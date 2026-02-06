# 03 - Technical Architecture

| Field              | Value                                                      |
|--------------------|------------------------------------------------------------|
| **Document**       | Technical Architecture                                     |
| **Version**        | 1.0                                                        |
| **Date**           | 2026-02-06                                                 |
| **Status**         | Draft                                                      |
| **Classification** | Internal / Confidential                                    |
| **Inspired by**    | Go Potty (goingpotty.com)                                  |
| **Related docs**   | 01_PRD.md, 02_FEATURE_SPECIFICATIONS.md, 04_UI_UX.md      |

---

## Table of Contents

1. [Technology Stack Recommendations](#1-technology-stack-recommendations)
   - 1.1 [Mobile App](#11-mobile-app)
   - 1.2 [Backend](#12-backend)
   - 1.3 [Third-Party Integrations](#13-third-party-integrations)
   - 1.4 [Hosting & DevOps](#14-hosting--devops)
   - 1.5 [Security Infrastructure](#15-security-infrastructure)
2. [Database Schema](#2-database-schema)
   - 2.1 [Entity-Relationship Overview](#21-entity-relationship-overview)
   - 2.2 [Table Definitions](#22-table-definitions)
   - 2.3 [Indexes & Performance](#23-indexes--performance)
3. [API Design](#3-api-design)
   - 3.1 [API Conventions](#31-api-conventions)
   - 3.2 [Endpoint Groups](#32-endpoint-groups)
   - 3.3 [Error Handling](#33-error-handling)
   - 3.4 [Rate Limiting](#34-rate-limiting)
4. [Mobile App Architecture](#4-mobile-app-architecture)
   - 4.1 [Navigation & Structure](#41-navigation--structure)
   - 4.2 [Offline Capabilities](#42-offline-capabilities)
   - 4.3 [Sync Strategy](#43-sync-strategy)
   - 4.4 [Performance](#44-performance)
   - 4.5 [Battery & Data Considerations](#45-battery--data-considerations)
5. [Development Roadmap](#5-development-roadmap)
   - 5.1 [Phase 1 - MVP](#51-phase-1---mvp)
   - 5.2 [Phase 2 - Premium & Community](#52-phase-2---premium--community)
   - 5.3 [Phase 3 - B2B Expansion](#53-phase-3---b2b-expansion)
   - 5.4 [Phase 4 - Scale & AI](#54-phase-4---scale--ai)
6. [Security & Compliance](#6-security--compliance)
   - 6.1 [GDPR](#61-gdpr)
   - 6.2 [Children's Data Protection](#62-childrens-data-protection)
   - 6.3 [Payment Security](#63-payment-security)
   - 6.4 [API Security](#64-api-security)
   - 6.5 [Content Moderation](#65-content-moderation)
   - 6.6 [Consultant Verification](#66-consultant-verification)

---

## 1. Technology Stack Recommendations

### 1.1 Mobile App

| Component                | Choice                          | Rationale                                                                 |
|--------------------------|---------------------------------|---------------------------------------------------------------------------|
| **Framework**            | Flutter 3.x (Dart)              | Already adopted by the team (2 Flutter devs). Single codebase for iOS + Android. Mature widget ecosystem, strong performance, excellent i18n support. |
| **State Management**     | Riverpod 2.x                    | Type-safe, testable, supports async/stream providers natively. Preferred over BLoC for smaller teams due to less boilerplate. Handles dependency injection cleanly. |
| **Local Storage**        | Drift (SQLite wrapper)          | Full SQL support for offline progress logging, cached guides, and assessment data. Supports migrations for schema evolution. |
| **Secure Storage**       | flutter_secure_storage          | Keychain (iOS) / Keystore (Android) for auth tokens, sensitive user preferences. |
| **HTTP Client**          | Dio                             | Interceptors for auth token injection, retry logic, request/response logging. |
| **Navigation**           | go_router                       | Declarative routing with deep link support. Tab-based navigation with nested routes. |
| **Localization**         | flutter_localizations + ARB     | Built-in Flutter i18n with ARB files for 5 languages (nl, en, ar, tr, pl). RTL support for Arabic. |
| **Push Notifications**   | firebase_messaging               | Unified iOS/Android push handling with background message processing. |
| **Charts/Visualization** | fl_chart                        | Lightweight charting for progress dashboards, streak displays, success rates. |
| **Image Handling**       | cached_network_image             | Disk + memory caching for profile photos, guide illustrations, community images. |
| **Testing**              | flutter_test + integration_test  | Widget tests, golden tests for UI regression, integration tests for critical flows. |

**Project structure (feature-first):**
```
lib/
  core/               # Shared utilities, theme, constants, extensions
    network/           # Dio client, interceptors, API error handling
    storage/           # Drift database, secure storage
    auth/              # Auth state, token management
    i18n/              # Localization delegates, language switching
  features/
    onboarding/        # Readiness assessments, method selection
    guide/             # Personalized e-guide viewer
    progress/          # Logging, charts, milestones, streaks
    tips/              # Daily tips, categorized tips, stage-based tips
    reminders/         # Scheduled reminders, notification preferences
    coaching/          # Premium coaching chat, session booking
    community/         # Posts, comments, likes, moderation
    profile/           # User settings, children management, subscription
  shared/
    widgets/           # Reusable UI components (buttons, cards, dialogs)
    models/            # Shared data models
    providers/         # Cross-feature Riverpod providers
```

### 1.2 Backend

| Component            | Choice                          | Rationale                                                                 |
|----------------------|---------------------------------|---------------------------------------------------------------------------|
| **Server Framework** | Node.js + NestJS                | TypeScript end-to-end (shared types with web dashboards). NestJS provides opinionated structure with modules, dependency injection, guards, and pipes -- critical for a growing team. 1 web dev can be productive immediately. |
| **Runtime**          | Node.js 20 LTS                  | Long-term support, native fetch, performance improvements. |
| **Primary Database** | PostgreSQL 16                   | Relational integrity for user/child/progress data. JSONB for flexible content storage (assessment responses, guide content). Row-level security support. Proven at scale. |
| **Vector Database**  | pgvector extension              | Future AI personalization (embedding-based content recommendations, similar user matching). Runs inside PostgreSQL -- no separate service to manage. |
| **ORM**              | Prisma                          | Type-safe database access, auto-generated migrations, excellent DX. Supports PostgreSQL JSON fields and relations. |
| **Cache**            | Redis 7                         | Session storage, rate limiting counters, leaderboard data, real-time coaching presence, frequently accessed tips cache. |
| **Search**           | PostgreSQL full-text search      | Adequate for community post search and tip search at current scale. Upgrade to Elasticsearch/Meilisearch if search volume exceeds 10K queries/day. |
| **Authentication**   | Passport.js (NestJS integration) | OAuth2 social login (Google, Apple, Facebook), email/password with bcrypt, JWT access + refresh tokens. |
| **Push Notifications** | Firebase Admin SDK             | Server-side push to FCM (Android) and APNs (iOS via FCM). Topic-based for broadcast tips, per-device for reminders and coaching messages. |
| **File Storage**     | AWS S3 (or S3-compatible)       | E-guide illustrations, profile photos, community post images, consultant profile photos. Presigned URLs for direct client upload. |
| **Email**            | Postmark                        | Transactional emails (welcome, password reset, coaching confirmations, premium receipt). High deliverability. SendGrid as fallback. |
| **Task Queue**       | BullMQ (Redis-backed)           | Background jobs: guide generation, assessment scoring, notification batching, community moderation queue, analytics aggregation. |
| **WebSocket**        | Socket.IO (NestJS gateway)      | Real-time coaching chat, live progress updates for nursery dashboards. |
| **API Documentation** | Swagger/OpenAPI (NestJS built-in) | Auto-generated from decorators. Essential for B2B partner API integration. |

**Backend project structure (NestJS modules):**
```
src/
  auth/               # Authentication, guards, JWT strategy, social login
  users/              # User CRUD, profile, preferences
  children/           # Child CRUD, parent-child linking
  assessments/        # Assessment logic, scoring engine, result generation
  guides/             # E-guide generation, personalization engine, content
  progress/           # Event logging, statistics, streaks, milestones
  tips/               # Tip delivery, categorization, stage matching
  reminders/          # Reminder scheduling, notification dispatch
  coaching/           # Coaching sessions, messaging, consultant matching
  community/          # Posts, comments, likes, moderation queue
  organizations/      # B2B org management, staff, children linking
  subscriptions/      # Payment processing, plan management, receipts
  admin/              # Admin panel API, content management
  notifications/      # Push notification service, email service
  common/             # Shared decorators, pipes, filters, interceptors
  config/             # Environment config, validation
  database/           # Prisma service, migrations, seeds
```

### 1.3 Third-Party Integrations

| Service                  | Provider                | Purpose                                                       |
|--------------------------|-------------------------|---------------------------------------------------------------|
| **Payments (Mobile)**    | RevenueCat              | In-app purchase management for iOS App Store and Google Play. Handles receipt validation, subscription lifecycle, cross-platform entitlements. Required because Apple/Google mandate using their payment systems for digital content. |
| **Payments (Web/B2B)**   | Stripe                  | B2B invoicing, nursery/municipality subscriptions, web premium purchases. Stripe Billing for recurring B2B plans. Stripe Connect if consultants are paid through the platform. |
| **Analytics**            | Mixpanel                | Event-based analytics: assessment completions, guide engagement, feature adoption, retention cohorts, funnel analysis. Essential for product iteration. |
| **Crash Reporting**      | Sentry                  | Flutter + NestJS error tracking with context, breadcrumbs, release tracking. |
| **Push Notifications**   | Firebase Cloud Messaging | Cross-platform push. Topic subscriptions for broadcast content (daily tips). Scheduled delivery for reminders. |
| **Email (Transactional)**| Postmark                | Welcome emails, password reset, coaching notifications, premium receipts. Templates with i18n. |
| **Email (Marketing)**    | Mailchimp or Brevo      | Drip campaigns for free-to-premium conversion, re-engagement, newsletter. |
| **Localization Platform**| Crowdin                 | Translation management for 5 languages. Connects to Git for automated sync of ARB files (Flutter) and JSON files (web). Professional translator workflow. |
| **Content Moderation**   | Perspective API (Google) | Automated toxicity scoring for community posts/comments. Flag for manual review above threshold. |
| **Image Moderation**     | AWS Rekognition or Google Cloud Vision | Automated screening of community-uploaded images for inappropriate content. |
| **CDN**                  | CloudFront (AWS)        | Static asset delivery for e-guide illustrations, app assets, web dashboard. |
| **Feature Flags**        | LaunchDarkly or Unleash (self-hosted) | Gradual rollout of features, A/B testing premium pricing, per-language feature gating. |
| **Monitoring**           | Datadog or Grafana Cloud | APM, infrastructure monitoring, custom dashboards for business metrics. |

### 1.4 Hosting & DevOps

**Cloud Provider: AWS (eu-west-1, Ireland)**

Chosen for: EU data residency (GDPR), mature service catalog, cost-effective at current scale, strong Flutter/mobile CI tooling ecosystem.

| Component              | AWS Service / Tool       | Details                                                      |
|------------------------|--------------------------|--------------------------------------------------------------|
| **Compute (API)**      | AWS ECS Fargate          | Containerized NestJS. Auto-scales based on request volume. No server management. Start with 2 tasks, scale to 10. |
| **Database**           | AWS RDS PostgreSQL 16    | Multi-AZ for production. db.t4g.medium to start. Automated backups, point-in-time recovery. pgvector extension enabled. |
| **Cache**              | AWS ElastiCache (Redis)  | Single-node cache.t4g.micro to start. Upgrade to cluster mode for coaching real-time features. |
| **File Storage**       | AWS S3                   | Versioned bucket for guide assets. Lifecycle policies to archive old versions after 90 days. |
| **CDN**                | AWS CloudFront           | Edge caching for static assets, e-guide images, web dashboard. |
| **DNS**                | AWS Route 53             | Domain management, health checks, latency-based routing for future multi-region. |
| **Secrets**            | AWS Secrets Manager      | API keys, database credentials, third-party service tokens. Rotated automatically. |
| **Logging**            | AWS CloudWatch Logs      | Centralized logging from ECS tasks. Structured JSON logs. Metric filters for error rate alerting. |
| **Container Registry** | AWS ECR                  | Private Docker image registry for NestJS API images. |
| **Load Balancer**      | AWS ALB                  | HTTPS termination, path-based routing, WebSocket support for coaching chat. |
| **VPC**                | Private subnets          | Database and cache in private subnets. API in public subnets behind ALB. NAT gateway for outbound. |

**CI/CD Pipeline:**

```
GitHub Actions workflow:

Push to feature branch:
  1. Lint (ESLint + Dart analyzer)
  2. Unit tests (Jest for NestJS, flutter_test for mobile)
  3. Build check (TypeScript compile, Flutter build)
  4. Security scan (Snyk or Trivy for dependencies)

Pull request to main:
  5. Integration tests (API tests against test database)
  6. Flutter integration tests (on Firebase Test Lab)
  7. Preview deployment (staging environment)

Merge to main:
  8. Build Docker image (NestJS API)
  9. Push to ECR
  10. Deploy to ECS (rolling update, zero downtime)
  11. Run database migrations (Prisma migrate deploy)
  12. Smoke tests against production

Release tag (mobile):
  13. Flutter build (iOS .ipa, Android .aab)
  14. Upload to App Store Connect / Google Play Console
  15. Staged rollout (10% -> 50% -> 100%)
```

**Environment Strategy:**

| Environment  | Purpose                        | Database                  | Scale        |
|--------------|--------------------------------|---------------------------|--------------|
| `local`      | Developer workstation          | Docker Compose PostgreSQL | Single       |
| `staging`    | QA, demo, B2B partner preview  | RDS (single-AZ, small)   | 1 ECS task   |
| `production` | Live users                     | RDS (multi-AZ)           | 2+ ECS tasks |

### 1.5 Security Infrastructure

| Layer                | Mechanism                                                           |
|----------------------|---------------------------------------------------------------------|
| **Transport**        | TLS 1.3 everywhere. HSTS headers. Certificate via ACM (auto-renew). |
| **Encryption at rest** | RDS encryption (AES-256). S3 server-side encryption (SSE-S3). ElastiCache encryption. |
| **Authentication**   | JWT (RS256) access tokens (15 min TTL) + refresh tokens (30 day, rotated on use, stored in DB). Social login via OAuth2 (Google, Apple, Facebook). |
| **Authorization**    | Role-based access control (RBAC): parent, nursery_staff, nursery_admin, municipal_admin, consultant, system_admin. NestJS guards enforce per-endpoint. |
| **API Security**     | Rate limiting (express-rate-limit + Redis). Input validation (class-validator + class-transformer). Helmet.js for HTTP headers. CORS whitelist. |
| **GDPR**             | Data encryption, right to erasure (cascade delete user + children + all related data), data export (JSON), consent tracking, DPO contact endpoint. |
| **COPPA/Children**   | Minimal data collection for children (name and DOB only, no direct identifiers beyond what parent provides). No direct contact with children. Parental consent gate. |
| **PCI-DSS**          | No card data touches our servers. Stripe/RevenueCat handle all payment processing. PCI SAQ-A compliance. |
| **Secrets**          | AWS Secrets Manager. No secrets in code or environment variables at build time. Runtime injection only. |
| **Audit Logging**    | All data access/modification logged with user ID, timestamp, IP, action. Retained 12 months minimum. |
| **Vulnerability Management** | Automated dependency scanning (Snyk/Dependabot). Container image scanning (Trivy). Penetration testing annually. |

---

## 2. Database Schema

### 2.1 Entity-Relationship Overview

```
Users ──────────┬── Children ──────────┬── Assessments
  |             |                      ├── EGuides
  |             |                      ├── ProgressLogs
  |             |                      ├── Milestones
  |             |                      └── Reminders
  |             |
  ├── Subscriptions                    Tips (reference table)
  ├── CoachingSessions ── Consultants
  |             |
  ├── CommunityPosts ── CommunityComments ── CommunityLikes
  |                                         CommunityReports
  |
  └── OrgMembers ── Organizations ── OrgChildren
```

**Key relationships:**
- A **User** has many **Children** (parent) or belongs to an **Organization** (staff/admin).
- A **Child** has many **Assessments**, one **EGuide** (latest active), many **ProgressLogs**, many **Milestones**, and many **Reminders**.
- **Organizations** have many **OrgMembers** (staff) and many **OrgChildren** (enrolled children).
- **CoachingSessions** link a parent **User** to a **Consultant**.
- **CommunityPosts** belong to a **User** and have many **CommunityComments**, **CommunityLikes**, and **CommunityReports**.

### 2.2 Table Definitions

All tables include standard audit columns unless noted: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()` (trigger-maintained).

#### users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),                          -- NULL for social-only auth
    name            VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    auth_provider   VARCHAR(50) NOT NULL DEFAULT 'email',  -- email, google, apple, facebook
    auth_provider_id VARCHAR(255),                         -- External provider user ID
    language        VARCHAR(5) NOT NULL DEFAULT 'en',      -- nl, en, ar, tr, pl
    role            VARCHAR(30) NOT NULL DEFAULT 'parent', -- parent, nursery_staff, nursery_admin, municipal_admin, system_admin
    premium_status  VARCHAR(20) NOT NULL DEFAULT 'free',   -- free, active, expired, cancelled
    premium_expires_at TIMESTAMPTZ,
    notification_preferences JSONB DEFAULT '{"push": true, "email": true, "tips": true, "reminders": true}'::jsonb,
    consent_given_at TIMESTAMPTZ,                          -- GDPR consent timestamp
    terms_accepted_at TIMESTAMPTZ,
    last_login_at   TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_provider ON users(auth_provider, auth_provider_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_premium_status ON users(premium_status);
```

#### children

```sql
CREATE TABLE children (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    date_of_birth       DATE NOT NULL,
    gender              VARCHAR(20),                       -- Optional, used for pronoun personalization
    personality_type    VARCHAR(50),                       -- Determined by assessment: cautious, strong-willed, eager, anxious, etc.
    special_needs       JSONB,                             -- {"types": ["autism", "sensory"], "notes": "..."}
    readiness_status    VARCHAR(30) DEFAULT 'not_assessed', -- not_assessed, not_ready, almost_ready, ready
    readiness_score     INTEGER,                           -- 0-100, from most recent assessment
    method_chosen       VARCHAR(50),                       -- child_led, structured, intensive, gentle, etc.
    training_start_date DATE,
    training_status     VARCHAR(30) DEFAULT 'not_started', -- not_started, in_progress, paused, completed
    avatar_url          TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_children_parent ON children(parent_id);
CREATE INDEX idx_children_training_status ON children(training_status);
```

#### assessments

```sql
CREATE TABLE assessments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,   -- child_readiness, parent_readiness, method_preference, personality
    responses   JSONB NOT NULL,         -- Array of {question_id, answer_value, answer_text}
    score       INTEGER,                -- Computed score (0-100)
    result      JSONB,                  -- {readiness: "ready", personality: "cautious", recommended_method: "child_led", details: {...}}
    version     INTEGER NOT NULL DEFAULT 1, -- Assessment version (questions may evolve)
    completed   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_child ON assessments(child_id);
CREATE INDEX idx_assessments_type ON assessments(child_id, type);
```

#### eguides

```sql
CREATE TABLE eguides (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id                UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    method                  VARCHAR(50) NOT NULL,        -- Matches child.method_chosen
    content                 JSONB NOT NULL,              -- Structured guide: {sections: [{title, body, tips, illustrations}]}
    version                 INTEGER NOT NULL DEFAULT 1,
    personalization_params  JSONB,                       -- {personality: "cautious", age_months: 28, special_needs: [...]}
    is_active               BOOLEAN NOT NULL DEFAULT true,
    generated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eguides_child ON eguides(child_id);
CREATE INDEX idx_eguides_active ON eguides(child_id, is_active);
```

#### progress_logs

```sql
CREATE TABLE progress_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    logged_by   UUID NOT NULL REFERENCES users(id),      -- Parent or nursery staff
    date        DATE NOT NULL,
    type        VARCHAR(30) NOT NULL,   -- success_wee, success_poo, accident_wee, accident_poo, dry_day, dry_night, initiated_by_child, refused
    time_of_day VARCHAR(20),            -- morning, midday, afternoon, evening, night
    location    VARCHAR(50),            -- home, nursery, out_and_about, grandparents
    notes       TEXT,
    mood        VARCHAR(20),            -- happy, neutral, upset, resistant
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_progress_child_date ON progress_logs(child_id, date DESC);
CREATE INDEX idx_progress_type ON progress_logs(child_id, type);
CREATE INDEX idx_progress_logged_by ON progress_logs(logged_by);
```

#### milestones

```sql
CREATE TABLE milestones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,   -- first_wee_on_potty, first_poo_on_potty, dry_day_streak_3, dry_day_streak_7, dry_night_streak_3, nappy_free_daytime, nappy_free_nighttime, fully_trained
    achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata    JSONB,                  -- {streak_count: 7, celebration_shown: true}
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_milestones_unique ON milestones(child_id, type);
CREATE INDEX idx_milestones_child ON milestones(child_id);
```

#### tips

```sql
CREATE TABLE tips (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category          VARCHAR(50) NOT NULL,    -- general, regression, refusal, nighttime, out_and_about, nursery, special_needs
    stage             VARCHAR(50),             -- preparation, early_days, building_confidence, nappy_free, nighttime
    personality_match VARCHAR(50),             -- cautious, strong_willed, eager, anxious, NULL for universal tips
    challenge_type    VARCHAR(50),             -- withholding, fear_of_potty, regression, constipation, refusal, NULL for general
    language          VARCHAR(5) NOT NULL,     -- nl, en, ar, tr, pl
    title             VARCHAR(255) NOT NULL,
    content           TEXT NOT NULL,
    illustration_url  TEXT,
    priority          INTEGER NOT NULL DEFAULT 50,  -- 1-100, higher = more relevant
    is_premium        BOOLEAN NOT NULL DEFAULT false,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tips_category ON tips(category, language);
CREATE INDEX idx_tips_stage ON tips(stage, language);
CREATE INDEX idx_tips_personality ON tips(personality_match, language);
CREATE INDEX idx_tips_challenge ON tips(challenge_type, language);
```

#### tip_reads

```sql
CREATE TABLE tip_reads (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tip_id  UUID NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_tip_reads_unique ON tip_reads(user_id, tip_id);
```

#### reminders

```sql
CREATE TABLE reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    created_by      UUID NOT NULL REFERENCES users(id),
    type            VARCHAR(50) NOT NULL,    -- potty_break, drink_water, check_nappy, encourage, custom
    title           VARCHAR(255),
    message         TEXT,
    scheduled_time  TIME NOT NULL,           -- Time of day (combined with recurring pattern)
    recurring       VARCHAR(30) NOT NULL DEFAULT 'daily', -- daily, weekdays, weekends, once, custom
    recurring_days  INTEGER[],               -- [1,2,3,4,5] for weekdays (ISO day numbers)
    is_active       BOOLEAN NOT NULL DEFAULT true,
    snoozed_until   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_child ON reminders(child_id, is_active);
CREATE INDEX idx_reminders_scheduled ON reminders(scheduled_time, is_active);
```

#### consultants

```sql
CREATE TABLE consultants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID UNIQUE NOT NULL REFERENCES users(id),
    display_name    VARCHAR(255) NOT NULL,
    bio             TEXT,
    avatar_url      TEXT,
    qualifications  JSONB,           -- [{title, institution, year}]
    specialties     VARCHAR(50)[],   -- ["special_needs", "refusal", "nighttime", "regression"]
    languages       VARCHAR(5)[],    -- ["en", "nl"]
    availability    JSONB,           -- {monday: [{start: "09:00", end: "17:00"}], ...}
    is_verified     BOOLEAN NOT NULL DEFAULT false,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    rating_avg      DECIMAL(3,2) DEFAULT 0,
    rating_count    INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consultants_active ON consultants(is_active, is_verified);
CREATE INDEX idx_consultants_specialties ON consultants USING GIN(specialties);
CREATE INDEX idx_consultants_languages ON consultants USING GIN(languages);
```

#### coaching_sessions

```sql
CREATE TABLE coaching_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id       UUID NOT NULL REFERENCES users(id),
    consultant_id   UUID NOT NULL REFERENCES consultants(id),
    child_id        UUID REFERENCES children(id),      -- Optional: may discuss multiple children
    status          VARCHAR(30) NOT NULL DEFAULT 'requested', -- requested, accepted, active, completed, cancelled
    rating          INTEGER,                            -- 1-5 post-session rating
    rating_comment  TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coaching_parent ON coaching_sessions(parent_id);
CREATE INDEX idx_coaching_consultant ON coaching_sessions(consultant_id);
CREATE INDEX idx_coaching_status ON coaching_sessions(status);
```

#### coaching_messages

```sql
CREATE TABLE coaching_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES users(id),
    content     TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL DEFAULT 'text',  -- text, image, system
    attachment_url TEXT,
    is_read     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coaching_messages_session ON coaching_messages(session_id, created_at);
CREATE INDEX idx_coaching_messages_unread ON coaching_messages(session_id, is_read) WHERE is_read = false;
```

#### community_posts

```sql
CREATE TABLE community_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   UUID NOT NULL REFERENCES users(id),
    title       VARCHAR(500),
    content     TEXT NOT NULL,
    category    VARCHAR(50),            -- general, question, success_story, tip, struggle
    image_url   TEXT,
    language    VARCHAR(5) NOT NULL DEFAULT 'en',
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    is_pinned   BOOLEAN NOT NULL DEFAULT false,
    is_hidden   BOOLEAN NOT NULL DEFAULT false,  -- Hidden by moderation
    like_count  INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_community_posts_author ON community_posts(author_id);
CREATE INDEX idx_community_posts_category ON community_posts(category, language, created_at DESC);
CREATE INDEX idx_community_posts_recent ON community_posts(created_at DESC) WHERE is_hidden = false;
```

#### community_comments

```sql
CREATE TABLE community_comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id     UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id   UUID NOT NULL REFERENCES users(id),
    parent_id   UUID REFERENCES community_comments(id) ON DELETE CASCADE, -- Threaded replies
    content     TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    is_hidden   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON community_comments(post_id, created_at);
```

#### community_likes

```sql
CREATE TABLE community_likes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    comment_id  UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT likes_target CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

CREATE UNIQUE INDEX idx_likes_post ON community_likes(user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX idx_likes_comment ON community_likes(user_id, comment_id) WHERE comment_id IS NOT NULL;
```

#### community_reports

```sql
CREATE TABLE community_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    post_id     UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    comment_id  UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    reason      VARCHAR(50) NOT NULL,   -- spam, offensive, harassment, misinformation, other
    details     TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON community_reports(status);
```

#### organizations

```sql
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(30) NOT NULL,         -- nursery, municipality, daycare_chain
    contact_email   VARCHAR(255) NOT NULL,
    contact_phone   VARCHAR(50),
    address         JSONB,                        -- {street, city, postal_code, country}
    logo_url        TEXT,
    plan            VARCHAR(30) NOT NULL DEFAULT 'basic', -- basic, professional, enterprise
    plan_max_children INTEGER,                    -- Plan limit on number of tracked children
    settings        JSONB DEFAULT '{}'::jsonb,    -- Org-specific configuration
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orgs_type ON organizations(type);
```

#### org_members

```sql
CREATE TABLE org_members (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role    VARCHAR(30) NOT NULL DEFAULT 'staff', -- staff, admin, manager
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_org_members_unique ON org_members(org_id, user_id);
CREATE INDEX idx_org_members_user ON org_members(user_id);
```

#### org_children

```sql
CREATE TABLE org_children (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unenrolled_at TIMESTAMPTZ,
    notes       TEXT
);

CREATE UNIQUE INDEX idx_org_children_unique ON org_children(org_id, child_id);
CREATE INDEX idx_org_children_org ON org_children(org_id) WHERE unenrolled_at IS NULL;
```

#### subscriptions

```sql
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    org_id              UUID REFERENCES organizations(id) ON DELETE SET NULL,
    plan                VARCHAR(50) NOT NULL,       -- premium_6month, b2b_basic, b2b_professional, b2b_enterprise
    amount              DECIMAL(10,2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'GBP',
    payment_provider    VARCHAR(30) NOT NULL,       -- stripe, revenuecat, apple, google
    payment_provider_id VARCHAR(255),               -- External subscription/transaction ID
    status              VARCHAR(30) NOT NULL DEFAULT 'active', -- active, expired, cancelled, refunded
    started_at          TIMESTAMPTZ NOT NULL,
    expires_at          TIMESTAMPTZ NOT NULL,
    cancelled_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT sub_owner CHECK (
        (user_id IS NOT NULL AND org_id IS NULL) OR
        (user_id IS NULL AND org_id IS NOT NULL)
    )
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_org ON subscriptions(org_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expiry ON subscriptions(expires_at) WHERE status = 'active';
```

### 2.3 Indexes & Performance

**General indexing strategy:**
- Primary keys use UUID v7 (time-ordered) for better index locality than UUID v4.
- Composite indexes follow query patterns: `(child_id, date DESC)` for progress queries, `(category, language, created_at DESC)` for tip feeds.
- Partial indexes (WHERE clauses) used for common filtered queries: active reminders, unread messages, visible posts.
- GIN indexes on array columns (`specialties`, `languages`) for consultant search.
- JSONB indexes added as needed for frequently queried JSON paths.

**Query performance targets:**

| Query                                    | Target    | Strategy                              |
|------------------------------------------|-----------|---------------------------------------|
| Get child's progress (last 30 days)      | < 10ms    | Composite index on (child_id, date)   |
| Get tips for stage + personality         | < 15ms    | Multi-column index + cache            |
| Community feed (recent posts by lang)    | < 20ms    | Partial index + cursor pagination     |
| Nursery dashboard (all children summary) | < 50ms    | Materialized view, refreshed hourly   |
| Vector search (future AI features)       | < 100ms   | pgvector HNSW index                   |

**Materialized views (B2B dashboards):**

```sql
-- Refreshed every hour via cron job
CREATE MATERIALIZED VIEW org_progress_summary AS
SELECT
    oc.org_id,
    c.id AS child_id,
    c.name,
    c.training_status,
    c.readiness_status,
    COUNT(pl.id) FILTER (WHERE pl.type LIKE 'success_%' AND pl.date >= CURRENT_DATE - 30) AS successes_30d,
    COUNT(pl.id) FILTER (WHERE pl.type LIKE 'accident_%' AND pl.date >= CURRENT_DATE - 30) AS accidents_30d,
    MAX(pl.date) AS last_logged
FROM org_children oc
JOIN children c ON c.id = oc.child_id
LEFT JOIN progress_logs pl ON pl.child_id = c.id
WHERE oc.unenrolled_at IS NULL
GROUP BY oc.org_id, c.id, c.name, c.training_status, c.readiness_status;
```

---

## 3. API Design

### 3.1 API Conventions

| Convention          | Detail                                                              |
|---------------------|---------------------------------------------------------------------|
| **Base URL**        | `https://api.goingpotty.com/v1`                                     |
| **Versioning**      | URL path prefix (`/v1/`, `/v2/`). Major versions only.              |
| **Format**          | JSON request/response. `Content-Type: application/json`.            |
| **Authentication**  | `Authorization: Bearer <access_token>` on all protected endpoints.  |
| **Pagination**      | Cursor-based: `?cursor=<id>&limit=20`. Response includes `next_cursor`. |
| **Filtering**       | Query params: `?status=active&type=success_wee&from=2026-01-01`.    |
| **Sorting**         | `?sort=created_at&order=desc`. Defaults per endpoint.               |
| **Localization**    | `Accept-Language: nl` header. Falls back to user's saved language.   |
| **Idempotency**     | `Idempotency-Key` header for POST mutations (payments, logging).    |

### 3.2 Endpoint Groups

#### Auth

```
POST   /v1/auth/register           # Email/password registration
POST   /v1/auth/login              # Email/password login
POST   /v1/auth/login/social       # Social login (Google, Apple, Facebook)
POST   /v1/auth/refresh            # Refresh access token
POST   /v1/auth/logout             # Invalidate refresh token
POST   /v1/auth/forgot-password    # Send password reset email
POST   /v1/auth/reset-password     # Reset password with token
POST   /v1/auth/verify-email       # Verify email address
```

#### Users

```
GET    /v1/users/me                # Get current user profile
PATCH  /v1/users/me                # Update profile (name, avatar, language)
PUT    /v1/users/me/notifications  # Update notification preferences
DELETE /v1/users/me                # Delete account (GDPR right to erasure)
GET    /v1/users/me/export         # Export all user data (GDPR data portability)
```

#### Children

```
GET    /v1/children                # List user's children
POST   /v1/children                # Add a child
GET    /v1/children/:id            # Get child details
PATCH  /v1/children/:id            # Update child info
DELETE /v1/children/:id            # Remove child
GET    /v1/children/:id/summary    # Dashboard summary (stats, milestones, current stage)
```

#### Assessments

```
GET    /v1/children/:id/assessments                 # List assessments for child
POST   /v1/children/:id/assessments                 # Start new assessment
PATCH  /v1/children/:id/assessments/:aid            # Submit answers (partial save)
POST   /v1/children/:id/assessments/:aid/complete   # Complete and score assessment
GET    /v1/children/:id/assessments/:aid/result     # Get assessment result
GET    /v1/assessments/questions?type=child_readiness&lang=en  # Get assessment questions
```

#### E-Guides

```
GET    /v1/children/:id/guide              # Get active guide for child
POST   /v1/children/:id/guide/generate     # Generate personalized guide
PATCH  /v1/children/:id/guide              # Regenerate/update based on progress
GET    /v1/children/:id/guide/sections     # Get guide table of contents
GET    /v1/children/:id/guide/sections/:sid # Get specific section content
```

#### Progress

```
POST   /v1/children/:id/progress           # Log a progress event
GET    /v1/children/:id/progress            # Get progress history (paginated, filterable)
DELETE /v1/children/:id/progress/:pid       # Delete a progress entry
GET    /v1/children/:id/progress/stats      # Get statistics (success rate, daily average, trends)
GET    /v1/children/:id/progress/streaks    # Get current and best streaks
GET    /v1/children/:id/milestones          # Get achieved milestones
```

#### Tips

```
GET    /v1/tips                    # Get tips for user's context (child stage, personality, challenges)
GET    /v1/tips/:id                # Get specific tip
POST   /v1/tips/:id/read          # Mark tip as read
GET    /v1/tips/categories         # List tip categories
GET    /v1/tips/daily              # Get daily tip (personalized)
```

#### Reminders

```
GET    /v1/children/:id/reminders          # List reminders for child
POST   /v1/children/:id/reminders          # Create reminder
PATCH  /v1/children/:id/reminders/:rid     # Update reminder
DELETE /v1/children/:id/reminders/:rid     # Delete reminder
POST   /v1/children/:id/reminders/:rid/snooze   # Snooze reminder (15/30/60 min)
POST   /v1/children/:id/reminders/:rid/complete  # Mark as done
```

#### Coaching (Premium)

```
GET    /v1/consultants                     # List available consultants
GET    /v1/consultants/:id                 # Get consultant profile
POST   /v1/coaching/sessions               # Request a coaching session
GET    /v1/coaching/sessions               # List user's sessions
GET    /v1/coaching/sessions/:id           # Get session details
PATCH  /v1/coaching/sessions/:id           # Update session (cancel, rate)
GET    /v1/coaching/sessions/:id/messages  # Get messages (paginated)
POST   /v1/coaching/sessions/:id/messages  # Send message
```

#### Community

```
GET    /v1/community/posts                 # Get posts feed (paginated, filterable by category/language)
POST   /v1/community/posts                 # Create post
GET    /v1/community/posts/:id             # Get post with comments
PATCH  /v1/community/posts/:id             # Edit post (author only)
DELETE /v1/community/posts/:id             # Delete post (author or admin)
POST   /v1/community/posts/:id/like       # Like/unlike toggle
POST   /v1/community/posts/:id/report     # Report post
GET    /v1/community/posts/:id/comments   # Get comments (paginated)
POST   /v1/community/posts/:id/comments   # Add comment
DELETE /v1/community/comments/:id          # Delete comment
POST   /v1/community/comments/:id/like    # Like/unlike comment
POST   /v1/community/comments/:id/report  # Report comment
```

#### B2B - Organization Management

```
GET    /v1/orgs/:id                        # Get organization details
PATCH  /v1/orgs/:id                        # Update organization (admin only)
GET    /v1/orgs/:id/members                # List staff members
POST   /v1/orgs/:id/members               # Invite staff member
DELETE /v1/orgs/:id/members/:mid           # Remove staff member
PATCH  /v1/orgs/:id/members/:mid          # Update member role
```

#### B2B - Nursery Dashboard

```
GET    /v1/orgs/:id/children               # List enrolled children
POST   /v1/orgs/:id/children               # Enroll a child
DELETE /v1/orgs/:id/children/:cid          # Unenroll a child
GET    /v1/orgs/:id/dashboard              # Aggregate dashboard data
GET    /v1/orgs/:id/dashboard/progress     # Children progress overview
GET    /v1/orgs/:id/dashboard/stats        # Success rates, training duration averages
GET    /v1/orgs/:id/dashboard/savings      # Cost savings calculator data
GET    /v1/orgs/:id/export                 # Export data (CSV/PDF)
```

#### B2B - Municipality Dashboard

```
GET    /v1/municipality/:id/nurseries      # List nurseries under municipality
GET    /v1/municipality/:id/dashboard      # Aggregate stats across nurseries
GET    /v1/municipality/:id/impact         # Impact report data (nappy waste reduction, cost savings)
GET    /v1/municipality/:id/export         # Export aggregated data
```

#### Admin (System)

```
GET    /v1/admin/users                     # List/search users
PATCH  /v1/admin/users/:id                 # Update user (role, status)
GET    /v1/admin/content/tips              # Manage tips content
POST   /v1/admin/content/tips              # Create tip
PATCH  /v1/admin/content/tips/:id          # Update tip
GET    /v1/admin/content/assessments       # Manage assessment questions
GET    /v1/admin/consultants               # Manage consultants
PATCH  /v1/admin/consultants/:id/verify    # Verify consultant
GET    /v1/admin/moderation/queue          # Get moderation queue
PATCH  /v1/admin/moderation/:id            # Resolve moderation report
GET    /v1/admin/orgs                      # List organizations
POST   /v1/admin/orgs                      # Create organization
GET    /v1/admin/analytics                 # Platform analytics
```

#### Subscriptions

```
GET    /v1/subscriptions                   # Get user's subscriptions
POST   /v1/subscriptions/purchase          # Initiate purchase (returns client secret / purchase URL)
POST   /v1/subscriptions/restore           # Restore purchases (mobile)
POST   /v1/webhooks/stripe                 # Stripe webhook handler
POST   /v1/webhooks/revenuecat            # RevenueCat webhook handler
GET    /v1/subscriptions/status            # Check entitlement status
```

### 3.3 Error Handling

All errors follow a consistent format:

```json
{
    "error": {
        "code": "CHILD_NOT_FOUND",
        "message": "The requested child profile was not found.",
        "status": 404,
        "details": {}
    }
}
```

**Standard error codes:**

| HTTP Status | Code                      | Description                          |
|-------------|---------------------------|--------------------------------------|
| 400         | `VALIDATION_ERROR`        | Invalid request body/params          |
| 401         | `UNAUTHORIZED`            | Missing or invalid auth token        |
| 403         | `FORBIDDEN`               | Insufficient permissions             |
| 403         | `PREMIUM_REQUIRED`        | Feature requires premium subscription|
| 404         | `NOT_FOUND`               | Resource not found                   |
| 409         | `CONFLICT`                | Duplicate resource / state conflict  |
| 422         | `UNPROCESSABLE`           | Valid syntax but semantic error      |
| 429         | `RATE_LIMITED`             | Too many requests                    |
| 500         | `INTERNAL_ERROR`          | Server error                         |

### 3.4 Rate Limiting

| Endpoint Group     | Limit (authenticated)  | Limit (unauthenticated) |
|--------------------|------------------------|--------------------------|
| Auth               | 10 req/min             | 5 req/min                |
| Read endpoints     | 120 req/min            | 30 req/min               |
| Write endpoints    | 60 req/min             | N/A                      |
| File uploads       | 10 req/min             | N/A                      |
| Community posts    | 5 req/min              | N/A                      |
| Coaching messages  | 30 req/min             | N/A                      |
| B2B dashboard      | 60 req/min             | N/A                      |
| Webhooks           | No limit               | N/A                      |

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1706745600
```

---

## 4. Mobile App Architecture

### 4.1 Navigation & Structure

**Tab-based navigation (5 tabs):**

```
Tab Bar
  |
  |-- Home (default)
  |     |-- Child selector (top, if multiple children)
  |     |-- Daily summary card (successes, accidents, streak)
  |     |-- Quick log buttons (Success wee, Success poo, Accident, Dry check)
  |     |-- Today's tip card
  |     |-- Active reminders
  |     |-- Guide progress (% complete)
  |
  |-- Progress
  |     |-- Calendar view (day dots: green=good, yellow=mixed, grey=no data)
  |     |-- Weekly chart (bar chart: successes vs accidents)
  |     |-- Monthly stats
  |     |-- Milestones achieved (with celebrations)
  |     |-- Streak tracker
  |     |-- History list (filterable by type)
  |
  |-- Guide
  |     |-- E-guide reader (sectioned content)
  |     |-- Method overview
  |     |-- Stage indicators (current progress through guide)
  |     |-- Illustrations and checklists
  |     |-- [Premium] Extended content
  |
  |-- Community
  |     |-- Feed (recent posts, filterable by category)
  |     |-- Create post
  |     |-- My posts
  |     |-- Search
  |     |-- [Premium] Expert Q&A
  |
  |-- Profile
        |-- User settings
        |-- Children management (add/edit/remove)
        |-- Notification preferences
        |-- Language selector
        |-- Subscription status / upgrade CTA
        |-- [Premium] Coaching sessions
        |-- Data export / Delete account
        |-- About / Help / FAQ
```

**Navigation patterns:**
- Deep linking: `goingpotty://child/:id/progress`, `goingpotty://guide/:section`
- Push notification tap navigates to relevant screen (tip -> Tips, reminder -> Home, coaching message -> Coaching chat)
- Onboarding flow (first launch): Welcome -> Add child -> Readiness assessment -> Method selection -> Guide generation -> Home

### 4.2 Offline Capabilities

The app must remain functional for core features even without internet connectivity, since parents often log events immediately and cannot wait for connectivity.

**Offline-first features:**

| Feature                  | Offline Behavior                                           |
|--------------------------|------------------------------------------------------------|
| Progress logging         | Stored in local Drift DB. Queued for sync. Green check shown. |
| View guide               | Fully cached after first load. All text + images stored locally. |
| View tips (cached)       | Last 50 tips cached. "Daily tip" cached for current day.    |
| View progress history    | Local DB is source of truth. Synced data merged on reconnect. |
| View milestones          | Cached locally. New milestones computed locally + confirmed on sync. |
| Reminders                | Fire from local scheduled notifications. No server needed. |
| Community                | Read-only cache of last viewed feed. Posting queued.        |
| Coaching chat            | Message queue. Sent on reconnect. Read receipts deferred.   |
| Assessments              | Cannot start offline (requires latest question set).        |
| Guide generation         | Cannot generate offline (server-side personalization).      |

**Local database (Drift/SQLite):**

```dart
// Simplified Drift schema for offline storage
class ProgressQueue extends Table {
  TextColumn get id => text()();               // Client-generated UUID
  TextColumn get childId => text()();
  TextColumn get type => text()();
  DateTimeColumn get date => dateTime()();
  TextColumn get timeOfDay => text().nullable()();
  TextColumn get notes => text().nullable()();
  TextColumn get mood => text().nullable()();
  TextColumn get location => text().nullable()();
  BoolColumn get synced => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
}

class CachedGuide extends Table {
  TextColumn get childId => text()();
  TextColumn get contentJson => text()();      // Full guide JSON
  DateTimeColumn get cachedAt => dateTime()();
  IntColumn get version => integer()();
}

class CachedTips extends Table {
  TextColumn get id => text()();
  TextColumn get contentJson => text()();
  DateTimeColumn get cachedAt => dateTime()();
}
```

### 4.3 Sync Strategy

**Optimistic updates with server reconciliation:**

```
                  USER ACTION
                      |
          +-----------+-----------+
          |                       |
    Save to Local DB        Show Success UI
          |                 (immediate feedback)
          |
    Queue for Sync
          |
    [Network available?]
          |
     YES  |  NO
      |       |
  POST to API  Wait for connectivity
      |           (ConnectivityProvider)
  [Success?]      |
      |       Retry on reconnect
   YES | NO
    |     |
  Mark    Retry with
  synced  exponential backoff
    |     (max 3 attempts, then
  Merge   flag for manual review)
  server
  response
```

**Conflict resolution rules:**
- **Last write wins** for progress logs (unlikely conflicts since each log is a distinct event).
- **Server wins** for guide content (server is authoritative for personalization).
- **Merge** for milestones: union of local + server milestones (milestones are append-only, never deleted by users).
- **Client-generated UUIDs** prevent duplicate creation on retry.

**Sync triggers:**
1. App comes to foreground (resume from background)
2. Network connectivity restored (connectivity stream listener)
3. Manual pull-to-refresh
4. Periodic background sync (iOS: BGAppRefreshTask, Android: WorkManager) -- max every 15 minutes

### 4.4 Performance

| Area                     | Strategy                                                      |
|--------------------------|---------------------------------------------------------------|
| **Lazy loading**         | Guide sections loaded on demand (not entire guide at once). Community feed paginated (20 posts per page). Progress history paginated by month. |
| **Image caching**        | `cached_network_image` with 100MB disk cache limit. Guide illustrations pre-fetched in background after guide load. Community images loaded with placeholder shimmer. |
| **List rendering**       | `ListView.builder` with `AutomaticKeepAlive` for scrolled-away items. `SliverList` for mixed content (charts + lists). |
| **State management**     | Riverpod providers dispose when no longer listened to. Family providers for per-child data (prevents memory leaks from stale child data). |
| **Database queries**     | Drift queries with proper indexes. Pagination via `limit/offset` on local DB. Background isolate for heavy queries (monthly stats aggregation). |
| **App size**             | Target under 30MB initial download. Deferred loading for community and coaching modules (on first access). |
| **Startup time**         | Target under 2 seconds to first meaningful paint. Auth check + child data load in parallel. Skeleton screens during data fetch. |
| **Animation**            | 60fps target. Use `AnimatedBuilder` over `setState` for animations. Progress chart animations run on GPU thread via `RepaintBoundary`. |

### 4.5 Battery & Data Considerations

| Concern                   | Mitigation                                                  |
|---------------------------|-------------------------------------------------------------|
| **Push notification batching** | Firebase handles batching. App-side: collapse multiple tip notifications into one if unread. Quiet hours respect device DND. |
| **Background sync**       | iOS: BGAppRefreshTask (system-managed, battery-aware). Android: WorkManager with `NetworkType.CONNECTED` + battery-not-low constraints. Max frequency: every 15 minutes. |
| **Image data usage**      | Community images lazy-loaded. Thumbnails served at 200px width. Full images only on tap. Guide images compressed (WebP, max 500KB each). Low-data mode: disable auto-image-load in community feed. |
| **API calls**             | Batch progress syncs (send all queued events in one request). ETag/If-Modified-Since headers for tips and guide content (304 responses save bandwidth). |
| **Local notifications**   | Reminders scheduled locally via `flutter_local_notifications`. No server round-trip needed for recurring reminders. |
| **Analytics**             | Mixpanel events batched and sent every 30 seconds or on app background (whichever comes first). |

---

## 5. Development Roadmap

### 5.1 Phase 1 - MVP

**Duration:** 10-12 weeks
**Goal:** Core potty training experience for individual parents. English + Dutch only.

| Week  | Deliverables                                                        |
|-------|---------------------------------------------------------------------|
| 1-2   | Project setup: Flutter app scaffold, NestJS API scaffold, PostgreSQL schema (core tables), CI/CD pipeline, auth (email + Google + Apple). |
| 3-4   | Child management (CRUD), readiness assessment (child readiness + parent readiness), assessment scoring engine, results screen. |
| 5-6   | Method selection flow, personalized e-guide generation (basic templated content), guide reader UI with sections. |
| 7-8   | Progress logging (quick log + detailed form), progress calendar view, weekly/monthly stats charts, streak tracking, milestone detection. |
| 9-10  | Tips engine (stage-based + personality-matched delivery), daily tip push notification, reminder scheduling (local notifications), offline support for progress logging. |
| 11-12 | End-to-end testing, bug fixes, App Store / Play Store submission, soft launch to beta users. |

**MVP feature scope (ref: 02_FEATURE_SPECIFICATIONS.md):**
- User registration + login (email, Google, Apple)
- Add child profile with DOB
- Child readiness assessment (10-15 questions)
- Parent readiness assessment (8-10 questions)
- Method preference quiz
- Basic personalized e-guide (3 methods: child-led, structured, gentle)
- Progress event logging (success, accident, dry day/night)
- Daily/weekly/monthly stats
- Streak tracking with visual display
- Milestone detection and celebration
- Stage-matched tips (20-30 tips per stage per language)
- Potty break reminders (customizable schedule)
- Offline progress logging with sync
- English and Dutch localization

### 5.2 Phase 2 - Premium & Community

**Duration:** 8-10 weeks
**Goal:** Monetization via premium coaching and expanded content. Community engagement. Guarantee program.

| Week  | Deliverables                                                        |
|-------|---------------------------------------------------------------------|
| 1-2   | Subscription infrastructure: RevenueCat integration (iOS/Android in-app purchase), Stripe for web. Premium paywall UI. 6-month plan at GBP 37.45. |
| 3-4   | Coaching module: consultant profiles, session request flow, real-time chat (Socket.IO), session rating. Admin panel for consultant management + verification. |
| 5-6   | Community: posts feed, create post, comments, likes, anonymous posting, category filtering. Content moderation (Perspective API + manual queue). |
| 7-8   | Advanced analytics: regression detection (alert if accident rate increases), personalized recommendations ("Your child is ready for nighttime training"), progress comparison (anonymized percentile). Guarantee program logic (refund eligibility tracking). |
| 9-10  | Extended guide content (premium sections), personality-specific deep dives, special challenges content (withholding, regression, fear). Push notification optimization (engagement-based timing). |

**Phase 2 feature scope:**
- Premium subscription (GBP 37.45 / 6 months, one-time, auto-expires)
- 1-on-1 coaching chat with verified consultants
- Community forum (posts, comments, likes, moderation)
- Anonymous posting option
- Regression detection and alerts
- Advanced progress analytics
- Guarantee program (refund if no progress in defined period)
- Extended e-guide content (premium)
- Challenge-specific tip packs
- Consultant admin panel

### 5.3 Phase 3 - B2B Expansion

**Duration:** 10-12 weeks
**Goal:** Nursery and municipality dashboards. Partner onboarding. Staff e-learning.

| Week  | Deliverables                                                        |
|-------|---------------------------------------------------------------------|
| 1-3   | B2B data model: organizations, org_members, org_children tables. Organization CRUD. Staff invitation flow. Role-based access (nursery_staff, nursery_admin). |
| 4-6   | Nursery web dashboard (Next.js or React): children overview, per-child progress, aggregate statistics, success rate charts, training duration averages, parent communication tools. |
| 7-8   | Municipality dashboard: multi-nursery aggregate view, impact reporting (nappy waste reduction, cost savings calculator), data export (CSV, PDF). |
| 9-10  | Staff e-learning module: potty training methodology course, quiz/certification, progress tracking for staff completion. Partner onboarding flow (self-service nursery registration). |
| 11-12 | B2B Stripe Billing integration (monthly/annual plans per nursery size), API documentation for B2B partners, SLA monitoring, load testing for dashboard queries. |

**Phase 3 feature scope:**
- Nursery organization management (staff, children, roles)
- Nursery staff can log progress for enrolled children
- Web dashboard for nursery admins (aggregate statistics)
- Municipality dashboard (multi-nursery oversight)
- Cost savings calculator (nappy waste reduction metrics)
- Data export (CSV, PDF reports)
- Staff e-learning module with certification
- B2B subscription plans (Stripe Billing)
- Partner API documentation (OpenAPI)
- Self-service nursery onboarding

### 5.4 Phase 4 - Scale & AI

**Duration:** 12-16 weeks
**Goal:** Full 5-language support, AI personalization, special needs content, content library expansion.

| Week  | Deliverables                                                        |
|-------|---------------------------------------------------------------------|
| 1-3   | Multi-language rollout: Arabic (RTL support), Turkish, Polish. Crowdin integration for continuous translation. Per-language tip and guide content. Cultural adaptation review. |
| 4-6   | AI personalization engine: pgvector embeddings for tip/content matching, child profile embedding (age, personality, progress history -> vector), similar child recommendations ("children like yours typically..."), adaptive guide content based on progress patterns. |
| 7-9   | Special needs features: autism-specific guides and tips, sensory processing considerations, anxiety/fear-focused content, consultant specialization matching, accessible UI improvements (high contrast, large tap targets, screen reader optimization). |
| 10-12 | Extended content library: 200+ tips per language, video content (short clips demonstrating techniques), printable resources (reward charts, visual schedules), partner content integration (pediatrician-reviewed articles). |
| 13-16 | Performance optimization for scale: database read replicas, Redis cluster, CDN optimization, APM tuning. Advanced analytics: cohort analysis, predictive success modeling, A/B testing framework for guide content. |

**Phase 4 feature scope:**
- 5-language support (Dutch, English, Arabic, Turkish, Polish)
- RTL layout for Arabic
- AI-powered content personalization (pgvector)
- Similar child pattern matching
- Adaptive guide updates based on progress
- Autism and special needs guides
- Sensory processing accommodations
- Video content library
- Printable reward charts and visual schedules
- Database read replicas for B2B dashboard performance
- A/B testing framework
- Predictive modeling for training success

---

## 6. Security & Compliance

### 6.1 GDPR

The company is EU-based (Netherlands) and processes data of EU residents, including children. GDPR compliance is mandatory and must be built into the architecture from day one.

| Requirement                    | Implementation                                                    |
|--------------------------------|-------------------------------------------------------------------|
| **Lawful basis**               | Consent (explicit, granular, withdrawable) for data processing. Legitimate interest for essential service operation. Contract for premium subscriptions. |
| **Consent management**         | Consent recorded with timestamp, version, and scope in `users.consent_given_at`. Separate consent for: account creation, push notifications, analytics, community participation. Consent UI presented during onboarding with clear language. |
| **Privacy by design**          | Data minimization: only collect what is necessary. Children identified by first name only (no surname required). No photo of child required. Default privacy settings are most restrictive. |
| **Right to access (Art. 15)**  | `GET /v1/users/me/export` returns all user data in structured JSON: profile, children, progress, assessments, guides, community posts, coaching messages, subscriptions. Automated, available within 24 hours. |
| **Right to erasure (Art. 17)** | `DELETE /v1/users/me` triggers cascading deletion: user record, all children, all progress logs, assessments, guides, milestones, reminders, community posts (anonymized, not deleted if replies exist), coaching messages, subscriptions. Completed within 30 days. Confirmation email sent. Backup purge within 90 days. |
| **Right to rectification**     | Users can edit all their data via the app (profile, children, progress logs). |
| **Data portability (Art. 20)** | Export in machine-readable JSON format. Includes all user-generated content. |
| **Data retention**             | Active accounts: retained while active. Inactive accounts (no login for 24 months): notification sent, deleted after 30 days if no response. Deleted accounts: purged from backups within 90 days. Analytics data: anonymized and retained indefinitely. |
| **Data Processing Agreement**  | Required with all third-party processors: AWS, Stripe, RevenueCat, Firebase, Mixpanel, Postmark, Perspective API. |
| **DPO**                        | Data Protection Officer contact available in app settings and privacy policy. Email: dpo@goingpotty.com. |
| **Breach notification**        | Automated monitoring for unauthorized access. 72-hour notification process to supervisory authority. User notification if high risk to rights and freedoms. |

### 6.2 Children's Data Protection

Children's data receives **heightened protection** under GDPR Article 8 and national implementations (Dutch UAVG). While COPPA (US) may not directly apply if not targeting the US market, its principles are adopted as best practice.

| Principle                       | Implementation                                                   |
|---------------------------------|------------------------------------------------------------------|
| **Parental consent**            | All children's data is entered by a verified parent/guardian. No child directly uses the app. Consent for child data processing is part of onboarding. |
| **Data minimization**           | Child record contains: first name, date of birth, gender (optional), personality type (derived from assessment). No surname, no photos (optional avatar is parent-uploaded), no location tracking. |
| **No direct contact**           | The app never communicates directly with children. All notifications go to the parent. |
| **No advertising/profiling**    | No third-party advertising. No behavioral profiling of children. Analytics are aggregate only. Personalization is based on parent-provided information (personality, needs), not behavioral tracking. |
| **Access controls**             | Child data only accessible by: the parent who created the record, nursery staff at an enrolled organization, consultants during an active coaching session. System admins can access for support purposes (logged). |
| **B2B data sharing**            | Nurseries see only: first name, training status, progress statistics. No DOB, no assessment details, no notes shared unless parent explicitly opts in. |
| **Anonymized aggregation**      | Municipality dashboards show only aggregate statistics. No individual child data is ever visible to municipal administrators. |
| **Deletion**                    | When a child is removed by a parent, all associated data is permanently deleted (assessments, guide, progress, milestones, reminders). No soft delete for children's data. |

### 6.3 Payment Security

| Aspect                     | Implementation                                                     |
|----------------------------|--------------------------------------------------------------------|
| **PCI-DSS compliance**     | SAQ-A level: no card data touches our servers. All payment processing handled by Stripe (web/B2B) and RevenueCat (mobile in-app purchases). |
| **Stripe integration**     | Stripe Elements (web) for card input -- PCI-compliant iframe. Stripe Billing for B2B recurring subscriptions. Webhook signature verification (`stripe-signature` header). |
| **RevenueCat integration** | Handles Apple/Google receipt validation server-side. Webhook for subscription status changes. Entitlement checks via RevenueCat SDK (cached locally). |
| **Refunds**                | Guarantee program refunds processed via Stripe (web) or platform-specific refund (App Store/Play Store). Refund eligibility logic server-side (progress data verification). |
| **Receipt storage**        | Transaction records stored in `subscriptions` table. No card numbers, CVVs, or bank details ever stored. Payment provider IDs used for reference. |
| **Price consistency**      | GBP 37.45 enforced server-side. Client displays price from server config (supports future A/B testing on pricing). Apple/Google take 15-30% commission on in-app purchases -- pricing adjusted to account for this. |

### 6.4 API Security

| Measure                     | Implementation                                                    |
|-----------------------------|-------------------------------------------------------------------|
| **Authentication**          | JWT (RS256) with 15-minute access token TTL. Refresh tokens: 30-day TTL, single-use (rotated on each refresh), stored hashed in database, revokable. |
| **Authorization**           | RBAC enforced via NestJS guards. Roles: parent, nursery_staff, nursery_admin, municipal_admin, consultant, system_admin. Resource ownership verified (parent can only access own children, staff can only access enrolled children). |
| **Input validation**        | All inputs validated via `class-validator` decorators. Max string lengths enforced. SQL injection prevented by Prisma parameterized queries. XSS prevented by output encoding (React/Flutter handle this natively). |
| **Rate limiting**           | Per-user rate limits (see Section 3.4). Global rate limits for unauthenticated endpoints. Redis-backed sliding window counter. |
| **CORS**                    | Whitelist: production domain, staging domain, localhost (dev only). Credentials mode enabled. |
| **HTTP security headers**   | Helmet.js: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy`. |
| **Request size limits**     | JSON body: 1MB max. File uploads: 10MB max (via presigned S3 URLs, not through API). |
| **Dependency scanning**     | Snyk or Dependabot for automated vulnerability alerts. Critical vulnerabilities patched within 48 hours. |
| **Penetration testing**     | Annual third-party penetration test. OWASP Top 10 coverage. Results reviewed and remediated within 30 days. |
| **Logging & monitoring**    | All auth events logged (login, logout, failed attempts). All data mutations logged with user ID and timestamp. Anomaly detection for: brute force (5 failed logins -> temporary lock), unusual data access patterns, bulk data export. |

### 6.5 Content Moderation

The community feature requires proactive moderation to maintain a safe, supportive environment.

| Layer                      | Implementation                                                    |
|----------------------------|-------------------------------------------------------------------|
| **Automated (pre-publish)**| Perspective API scores each post/comment for toxicity, threat, insult, profanity. Score > 0.8: blocked with user notification. Score 0.5-0.8: queued for manual review (published but flagged). Score < 0.5: published immediately. |
| **Image moderation**       | AWS Rekognition or Google Cloud Vision scans uploaded images. Blocks: explicit content, violence. Flags for review: potentially sensitive content. |
| **User reporting**         | Report button on all posts and comments. Reason categories: spam, offensive, harassment, misinformation, other. Reports enter moderation queue. 3+ reports on same content: auto-hidden pending review. |
| **Manual review**          | Admin moderation dashboard (web). Queue sorted by: report count, automated score, recency. Actions: approve, hide, delete, warn user, ban user. |
| **User sanctions**         | Warning (first offense): notification explaining guidelines. Temporary mute (repeat offense): 24-hour posting ban. Permanent ban (severe/repeated): account flagged, community access revoked. |
| **Community guidelines**   | Displayed during onboarding community tab first access. Cover: respectful communication, no medical advice, no shaming, no commercial promotion, privacy (no sharing other people's children's information). |

### 6.6 Consultant Verification

Coaching consultants provide paid advice to parents, requiring a verification process.

| Step                        | Detail                                                           |
|-----------------------------|------------------------------------------------------------------|
| **Application**             | Consultant submits: qualifications (certifications, degrees), professional experience, specialties, government-issued ID, professional registration number (where applicable). |
| **Verification**            | Admin team verifies: qualification documents (manual review), professional registration (cross-reference with registry where available), identity verification (ID match). |
| **Approval**                | `consultants.is_verified = true` set by admin. Only verified consultants appear in listings and can accept sessions. |
| **Ongoing monitoring**      | Session ratings reviewed (< 3.0 average triggers review). Parent complaints escalated to admin. Quarterly audit of active consultants. |
| **Liability**               | Terms of service clarify: consultants provide guidance, not medical advice. App provides platform, not employment. Parents retain responsibility for their child's care. Professional liability insurance encouraged for consultants. |

---

## Cross-References

- **01_PRD.md**: Product requirements that drive the technical decisions in this document. Feature priorities inform the development roadmap (Section 5).
- **02_FEATURE_SPECIFICATIONS.md**: Detailed feature specifications referenced in the API design (Section 3) and database schema (Section 2). The 150+ features map to specific API endpoints and database tables defined here.
- **04_UI_UX.md**: User interface designs that inform the mobile app architecture (Section 4), navigation structure, and offline UX patterns.
- **05_TESTING_STRATEGY.md**: Test plans that depend on the CI/CD pipeline (Section 1.4) and API error handling (Section 3.3).
- **06_DEPLOYMENT_GUIDE.md**: Deployment procedures that build on the hosting and DevOps architecture (Section 1.4).

---

*This document should be reviewed and updated as the project progresses through each development phase. Technology choices should be re-evaluated at each phase boundary based on team experience, scale requirements, and ecosystem changes.*
