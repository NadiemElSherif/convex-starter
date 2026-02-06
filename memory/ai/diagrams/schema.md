# Database Schema — Entity Relationship Diagram

## Full ER Diagram

```mermaid
erDiagram
    users {
        Id _id PK
        string clerkId UK "index: by_clerk_id"
        string name "v.optional(v.string())"
        string email "v.string()"
        enum role "v.union: user | admin"
        number createdAt "v.number()"
        number updatedAt "v.number()"
    }

    todos {
        Id _id PK
        string title "v.string()"
        string description "v.optional(v.string())"
        enum status "v.union: pending | in_progress | done"
        Id_users createdBy FK "v.id('users'), index: by_created_by"
        Id_users assignedTo FK "v.optional(v.id('users')), index: by_assigned_to"
        number createdAt "v.number()"
        number updatedAt "v.number()"
    }

    fileMetadata {
        Id _id PK
        string fileName "v.string()"
        string storageKey "v.string() — MinIO object path"
        string mimeType "v.string()"
        number size "v.number() — bytes"
        enum fileType "v.union: audio | document | image"
        enum ragStatus "v.optional(v.union: pending | processing | completed | failed)"
        Id_users createdBy FK "v.id('users'), index: by_created_by"
        number createdAt "v.number()"
    }

    transcriptions {
        Id _id PK
        Id_fileMetadata fileMetadataId FK "v.id('fileMetadata'), index: by_file_metadata"
        enum status "v.union: queued | processing | completed | failed"
        string transcript "v.optional(v.string())"
        string errorMessage "v.optional(v.string())"
        enum ragStatus "v.optional(v.union: pending | processing | completed | failed)"
        Id_users createdBy FK "v.id('users'), index: by_created_by"
        number createdAt "v.number()"
        number updatedAt "v.number()"
    }

    chatMessages {
        Id _id PK
        string content "v.string()"
        enum role "v.union: user | assistant"
        string conversationId "v.string(), index: by_conversation"
        Id_users createdBy FK "v.id('users'), index: by_created_by"
        number createdAt "v.number()"
    }

    documentChunks {
        Id _id PK
        string text "v.string()"
        float64_array embedding "v.array(v.float64()) — 1536 dims"
        enum sourceType "v.union: document | transcription"
        string sourceId "v.string(), index: by_source"
        number chunkIndex "v.number()"
        Id_users createdBy FK "v.id('users') — vectorIndex filterField"
        number createdAt "v.number()"
    }

    %% Foreign key relationships
    users ||--o{ todos : "createdBy"
    users ||--o{ todos : "assignedTo (optional)"
    users ||--o{ fileMetadata : "createdBy"
    users ||--o{ transcriptions : "createdBy"
    users ||--o{ chatMessages : "createdBy"
    users ||--o{ documentChunks : "createdBy"
    fileMetadata ||--o| transcriptions : "fileMetadataId (1:0..1)"
    fileMetadata ||--o{ documentChunks : "sourceId (when sourceType=document)"
    transcriptions ||--o{ documentChunks : "sourceId (when sourceType=transcription)"
```

## Indexes

```mermaid
graph TB
    classDef regular fill:#3B82F6,color:#fff,stroke:#1D4ED8
    classDef vector fill:#F59E0B,color:#fff,stroke:#D97706

    subgraph users_idx["users — 2 indexes"]
        u1["by_clerk_id<br/>[clerkId]"]:::regular
        u2["by_email<br/>[email]"]:::regular
    end

    subgraph todos_idx["todos — 3 indexes"]
        t1["by_status<br/>[status]"]:::regular
        t2["by_created_by<br/>[createdBy]"]:::regular
        t3["by_assigned_to<br/>[assignedTo]"]:::regular
    end

    subgraph fileMetadata_idx["fileMetadata — 2 indexes"]
        f1["by_created_by<br/>[createdBy]"]:::regular
        f2["by_file_type<br/>[fileType]"]:::regular
    end

    subgraph transcriptions_idx["transcriptions — 3 indexes"]
        tr1["by_status<br/>[status]"]:::regular
        tr2["by_file_metadata<br/>[fileMetadataId]"]:::regular
        tr3["by_created_by<br/>[createdBy]"]:::regular
    end

    subgraph chatMessages_idx["chatMessages — 2 indexes"]
        cm1["by_conversation<br/>[conversationId]"]:::regular
        cm2["by_created_by<br/>[createdBy]"]:::regular
    end

    subgraph documentChunks_idx["documentChunks — 1 index + 1 vector"]
        dc1["by_source<br/>[sourceId]"]:::regular
        dc2["by_embedding (VECTOR)<br/>vectorField: embedding<br/>dimensions: 1536<br/>filterFields: [createdBy]"]:::vector
    end
```

