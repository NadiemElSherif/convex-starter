# Convex Starter App

## IMPORTANT: Working with Convex

Convex is the core of this application - the database, backend runtime, and real-time sync layer. **Before writing or modifying any Convex code, you MUST invoke the appropriate Convex skill** to get the correct patterns.

### Required: Use Convex Skills

This project has a comprehensive set of Convex skills. **Always invoke the relevant skill BEFORE writing Convex code.** The main `/convex` skill acts as a router — use it if you're unsure which specific skill to use, and it will guide you to the right one.

**Skill routing by task:**

| Task | Skill to invoke |
|------|----------------|
| Writing queries, mutations, actions | `/convex-functions` |
| Adding/modifying schema, indexes, validators | `/convex-schema-validator` |
| Real-time subscriptions, optimistic updates, pagination | `/convex-realtime` |
| File uploads, serving, storage | `/convex-file-storage` |
| HTTP endpoints, webhooks, CORS | `/convex-http-actions` |
| AI agents, threads, tool integration | `/convex-agents` |
| Scheduled/background tasks | `/convex-cron-jobs` |
| Schema evolution, backfills, migrations | `/convex-migrations` |
| Creating reusable Convex components | `/convex-component-authoring` |
| Quick security checklist | `/convex-security-check` |
| Deep security review | `/convex-security-audit` |
| Production patterns, error handling, organization | `/convex-best-practices` |
| General / unsure which skill | `/convex` (routes to the right one) |

**Other skills:**

| Task | Skill to invoke |
|------|----------------|
| Browser testing, form filling, screenshots, web interaction | `/agent-browser` |
| Building polished UI components and pages | `/frontend-design` |
| Preventing scope creep during development | `/avoid-feature-creep` |

Use `/agent-browser` whenever you need to visually verify the app in a browser, test a flow end-to-end, fill out forms, take screenshots, or extract data from a web page.

**Fallback:** If skills don't cover an edge case, use `mcp__zread__search_doc(repo_name="get-convex/convex-backend", query="...")` to search the Convex source repo directly.

### Convex Runtime Rules

| Rule | Detail |
|------|--------|
| **Queries** are reactive | They re-run automatically when underlying data changes. No side effects allowed. |
| **Mutations** are transactional | They read/write the database atomically. No `fetch()` or external calls. |
| **Actions** are for side effects | They call external APIs, but can't directly read/write the DB. Use `ctx.runQuery()`/`ctx.runMutation()`. |
| **`"use node"` files** | ONLY contain actions. Cannot export queries/mutations. Required for Node.js packages (minio, pdf parsing). |
| **Default runtime files** | Contain queries/mutations/actions. No Node.js built-ins (fs, crypto, stream). |
| **Split pattern** | `files.ts` (queries/mutations) + `fileActions.ts` (actions with `"use node"`). Same for `documentChunks.ts` + `embeddings.ts`. |
| **Action → Action is an anti-pattern** | Avoid `ctx.runAction()` inside actions. Inline the logic or use `ctx.scheduler.runAfter()` from a mutation. |
| **Scheduling** | Use `ctx.scheduler.runAfter(0, ...)` from mutations to trigger async work server-side (reliable, survives client disconnect). |
| **String references** | Actions call mutations/queries via `"module:function" as any` (e.g., `"chat:storeMessage" as any`). |

### Convex Gotchas

- Schema changes require `bunx convex dev` to be running (auto-pushes on save)
- Adding required fields to existing tables will fail if data exists - use `v.optional()` for new fields
- `ctx.vectorSearch()` is only available inside actions, not queries/mutations
- Vector index `filterFields` must be declared at schema time - you can't filter by arbitrary fields at query time
- TypeScript: `tsconfig` has `strict: true` - annotate `.map()` callbacks on Convex query results
- Type-check with `bunx tsc --noEmit`
- To clear existing data for schema migration: `bunx convex import --replace-all -y empty-snapshot.zip`

---

## Project Overview

A modular starter app built with **Convex** (backend) + **Next.js 14** (frontend) + **Clerk** (auth) + **Tailwind CSS** + **shadcn/ui**.

