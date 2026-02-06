# Authentication Flow — Sequence Diagrams

## Architecture Overview

```mermaid
flowchart TB
    classDef clerk fill:#6C63FF,color:#fff,stroke:#4B44C9
    classDef nextjs fill:#000,color:#fff,stroke:#333
    classDef convex fill:#F97316,color:#fff,stroke:#C2410C
    classDef browser fill:#0EA5E9,color:#fff,stroke:#0284C7
    classDef db fill:#16A34A,color:#fff,stroke:#15803D

    User["Browser"]:::browser

    subgraph L1["Layer 1 — Clerk Identity"]
        ClerkProvider["ClerkProvider<br/>wraps entire app in layout.tsx"]:::clerk
        SignIn["/sign-in → Clerk SignIn"]:::clerk
        SignUp["/sign-up → Clerk SignUp"]:::clerk
        JWT["Clerk JWT<br/>subject=clerkId, name, email"]:::clerk
        UserButton["UserButton<br/>sign-out in NavHeader"]:::clerk
    end

    subgraph L2["Layer 2 — Next.js Middleware"]
        MW["clerkMiddleware()<br/>src/middleware.ts"]:::nextjs
        Public["Public: /, /sign-in/*, /sign-up/*"]:::nextjs
        Protected["Protected: all other routes<br/>auth().protect() → redirect"]:::nextjs
    end

    subgraph L3["Layer 3 — Convex-Clerk Bridge"]
        Bridge["ConvexProviderWithClerk<br/>src/components/providers.tsx"]:::convex
        UseAuth["useAuth() from @clerk/nextjs<br/>forwards JWT to ConvexReactClient"]:::convex
        AuthConfig["convex/auth.config.ts<br/>CLERK_JWT_ISSUER_DOMAIN + applicationID=convex"]:::convex
    end

    subgraph L4["Layer 4 — Backend Guards"]
        Identity["ctx.auth.getUserIdentity()<br/>returns JWT claims or null"]:::convex
        GetUser["auth.getCurrentUser(ctx)<br/>JWT → DB lookup via by_clerk_id"]:::convex
        ReqAuth["requireAuth(ctx)<br/>alias for getCurrentUser, throws AuthError"]:::convex
        ReqAdmin["requireAdmin(ctx)<br/>requireAuth + role=admin check, throws ForbiddenError"]:::convex
    end

    subgraph L5["Layer 5 — User Provisioning"]
        NavHeader["NavHeader component<br/>useQuery(getCurrentUser)<br/>+ useEffect → getOrCreateUser"]:::nextjs
        GetOrCreate["users.getOrCreateUser mutation<br/>JWT claims → insert if not exists"]:::convex
        UsersDB["users table"]:::db
    end

    User --> ClerkProvider
    User -- "unauthenticated" --> SignIn
    User -- "new user" --> SignUp
    SignIn --> JWT
    SignUp --> JWT

    JWT --> MW
    MW -- "public route" --> Public
    MW -- "protected route" --> Protected
    Protected -- "no JWT" --> SignIn

    JWT --> Bridge
    Bridge --> UseAuth
    UseAuth --> AuthConfig
    AuthConfig --> Identity

    Identity --> GetUser
    GetUser --> ReqAuth
    ReqAuth --> ReqAdmin

    Protected --> NavHeader
    NavHeader -- "currentUser===null" --> GetOrCreate
    GetOrCreate --> UsersDB
```

## First Visit — Full Sequence

