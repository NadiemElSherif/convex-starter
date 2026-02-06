import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

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

    const fileId = await ctx.db.insert("fileMetadata", {
      fileName: args.fileName,
      storageKey: args.storageKey,
      mimeType: args.mimeType,
      size: args.size,
      fileType: args.fileType,
      createdBy: user._id,
      createdAt: Date.now(),
    });

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
    await ctx.db.delete(args.fileId);
  },
});