Six core capabilities through isolated feature pages:
1. **Auth** - Clerk integration with Convex, auto-provisioned user records
2. **Todos** - Real-time CRUD with user assignment
3. **File Uploads** - MinIO/S3 presigned URL uploads with progress tracking
4. **Transcription** - Audio upload + NCAT API transcription pipeline
5. **RAG Chat** - LLM chatbot with vector search across documents & transcriptions
6. **Document Indexing** - Automatic chunking, embedding, and vector storage for uploaded documents

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend / DB | Convex | Real-time, reactive, transactional |
| Frontend | Next.js 14 (App Router) | `"use client"` pages |
| Auth | Clerk | JWT-based, synced to Convex `users` table |
| UI Components | shadcn/ui + Tailwind CSS | |
| Object Storage | MinIO / S3-compatible | Presigned URLs for upload/download |
| AI / LLM | OpenRouter | Chat completions + embeddings |
| Transcription | NCAT API (No-Code Architects Toolkit) | Async job queue |
| Vector Search | Convex native | 1536-dim, `text-embedding-3-small` |

---

## Schema (6 tables)

```
users            - clerkId, name, email, role (user|admin)
todos            - title, description, status, createdBy, assignedTo
fileMetadata     - fileName, storageKey, mimeType, size, fileType, ragStatus?
transcriptions   - fileMetadataId, status, transcript?, ragStatus?
chatMessages     - content, role (user|assistant), conversationId, createdBy
documentChunks   - text, embedding[1536], sourceType, sourceId, chunkIndex, createdBy
                   vectorIndex("by_embedding", dimensions=1536, filterFields=["createdBy"])
                   index("by_source", ["sourceId"])
```

---

## Architecture

```
convex/                  # Backend (runs on Convex)
  schema.ts              # 6-table schema with vector index
  auth.ts                # Auth middleware (getCurrentUser, requireAuth, requireAdmin)
  auth.config.ts         # Clerk provider configuration
  users.ts               # User queries/mutations (getOrCreateUser, getAllUsers)
  todos.ts               # Todo CRUD (list, create, update, updateStatus, remove)
  files.ts               # File metadata + schedules RAG processing on upload
  fileActions.ts          # "use node" - MinIO presigned URL generation
  transcriptions.ts      # Transcription queue + NCAT API integration
  documentChunks.ts      # Chunk CRUD (storeChunks batch, fetchChunksByIds, deleteChunksBySource)
  embeddings.ts           # "use node" - embedding generation + document/transcription processing pipeline
  chat.ts                # RAG chatbot with vector search
  llm.ts                 # OpenRouter LLM client with retry logic
  util.ts                # Error handling utilities

src/app/                 # Frontend (Next.js App Router)
  page.tsx               # Landing page
  dashboard/             # Feature hub (auto-provisions user on first visit)
  todos/                 # Todo list with filters + assignment
  uploads/               # File upload + download + delete + RAG status badges
  transcription/         # Audio upload + transcription pipeline + RAG status
  chat/                  # RAG chatbot with conversation history
  sign-in/, sign-up/     # Clerk auth pages

src/components/          # Shared components
  nav-header.tsx         # App-wide navigation
  file-upload.tsx        # Reusable file upload with MinIO presigned URLs
  providers.tsx          # Convex + Clerk provider wrapper
  ui/                    # shadcn/ui components
```

---

## MinIO / S3 Object Storage

Files are stored in MinIO (S3-compatible). Convex stores metadata only; the actual bytes live in the bucket.

### How It Works

```
Browser                        Convex                         MinIO
  |                              |                              |
  |-- generateUploadUrl action --|                              |
  |        (presigned PUT URL)   |--- Minio.presignedPutObject -|
  |<----- presigned URL ---------|                              |
  |                              |                              |
  |------------- PUT file directly to MinIO ------------------->|
  |                              |                              |
  |-- storeFileMetadata mut ---->|                              |
  |   (fileName, storageKey,     |                              |
  |    mimeType, size, fileType) |                              |
```

### Key Files
- **`convex/fileActions.ts`** (`"use node"`) - MinIO client, `generateUploadUrl`, `generateDownloadUrl`
- **`convex/files.ts`** (default runtime) - `storeFileMetadata` mutation, `getMyFiles` query, `deleteFile` mutation
- **`src/components/file-upload.tsx`** - XHR upload with progress tracking

### MinIO Client Pattern
```typescript
// fileActions.ts uses "use node" because minio requires Node.js
import * as Minio from "minio";

function getMinioClient() {
  const url = new URL(process.env.S3_ENDPOINT!);
  return new Minio.Client({
    endPoint: url.hostname,
    port: url.port ? parseInt(url.port) : url.protocol === "https:" ? 443 : 80,
    useSSL: url.protocol === "https:",
    accessKey: process.env.S3_ACCESS_KEY || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    region: process.env.S3_REGION || "us-east-1",
  });
}
```

