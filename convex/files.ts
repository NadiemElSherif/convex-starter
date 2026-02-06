import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

const INDEXABLE_EXTENSIONS = ["pdf", "txt", "md"];

export const storeFileMetadata = mutation({
  args: {
    fileName: v.string(),
    storageKey: v.string(),
    mimeType: v.string(),
    size: v.number(),
    fileType: v.union(
      v.literal("audio"),
      v.literal("document"),
      v.literal("image")
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    // Check if this document should be RAG-indexed
    const ext = args.fileName.toLowerCase().split(".").pop() || "";
    const shouldIndex = args.fileType === "document" && INDEXABLE_EXTENSIONS.includes(ext);

    const fileId = await ctx.db.insert("fileMetadata", {
      fileName: args.fileName,
      storageKey: args.storageKey,
      mimeType: args.mimeType,
      size: args.size,
      fileType: args.fileType,
      createdBy: user._id,
      createdAt: Date.now(),
      ...(shouldIndex ? { ragStatus: "pending" as const } : {}),
    });

    // Schedule RAG processing server-side (survives tab close)
    if (shouldIndex) {
      await ctx.scheduler.runAfter(
        0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "embeddings:processDocument" as any,
        { fileMetadataId: fileId }
      );
    }

    return fileId;
  },
});

export const getMyFiles = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = await requireAuth(ctx);
      return await ctx.db
        .query("fileMetadata")
        .withIndex("by_created_by", (q) => q.eq("createdBy", user._id))
        .collect();
    } catch {
      return [];
    }
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("fileMetadata"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // Delete associated document chunks
    const chunks = await ctx.db
      .query("documentChunks")
      .withIndex("by_source", (q) => q.eq("sourceId", args.fileId))
      .collect();
    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }

    await ctx.db.delete(args.fileId);
  },
});
