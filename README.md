# Convex Starter

A modular starter app demonstrating **Convex + Next.js** patterns with isolated feature pages.

## Features

- **Auth** — Clerk authentication with auto-provisioned user records
- **Todo List** — Real-time CRUD with status tracking and user assignment
- **File Uploads** — MinIO/S3 presigned URL uploads with progress tracking
- **Transcription** — Audio upload and transcription via NCAT API
- **RAG Chat** — AI chatbot with context from your todos and transcriptions

## Tech Stack

- [Convex](https://convex.dev) — Reactive backend & database
- [Next.js 14](https://nextjs.org) — React framework (App Router)
- [Clerk](https://clerk.com) — Authentication
- [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com) — UI
- [OpenRouter](https://openrouter.ai) — LLM API
- [MinIO](https://min.io) — S3-compatible object storage

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env.local
# Fill in your Clerk, Convex, MinIO, OpenRouter, and NCAT credentials

# Start Convex (first run creates a deployment)
npx convex dev

# Start Next.js (separate terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
convex/           # Backend functions & schema
src/app/          # Next.js pages (dashboard, todos, uploads, transcription, chat)
src/components/   # Shared React components + shadcn/ui
```

See [CLAUDE.md](./CLAUDE.md) for detailed setup instructions and architecture documentation.

## License

MIT
