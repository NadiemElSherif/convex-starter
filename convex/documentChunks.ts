import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeChunk = mutation({
  args: {
    text: v.string(),
    embedding: v.array(v.float64()),
    sourceType: v.union(v.literal("document"), v.literal("transcription")),
    sourceId: v.string(),
    chunkIndex: v.number(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documentChunks", {
      text: args.text,
      embedding: args.embedding,
      sourceType: args.sourceType,
      sourceId: args.sourceId,
      chunkIndex: args.chunkIndex,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });
  },
});

export const fetchChunksByIds = query({
  args: {
    ids: v.array(v.id("documentChunks")),
  },
  handler: async (ctx, args) => {
    const chunks = await Promise.all(
      args.ids.map(async (id) => {
        const chunk = await ctx.db.get(id);
        if (!chunk) return null;
        return {
          _id: chunk._id,
          text: chunk.text,
          sourceType: chunk.sourceType,
          sourceId: chunk.sourceId,
          chunkIndex: chunk.chunkIndex,
        };
      })
    );
    return chunks.filter((c): c is NonNullable<typeof c> => c !== null);
  },
});

export const deleteChunksBySource = mutation({
  args: {
    sourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("documentChunks")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();
    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
    return chunks.length;
  },
});

export const updateFileRagStatus = mutation({
  args: {
    fileId: v.id("fileMetadata"),
    ragStatus: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.fileId, { ragStatus: args.ragStatus });
  },
});

export const updateTranscriptionRagStatus = mutation({
  args: {
    transcriptionId: v.id("transcriptions"),
    ragStatus: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.transcriptionId, { ragStatus: args.ragStatus });
  },
});

export const getFileMetadata = query({
  args: {
    fileId: v.id("fileMetadata"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.fileId);
  },
});
