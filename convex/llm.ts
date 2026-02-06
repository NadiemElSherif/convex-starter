import { action } from "./_generated/server";
import { v } from "convex/values";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";
const TIMEOUT_MS = 60000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

export const callLLM = action({
  args: {
    prompt: v.string(),
    systemPrompt: v.optional(v.string()),
    model: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    const model =
      args.model ||
      process.env.DEFAULT_OPENROUTER_MODEL ||
      DEFAULT_MODEL;
    const maxTokens = args.maxTokens || 4096;

    const messages: Array<{ role: string; content: string }> = [];

    if (args.systemPrompt) {
      messages.push({ role: "system", content: args.systemPrompt });
    }

    messages.push({ role: "user", content: args.prompt });

    let lastError: Error | null = null;
    let delay = INITIAL_RETRY_DELAY_MS;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await callOpenRouterWithTimeout({
          apiKey,
          model,
          messages,
          maxTokens,
        });

        if (response.usage) {
          console.log(
            `[OpenRouter] Tokens used: ${response.usage.total_tokens} ` +
            `(prompt: ${response.usage.prompt_tokens}, ` +
            `completion: ${response.usage.completion_tokens})`
          );
        }

        const content = response.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("Empty response from OpenRouter");
        }

        return content;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();

          if (
            errorMessage.includes("401") ||
            errorMessage.includes("unauthorized")
          ) {
            throw new Error(
              "OpenRouter authentication failed. Check your API key."
            );
          }

          if (
            errorMessage.includes("400") ||
            errorMessage.includes("invalid")
          ) {
            throw new Error(
              `Invalid request to OpenRouter: ${error.message}`
            );
          }
        }

        if (attempt < MAX_RETRIES - 1) {
          console.warn(
            `[OpenRouter] Attempt ${attempt + 1} failed: ${error}. ` +
            `Retrying in ${delay}ms...`
          );

          await sleep(delay);
          delay *= 2;
        }
      }
    }

    throw new Error(
      `OpenRouter API call failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`
    );
  },
});

async function callOpenRouterWithTimeout(params: {
  apiKey: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  maxTokens: number;
}): Promise<OpenRouterResponse> {
  const { apiKey, model, messages, maxTokens } = params;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://convex-starter.app",
        "X-Title": "Convex Starter",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: OpenRouterResponse = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`OpenRouter API timeout after ${TIMEOUT_MS}ms`);
    }

    throw error;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type OpenRouterResponse = {
  id: string;
  choices: Array<{
    finish_reason: string | null;
    message: {
      content: string | null;
      role: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};
