# Data Flow — Client ↔ Convex ↔ External Services

## Complete Data Flow Architecture

```mermaid
flowchart TB
    classDef client fill:#0EA5E9,color:#fff,stroke:#0284C7
    classDef provider fill:#6366F1,color:#fff,stroke:#4F46E5
    classDef query fill:#22C55E,color:#fff,stroke:#16A34A
    classDef mutation fill:#3B82F6,color:#fff,stroke:#2563EB
    classDef action fill:#F97316,color:#fff,stroke:#EA580C
    classDef internal fill:#8B5CF6,color:#fff,stroke:#7C3AED
    classDef db fill:#10B981,color:#fff,stroke:#059669
    classDef ext fill:#EC4899,color:#fff,stroke:#DB2777
    classDef helper fill:#A855F7,color:#fff,stroke:#9333EA

    subgraph Browser["Browser (Next.js Client)"]
        Pages["Pages: /dashboard, /todos,<br/>/uploads, /transcription, /chat"]:::client
        Components["Components: NavHeader,<br/>FileUpload"]:::client
        XHR["XHR Upload<br/>(direct to MinIO)"]:::client
    end

    subgraph Providers["Provider Layer"]
        Clerk["ClerkProvider<br/>JWT management"]:::provider
        ConvexProv["ConvexProviderWithClerk<br/>forwards JWT, manages subscriptions"]:::provider
    end

    subgraph ConvexRuntime["Convex Runtime"]
        subgraph PublicAPI["Public API (client-callable)"]
            Queries["Queries (reactive)<br/>users.getCurrentUser<br/>users.getAllUsers<br/>todos.list<br/>files.getMyFiles<br/>transcriptions.getTranscriptions<br/>chat.getConversations<br/>chat.getConversation"]:::query
            Mutations["Mutations (transactional)<br/>users.getOrCreateUser<br/>todos.create/update/updateStatus/remove<br/>files.storeFileMetadata/deleteFile<br/>transcriptions.queueTranscription<br/>chat.storeMessage/deleteConversation"]:::mutation
            Actions["Actions (side effects)<br/>fileActions.generateUploadUrl<br/>fileActions.generateDownloadUrl<br/>transcriptions.processTranscription<br/>chat.sendMessage<br/>llm.callLLM"]:::action
        end

        subgraph InternalAPI["Internal API (server-only)"]
            IntMutations["Internal Mutations<br/>documentChunks.storeChunks<br/>documentChunks.deleteChunksBySource<br/>documentChunks.updateFileRagStatus<br/>documentChunks.updateTranscriptionRagStatus<br/>transcriptions.completeTranscription<br/>transcriptions.failTranscription<br/>transcriptions._updateStatus"]:::internal
            IntQueries["Internal Queries<br/>documentChunks.fetchChunksByIds<br/>documentChunks.getFileMetadata<br/>transcriptions.getTranscription"]:::internal
            IntActions["Internal Actions<br/>embeddings.processDocument<br/>embeddings.processTranscription"]:::internal
        end

        subgraph Helpers["Shared Helpers (openrouter.ts)"]
            EmbedHelper["generateSingleEmbedding()<br/>embedBatch()"]:::helper
            LLMHelper["callLLMHelper()"]:::helper
        end

        subgraph Scheduler["Scheduler"]
            Sched["ctx.scheduler.runAfter(0, ...)"]:::internal
        end
    end

    subgraph Database["Convex Database"]
        UsersT["users"]:::db
        TodosT["todos"]:::db
        FilesT["fileMetadata"]:::db
        TransT["transcriptions"]:::db
        ChatT["chatMessages"]:::db
        ChunksT["documentChunks<br/>(+ vector index)"]:::db
    end

    subgraph External["External Services"]
        MinIO["MinIO / S3<br/>Object Storage"]:::ext
        NCAT["NCAT API<br/>Transcription"]:::ext
        OpenRouter["OpenRouter API<br/>Embeddings + LLM"]:::ext
    end

    %% Client → Providers
    Pages --> Clerk
    Components --> Clerk
    Clerk --> ConvexProv

    %% Client → Convex (hooks)
    ConvexProv -- "useQuery() →<br/>reactive subscription" --> Queries
    ConvexProv -- "useMutation() →<br/>one-shot call" --> Mutations
    ConvexProv -- "useAction() →<br/>one-shot call" --> Actions

    %% Queries → DB (read)
    Queries -- "read" --> UsersT
    Queries -- "read" --> TodosT
    Queries -- "read" --> FilesT
    Queries -- "read" --> TransT
    Queries -- "read" --> ChatT

    %% Mutations → DB (read/write)
    Mutations -- "read/write" --> UsersT
    Mutations -- "read/write" --> TodosT
    Mutations -- "read/write" --> FilesT
    Mutations -- "read/write" --> TransT
    Mutations -- "read/write" --> ChatT
    Mutations -- "read/delete" --> ChunksT

    %% Mutations → Scheduler
    Mutations -- "storeFileMetadata<br/>schedules processDocument" --> Sched
    Sched --> IntActions

    %% Internal Mutations → DB
    IntMutations -- "write/delete" --> ChunksT
    IntMutations -- "patch ragStatus" --> FilesT
    IntMutations -- "patch status/ragStatus" --> TransT

    %% Internal Queries → DB
    IntQueries -- "read" --> ChunksT
    IntQueries -- "read" --> FilesT
    IntQueries -- "read" --> TransT

    %% Internal Actions → Internal Mutations/Queries
    IntActions -- "runMutation/<br/>runQuery" --> IntMutations
    IntActions -- "runMutation/<br/>runQuery" --> IntQueries

    %% Actions → External Services
    Actions -- "presigned URLs" --> MinIO
    Actions -- "POST /v1/media/transcribe<br/>POST /v1/toolkit/job/status" --> NCAT
    Actions -- "import call" --> EmbedHelper
    Actions -- "import call" --> LLMHelper
    IntActions -- "presigned download" --> MinIO
    IntActions -- "import call" --> EmbedHelper
    EmbedHelper -- "POST /v1/embeddings" --> OpenRouter
    LLMHelper -- "POST /v1/chat/completions" --> OpenRouter

    %% Actions → Internal
    Actions -- "runMutation/<br/>runQuery" --> IntMutations
    Actions -- "runQuery" --> IntQueries
    Actions -- "vectorSearch" --> ChunksT

    %% Direct upload
    XHR -- "PUT presigned URL<br/>(file bytes)" --> MinIO

    %% DB → Client (reactive)
    UsersT -. "subscription<br/>auto-update" .-> ConvexProv
    TodosT -. "subscription<br/>auto-update" .-> ConvexProv
    FilesT -. "subscription<br/>auto-update" .-> ConvexProv
    TransT -. "subscription<br/>auto-update" .-> ConvexProv
    ChatT -. "subscription<br/>auto-update" .-> ConvexProv
```

