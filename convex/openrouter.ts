/**
 * Shared OpenRouter API helpers (pure fetch, no Node.js dependencies).
 * Can be imported from both default-runtime and "use node" files.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings";
const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";
const TIMEOUT_MS = 60000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

// --- Embedding ---

export async function callEmbeddingAPI(
  apiKey: string,
  input: string | string[]
): Promise<number[][]> {
  const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://convex-starter.app",
      "X-Title": "Convex Starter",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

export async function generateSingleEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");
  const embeddings = await callEmbeddingAPI(apiKey, text);
  return embeddings[0];
}

export async function embedBatch(apiKey: string, texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const API_BATCH = 20;
  const all: number[][] = [];
  for (let i = 0; i < texts.length; i += API_BATCH) {
    const batch = texts.slice(i, i + API_BATCH);
    const embeddings = await callEmbeddingAPI(apiKey, batch);
    all.push(...embeddings);
  }
  return all;
}

// --- LLM Chat Completion ---

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

export async function callLLMHelper(params: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const model =
    params.model ||
    process.env.DEFAULT_OPENROUTER_MODEL ||
    DEFAULT_MODEL;
  const maxTokens = params.maxTokens || 4096;

  const messages: Array<{ role: string; content: string }> = [];

  if (params.systemPrompt) {
    messages.push({ role: "system", content: params.systemPrompt });
  }

  messages.push({ role: "user", content: params.prompt });

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
}
