"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { extractText as extractPdfText } from "unpdf";

const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const OPENROUTER_EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings";

// --- Text chunking helpers ---

function chunkText(text: string): string[] {
  const TARGET_CHUNK_SIZE = 500; // ~tokens (roughly chars / 4, but we use chars as proxy)
  const OVERLAP = 50;
  const MAX_CHARS = TARGET_CHUNK_SIZE * 4; // ~2000 chars
  const OVERLAP_CHARS = OVERLAP * 4; // ~200 chars

  // Split by double newlines (paragraphs)
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
          // Overlap: keep tail of previous chunk
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
      // Overlap: keep tail of previous chunk
      const overlap = currentChunk.slice(-OVERLAP_CHARS);
      currentChunk = overlap + "\n\n" + trimmed;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Filter out very short chunks
  return chunks.filter((c) => c.length > 20);
}

async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  if (mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
    const { text } = await extractPdfText(new Uint8Array(buffer));
    return text.join("\n");
  }
  // Plain text, markdown, etc.
  return buffer.toString("utf-8");
}

// --- Embedding actions ---

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
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Embedding API error: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

export const generateEmbedding = action({
  args: {
    text: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

    const embeddings = await callEmbeddingAPI(apiKey, args.text);
    return embeddings[0];
  },
});

export const generateEmbeddings = action({
  args: {
    texts: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

    if (args.texts.length === 0) return [];

    // Batch in groups of 20 to avoid API limits
    const BATCH_SIZE = 20;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < args.texts.length; i += BATCH_SIZE) {
      const batch = args.texts.slice(i, i + BATCH_SIZE);
      const embeddings = await callEmbeddingAPI(apiKey, batch);
      allEmbeddings.push(...embeddings);
    }

    return allEmbeddings;
  },
});

// --- Processing pipeline actions ---

export const processDocument = action({
  args: {
    fileMetadataId: v.id("fileMetadata"),
  },
  handler: async (ctx, args) => {
    const { fileMetadataId } = args;

    try {
      // Set ragStatus to processing
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

      // Download file from MinIO
      const downloadUrl = await ctx.runAction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "fileActions:generateDownloadUrl" as any,
        { storageKey: file.storageKey }
      );

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Failed to download file: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text
      const text = await extractTextFromFile(buffer, file.mimeType, file.fileName);
      if (!text.trim()) {
        throw new Error("No text content extracted from file");
      }

      // Chunk text
      const chunks = chunkText(text);
      if (chunks.length === 0) {
        throw new Error("No chunks generated from text");
      }

      // Generate embeddings in batch
      const embeddings = await ctx.runAction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "embeddings:generateEmbeddings" as any,
        { texts: chunks }
      );

      // Store chunks
      for (let i = 0; i < chunks.length; i++) {
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:storeChunk" as any,
          {
            text: chunks[i],
            embedding: embeddings[i],
            sourceType: "document",
            sourceId: fileMetadataId,
            chunkIndex: i,
            createdBy: file.createdBy,
          }
        );
      }

      // Set ragStatus to completed
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateFileRagStatus" as any,
        { fileId: fileMetadataId, ragStatus: "completed" }
      );

      console.log(
        `[RAG] Processed document ${file.fileName}: ${chunks.length} chunks`
      );

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
      } catch {
        // Ignore status update failure
      }

      return { success: false, error: msg };
    }
  },
});

export const processTranscription = action({
  args: {
    transcriptionId: v.id("transcriptions"),
  },
  handler: async (ctx, args) => {
    const { transcriptionId } = args;

    try {
      // Set ragStatus to processing
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateTranscriptionRagStatus" as any,
        { transcriptionId, ragStatus: "processing" }
      );

      // Get transcription data
      const transcription = await ctx.runQuery(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "transcriptions:getTranscription" as any,
        { id: transcriptionId }
      );

      if (!transcription || !transcription.transcript) {
        throw new Error("Transcription not found or has no text");
      }

      // Chunk text
      const chunks = chunkText(transcription.transcript);
      if (chunks.length === 0) {
        throw new Error("No chunks generated from transcription");
      }

      // Generate embeddings in batch
      const embeddings = await ctx.runAction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "embeddings:generateEmbeddings" as any,
        { texts: chunks }
      );

      // Store chunks
      for (let i = 0; i < chunks.length; i++) {
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:storeChunk" as any,
          {
            text: chunks[i],
            embedding: embeddings[i],
            sourceType: "transcription",
            sourceId: transcriptionId,
            chunkIndex: i,
            createdBy: transcription.createdBy,
          }
        );
      }

      // Set ragStatus to completed
      await ctx.runMutation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "documentChunks:updateTranscriptionRagStatus" as any,
        { transcriptionId, ragStatus: "completed" }
      );

      console.log(
        `[RAG] Processed transcription ${transcriptionId}: ${chunks.length} chunks`
      );

      return { success: true, chunksCreated: chunks.length };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(
        `[RAG] Failed to process transcription ${transcriptionId}: ${msg}`
      );

      try {
        await ctx.runMutation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "documentChunks:updateTranscriptionRagStatus" as any,
          { transcriptionId, ragStatus: "failed" }
        );
      } catch {
        // Ignore status update failure
      }

      return { success: false, error: msg };
    }
  },
});