```mermaid
sequenceDiagram
    participant B as Browser
    participant C as Clerk
    participant MW as Next.js Middleware
    participant R as React App
    participant CV as Convex Backend
    participant DB as Convex DB (users)

    B->>C: Navigate to /sign-up
    C->>C: User creates account<br/>(email/password or OAuth)
    C->>B: JWT issued<br/>(subject=clerkId, name, email)

    B->>MW: GET /dashboard
    MW->>MW: clerkMiddleware()<br/>isPublicRoute? No
    MW->>MW: auth().protect()<br/>JWT present? Yes
    MW->>R: Serve page

    R->>R: layout.tsx renders<br/>ClerkProvider → ConvexClientProvider
    R->>R: ConvexProviderWithClerk<br/>forwards JWT via useAuth()

    R->>R: NavHeader mounts
    R->>CV: useQuery(users.getCurrentUser)
    CV->>CV: ctx.auth.getUserIdentity()<br/>→ validates JWT against auth.config.ts
    CV->>DB: query("users").withIndex("by_clerk_id")<br/>eq("clerkId", identity.subject)
    DB-->>CV: null (no record yet)
    CV->>CV: throw NotFoundError
    CV->>CV: catch → return null
    CV-->>R: null

    R->>R: useEffect: currentUser === null
    R->>CV: useMutation(users.getOrCreateUser)
    CV->>CV: ctx.auth.getUserIdentity()
    CV->>DB: query("users").withIndex("by_clerk_id")
    DB-->>CV: null
    CV->>DB: insert("users", {<br/>  clerkId, name, email,<br/>  role: "user",<br/>  createdAt, updatedAt<br/>})
    DB-->>CV: new userId
    CV->>DB: db.get(userId)
    DB-->>CV: user record
    CV-->>R: user record

    Note over R: useQuery(getCurrentUser)<br/>auto-updates reactively
    R->>R: NavHeader + Dashboard<br/>render with user data
```

## Returning Visit — Fast Path

```mermaid
sequenceDiagram
    participant B as Browser
    participant C as Clerk
    participant MW as Next.js Middleware
    participant R as React App
    participant CV as Convex Backend
    participant DB as Convex DB (users)

    B->>C: Navigate to /todos<br/>(existing session cookie)
    C->>B: JWT from session

    B->>MW: GET /todos
    MW->>MW: auth().protect() — JWT valid
    MW->>R: Serve page

    R->>R: NavHeader mounts
    R->>CV: useQuery(users.getCurrentUser)
    CV->>CV: ctx.auth.getUserIdentity()
    CV->>DB: query by_clerk_id
    DB-->>CV: existing user record
    CV-->>R: user object

    R->>R: useEffect: currentUser !== null<br/>→ skip getOrCreateUser
    R->>R: Page renders immediately
```

## Unauthenticated Access Attempt

```mermaid
sequenceDiagram
    participant B as Browser
    participant MW as Next.js Middleware
    participant C as Clerk

    B->>MW: GET /todos (no session)
    MW->>MW: auth().protect()<br/>No JWT → redirect
    MW->>B: 302 → /sign-in?redirect_url=/todos
    B->>C: Show sign-in page

    Note over B,C: After sign-in, Clerk<br/>redirects back to /todos
```

## Sign Out Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant C as Clerk
    participant CV as Convex

    B->>B: User clicks UserButton in NavHeader
    B->>C: Clerk sign-out
    C->>B: Session cleared, JWT invalidated
    B->>B: Redirect to / (afterSignOutUrl="/")

    Note over CV: All useQuery subscriptions<br/>return null/[] as<br/>getUserIdentity() → null
```

## Backend Auth Helper Call Chain

```mermaid
flowchart LR
    classDef fn fill:#3B82F6,color:#fff,stroke:#1D4ED8
    classDef guard fill:#EF4444,color:#fff,stroke:#B91C1C
    classDef db fill:#22C55E,color:#fff,stroke:#16A34A

    getUserIdentity["ctx.auth<br/>.getUserIdentity()"]:::fn
    getCurrentUser["auth.getCurrentUser()"]:::guard
    requireAuth["requireAuth()"]:::guard
    requireAdmin["requireAdmin()"]:::guard
    dbLookup["DB: users.by_clerk_id"]:::db

    getUserIdentity -- "returns identity<br/>or null" --> getCurrentUser
    getCurrentUser -- "null → throw AuthError" --> requireAuth
    getCurrentUser -- "lookup clerkId" --> dbLookup
    dbLookup -- "null → throw NotFoundError" --> getCurrentUser
    requireAuth -- "alias" --> getCurrentUser
    requireAuth --> requireAdmin
    requireAdmin -- "role !== admin<br/>→ throw ForbiddenError" --> requireAdmin
```

## Environment Variables

| Variable | Location | Used By |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` | Clerk frontend SDK |
| `CLERK_SECRET_KEY` | `.env.local` | Clerk server-side (middleware) |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex dashboard env | `convex/auth.config.ts` |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` | `ConvexReactClient` constructor |
