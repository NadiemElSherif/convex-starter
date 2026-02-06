# User Journeys — Page-to-Function Flowcharts

## Page → Convex Function Map

```mermaid
flowchart LR
    classDef page fill:#1E40AF,color:#fff,stroke:#1E3A8A
    classDef comp fill:#7C3AED,color:#fff,stroke:#6D28D9
    classDef query fill:#22C55E,color:#fff,stroke:#16A34A
    classDef mutation fill:#3B82F6,color:#fff,stroke:#2563EB
    classDef action fill:#F97316,color:#fff,stroke:#EA580C

    subgraph nav["NavHeader (all authed pages)"]
        NH["NavHeader"]:::comp
        NH --> NH_Q["useQuery<br/>users.getCurrentUser"]:::query
        NH --> NH_M["useMutation<br/>users.getOrCreateUser"]:::mutation
    end

    subgraph dash["/dashboard"]
        DP["DashboardPage"]:::page
        DP --> DP_Q["useQuery<br/>users.getCurrentUser"]:::query
    end

    subgraph todos_p["/todos"]
        TP["TodosPage"]:::page
        TP --> TP_Q1["useQuery<br/>todos.list"]:::query
        TP --> TP_Q2["useQuery<br/>users.getAllUsers"]:::query
        TP --> TP_M1["useMutation<br/>todos.create"]:::mutation
        TP --> TP_M2["useMutation<br/>todos.updateStatus"]:::mutation
        TP --> TP_M3["useMutation<br/>todos.remove"]:::mutation
    end

    subgraph uploads_p["/uploads"]
        UP["UploadsPage"]:::page
        UP --> UP_Q["useQuery<br/>files.getMyFiles"]:::query
        UP --> UP_M["useMutation<br/>files.deleteFile"]:::mutation
        UP --> UP_A["useAction<br/>fileActions.generateDownloadUrl"]:::action
        FU["FileUpload component"]:::comp
        UP -.-> FU
        FU --> FU_Q["useQuery<br/>users.getCurrentUser"]:::query
        FU --> FU_A["useAction<br/>fileActions.generateUploadUrl"]:::action
        FU --> FU_M["useMutation<br/>files.storeFileMetadata"]:::mutation
    end

    subgraph trans_p["/transcription"]
        TRP["TranscriptionPage"]:::page
        TRP --> TRP_Q["useQuery<br/>transcriptions.getTranscriptions"]:::query
        TRP --> TRP_M["useMutation<br/>transcriptions.queueTranscription"]:::mutation
        TRP --> TRP_A1["useAction<br/>transcriptions.processTranscription"]:::action
        TRP --> TRP_A2["useAction<br/>fileActions.generateDownloadUrl"]:::action
        FU2["FileUpload component"]:::comp
        TRP -.-> FU2
    end

    subgraph chat_p["/chat"]
        CP["ChatPage"]:::page
        CP --> CP_Q1["useQuery<br/>chat.getConversations"]:::query
        CP --> CP_Q2["useQuery<br/>chat.getConversation"]:::query
        CP --> CP_A["useAction<br/>chat.sendMessage"]:::action
        CP --> CP_M["useMutation<br/>chat.deleteConversation"]:::mutation
    end
```

## Journey 1: Todo Management

