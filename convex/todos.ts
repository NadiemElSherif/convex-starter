import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("pending"), v.literal("in_progress"), v.literal("done"))
    ),
  },
  handler: async (ctx, args) => {
    try {
      await requireAuth(ctx);
    } catch {
      return [];
    }

    let todos;
    if (args.status) {
      todos = await ctx.db
        .query("todos")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      todos = await ctx.db.query("todos").collect();
    }

    // Enrich with user names
    const enriched = await Promise.all(
      todos.map(async (todo) => {
        const creator = await ctx.db.get(todo.createdBy);
        const assignee = todo.assignedTo
          ? await ctx.db.get(todo.assignedTo)
          : null;
        return {
          ...todo,
          creatorName: creator?.name ?? creator?.email ?? "Unknown",
          assigneeName: assignee?.name ?? assignee?.email ?? undefined,
        };
      })
    );

    return enriched;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const now = Date.now();

    const todoId = await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      status: "pending",
      createdBy: user._id,
      assignedTo: args.assignedTo,
      createdAt: now,
      updatedAt: now,
    });

    return todoId;
  },
});

export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...updates } = args;
    const filtered: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.title !== undefined) filtered.title = updates.title;
    if (updates.description !== undefined)
      filtered.description = updates.description;
    if (updates.assignedTo !== undefined)
      filtered.assignedTo = updates.assignedTo;

    await ctx.db.patch(id, filtered);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("todos"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
  },
});
