"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { extractText as extractPdfText } from "unpdf";
import * as Minio from "minio";

const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const OPENROUTER_EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings";
const CHUNK_BATCH_SIZE = 15; // chunks per storeChunks mutation (stay under 1MB arg limit)

// --- MinIO helpers (mirrors fileActions.ts) ---

function getMinioClient() {
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) throw new Error("S3_ENDPOINT not configured");

  const url = new URL(endpoint);
  return new Minio.Client({
    endPoint: url.hostname,
    port: url.port ? parseInt(url.port) : url.protocol === "https:" ? 443 : 80,
    useSSL: url.protocol === "https:",
    accessKey: process.env.S3_ACCESS_KEY || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    region: process.env.S3_REGION || "us-east-1",
  });
}

// --- Text chunking ---

function chunkText(text: string): string[] {
  const MAX_CHARS = 2000; // ~500 tokens
  const OVERLAP_CHARS = 200; // ~50 tokens

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();

    // If a single paragraph is too large, split by sentences
    if (trimmed.length > MAX_CHARS) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      const sentences = trimmed.split(/(?<=[.!?])\s+/);
      let sentenceChunk = "";
      for (const sentence of sentences) {
        if ((sentenceChunk + " " + sentence).length > MAX_CHARS && sentenceChunk) {
          chunks.push(sentenceChunk.trim());
          const overlap = sentenceChunk.slice(-OVERLAP_CHARS);
          sentenceChunk = overlap + " " + sentence;
        } else {
          sentenceChunk += (sentenceChunk ? " " : "") + sentence;
        }
      }
      if (sentenceChunk.trim()) {
        currentChunk = sentenceChunk.trim();
      }
      continue;
    }

    if ((currentChunk + "\n\n" + trimmed).length > MAX_CHARS && currentChunk) {
      chunks.push(currentChunk.trim());
      const overlap = currentChunk.slice(-OVERLAP_CHARS);
      currentChunk = overlap + "\n\n" + trimmed;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => c.length > 20);
}

// --- Text extraction ---

async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  if (mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
    const { text } = await extractPdfText(new Uint8Array(buffer));
    return text.join("\n");
  }
  return buffer.toString("utf-8");
}

// --- Embedding API (called directly, not via action) ---

async function callEmbeddingAPI(
  apiKey: string,
  input: string | string[]
): Promise<number[][]> {
  const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://convex-starter.app",
      "X-Title": "Convex Starter",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

async function embedBatch(apiKey: string, texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const API_BATCH = 20;
  const all: number[][] = [];
  for (let i = 0; i < texts.length; i += API_BATCH) {
    const batch = texts.slice(i, i + API_BATCH);
    const embeddings = await callEmbeddingAPI(apiKey, batch);
    all.push(...embeddings);
  }
  return all;
}

// --- Single embedding action (used by chat for query embedding) ---

export const generateEmbedding = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
    const embeddings = await callEmbeddingAPI(apiKey, args.text);
    return embeddings[0];
  },
});

// --- Processing pipelines (scheduled by mutations, no action-to-action) ---

export const processDocument = action({
  args: { fileMetadataId: v.id("fileMetadata") },
  handler: async (ctx, args) => {
    const { fileMetadataId } = args;

    try {
      // Set ragStatus → processing
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateFileRagStatus" as any,
        { fileId: fileMetadataId, ragStatus: "processing" }
      );

      // Get file metadata
      const file = await ctx.runQuery(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:getFileMetadata" as any,
        { fileId: fileMetadataId }
      );
      if (!file) throw new Error("File metadata not found");

      // Generate presigned download URL directly (no action-to-action)
      const client = getMinioClient();
      const bucket = process.env.S3_BUCKET_NAME || "uploads";
      const downloadUrl = await client.presignedGetObject(bucket, file.storageKey, 3600);

      // Download + extract text
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      const text = await extractTextFromFile(buffer, file.mimeType, file.fileName);
      if (!text.trim()) throw new Error("No text content extracted from file");

      // Chunk + embed (all inline, no action-to-action)
      const chunks = chunkText(text);
      if (chunks.length === 0) throw new Error("No chunks generated from text");

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
      const embeddings = await embedBatch(apiKey, chunks);

      // Store in batches via storeChunks mutation
      for (let i = 0; i < chunks.length; i += CHUNK_BATCH_SIZE) {
        const batch = chunks.slice(i, i + CHUNK_BATCH_SIZE).map((text, j) => ({
          text,
          embedding: embeddings[i + j],
          sourceType: "document" as const,
          sourceId: fileMetadataId,
          chunkIndex: i + j,
          createdBy: file.createdBy,
        }));
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:storeChunks" as any,
          { chunks: batch }
        );
      }

      // Set ragStatus → completed
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateFileRagStatus" as any,
        { fileId: fileMetadataId, ragStatus: "completed" }
      );

      console.log(`[RAG] Processed document ${file.fileName}: ${chunks.length} chunks`);
      return { success: true, chunksCreated: chunks.length };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[RAG] Failed to process document ${fileMetadataId}: ${msg}`);
      try {
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:updateFileRagStatus" as any,
          { fileId: fileMetadataId, ragStatus: "failed" }
        );
      } catch { /* ignore */ }
      return { success: false, error: msg };
    }
  },
});

export const processTranscription = action({
  args: { transcriptionId: v.id("transcriptions") },
  handler: async (ctx, args) => {
    const { transcriptionId } = args;

    try {
      // Set ragStatus → processing
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateTranscriptionRagStatus" as any,
        { transcriptionId, ragStatus: "processing" }
      );

      // Get transcription text
      const transcription = await ctx.runQuery(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "transcriptions:getTranscription" as any,
        { id: transcriptionId }
      );
      if (!transcription || !transcription.transcript) {
        throw new Error("Transcription not found or has no text");
      }

      // Chunk + embed (all inline)
      const chunks = chunkText(transcription.transcript);
      if (chunks.length === 0) throw new Error("No chunks generated from transcription");

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
      const embeddings = await embedBatch(apiKey, chunks);

      // Store in batches
      for (let i = 0; i < chunks.length; i += CHUNK_BATCH_SIZE) {
        const batch = chunks.slice(i, i + CHUNK_BATCH_SIZE).map((text, j) => ({
          text,
          embedding: embeddings[i + j],
          sourceType: "transcription" as const,
          sourceId: transcriptionId,
          chunkIndex: i + j,
          createdBy: transcription.createdBy,
        }));
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:storeChunks" as any,
          { chunks: batch }
        );
      }

      // Set ragStatus → completed
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateTranscriptionRagStatus" as any,
        { transcriptionId, ragStatus: "completed" }
      );

      console.log(`[RAG] Processed transcription ${transcriptionId}: ${chunks.length} chunks`);
      return { success: true, chunksCreated: chunks.length };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[RAG] Failed to process transcription ${transcriptionId}: ${msg}`);
      try {
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:updateTranscriptionRagStatus" as any,
          { transcriptionId, ragStatus: "failed" }
        );
      } catch { /* ignore */ }
      return { success: false, error: msg };
    }
  },
});
