import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = await requireAuth(ctx);
      const messages = await ctx.db
        .query("chatMessages")
        .withIndex("by_created_by", (q) => q.eq("createdBy", user._id))
        .collect();

      // Group by conversationId, return unique conversations with first message
      const convMap = new Map<
        string,
        { conversationId: string; firstMessage: string; createdAt: number }
      >();

      for (const msg of messages) {
        if (!convMap.has(msg.conversationId)) {
          convMap.set(msg.conversationId, {
            conversationId: msg.conversationId,
            firstMessage:
              msg.role === "user"
                ? msg.content.slice(0, 80)
                : "New conversation",
            createdAt: msg.createdAt,
          });
        }
      }

      return Array.from(convMap.values()).sort(
        (a, b) => b.createdAt - a.createdAt
      );
    } catch {
      return [];
    }
  },
});

export const getConversation = query({
  args: {
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await requireAuth(ctx);
    } catch {
      return [];
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const storeMessage = mutation({
  args: {
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    return await ctx.db.insert("chatMessages", {
      content: args.content,
      role: args.role,
      conversationId: args.conversationId,
      createdBy: user._id,
      createdAt: Date.now(),
    });
  },
});

export const sendMessage = action({
  args: {
    content: v.string(),
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const { content, conversationId } = args;

    // Store user message
    await ctx.runMutation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "chat:storeMessage" as any,
      {
        content,
        role: "user",
        conversationId,
      }
    );

    // Gather context from todos
    const todos = await ctx.runQuery(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "todos:list" as any,
      {}
    );

    // Build context
    let context = "";

    if (Array.isArray(todos) && todos.length > 0) {
      context += "## Current Todos\n";
      for (const todo of todos) {
        context += `- [${todo.status}] ${todo.title}`;
        if (todo.description) context += `: ${todo.description}`;
        if (todo.assigneeName) context += ` (assigned to ${todo.assigneeName})`;
        context += "\n";
      }
      context += "\n";
    }

    // Vector search for relevant document/transcription chunks
    try {
      const user = await ctx.runQuery(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "users:getCurrentUser" as any,
        {}
      );

      if (user) {
        const queryEmbedding = await ctx.runAction(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "embeddings:generateEmbedding" as any,
          { text: content }
        );

        const searchResults = await ctx.vectorSearch(
          "documentChunks",
          "by_embedding",
          {
            vector: queryEmbedding,
            limit: 8,
            filter: (q: any) => q.eq("createdBy", user._id), // eslint-disable-line @typescript-eslint/no-explicit-any
          }
        );

        if (searchResults.length > 0) {
          const chunkIds = searchResults.map((r: { _id: any }) => r._id); // eslint-disable-line @typescript-eslint/no-explicit-any
          const chunks = await ctx.runQuery(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "documentChunks:fetchChunksByIds" as any,
            { ids: chunkIds }
          );

          if (Array.isArray(chunks) && chunks.length > 0) {
            context += "## Relevant Documents\n";
            for (const chunk of chunks) {
              const label = chunk.sourceType === "transcription" ? "Transcription" : "Document";
              context += `### ${label} (chunk ${chunk.chunkIndex + 1})\n`;
              context += chunk.text + "\n\n";
            }
          }
        }
      }
    } catch (ragError) {
      console.warn("[RAG] Vector search failed, continuing without document context:", ragError);
    }

    // Get conversation history
    const history = await ctx.runQuery(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "chat:getConversation" as any,
      { conversationId }
    );

    const systemPrompt = `You are a helpful assistant for a project management app. You have access to the user's todos, documents, and transcriptions as context. Relevant document and transcription chunks are retrieved via semantic search. Answer questions about their data, help them plan, and provide useful insights.

${context ? "Here is the user's current data:\n\n" + context : "The user has no data yet."}`;

    // Build messages for LLM
    let prompt = "";
    if (Array.isArray(history) && history.length > 1) {
      // Include last 10 messages as conversation context
      const recent = history.slice(-10);
      for (const msg of recent) {
        prompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n\n`;
      }
    }
    prompt += `User: ${content}`;

    // Call LLM
    const response = await ctx.runAction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "llm:callLLM" as any,
      {
        prompt,
        systemPrompt,
        maxTokens: 2048,
      }
    );

    // Store assistant response
    await ctx.runMutation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "chat:storeMessage" as any,
      {
        content: response as string,
        role: "assistant",
        conversationId,
      }
    );

    return response;
  },
});

export const deleteConversation = mutation({
  args: {
    conversationId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Only delete messages owned by this user
    for (const msg of messages) {
      if (msg.createdBy === user._id) {
        await ctx.db.delete(msg._id);
      }
    }
  },
});