## Field-Level Detail

| Table | Field | Convex Type | Required | Notes |
|-------|-------|-------------|----------|-------|
| **users** | `_id` | `Id<"users">` | auto | System-generated |
| | `clerkId` | `v.string()` | yes | Clerk `identity.subject`, unique via index |
| | `name` | `v.optional(v.string())` | no | From Clerk JWT `identity.name` |
| | `email` | `v.string()` | yes | From Clerk JWT `identity.email`, defaults to `""` |
| | `role` | `v.union(v.literal("user"), v.literal("admin"))` | yes | Defaults to `"user"` on creation |
| | `createdAt` | `v.number()` | yes | `Date.now()` |
| | `updatedAt` | `v.number()` | yes | `Date.now()` |
| **todos** | `_id` | `Id<"todos">` | auto | |
| | `title` | `v.string()` | yes | |
| | `description` | `v.optional(v.string())` | no | |
| | `status` | `v.union(...)` | yes | `pending` (default) / `in_progress` / `done` |
| | `createdBy` | `v.id("users")` | yes | FK to users, ownership check on mutations |
| | `assignedTo` | `v.optional(v.id("users"))` | no | FK to users, grants update permission |
| | `createdAt` | `v.number()` | yes | |
| | `updatedAt` | `v.number()` | yes | |
| **fileMetadata** | `_id` | `Id<"fileMetadata">` | auto | |
| | `fileName` | `v.string()` | yes | Original filename |
| | `storageKey` | `v.string()` | yes | MinIO path: `uploads/{fileType}/{userId}/{ts}_{name}` |
| | `mimeType` | `v.string()` | yes | |
| | `size` | `v.number()` | yes | Bytes, max 100MB enforced client-side |
| | `fileType` | `v.union(...)` | yes | `audio` / `document` / `image` |
| | `ragStatus` | `v.optional(v.union(...))` | no | Only set for indexable docs (pdf/txt/md) |
| | `createdBy` | `v.id("users")` | yes | FK to users, ownership check on delete |
| | `createdAt` | `v.number()` | yes | |
| **transcriptions** | `_id` | `Id<"transcriptions">` | auto | |
| | `fileMetadataId` | `v.id("fileMetadata")` | yes | 1:1 relationship, checked for duplicates |
| | `status` | `v.union(...)` | yes | `queued` → `processing` → `completed` or `failed` |
| | `transcript` | `v.optional(v.string())` | no | Set on completion by NCAT |
| | `errorMessage` | `v.optional(v.string())` | no | Set on failure |
| | `ragStatus` | `v.optional(v.union(...))` | no | Set to `pending` on completion, then processed |
| | `createdBy` | `v.id("users")` | yes | FK to users |
| | `createdAt` | `v.number()` | yes | |
| | `updatedAt` | `v.number()` | yes | |
| **chatMessages** | `_id` | `Id<"chatMessages">` | auto | |
| | `content` | `v.string()` | yes | Message text |
| | `role` | `v.union(...)` | yes | `user` or `assistant` |
| | `conversationId` | `v.string()` | yes | Client-generated: `conv_{Date.now()}` |
| | `createdBy` | `v.id("users")` | yes | FK to users, ownership filter on queries |
| | `createdAt` | `v.number()` | yes | |
| **documentChunks** | `_id` | `Id<"documentChunks">` | auto | |
| | `text` | `v.string()` | yes | ~2000 chars per chunk |
| | `embedding` | `v.array(v.float64())` | yes | 1536-dimensional, text-embedding-3-small |
| | `sourceType` | `v.union(...)` | yes | `document` or `transcription` |
| | `sourceId` | `v.string()` | yes | fileMetadata._id or transcriptions._id as string |
| | `chunkIndex` | `v.number()` | yes | 0-indexed position within source |
| | `createdBy` | `v.id("users")` | yes | Copied from source, used as vector filter |
| | `createdAt` | `v.number()` | yes | |
