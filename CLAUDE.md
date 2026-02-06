# Convex Starter App

## Project Overview

A modular starter app built with **Convex** (backend) + **Next.js 14** (frontend) + **Clerk** (auth) + **Tailwind CSS** + **shadcn/ui**.

Demonstrates five core patterns through isolated feature pages:
1. **Auth** - Clerk integration with Convex, auto-provisioned user records
2. **Todos** - Real-time CRUD with user assignment
3. **File Uploads** - MinIO/S3 presigned URL uploads with progress tracking
4. **Transcription** - Audio upload + NCAT API transcription pipeline
5. **RAG Chat** - LLM chatbot with context from todos & transcriptions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend / DB | Convex |
| Frontend | Next.js 14 (App Router) |
| Auth | Clerk |
| UI Components | shadcn/ui + Tailwind CSS |
| Object Storage | MinIO / S3-compatible |
| AI / LLM | OpenRouter |
| Transcription | NCAT API |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start Convex backend (creates deployment on first run)
npx convex dev

# 4. In a separate terminal, start Next.js
npm run dev
```

## Setting Up Clerk

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key to `.env.local`
4. In Clerk Dashboard > JWT Templates, create a "convex" template:
   - Issuer: your Clerk domain (e.g., `https://your-domain.clerk.accounts.dev`)
5. In the Convex dashboard, add your Clerk issuer domain under Settings > Authentication

## Setting Up MinIO / S3

1. Set up a MinIO instance or use AWS S3
2. Create a bucket (e.g., `uploads`)
3. Configure CORS for browser uploads:
   ```json
   [{"AllowedOrigins": ["http://localhost:3000"], "AllowedMethods": ["PUT", "GET"], "AllowedHeaders": ["*"]}]
   ```
4. Add credentials to `.env.local` (set these in Convex dashboard environment variables too)

## Setting Up OpenRouter

1. Get an API key from [openrouter.ai](https://openrouter.ai)
2. Add to `.env.local` and Convex dashboard environment variables
3. Default model: `mistralai/devstral-2512:free` (free tier)

## Setting Up NCAT Transcription

1. Deploy or access an NCAT instance
2. Add `NCAT_BASE_URL` and `NCAT_API_KEY` to `.env.local` and Convex dashboard

## Environment Variables

| Variable | Where | Required | Description |
|----------|-------|----------|-------------|
| `CONVEX_DEPLOYMENT` | `.env.local` | Yes | Auto-set by `npx convex dev` |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` | Yes | Auto-set by `npx convex dev` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | `.env.local` | Yes | Clerk secret key |
| `OPENROUTER_API_KEY` | Convex dashboard | For chat | OpenRouter API key |
| `DEFAULT_OPENROUTER_MODEL` | Convex dashboard | No | LLM model ID |
| `S3_ENDPOINT` | Convex dashboard | For uploads | MinIO/S3 endpoint URL |
| `S3_REGION` | Convex dashboard | For uploads | S3 region |
| `S3_ACCESS_KEY` | Convex dashboard | For uploads | S3 access key |
| `S3_SECRET_KEY` | Convex dashboard | For uploads | S3 secret key |
| `S3_BUCKET_NAME` | Convex dashboard | For uploads | S3 bucket name |
| `NCAT_BASE_URL` | Convex dashboard | For transcription | NCAT API URL |
| `NCAT_API_KEY` | Convex dashboard | For transcription | NCAT API key |

## Architecture

```
convex/              # Backend (runs on Convex)
  schema.ts          # 5-table schema (users, todos, fileMetadata, transcriptions, chatMessages)
  auth.ts            # Auth middleware (getCurrentUser, requireAuth, requireAdmin)
  users.ts           # User queries/mutations (getOrCreateUser, getAllUsers)
  todos.ts           # Todo CRUD (list, create, update, updateStatus, remove)
  files.ts           # File upload/download via MinIO presigned URLs
  transcriptions.ts  # Transcription queue + NCAT API integration
  chat.ts            # RAG chatbot (context from todos + transcriptions)
  llm.ts             # OpenRouter LLM client with retry logic
  util.ts            # Error handling utilities

src/app/             # Frontend (Next.js App Router)
  page.tsx           # Landing page
  dashboard/         # Feature hub (auto-provisions user)
  todos/             # Todo list with filters + assignment
  uploads/           # File upload + download + delete
  transcription/     # Audio upload + transcription pipeline
  chat/              # RAG chatbot with conversation history

src/components/      # Shared components
  nav-header.tsx     # App-wide navigation
  file-upload.tsx    # Reusable file upload with MinIO presigned URLs
  providers.tsx      # Convex + Clerk provider wrapper
  ui/                # shadcn/ui components
```

## Adding a New Feature Module

1. **Schema**: Add a new table in `convex/schema.ts`
2. **Backend**: Create `convex/your-feature.ts` with queries/mutations/actions
3. **Page**: Create `src/app/your-feature/page.tsx` (add `"use client"` directive)
4. **Nav**: Add a link in `src/components/nav-header.tsx`
5. **Dashboard**: Add a card in `src/app/dashboard/page.tsx`
6. Run `npx convex dev` to push schema changes