## Reactive Subscription Flow

```mermaid
sequenceDiagram
    participant C as Client Component
    participant CR as ConvexReactClient
    participant WS as WebSocket
    participant CV as Convex Backend
    participant DB as Convex Database

    C->>CR: useQuery(api.todos.list, {})
    CR->>WS: Subscribe to todos.list({})
    WS->>CV: Register subscription
    CV->>DB: Execute query
    DB-->>CV: [todo1, todo2, ...]
    CV-->>WS: Initial result
    WS-->>CR: Update cache
    CR-->>C: Render with data

    Note over DB: Another client inserts a todo<br/>via useMutation(todos.create)

    DB->>CV: Data changed (todos table)
    CV->>CV: Re-execute todos.list
    CV->>DB: Read todos
    DB-->>CV: [todo1, todo2, todo3]
    CV-->>WS: Updated result
    WS-->>CR: Update cache
    CR-->>C: Re-render with new data

    Note over C: Component unmounts
    C->>CR: Unsubscribe
    CR->>WS: Remove subscription
```

## File Upload Data Flow (Detailed)

```mermaid
sequenceDiagram
    participant B as Browser
    participant CV_A as Convex Action<br/>(fileActions)
    participant MinIO as MinIO/S3
    participant CV_M as Convex Mutation<br/>(files)
    participant DB as Convex DB
    participant Sched as Scheduler
    participant CV_IA as Convex Internal Action<br/>(embeddings)
    participant OR as OpenRouter API

    B->>CV_A: generateUploadUrl({fileName, mimeType, size, fileType, userId})
    CV_A->>CV_A: Validate size <= 100MB
    CV_A->>CV_A: Build storageKey=uploads/{type}/{userId}/{ts}_{name}
    CV_A->>MinIO: presignedPutObject(bucket, storageKey, ttl)
    MinIO-->>CV_A: presignedUrl
    CV_A-->>B: {presignedUrl, storageKey, ...}

    B->>MinIO: PUT presignedUrl (file bytes)<br/>XHR with progress tracking
    MinIO-->>B: 200 OK

    B->>CV_M: storeFileMetadata({fileName, storageKey, mimeType, size, fileType})
    CV_M->>CV_M: requireAuth() → user
    CV_M->>DB: insert("fileMetadata", {..., createdBy, ragStatus?})
    DB-->>CV_M: fileId

    alt fileType=document AND ext in [pdf,txt,md]
        CV_M->>Sched: runAfter(0, internal.embeddings.processDocument, {fileMetadataId})
        Sched->>CV_IA: processDocument({fileMetadataId})
        CV_IA->>DB: patch fileMetadata ragStatus="processing"
        CV_IA->>DB: get fileMetadata (storageKey, mimeType, fileName)
        CV_IA->>MinIO: presignedGetObject → fetch(url)
        MinIO-->>CV_IA: file bytes
        CV_IA->>CV_IA: extractText (unpdf for PDF, utf-8 for txt/md)
        CV_IA->>CV_IA: chunkText (~2000 chars, 200 overlap)
        loop batches of 20
            CV_IA->>OR: POST /v1/embeddings {model, input[]}
            OR-->>CV_IA: embeddings[]
        end
        loop batches of 15
            CV_IA->>DB: insert documentChunks (text, embedding, sourceType, sourceId, chunkIndex, createdBy)
        end
        CV_IA->>DB: patch fileMetadata ragStatus="completed"
    end

    CV_M-->>B: fileId
    Note over B: useQuery(files.getMyFiles)<br/>auto-updates with new file
```

