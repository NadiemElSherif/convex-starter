import { query, mutation } from "./_generated/server";
import { getCurrentUser as getAuthUser } from "./auth";

/**
 * Get the current user. Returns null if not authenticated.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await getAuthUser(ctx);
    } catch {
      return null;
    }
  },
});

/**
 * Get or create a user record from Clerk identity.
 * Called on first visit to auto-provision the user.
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const clerkId = identity.subject;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existing) {
      return existing;
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      clerkId,
      name: identity.name ?? undefined,
      email: identity.email ?? "",
      role: "user",
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(userId);
  },
});

/**
 * Get all users (for todo assignment dropdown).
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    try {
      await getAuthUser(ctx);
    } catch {
      return [];
    }

    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
    }));
  },
});
