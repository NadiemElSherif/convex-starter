import { action } from "./_generated/server";
import { v } from "convex/values";
import { callLLMHelper } from "./openrouter";

export const callLLM = action({
  args: {
    prompt: v.string(),
    systemPrompt: v.optional(v.string()),
    model: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    return await callLLMHelper(args);
  },
});