```mermaid
flowchart TB
    classDef user fill:#0EA5E9,color:#fff
    classDef ui fill:#1E40AF,color:#fff
    classDef fn fill:#3B82F6,color:#fff
    classDef db fill:#22C55E,color:#fff

    Start["User navigates to /todos"]:::user
    Start --> Load

    subgraph Load["Page Load"]
        Q1["useQuery(todos.list, {status?})"]:::fn
        Q1 --> DB1["Read todos table<br/>+ join users for names"]:::db
        Q2["useQuery(users.getAllUsers)"]:::fn
        Q2 --> DB2["Read users table<br/>for assignment dropdown"]:::db
    end

    Load --> Interact

    subgraph Interact["User Interactions"]
        direction TB

        Create["Submit create form"]:::user
        Create --> C1["useMutation(todos.create)"]:::fn
        C1 --> C1_auth["requireAuth()"]
        C1_auth --> C1_db["insert('todos', {<br/>title, description, status:'pending',<br/>createdBy:user._id, assignedTo?})"]:::db
        C1_db --> C1_react["useQuery auto-updates<br/>new todo appears"]:::ui

        Filter["Click status filter tab"]:::user
        Filter --> F1["useQuery(todos.list, {status:'pending'})"]:::fn
        F1 --> F1_db["query('todos').withIndex('by_status')"]:::db

        Toggle["Click status badge"]:::user
        Toggle --> T1["useMutation(todos.updateStatus)"]:::fn
        T1 --> T1_auth["requireAuth()<br/>+ ownership check:<br/>createdBy OR assignedTo"]
        T1_auth -- "authorized" --> T1_db["patch(id, {status:next, updatedAt})"]:::db
        T1_auth -- "not owner/assignee" --> T1_err["throw 'Not authorized'"]

        Delete["Click trash icon"]:::user
        Delete --> D1["useMutation(todos.remove)"]:::fn
        D1 --> D1_auth["requireAuth()<br/>+ createdBy must match<br/>(creator only)"]
        D1_auth -- "authorized" --> D1_db["delete(id)"]:::db
        D1_auth -- "not creator" --> D1_err["throw 'Not authorized'"]
    end
```

## Journey 2: File Upload + RAG Indexing

```mermaid
flowchart TB
    classDef user fill:#0EA5E9,color:#fff
    classDef ui fill:#1E40AF,color:#fff
    classDef fn fill:#3B82F6,color:#fff
    classDef action fill:#F97316,color:#fff
    classDef db fill:#22C55E,color:#fff
    classDef ext fill:#EC4899,color:#fff
    classDef internal fill:#8B5CF6,color:#fff

    Start["User selects file in FileUpload"]:::user

    Start --> SizeCheck{"file.size > 100MB?"}
    SizeCheck -- yes --> Error["Show error:<br/>File size exceeds 100MB"]:::ui
    SizeCheck -- no --> GetUrl

    GetUrl["useAction(fileActions.generateUploadUrl)<br/>{fileName, mimeType, size, fileType, userId}"]:::action
    GetUrl --> MinIO1["MinIO: presignedPutObject<br/>storageKey=uploads/{type}/{userId}/{ts}_{name}"]:::ext
    MinIO1 --> Upload

    Upload["XHR PUT to presigned URL<br/>with progress tracking (onprogress)"]:::user
    Upload --> XHR_OK{"xhr.status 2xx?"}
    XHR_OK -- no --> UploadErr["Show error"]:::ui
    XHR_OK -- yes --> StoreMeta

    StoreMeta["useMutation(files.storeFileMetadata)<br/>{fileName, storageKey, mimeType, size, fileType}"]:::fn
    StoreMeta --> Auth1["requireAuth()"]
    Auth1 --> ExtCheck{"fileType=document AND<br/>ext in [pdf,txt,md]?"}

    ExtCheck -- no --> InsertBasic["insert('fileMetadata', {<br/>...args, createdBy, createdAt<br/>})"]:::db
    ExtCheck -- yes --> InsertRAG["insert('fileMetadata', {<br/>...args, ragStatus:'pending',<br/>createdBy, createdAt<br/>})"]:::db
    InsertRAG --> Schedule["scheduler.runAfter(0,<br/>internal.embeddings.processDocument)"]:::internal

    Schedule --> ProcessDoc["processDocument (internalAction)"]:::internal
    ProcessDoc --> RAG1["runMutation: ragStatus='processing'"]:::internal
    RAG1 --> RAG2["runQuery: getFileMetadata"]:::internal
    RAG2 --> RAG3["MinIO: presignedGetObject + fetch"]:::ext
    RAG3 --> RAG4{"mimeType = pdf?"}
    RAG4 -- yes --> RAG5a["unpdf extractText"]:::internal
    RAG4 -- no --> RAG5b["buffer.toString('utf-8')"]:::internal
    RAG5a --> RAG6["chunkText()<br/>~2000 chars, 200 overlap"]:::internal
    RAG5b --> RAG6
    RAG6 --> RAG7["embedBatch() via OpenRouter<br/>batches of 20"]:::ext
    RAG7 --> RAG8["storeChunks (internalMutation)<br/>batches of 15"]:::internal
    RAG8 --> RAG9["ragStatus='completed'"]:::internal

    ProcessDoc -- "on error" --> RAG_FAIL["ragStatus='failed'"]:::internal
```