### Storage Key Format
```
uploads/{fileType}/{userId}/{timestamp}_{fileName}
```

### Environment Variables (set in Convex dashboard)
- `S3_ENDPOINT` - MinIO/S3 endpoint URL (e.g., `https://minio.example.com`)
- `S3_REGION` - S3 region (e.g., `us-east-1`)
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET_NAME` - Bucket name (default: `uploads`)

---

## NCAT Transcription Service

Uses the [No-Code Architects Toolkit](https://github.com/stephengpope/no-code-architects-toolkit) API for audio transcription.

### API Reference

**Base URL**: Set via `NCAT_BASE_URL` env var (e.g., `https://ncat.example.com`)

#### Submit Transcription
```
POST {NCAT_BASE_URL}/v1/media/transcribe
Headers:
  x-api-key: {NCAT_API_KEY}
  Content-Type: application/json
Body:
  { "media_url": "https://...", "language": "en", "include_text": true }
Response (202 - queued):
  { "code": 202, "job_id": "uuid", "message": "processing" }
Response (200 - direct):
  { "code": 200, "job_id": "uuid", "response": { "text": "..." } }
```

#### Check Job Status
```
POST {NCAT_BASE_URL}/v1/toolkit/job/status
Headers:
  x-api-key: {NCAT_API_KEY}
  Content-Type: application/json
Body:
  { "job_id": "uuid" }
Response:
  { "response": { "job_status": "done", "response": { "text": "..." } } }
  Job statuses: "processing", "done", "failed"
```

### IMPORTANT: NCAT API Details
- Auth header is **`x-api-key`** (NOT `Authorization: Bearer`)
- Media field is **`media_url`** (NOT `url` or `audio_url`)
- Job status endpoint is **POST** (NOT GET)
- Job status is at **`response.job_status`** = `"done"` (NOT `"completed"`)
- Transcript text is at **`response.response.text`**

### Pipeline Flow
```
Upload audio → storeFileMetadata → queueTranscription mutation
  → Frontend calls processTranscription action
    → POST /v1/media/transcribe (submit)
    → Poll POST /v1/toolkit/job/status every 10s
    → completeTranscription mutation (saves text + schedules RAG indexing)
```

### Environment Variables (set in Convex dashboard)
- `NCAT_BASE_URL` - NCAT instance URL
- `NCAT_API_KEY` - NCAT API key (sent via `x-api-key` header)

---

## OpenRouter (LLM + Embeddings)

