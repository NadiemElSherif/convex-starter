import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx
): Promise<{
  _id: Id<"users">;
  clerkId: string;
  role: string;
  name?: string;
  email?: string;
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new AuthError("Authentication required. Please sign in.");
  }

  const clerkId = identity.subject;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .first();

  if (!user) {
    throw new NotFoundError(
      "User not found. Please ensure your account is properly set up."
    );
  }

  return user;
}

export async function hasRole(
  ctx: QueryCtx | MutationCtx,
  role: string
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return user.role === role;
  } catch {
    return false;
  }
}

export async function isAdmin(
  ctx: QueryCtx | MutationCtx
): Promise<boolean> {
  try {
    const user = await getCurrentUser(ctx);
    return user.role === "admin";
  } catch {
    return false;
  }
}

export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<{
  _id: Id<"users">;
  clerkId: string;
  role: string;
  name?: string;
  email?: string;
}> {
  return getCurrentUser(ctx);
}

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx
): Promise<{
  _id: Id<"users">;
  clerkId: string;
  role: string;
  name?: string;
  email?: string;
}> {
  const user = await requireAuth(ctx);
  if (user.role !== "admin") {
    throw new ForbiddenError(
      "Admin access required. You don't have permission to perform this action."
    );
  }
  return user;
}