## Journey 3: Audio Transcription + RAG

```mermaid
flowchart TB
    classDef user fill:#0EA5E9,color:#fff
    classDef fn fill:#3B82F6,color:#fff
    classDef action fill:#F97316,color:#fff
    classDef db fill:#22C55E,color:#fff
    classDef ext fill:#EC4899,color:#fff
    classDef internal fill:#8B5CF6,color:#fff

    Start["User uploads audio via FileUpload"]:::user
    Start --> Upload["Same upload flow as Journey 2<br/>(fileType='audio', no RAG scheduled)"]:::action

    Upload --> SaveIds["onUploadComplete callback<br/>saves fileId + storageKey in state"]:::user

    SaveIds --> Click["User clicks 'Start Transcription'"]:::user

    Click --> Queue["useMutation(transcriptions.queueTranscription)<br/>{fileMetadataId}"]:::fn
    Queue --> QAuth["requireAuth()"]
    QAuth --> QCheck1{"file exists AND<br/>fileType === 'audio'?"}
    QCheck1 -- no --> QErr["throw error"]
    QCheck1 -- yes --> QCheck2{"transcription already exists<br/>for this fileMetadataId?"}
    QCheck2 -- yes --> QReturn["return existing._id"]
    QCheck2 -- no --> QInsert["insert('transcriptions', {<br/>status:'queued', createdBy, ...})"]:::db
    QInsert --> QDone["return transcriptionId"]

    QDone --> GetAudio["useAction(fileActions.generateDownloadUrl)<br/>{storageKey}"]:::action
    GetAudio --> MinIO["MinIO: presignedGetObject"]:::ext
    MinIO --> Process

    Process["useAction(transcriptions.processTranscription)<br/>{transcriptionId, audioUrl}"]:::action

    Process --> P1["runMutation: _updateStatus → 'processing'"]:::internal
    P1 --> P2["POST /v1/media/transcribe<br/>{media_url, language:'en', include_text:true}<br/>header: x-api-key"]:::ext

    P2 --> P2Check{"response.code === 200<br/>AND response.text?"}
    P2Check -- "yes (direct result)" --> P_Complete
    P2Check -- "no (queued)" --> P3

    P3["Extract job_id from response"]
    P3 --> P3Check{"job_id exists?"}
    P3Check -- no --> P_Fail

    P3Check -- yes --> Poll["Poll loop: max 30 iterations, 10s interval"]
    Poll --> PollReq["POST /v1/toolkit/job/status<br/>{job_id}<br/>header: x-api-key"]:::ext
    PollReq --> PollCheck{"job_status?"}
    PollCheck -- "'done' or 'completed'" --> P_Complete
    PollCheck -- "'failed' or 'error'" --> P_Fail
    PollCheck -- "'processing'" --> PollWait["await 10s"]
    PollWait --> Poll
    PollCheck -- "30 iterations exhausted" --> P_Timeout["throw 'Transcription timed out'"]
    P_Timeout --> P_Fail

    P_Complete["runMutation: completeTranscription<br/>{id, transcript}"]:::internal
    P_Complete --> CompletePatch["patch: status='completed',<br/>transcript=text,<br/>ragStatus='pending'"]:::db
    CompletePatch --> ScheduleRAG["scheduler.runAfter(0,<br/>internal.embeddings.processTranscription)"]:::internal
    ScheduleRAG --> RAG["Same chunk → embed → store pipeline<br/>as document RAG (Journey 2)"]:::internal

    P_Fail["runMutation: failTranscription<br/>{id, errorMessage}"]:::internal
    P_Fail --> FailPatch["patch: status='failed',<br/>errorMessage=msg"]:::db
```

## Journey 4: RAG Chat