All AI calls go through [OpenRouter](https://openrouter.ai), which provides a unified API for multiple LLM providers.

### Chat Completions (LLM)

Used by the RAG chat (`convex/llm.ts`).

```
POST https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer {OPENROUTER_API_KEY}
  Content-Type: application/json
Body:
  { "model": "...", "messages": [...], "max_tokens": 2048 }
```

- Default model: `google/gemini-3-flash-preview` (overrideable via `DEFAULT_OPENROUTER_MODEL`)
- Retry logic: 3 attempts with exponential backoff
- Timeout: 60 seconds

### Embeddings

Used by the RAG pipeline (`convex/embeddings.ts`).

```
POST https://openrouter.ai/api/v1/embeddings
Headers:
  Authorization: Bearer {OPENROUTER_API_KEY}
  Content-Type: application/json
Body:
  { "model": "openai/text-embedding-3-small", "input": "text" | ["text1", "text2"] }
Response:
  { "data": [{ "embedding": [0.1, 0.2, ...] }] }
```

- Model: `openai/text-embedding-3-small` (1536 dimensions)
- Supports single string or batch array input
- Batch API calls in groups of 20 to avoid rate limits

### Environment Variables (set in Convex dashboard)
- `OPENROUTER_API_KEY` - OpenRouter API key (required for chat + RAG)
- `DEFAULT_OPENROUTER_MODEL` - Override default chat model (optional)

---

## RAG Implementation

Documents (PDF/TXT/MD) and transcriptions are automatically chunked, embedded, and stored for vector search.

### Pipeline Architecture

```
DOCUMENT UPLOAD:
  storeFileMetadata mutation
    → Sets ragStatus="pending"
    → ctx.scheduler.runAfter(0, processDocument action)
      → Downloads file from MinIO (inline, no action-to-action)
      → Extracts text (unpdf for PDF, toString for text)
      → Chunks text (~2000 chars/chunk, 200 char overlap)
      → Calls OpenRouter embeddings API (inline, batched by 20)
      → Stores chunks via storeChunks mutation (batched by 15)
      → Sets ragStatus="completed" (or "failed")

TRANSCRIPTION COMPLETE:
  completeTranscription mutation
    → Saves transcript text
    → Sets ragStatus="pending"
    → ctx.scheduler.runAfter(0, processTranscription action)
      → Same chunk → embed → store pipeline

CHAT QUERY:
  sendMessage action
    → Embeds user query via generateEmbedding action
    → ctx.vectorSearch("documentChunks", "by_embedding", { vector, limit: 8, filter: createdBy })
    → Fetches chunk text via fetchChunksByIds query
    → Adds chunks as "Relevant Documents" context in system prompt
    → Todos still included directly in system prompt
    → Calls LLM with full context

FILE DELETE:
  deleteFile mutation → deletes all chunks with matching sourceId
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Server-side scheduling** | `ctx.scheduler.runAfter(0, ...)` from mutations, not client-side. Survives tab close. |
| **No action-to-action** | MinIO URLs + embedding API called inline in the processing action. One action does everything. |
| **Batch chunk storage** | `storeChunks` inserts up to 15 chunks per mutation (stays under Convex 1MB arg limit). |
| **Decoupled from transcription** | `completeTranscription` mutation schedules RAG separately. Transcription action returns immediately. |
| **Graceful RAG failure** | Chat still works without RAG - vector search errors are caught and logged. |
| **Per-user filtering** | Vector index `filterFields: ["createdBy"]` ensures users only search their own documents. |

### Chunking Strategy
- Split by paragraphs (double newlines), then by sentences if a paragraph exceeds 2000 chars
- ~500 tokens per chunk (~2000 characters)
- ~50 token overlap (~200 characters) between chunks
- Minimum chunk size: 20 characters

### Supported File Types for Indexing
- `.pdf` - Text extracted via `unpdf` library
- `.txt` - Read as UTF-8
- `.md` - Read as UTF-8

---

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start Convex backend (creates deployment on first run)
bunx convex dev

# 4. In a separate terminal, start Next.js
bun dev
```

## Setting Up Clerk

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key to `.env.local`
4. In Clerk Dashboard > JWT Templates, create a "convex" template:
   - Issuer: your Clerk domain (e.g., `https://your-domain.clerk.accounts.dev`)
5. In the Convex dashboard, add your Clerk issuer domain under Settings > Authentication

## All Environment Variables

| Variable | Where | Required | Description |
|----------|-------|----------|-------------|
| `CONVEX_DEPLOYMENT` | `.env.local` | Yes | Auto-set by `bunx convex dev` |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` | Yes | Auto-set by `bunx convex dev` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | `.env.local` | Yes | Clerk secret key |
| `OPENROUTER_API_KEY` | Convex dashboard | For chat/RAG | OpenRouter API key |
| `DEFAULT_OPENROUTER_MODEL` | Convex dashboard | No | LLM model ID override |
| `S3_ENDPOINT` | Convex dashboard | For uploads | MinIO/S3 endpoint URL |
| `S3_REGION` | Convex dashboard | For uploads | S3 region |
| `S3_ACCESS_KEY` | Convex dashboard | For uploads | S3 access key |
| `S3_SECRET_KEY` | Convex dashboard | For uploads | S3 secret key |
| `S3_BUCKET_NAME` | Convex dashboard | For uploads | S3 bucket name |
| `NCAT_BASE_URL` | Convex dashboard | For transcription | NCAT API base URL |
| `NCAT_API_KEY` | Convex dashboard | For transcription | NCAT API key |

---

## Adding a New Feature Module

1. **Invoke the right skills first** - Use `/convex-schema-validator` for schema, `/convex-functions` for backend logic, `/convex-best-practices` for patterns
2. **Schema**: Add a new table in `convex/schema.ts` (use `v.optional()` for fields on existing tables)
3. **Backend**: Create `convex/your-feature.ts` with queries/mutations/actions
4. **If Node.js needed**: Create a separate `convex/your-featureActions.ts` with `"use node"` for actions using Node packages
5. **Page**: Create `src/app/your-feature/page.tsx` (add `"use client"` directive) — use `/frontend-design` for UI quality
6. **Nav**: Add a link in `src/components/nav-header.tsx`
7. **Dashboard**: Add a card in `src/app/dashboard/page.tsx`
8. Run `bunx convex dev` to push schema changes
9. **Type-check**: `bunx tsc --noEmit`
10. **Security**: Run `/convex-security-check` before shipping