## Chat RAG Data Flow (Detailed)

```mermaid
sequenceDiagram
    participant B as Browser
    participant CV_A as Convex Action<br/>(chat.sendMessage)
    participant CV_Q as Convex Query
    participant CV_M as Convex Mutation
    participant DB as Convex DB
    participant OR as OpenRouter API
    participant Vec as Vector Index

    B->>CV_A: sendMessage({content, conversationId})

    CV_A->>CV_M: storeMessage({content, role:"user", conversationId})
    CV_M->>DB: insert chatMessages

    CV_A->>CV_Q: todos.list({})
    CV_Q->>DB: query todos + join users
    DB-->>CV_Q: todos[]
    CV_Q-->>CV_A: todos context

    CV_A->>CV_Q: users.getCurrentUser({})
    CV_Q->>DB: query users.by_clerk_id
    DB-->>CV_Q: user
    CV_Q-->>CV_A: user._id

    CV_A->>OR: POST /v1/embeddings<br/>{model:"text-embedding-3-small", input:content}
    OR-->>CV_A: queryEmbedding[1536]

    CV_A->>Vec: vectorSearch("documentChunks", "by_embedding",<br/>{vector:queryEmbedding, limit:8, filter:createdBy=user._id})
    Vec-->>CV_A: [{_id, _score}, ...]

    alt results.length > 0
        CV_A->>CV_Q: fetchChunksByIds({ids})
        CV_Q->>DB: get documentChunks by ID
        DB-->>CV_Q: chunks[]
        CV_Q-->>CV_A: chunk text + metadata
    end

    CV_A->>CV_Q: chat.getConversation({conversationId})
    CV_Q->>DB: query chatMessages.by_conversation<br/>filter by createdBy
    DB-->>CV_Q: messages[]
    CV_Q-->>CV_A: last 10 messages

    CV_A->>CV_A: Build systemPrompt (todos + RAG chunks)<br/>Build prompt (history + current message)

    CV_A->>OR: POST /v1/chat/completions<br/>{model, messages:[system,user], max_tokens:2048}
    Note over CV_A,OR: 3 retries, exponential backoff<br/>60s timeout per attempt
    OR-->>CV_A: assistant response

    CV_A->>CV_M: storeMessage({content:response, role:"assistant", conversationId})
    CV_M->>DB: insert chatMessages

    CV_A-->>B: response text

    Note over B: useQuery(chat.getConversation)<br/>auto-updates with both messages
```

