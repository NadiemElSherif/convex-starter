import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("done")
    ),
    createdBy: v.id("users"),
    assignedTo: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created_by", ["createdBy"])
    .index("by_assigned_to", ["assignedTo"]),

  fileMetadata: defineTable({
    fileName: v.string(),
    storageKey: v.string(),
    mimeType: v.string(),
    size: v.number(),
    fileType: v.union(
      v.literal("audio"),
      v.literal("document"),
      v.literal("image")
    ),
    ragStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_created_by", ["createdBy"])
    .index("by_file_type", ["fileType"]),

  transcriptions: defineTable({
    fileMetadataId: v.id("fileMetadata"),
    status: v.union(
      v.literal("queued"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    transcript: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    ragStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_file_metadata", ["fileMetadataId"])
    .index("by_created_by", ["createdBy"]),

  chatMessages: defineTable({
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    conversationId: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_created_by", ["createdBy"]),

  documentChunks: defineTable({
    text: v.string(),
    embedding: v.array(v.float64()),
    sourceType: v.union(v.literal("document"), v.literal("transcription")),
    sourceId: v.string(),
    chunkIndex: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["createdBy"],
    })
    .index("by_source", ["sourceId"]),
});