```mermaid
flowchart TB
    classDef user fill:#0EA5E9,color:#fff
    classDef ui fill:#1E40AF,color:#fff
    classDef fn fill:#3B82F6,color:#fff
    classDef action fill:#F97316,color:#fff
    classDef db fill:#22C55E,color:#fff
    classDef ext fill:#EC4899,color:#fff
    classDef internal fill:#8B5CF6,color:#fff

    Start["User opens /chat"]:::user
    Start --> LoadConvs["useQuery(chat.getConversations)<br/>groups chatMessages by conversationId<br/>filters by createdBy"]:::fn

    Start --> NewChat["Click 'New Chat'"]:::user
    NewChat --> GenId["setConversationId('conv_{Date.now()}')"]:::ui

    Start --> SelectConv["Click existing conversation"]:::user
    SelectConv --> LoadMsgs["useQuery(chat.getConversation, {conversationId})<br/>filters by createdBy, sorted by createdAt"]:::fn

    LoadMsgs --> TypeMsg["User types message + Enter"]:::user
    TypeMsg --> Send["useAction(chat.sendMessage)<br/>{content, conversationId}"]:::action

    Send --> S1["runMutation: chat.storeMessage<br/>(role='user')"]:::fn
    S1 --> S1_DB["insert('chatMessages')"]:::db

    Send --> S2["runQuery: todos.list<br/>get all todos for context"]:::fn
    S2 --> S2_CTX["Build '## Current Todos' context string"]

    Send --> S3["runQuery: users.getCurrentUser<br/>get user._id for vector filter"]:::fn

    S3 --> S4{"user exists?"}
    S4 -- no --> S6
    S4 -- yes --> S5

    S5["generateSingleEmbedding(content)<br/>via openrouter.ts helper"]:::ext
    S5 --> VEC["ctx.vectorSearch('documentChunks', 'by_embedding',<br/>{vector, limit:8, filter: createdBy=user._id})"]:::db
    VEC --> VEC_Check{"results.length > 0?"}
    VEC_Check -- no --> S6
    VEC_Check -- yes --> FetchChunks["runQuery: internal.documentChunks.fetchChunksByIds"]:::internal
    FetchChunks --> BuildRAG["Build '## Relevant Documents' context<br/>with sourceType labels and chunk text"]

    BuildRAG --> S6
    S6["runQuery: chat.getConversation<br/>get last 10 messages as history"]:::fn

    S6 --> BuildPrompt["Assemble:<br/>- systemPrompt (todos + RAG context)<br/>- prompt (history + current message)"]

    BuildPrompt --> LLM["callLLMHelper() via openrouter.ts<br/>3 retries, 60s timeout, exponential backoff"]:::ext
    LLM --> LLM_API["POST /v1/chat/completions<br/>model: DEFAULT_OPENROUTER_MODEL or gemini-3-flash-preview<br/>max_tokens: 2048"]:::ext

    LLM_API --> StoreResp["runMutation: chat.storeMessage<br/>(role='assistant', content=response)"]:::fn
    StoreResp --> StoreDB["insert('chatMessages')"]:::db
    StoreDB --> React["useQuery(getConversation) auto-updates<br/>both user + assistant messages appear"]:::ui

    Send -- "RAG try/catch fails" --> S6_fallback["Continue without document context<br/>console.warn logged"]
    S6_fallback --> S6
```

## Journey 5: File Download + Delete

```mermaid
flowchart TB
    classDef user fill:#0EA5E9,color:#fff
    classDef fn fill:#3B82F6,color:#fff
    classDef action fill:#F97316,color:#fff
    classDef db fill:#22C55E,color:#fff
    classDef ext fill:#EC4899,color:#fff

    Start["User on /uploads page"]:::user

    Start --> Download["Click download icon"]:::user
    Download --> DL1["useAction(fileActions.generateDownloadUrl)<br/>{storageKey}"]:::action
    DL1 --> DL2["MinIO: presignedGetObject"]:::ext
    DL2 --> DL3["Create <a> element<br/>a.href=url, a.download=fileName<br/>a.click()"]:::user

    Start --> Delete["Click trash icon"]:::user
    Delete --> DEL1["useMutation(files.deleteFile)<br/>{fileId}"]:::fn
    DEL1 --> DEL_AUTH["requireAuth()"]
    DEL_AUTH --> DEL_OWN{"file.createdBy === user._id?"}
    DEL_OWN -- no --> DEL_ERR["throw 'Not authorized'"]
    DEL_OWN -- yes --> DEL_CHUNKS["query('documentChunks').withIndex('by_source')<br/>delete all matching chunks"]:::db
    DEL_CHUNKS --> DEL_FILE["delete(fileId) from fileMetadata"]:::db
    DEL_FILE --> DEL_REACT["useQuery(getMyFiles) auto-updates<br/>file disappears from list"]
```