## Scheduler Pipeline Flow

```mermaid
flowchart LR
    classDef mutation fill:#3B82F6,color:#fff
    classDef scheduler fill:#F59E0B,color:#fff
    classDef internal fill:#8B5CF6,color:#fff

    subgraph Triggers["Trigger Points"]
        FM["files:storeFileMetadata<br/>(on indexable doc upload)"]:::mutation
        CT["transcriptions:completeTranscription<br/>(on transcription done)"]:::mutation
    end

    subgraph Scheduler["Scheduler (runAfter 0ms)"]
        S1["Schedule immediately"]:::scheduler
    end

    subgraph Pipelines["Processing Pipelines"]
        PD["embeddings:processDocument<br/>(internalAction, node runtime)"]:::internal
        PT["embeddings:processTranscription<br/>(internalAction, node runtime)"]:::internal
    end

    FM --> S1
    CT --> S1
    S1 --> PD
    S1 --> PT
```

## Runtime Boundaries

```mermaid
graph TB
    classDef default_rt fill:#22C55E,color:#fff,stroke:#16A34A
    classDef node_rt fill:#F97316,color:#fff,stroke:#EA580C
    classDef shared fill:#8B5CF6,color:#fff,stroke:#7C3AED

    subgraph default_runtime["Default Runtime (V8 isolate — no Node.js)"]
        auth_ts["auth.ts — helper functions"]:::default_rt
        users_ts["users.ts — queries + mutations"]:::default_rt
        todos_ts["todos.ts — queries + mutations"]:::default_rt
        files_ts["files.ts — queries + mutations"]:::default_rt
        transcriptions_ts["transcriptions.ts — queries + mutations + action"]:::default_rt
        documentChunks_ts["documentChunks.ts — internal queries + mutations"]:::default_rt
        chat_ts["chat.ts — queries + mutations + action"]:::default_rt
        llm_ts["llm.ts — action (delegates to helper)"]:::default_rt
    end

    subgraph node_runtime["Node.js Runtime ('use node')"]
        fileActions_ts["fileActions.ts — actions<br/>requires: minio"]:::node_rt
        embeddings_ts["embeddings.ts — internalActions<br/>requires: unpdf, minio"]:::node_rt
    end

    subgraph shared_helpers["Shared Helpers (no runtime directive — importable from both)"]
        openrouter_ts["openrouter.ts<br/>callEmbeddingAPI, generateSingleEmbedding,<br/>embedBatch, callLLMHelper<br/>(pure fetch, no Node.js deps)"]:::shared
        util_ts["util.ts<br/>error classes + utilities"]:::shared
    end

    chat_ts -- "import" --> openrouter_ts
    llm_ts -- "import" --> openrouter_ts
    embeddings_ts -- "import" --> openrouter_ts
```
