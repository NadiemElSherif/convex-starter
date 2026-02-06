# Go Potty App — Expo Build Prompt

**Status**: Ready to execute
**Tech Stack**: Expo (React Native) + Convex + Clerk + NativeWind v5
**Scope**: MVP (Phase 1) — Core potty training experience for parents
**Target**: Single AI agent session, phased execution with verification checkpoints
**Reference Specs**: `app_build_specs/` (6 documents — use for deep detail on any feature, but this prompt is self-contained)

---

## IMPORTANT: SKILLS & CONVEX RULES

Before writing ANY code, the AI agent MUST invoke the appropriate skill:

| Task | Skill to invoke FIRST |
|------|----------------------|
| Any Convex backend code | `/convex-functions` |
| Schema or validators | `/convex-schema-validator` |
| Expo UI, navigation, styling | `/building-native-ui` |
| NativeWind / Tailwind setup | `/expo-tailwind-setup` |
| Data fetching patterns | `/native-data-fetching` |
| Expo dev client / builds | `/expo-dev-client` |
| General Convex question | `/convex` (routes to specific skill) |

### Convex Runtime Rules (Critical)

- **Queries** = reactive, no side effects, no fetch()
- **Mutations** = transactional, read/write DB atomically, no fetch() or external calls
- **Actions** = for side effects (external APIs), can't directly read/write DB — use `ctx.runQuery()`/`ctx.runMutation()`
- **`"use node"` files** = ONLY contain actions, required for Node.js packages
- **Action → Action is an anti-pattern** — inline the logic or schedule from a mutation
- **String references** for action→mutation calls: `"module:function" as any`
- **Scheduling**: `ctx.scheduler.runAfter(0, ...)` from mutations for async server-side work

---

## TECH STACK (Exact Versions)

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Mobile Framework** | Expo SDK 52+ (managed workflow) | iOS + Android |
| **Navigation** | Expo Router v4 (file-based routing) | Tab + stack |
| **Backend / DB** | Convex | Real-time, reactive |
| **Auth** | Clerk (`@clerk/clerk-expo`) | JWT synced to Convex |
| **Styling** | NativeWind v5 + `react-native-css` + Tailwind CSS v4 | Invoke `/expo-tailwind-setup` |
| **State** | Convex reactive queries + React state | No Redux needed |
| **Charts** | `victory-native` | Progress visualizations |
| **Animations** | `react-native-reanimated` | Celebrations, transitions |
| **Local Storage** | `expo-secure-store` (tokens) + `@react-native-async-storage/async-storage` (drafts) | |

### NOT in MVP (defer these entirely)
- RevenueCat / payments (stub the premium check as `isPremium = true` for now)
- Push notifications (stub the UI, don't implement)
- i18n (English only, no i18next setup)
- Offline sync
- PDF export
- Night-time training module
- Community features, B2B, coaching

---

## PROJECT SETUP (Phase 0)

Run these commands in order:

```bash
# 1. Create Expo project
npx create-expo-app@latest go-potty --template tabs
cd go-potty

# 2. Install Expo dependencies
npx expo install expo-router expo-secure-store @react-native-async-storage/async-storage
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install react-native-safe-area-context react-native-screens

# 3. Install Convex
npx expo install convex react-native-get-random-values
npx convex init

# 4. Install Clerk
npm install @clerk/clerk-expo

# 5. Install NativeWind v5 (MUST invoke /expo-tailwind-setup skill first)
npx expo install nativewind react-native-css tailwindcss

# 6. Install charts
npm install victory-native

# 7. Start dev servers
npx convex dev          # Terminal 1
npx expo start          # Terminal 2
```

### Verification Checkpoint (Phase 0)
- [ ] `npx expo start` launches without errors
- [ ] `npx convex dev` connects to deployment
- [ ] NativeWind classes render correctly on a test view
- [ ] TypeScript compiles: `npx tsc --noEmit`

---

## CONVEX SCHEMA

All backend logic runs on Convex. Define in `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ===== USERS =====
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    premiumStatus: v.optional(v.string()), // "free" | "premium"
    premiumExpiresAt: v.optional(v.number()),
    onboardingComplete: v.optional(v.boolean()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // ===== CHILDREN =====
  children: defineTable({
    userId: v.id("users"),
    name: v.string(),
    dateOfBirth: v.string(), // ISO date
    gender: v.optional(v.string()),
    personalityType: v.optional(v.string()), // "bold" | "cautious" | "routine" | "spontaneous"
    readinessStatus: v.optional(v.string()), // "not_assessed" | "ready" | "almost_ready" | "not_yet"
    readinessScore: v.optional(v.number()), // 0-100
    methodChosen: v.optional(v.string()), // "intensive" | "gradual"
    trainingStartDate: v.optional(v.string()),
    trainingStatus: v.optional(v.string()), // "not_started" | "active" | "completed"
    currentPhase: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),

  // ===== ASSESSMENTS =====
  assessments: defineTable({
    childId: v.id("children"),
    userId: v.id("users"),
    type: v.string(), // "child_readiness" | "parent_readiness" | "personality"
    status: v.string(), // "in_progress" | "completed"
    responses: v.optional(v.any()), // { questionId: answerValue }
    score: v.optional(v.number()),
    result: v.optional(v.any()), // { verdict, domainScores, personalityType, recommendations }
  })
    .index("by_childId", ["childId"])
    .index("by_childId_type", ["childId", "type"]),

  // ===== E-GUIDES =====
  eguides: defineTable({
    childId: v.id("children"),
    userId: v.id("users"),
    method: v.string(), // "intensive" | "gradual"
    personalityType: v.string(),
    childAgeMonths: v.number(),
    content: v.any(), // EGuideContent JSON (see structure below)
    currentSection: v.optional(v.number()),
    version: v.number(),
  })
    .index("by_childId", ["childId"]),

  // ===== PROGRESS LOGS =====
  progressLogs: defineTable({
    childId: v.id("children"),
    userId: v.id("users"),
    date: v.string(), // ISO date
    type: v.string(), // "success_wee" | "success_poo" | "accident_wee" | "accident_poo" | "dry_check" | "potty_sit"
    timeOfDay: v.optional(v.string()), // "morning" | "afternoon" | "evening" | "night"
    location: v.optional(v.string()), // "home" | "daycare" | "out"
    initiatedBy: v.optional(v.string()), // "child" | "parent" | "scheduled"
    notes: v.optional(v.string()),
    mood: v.optional(v.string()), // "happy" | "neutral" | "upset" | "resistant"
  })
    .index("by_childId", ["childId"])
    .index("by_childId_date", ["childId", "date"]),

  // ===== MILESTONES =====
  milestones: defineTable({
    childId: v.id("children"),
    userId: v.id("users"),
    type: v.string(), // see MILESTONE_TYPES below
    achievedAt: v.string(), // ISO date
    celebrated: v.optional(v.boolean()),
  })
    .index("by_childId", ["childId"]),

  // ===== TIPS =====
  tips: defineTable({
    category: v.string(),
    stage: v.optional(v.string()),
    personalityMatch: v.optional(v.string()),
    challengeType: v.optional(v.string()),
    method: v.optional(v.string()), // "intensive" | "gradual" | "both"
    title: v.string(),
    content: v.string(),
    priority: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_stage", ["stage"]),

  // ===== ASSESSMENT QUESTIONS =====
  assessmentQuestions: defineTable({
    assessmentType: v.string(),
    domain: v.string(),
    questionText: v.string(),
    questionType: v.string(), // "yes_no_sometimes" | "scale_1_5" | "multiple_choice" | "scenario"
    options: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
      score: v.optional(v.number()),
    }))),
    weight: v.optional(v.number()),
    order: v.number(),
    whyWeAsk: v.optional(v.string()),
  })
    .index("by_type", ["assessmentType"])
    .index("by_type_domain", ["assessmentType", "domain"]),
});
```

---

## APP STRUCTURE (Expo Router)

```
app/
  _layout.tsx              # Root: ConvexProvider + ClerkProvider + NativeWind
  index.tsx                # Splash → redirect to (onboarding) or (tabs) based on user state

  (auth)/
    _layout.tsx            # Stack, no tabs
    sign-in.tsx
    sign-up.tsx

  (onboarding)/
    _layout.tsx            # Stack, sequential, no back to tabs
    welcome.tsx            # Welcome screen
    add-child.tsx          # Add first child (name, DOB, gender)
    assessment.tsx         # Readiness assessment (child + parent + personality, one question per screen)
    results.tsx            # Readiness report (score gauge, domain breakdowns, personality)
    method-select.tsx      # Compare intensive vs gradual, pick one
    ready.tsx              # "You're all set!" → navigate to (tabs)

  (tabs)/
    _layout.tsx            # 5 tabs: Home, Progress, Guide, Tips, Profile
    index.tsx              # Home: daily summary, quick log buttons, today's tip
    progress.tsx           # Calendar view, charts, streaks, milestones
    guide.tsx              # E-guide reader, current section, phase indicator
    tips.tsx               # Browsable tip categories
    profile.tsx            # Child profiles, settings, account

  log/
    quick.tsx              # Quick log modal (full screen)
    detailed.tsx           # Detailed log with time, location, mood, notes

  milestone/
    [id].tsx               # Celebration screen (confetti, stats, badge)

components/
  ui/                      # Button, Card, Input, ProgressBar (NativeWind styled)
  AssessmentQuestion.tsx   # Renders one question per screen with options
  ReadinessGauge.tsx       # Visual score gauge (0-100)
  QuickLogButtons.tsx      # 4 large colored tap buttons
  ProgressCalendar.tsx     # Monthly calendar with colored day dots
  TipCard.tsx              # Single tip display card
  GuideSection.tsx         # E-guide section renderer with checklist
  MilestoneBadge.tsx       # Achievement badge component
  PremiumGate.tsx          # Wraps premium content, shows upgrade prompt for free users

lib/
  convex.ts                # Convex client setup
  auth.ts                  # Clerk + Convex auth helpers
```

---

## PHASED BUILD ORDER

Execute these phases sequentially. Each phase ends with a verification checkpoint.

---

### PHASE 1: Auth + Providers + Navigation Shell

**Build:**
1. `app/_layout.tsx` — Root layout with ConvexProvider + ClerkProvider + NativeWind
2. `convex/auth.ts` — `requireAuth()` helper (get user from Clerk JWT or throw)
3. `convex/users.ts` — `getOrCreateUser` mutation, `getCurrentUser` query
4. `app/(auth)/_layout.tsx` + `sign-in.tsx` + `sign-up.tsx` — Clerk auth screens
5. `app/(tabs)/_layout.tsx` — Tab navigator with 5 tabs (Home, Progress, Guide, Tips, Profile)
6. `app/index.tsx` — Check if user exists + onboardingComplete, redirect accordingly
7. Placeholder screens for all tabs (just title + "Coming soon")

**Auth flow:**
- Unauthenticated → `(auth)/sign-in`
- Authenticated, no user record → call `getOrCreateUser`, go to `(onboarding)/welcome`
- Authenticated, `onboardingComplete === false` → `(onboarding)/welcome`
- Authenticated, `onboardingComplete === true` → `(tabs)`

**Verification:**
- [ ] Sign up creates Clerk account + Convex user record
- [ ] Sign in redirects to onboarding (first time) or tabs (returning user)
- [ ] Tab navigation works between all 5 tabs
- [ ] `npx tsc --noEmit` passes

---

### PHASE 2: Onboarding + Add Child

**Build:**
1. `convex/children.ts` — `addChild` mutation, `getMyChildren` query, `getChild` query, `updateChild` mutation
2. `app/(onboarding)/_layout.tsx` — Stack navigator
3. `app/(onboarding)/welcome.tsx` — Welcome text + "Get Started" button
4. `app/(onboarding)/add-child.tsx` — Form: name (required), date of birth (date picker, required), gender (optional radio)
5. Validation: DOB must make child 12 months to 6 years old

**Verification:**
- [ ] Can navigate welcome → add-child
- [ ] Child is created in Convex `children` table
- [ ] DOB validation rejects children outside 12mo-6yr range
- [ ] `npx tsc --noEmit` passes

---

### PHASE 3: Assessment System + Seed Data

This is the most complex phase. Build the backend first, seed the data, then build the UI.

#### 3A: Seed Data Script

Create `convex/seed.ts` with an internal mutation that populates `assessmentQuestions`. Call it once via the Convex dashboard or a script.

**CHILD READINESS QUESTIONS (16 questions, 4 domains):**

```typescript
const CHILD_READINESS_QUESTIONS = [
  // === PHYSICAL DOMAIN (5 questions, weight: 0.30) ===
  {
    assessmentType: "child_readiness",
    domain: "physical",
    questionText: "Can your child stay dry for at least 1-2 hours during the day?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 1,
    whyWeAsk: "Bladder control develops when a child can hold urine for longer periods. This is one of the strongest physical readiness signals.",
  },
  {
    assessmentType: "child_readiness",
    domain: "physical",
    questionText: "Can your child pull their pants up and down with minimal help?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.8,
    order: 2,
    whyWeAsk: "Motor skills for managing clothing are important for independent toilet use.",
  },
  {
    assessmentType: "child_readiness",
    domain: "physical",
    questionText: "Does your child show regular bowel movement patterns (predictable times of day)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.8,
    order: 3,
    whyWeAsk: "Regular patterns make it easier to time potty sits for success.",
  },
  {
    assessmentType: "child_readiness",
    domain: "physical",
    questionText: "Can your child walk to and sit on a potty or toilet (with a step stool) by themselves?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.7,
    order: 4,
    whyWeAsk: "Physical ability to get to and onto the potty supports independence.",
  },
  {
    assessmentType: "child_readiness",
    domain: "physical",
    questionText: "Does your child show awareness when they are weeing or pooing (pausing, squatting, facial expressions)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 5,
    whyWeAsk: "Body awareness is a key sign that your child's nervous system is ready for toilet training.",
  },

  // === MENTAL/COGNITIVE DOMAIN (4 questions, weight: 0.25) ===
  {
    assessmentType: "child_readiness",
    domain: "mental",
    questionText: "Can your child follow simple two-step instructions (e.g., 'Pick up the ball and bring it to me')?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 6,
    whyWeAsk: "Following multi-step instructions shows your child can understand the potty training process.",
  },
  {
    assessmentType: "child_readiness",
    domain: "mental",
    questionText: "Does your child understand simple concepts like 'wet' vs 'dry' or 'clean' vs 'dirty'?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.9,
    order: 7,
    whyWeAsk: "Understanding these concepts helps your child connect the sensation of needing to go with the action of using the potty.",
  },
  {
    assessmentType: "child_readiness",
    domain: "mental",
    questionText: "Can your child identify basic body parts when asked?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.7,
    order: 8,
    whyWeAsk: "Body awareness supports understanding what happens during potty use.",
  },
  {
    assessmentType: "child_readiness",
    domain: "mental",
    questionText: "Does your child imitate things they see others do (e.g., pretend cooking, cleaning, talking on phone)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.8,
    order: 9,
    whyWeAsk: "Imitation is how children learn new routines — including using the toilet.",
  },

  // === EMOTIONAL MATURITY DOMAIN (4 questions, weight: 0.25) ===
  {
    assessmentType: "child_readiness",
    domain: "emotional",
    questionText: "Does your child express discomfort when their nappy is wet or soiled?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 10,
    whyWeAsk: "Discomfort with a wet nappy shows your child is developing a preference for being dry — a strong motivator.",
  },
  {
    assessmentType: "child_readiness",
    domain: "emotional",
    questionText: "Can your child cope with small frustrations without extended meltdowns (e.g., toy taken away, asked to wait)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.8,
    order: 11,
    whyWeAsk: "Potty training involves setbacks. A child who can manage small frustrations will handle accidents better.",
  },
  {
    assessmentType: "child_readiness",
    domain: "emotional",
    questionText: "Does your child show pride when accomplishing tasks independently (e.g., putting on shoes, stacking blocks)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.9,
    order: 12,
    whyWeAsk: "Pride in independence is the intrinsic motivation that drives successful potty training — NOT rewards.",
  },
  {
    assessmentType: "child_readiness",
    domain: "emotional",
    questionText: "Is your child going through a generally stable period (no major life changes like new sibling, moving, starting nursery)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes, things are stable", value: "yes", score: 2 },
      { label: "Some changes, but manageable", value: "sometimes", score: 1 },
      { label: "Major changes happening", value: "no", score: 0 },
    ],
    weight: 0.7,
    order: 13,
    whyWeAsk: "Big life changes can make potty training harder. Stability helps your child focus on this new skill.",
  },

  // === COMMUNICATION DOMAIN (3 questions, weight: 0.20) ===
  {
    assessmentType: "child_readiness",
    domain: "communication",
    questionText: "Can your child tell you (verbally or with gestures) when they need something?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 14,
    whyWeAsk: "Being able to communicate needs is essential for telling you when they need to go.",
  },
  {
    assessmentType: "child_readiness",
    domain: "communication",
    questionText: "Does your child have words or signs for wee and poo (or their equivalents)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes / learning", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 15,
    whyWeAsk: "Having words for bodily functions helps your child communicate what's happening.",
  },
  {
    assessmentType: "child_readiness",
    domain: "communication",
    questionText: "Can your child say 'no' or clearly refuse something they don't want?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes", value: "yes", score: 2 },
      { label: "Sometimes", value: "sometimes", score: 1 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.7,
    order: 16,
    whyWeAsk: "The ability to refuse shows autonomy — important for a child to feel in control of the potty process.",
  },
];
```

**PARENT READINESS QUESTIONS (10 questions):**

```typescript
const PARENT_READINESS_QUESTIONS = [
  {
    assessmentType: "parent_readiness",
    domain: "schedule",
    questionText: "Can you or a caregiver dedicate focused time for potty training over the next 1-2 weeks?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes, I can clear my schedule", value: "yes", score: 2 },
      { label: "Partially, I have some flexibility", value: "sometimes", score: 1 },
      { label: "No, my schedule is very full", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 1,
    whyWeAsk: "Consistency in the first days is the biggest predictor of success.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "schedule",
    questionText: "Is your household going through any major changes right now (new baby, moving, separation, new job)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "No, things are stable", value: "no", score: 2 },
      { label: "Minor changes", value: "sometimes", score: 1 },
      { label: "Yes, significant changes", value: "yes", score: 0 },
    ],
    weight: 0.9,
    order: 2,
    whyWeAsk: "Major disruptions make it harder for everyone to stay consistent.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "alignment",
    questionText: "Are all primary caregivers (partner, grandparents, nursery staff) willing to follow the same potty training approach?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes, everyone is on board", value: "yes", score: 2 },
      { label: "Most are, some need convincing", value: "sometimes", score: 1 },
      { label: "No, there's disagreement", value: "no", score: 0 },
    ],
    weight: 1.0,
    order: 3,
    whyWeAsk: "Inconsistent approaches between caregivers confuse children and slow progress.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "alignment",
    questionText: "Have you discussed potty training plans with your child's daycare or nursery provider?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes, they're ready to support", value: "yes", score: 2 },
      { label: "Not yet, but I plan to", value: "sometimes", score: 1 },
      { label: "N/A — child doesn't attend daycare", value: "yes", score: 2 },
      { label: "No", value: "no", score: 0 },
    ],
    weight: 0.7,
    order: 4,
    whyWeAsk: "Daycare consistency is critical — children need the same approach everywhere.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "confidence",
    questionText: "How confident do you feel about starting potty training?",
    questionType: "scale_1_5",
    options: [
      { label: "Very confident", value: "5", score: 2 },
      { label: "Fairly confident", value: "4", score: 1.5 },
      { label: "Neutral", value: "3", score: 1 },
      { label: "A bit nervous", value: "2", score: 0.5 },
      { label: "Very anxious", value: "1", score: 0 },
    ],
    weight: 0.6,
    order: 5,
    whyWeAsk: "Your confidence affects your child's confidence. The guide will help build yours.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "confidence",
    questionText: "Have you attempted potty training before?",
    questionType: "multiple_choice",
    options: [
      { label: "No, this is the first time", value: "first_time", score: 1.5 },
      { label: "Yes, it went partially well", value: "partial", score: 1 },
      { label: "Yes, but it didn't work out", value: "failed", score: 0.5 },
      { label: "Yes, with a different child successfully", value: "success_other", score: 2 },
    ],
    weight: 0.5,
    order: 6,
    whyWeAsk: "Understanding your experience helps us tailor the approach and expectations.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "lifestyle",
    questionText: "Does your child attend nursery or daycare?",
    questionType: "multiple_choice",
    options: [
      { label: "No, they're at home full-time", value: "home", score: 2 },
      { label: "Yes, 1-2 days per week", value: "part_time", score: 1.5 },
      { label: "Yes, 3-4 days per week", value: "most_days", score: 1 },
      { label: "Yes, 5 days per week", value: "full_time", score: 0.5 },
    ],
    weight: 0.6,
    order: 7,
    whyWeAsk: "More time at home means more control over the training environment.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "lifestyle",
    questionText: "How would you describe your daily routine?",
    questionType: "multiple_choice",
    options: [
      { label: "Very structured and predictable", value: "structured", score: 2 },
      { label: "Mostly structured with some flexibility", value: "mostly_structured", score: 1.5 },
      { label: "Fairly flexible / varies day to day", value: "flexible", score: 1 },
      { label: "Unpredictable / no set routine", value: "unpredictable", score: 0.5 },
    ],
    weight: 0.5,
    order: 8,
    whyWeAsk: "Structure helps create potty routines. We'll help you build one if you don't have one yet.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "resources",
    questionText: "Do you have the basic equipment ready (potty seat or toilet insert, step stool)?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes, all ready", value: "yes", score: 2 },
      { label: "Some things, need to get more", value: "sometimes", score: 1 },
      { label: "No, haven't started", value: "no", score: 0 },
    ],
    weight: 0.4,
    order: 9,
    whyWeAsk: "Having equipment ready means you can start without delays.",
  },
  {
    assessmentType: "parent_readiness",
    domain: "resources",
    questionText: "Can you handle extra laundry and cleanup for the first week of training?",
    questionType: "yes_no_sometimes",
    options: [
      { label: "Yes, no problem", value: "yes", score: 2 },
      { label: "It'll be manageable", value: "sometimes", score: 1 },
      { label: "That sounds very difficult", value: "no", score: 0 },
    ],
    weight: 0.4,
    order: 10,
    whyWeAsk: "Accidents are normal and frequent at first. Being prepared reduces stress.",
  },
];
```

**PERSONALITY EVALUATION QUESTIONS (10 scenario questions):**

```typescript
const PERSONALITY_QUESTIONS = [
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "When your child encounters a new toy for the first time, they usually...",
    questionType: "scenario",
    options: [
      { label: "Jump right in and start playing immediately", value: "bold", score: 0 },
      { label: "Watch someone else play with it first", value: "cautious", score: 0 },
      { label: "Try to figure out the 'right' way to use it", value: "routine", score: 0 },
      { label: "Use it in a completely unexpected way", value: "spontaneous", score: 0 },
    ],
    weight: 1.0,
    order: 1,
    whyWeAsk: "How your child approaches new things tells us what potty training style will work best.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "At a new playground, your child tends to...",
    questionType: "scenario",
    options: [
      { label: "Run straight for the biggest slide", value: "bold", score: 0 },
      { label: "Stay close to you and watch other children first", value: "cautious", score: 0 },
      { label: "Go to the equipment they already know", value: "routine", score: 0 },
      { label: "Wander around exploring everything randomly", value: "spontaneous", score: 0 },
    ],
    weight: 1.0,
    order: 2,
    whyWeAsk: "Behavior in new environments reflects how your child will approach the new experience of potty training.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "When your child's daily routine changes unexpectedly, they usually...",
    questionType: "scenario",
    options: [
      { label: "Adapt quickly and seem excited", value: "bold", score: 0 },
      { label: "Become anxious or clingy", value: "cautious", score: 0 },
      { label: "Get upset or have a meltdown", value: "routine", score: 0 },
      { label: "Don't seem to notice or care", value: "spontaneous", score: 0 },
    ],
    weight: 1.0,
    order: 3,
    whyWeAsk: "Potty training is a big routine change. This tells us how much preparation your child needs.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "When asked to do something they don't want to do, your child...",
    questionType: "scenario",
    options: [
      { label: "Negotiates or tries to do it their own way", value: "bold", score: 0 },
      { label: "Quietly resists or looks for an escape", value: "cautious", score: 0 },
      { label: "Cooperates if it's part of the usual routine", value: "routine", score: 0 },
      { label: "Gets distracted by something else entirely", value: "spontaneous", score: 0 },
    ],
    weight: 1.0,
    order: 4,
    whyWeAsk: "Understanding resistance patterns helps us suggest the right approach for your child.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "During mealtimes, your child is most likely to...",
    questionType: "scenario",
    options: [
      { label: "Eat quickly so they can get back to playing", value: "bold", score: 0 },
      { label: "Eat slowly and carefully, maybe sorting food", value: "cautious", score: 0 },
      { label: "Eat the same preferred foods in the same order", value: "routine", score: 0 },
      { label: "Take a few bites, leave, come back, take a few more", value: "spontaneous", score: 0 },
    ],
    weight: 0.8,
    order: 5,
    whyWeAsk: "Eating habits often mirror how a child approaches other new routines.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "When your child achieves something new (builds a tower, puts on shoes), they...",
    questionType: "scenario",
    options: [
      { label: "Immediately try something even harder", value: "bold", score: 0 },
      { label: "Look to you for approval and reassurance", value: "cautious", score: 0 },
      { label: "Repeat it several times to perfect it", value: "routine", score: 0 },
      { label: "Quickly move on to something completely different", value: "spontaneous", score: 0 },
    ],
    weight: 0.9,
    order: 6,
    whyWeAsk: "This tells us how to celebrate potty successes in a way that motivates YOUR child.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "In a group of children, your child usually...",
    questionType: "scenario",
    options: [
      { label: "Takes the lead and decides what to play", value: "bold", score: 0 },
      { label: "Follows along and joins in gradually", value: "cautious", score: 0 },
      { label: "Prefers structured games with clear rules", value: "routine", score: 0 },
      { label: "Does their own thing, dipping in and out", value: "spontaneous", score: 0 },
    ],
    weight: 0.8,
    order: 7,
    whyWeAsk: "Social behavior helps us understand if peer modeling would help with potty training.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "At bedtime, your child...",
    questionType: "scenario",
    options: [
      { label: "Resists bedtime and wants to keep going", value: "bold", score: 0 },
      { label: "Needs their comfort items and specific conditions", value: "cautious", score: 0 },
      { label: "Follows the bedtime routine without fuss if it's consistent", value: "routine", score: 0 },
      { label: "Some nights are easy, some are a battle — unpredictable", value: "spontaneous", score: 0 },
    ],
    weight: 0.7,
    order: 8,
    whyWeAsk: "Bedtime behaviour reveals how your child handles transitions — potty training is one big transition.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "When something scares or startles your child, they...",
    questionType: "scenario",
    options: [
      { label: "Recover quickly and want to investigate", value: "bold", score: 0 },
      { label: "Need lots of comfort and time to feel safe", value: "cautious", score: 0 },
      { label: "Are fine if it happened before and they know what it is", value: "routine", score: 0 },
      { label: "React strongly in the moment but forget about it fast", value: "spontaneous", score: 0 },
    ],
    weight: 0.9,
    order: 9,
    whyWeAsk: "Some children find the potty scary at first. This helps us prepare for that.",
  },
  {
    assessmentType: "personality",
    domain: "temperament",
    questionText: "Your child's attention span is best described as...",
    questionType: "scenario",
    options: [
      { label: "Focused when interested, impatient when not", value: "bold", score: 0 },
      { label: "Can focus for a long time on careful, detailed activities", value: "cautious", score: 0 },
      { label: "Good focus on familiar activities, less on new ones", value: "routine", score: 0 },
      { label: "Short bursts of interest, constantly shifting", value: "spontaneous", score: 0 },
    ],
    weight: 0.8,
    order: 10,
    whyWeAsk: "Attention span determines how long potty sits should be and what entertainment helps.",
  },
];
```

**PERSONALITY SCORING ALGORITHM:**

```typescript
// Count how many times each archetype was selected
function scorePersonality(responses: Record<string, string>): string {
  const counts = { bold: 0, cautious: 0, routine: 0, spontaneous: 0 };
  for (const value of Object.values(responses)) {
    if (value in counts) counts[value as keyof typeof counts]++;
  }
  // Highest count wins. Tie-break: bold > routine > cautious > spontaneous
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0][0]; // return the archetype with highest count
}
```

#### 3B: Assessment Backend

`convex/assessments.ts`:
- `getQuestions(type)` — query: get questions by assessmentType, ordered by `order`
- `startAssessment(childId, type)` — mutation: create assessment with status "in_progress" (enforce max 1 active per type per child)
- `saveResponse(assessmentId, questionId, value)` — mutation: save individual answer to responses blob
- `completeAssessment(assessmentId)` — mutation: calculate scores, set status "completed", update child's readinessStatus/readinessScore/personalityType

**Scoring logic (inside `completeAssessment`):**

```
Child readiness:
  physicalScore = avg(physical question scores) / maxScore * 100
  mentalScore = avg(mental question scores) / maxScore * 100
  emotionalScore = avg(emotional question scores) / maxScore * 100
  communicationScore = avg(communication question scores) / maxScore * 100
  childScore = physical*0.30 + mental*0.25 + emotional*0.25 + communication*0.20

Parent readiness:
  parentScore = avg(all parent question scores) / maxScore * 100

Overall = childScore * 0.70 + parentScore * 0.30

Verdict:
  >= 70 → "ready"
  50-69 → "almost_ready"
  < 50  → "not_yet"
```

#### 3C: Assessment UI

`app/(onboarding)/assessment.tsx`:
- Shows one question per screen
- Progress bar at top ("Question 4 of 16")
- Large tap targets for answer options
- "Why we ask this" expandable section
- Back button to revisit
- Auto-saves each answer via `saveResponse`
- Runs all 3 assessments sequentially: child readiness → parent readiness → personality
- On completion → navigate to results

`app/(onboarding)/results.tsx`:
- Score gauge (0-100) with color (green/amber/red)
- Domain breakdown bars (physical, mental, emotional, communication)
- Personality type card with description
- Verdict: "Ready to Start" / "Almost Ready" / "Not Yet"
- If "Not Yet" → show recommendations + "Reassess in 2-4 weeks" message
- If "Ready" or "Almost Ready" → CTA to method selection

**Verification:**
- [ ] Seed script populates 36 questions (16 + 10 + 10)
- [ ] Assessment flow renders all questions correctly
- [ ] Scores calculate correctly (test: all "Yes" = ~100, all "No" = ~0)
- [ ] Personality type matches most-selected archetype
- [ ] Child's readinessStatus and readinessScore update in DB
- [ ] `npx tsc --noEmit` passes

---

### PHASE 4: Method Selection

**Build:**
1. `app/(onboarding)/method-select.tsx`:
   - Side-by-side comparison cards (Intensive 3-5 days vs Gradual 10 weeks)
   - Auto-recommendation based on personality + parent readiness:
     ```
     If personality is "bold" or "routine" AND parentScore >= 70 → recommend Intensive
     If personality is "cautious" or "spontaneous" OR parentScore < 70 → recommend Gradual
     ```
   - Confidence: strong if clear match, "consider both" if mixed signals
   - "We recommend Intensive/Gradual for [child name]" with 3 reasons
   - Parent can override and pick either
   - Saves `methodChosen` on child record

2. `app/(onboarding)/ready.tsx`:
   - "You're all set!" celebration screen
   - Summary: child name, personality type, chosen method
   - "Start Your Journey" button → sets `onboardingComplete = true`, navigates to `(tabs)`

**Verification:**
- [ ] Recommendation logic matches personality/parent score rules
- [ ] Parent can override recommendation
- [ ] `methodChosen` saved on child
- [ ] `onboardingComplete` flag set, app redirects to tabs
- [ ] `npx tsc --noEmit` passes

---

### PHASE 5: Home Tab + Quick Logging

**Build:**
1. `convex/progressLogs.ts`:
   - `logEvent(childId, type, date?, timeOfDay?, location?, initiatedBy?, mood?, notes?)` — mutation
   - `getLogsByDate(childId, date)` — query
   - `getLogsByDateRange(childId, startDate, endDate)` — query
   - `getDailyStats(childId, date)` — query: returns `{ successes, accidents, total }`
   - `deleteLog(logId)` — mutation

2. `app/(tabs)/index.tsx` (Home tab):
   - Top: greeting + child name + training day counter
   - Middle: `QuickLogButtons` — 4 large buttons:
     - "Wee success" (green, icon: droplet + check)
     - "Poo success" (green, icon: poo + check)
     - "Accident" (amber, icon: splash)
     - "Dry check" (blue, icon: sun)
   - One tap → calls `logEvent` with current date/time, shows brief success toast
   - Long press → opens detailed log modal
   - Bottom: today's summary ("3 successes, 1 accident")
   - Bottom: today's tip card (placeholder for Phase 7)

3. `app/log/quick.tsx` — Quick log modal with time/location/mood pickers
4. `app/log/detailed.tsx` — Full form for retroactive logging

**Verification:**
- [ ] Tapping a quick log button creates a progressLog record instantly
- [ ] Daily stats update reactively (Convex real-time)
- [ ] Detailed log modal saves all optional fields
- [ ] `npx tsc --noEmit` passes

---

### PHASE 6: Progress Tab + Milestones

**Build:**
1. `convex/milestones.ts`:
   - `checkAndAwardMilestones(childId)` — mutation: called after each log event, checks conditions:
     ```
     MILESTONE DETECTION RULES:
     "first_wee"      → first progressLog with type "success_wee"
     "first_poo"      → first progressLog with type "success_poo"
     "dry_day"        → a full day with 0 accidents and at least 1 success
     "3_day_streak"   → 3 consecutive days each qualifying as "dry_day"
     "7_day_streak"   → 7 consecutive days
     "completed"      → 14 consecutive dry days
     ```
   - `getMilestones(childId)` — query
   - `celebrateMilestone(milestoneId)` — mutation: set `celebrated = true`

2. Hook milestone check into `logEvent`: after inserting log, call `checkAndAwardMilestones`

3. `convex/progressLogs.ts` additions:
   - `getWeeklyStats(childId)` — query: last 7 days aggregated
   - `getStreaks(childId)` — query: current consecutive dry days count

4. `app/(tabs)/progress.tsx`:
   - Summary cards: current streak, longest streak, this week's success rate
   - `ProgressCalendar` — monthly calendar, each day colored:
     - Green = more successes than accidents
     - Amber = mixed (equal or close)
     - Red = more accidents than successes
     - Grey = no data
   - Tap day → shows that day's log timeline
   - Weekly success rate chart (victory-native line chart)
   - Milestones section: list of achieved milestones with badges

5. `app/milestone/[id].tsx`:
   - Full-screen celebration
   - Confetti animation (react-native-reanimated)
   - Achievement badge + milestone name
   - "It took X days!" stat
   - "Keep going!" button → dismiss

**Verification:**
- [ ] After logging first wee success, "first_wee" milestone appears
- [ ] Calendar dots match actual log data
- [ ] Streak calculation works across consecutive days
- [ ] Milestone celebration screen renders with animation
- [ ] `npx tsc --noEmit` passes

---

### PHASE 7: E-Guide + Tips

**Build:**
1. `convex/eguides.ts`:
   - `generateGuide(childId)` — mutation: creates e-guide based on child's method + personality + age
   - `getGuide(childId)` — query
   - `updateCurrentSection(guideId, sectionIndex)` — mutation

   Guide content is generated from templates. For MVP, generate programmatically based on method + personality:

   ```typescript
   // Intensive method: 7 sections (preparation, day 1-5, maintenance)
   // Gradual method: 12 sections (preparation, week 1-10, maintenance)
   // Each section has: title, body (markdown), tips[], checklist[]
   // Body text adapts wording based on personalityType
   ```

   Create a helper function `generateGuideContent(method, personalityType, childName, ageMonths)` that returns the `EGuideContent` structure. The content should be practical, science-based potty training advice (NOT reward-based).

2. Seed tips via `convex/seed.ts` — add at least 40 tips:
   - 8 "getting_started" tips
   - 8 "daily" tips (stage-matched)
   - 6 "accidents" tips
   - 6 "poo_challenges" tips
   - 6 "encouragement" tips
   - 6 "regression" tips

3. `convex/tips.ts`:
   - `getDailyTip(childId)` — query: pick a tip matching child's current phase + personality
   - `getTipsByCategory(category)` — query

4. `app/(tabs)/guide.tsx`:
   - If no guide exists → "Generate your personalized guide" button
   - Guide reader: section list with current section highlighted
   - Section view: markdown body, tips, checklist (checkable)
   - Phase indicator at top

5. `app/(tabs)/tips.tsx`:
   - Category grid (6 categories with icons)
   - Category detail: scrollable list of tip cards
   - Each tip card: title, content, category badge

6. Update Home tab: add daily tip card at bottom

**Verification:**
- [ ] Guide generates correctly for both methods
- [ ] Guide content adapts to personality type
- [ ] Tips display by category
- [ ] Daily tip appears on home screen
- [ ] `npx tsc --noEmit` passes

---

### PHASE 8: Profile + Polish

**Build:**
1. `app/(tabs)/profile.tsx`:
   - User info (name, email from Clerk)
   - Children list with tap to view/edit
   - "Add another child" button
   - Settings section: sign out button
   - Premium status badge (always shows "Premium" for MVP since we stub it)

2. `convex/children.ts` additions:
   - `deleteChild(childId)` — mutation: cascade delete assessments + logs + milestones + guide

3. Polish pass:
   - Consistent NativeWind styling across all screens
   - Loading states (skeleton loaders)
   - Empty states (no logs yet, no milestones yet, no children yet)
   - Error boundaries
   - Haptic feedback on quick log buttons

**Verification:**
- [ ] Profile shows user info and children
- [ ] Can add multiple children
- [ ] Delete child cascades correctly
- [ ] All screens have loading and empty states
- [ ] `npx tsc --noEmit` passes
- [ ] App runs on iOS simulator without crashes
- [ ] App runs on Android emulator without crashes

---

## DESIGN SYSTEM

Use NativeWind v5 with this color palette:

```
Primary:        #6C63FF (purple — trust, expertise)
Secondary:      #FF6B6B (coral — warmth, celebration)
Success:        #4CAF50 (green — progress)
Warning:        #FFB74D (amber — gentle, NOT red for accidents)
Background:     #FAFAFA (light grey)
Surface:        #FFFFFF (white cards)
Text:           #1A1A2E (dark navy)
TextSecondary:  #6B7280 (grey)
```

Key UI principles:
- **Big tap targets**: minimum 48x48px for all interactive elements
- **Readable text**: parents are often distracted/multitasking
- **No shame**: accidents are shown in warm amber, NEVER red
- **No rewards**: celebrations use intrinsic pride language, NEVER sticker charts or candy
- **Rounded corners**: 12-16px border radius on cards
- **Consistent spacing**: 16px padding, 12px gaps

---

## PREMIUM GATING (MVP STUB)

For MVP, stub premium as always active:

```typescript
// convex/auth.ts
export function isPremium(user: Doc<"users">): boolean {
  // MVP: always return true. Replace with real check later.
  return true;
}
```

Premium features (to gate later): e-guide, progress tracking, unlimited tips, charts.
Free features: auth, onboarding, assessments, method selection, 1 tip/day.

---

## MILESTONE TYPES

```typescript
const MILESTONE_TYPES = [
  "first_wee",        // First successful wee on potty
  "first_poo",        // First successful poo on potty
  "dry_day",          // Full day with 0 accidents + at least 1 success
  "dry_night",        // Dry overnight (future — not tracked in MVP)
  "3_day_streak",     // 3 consecutive dry days
  "7_day_streak",     // 7 consecutive dry days
  "completed",        // 14 consecutive dry days
] as const;
```

---

## METHOD COMPARISON (for method-select screen)

| | Intensive | Gradual |
|---|---|---|
| **Duration** | 3-5 days | 10 weeks |
| **Commitment** | Full-time at home | Integrates into daily routine |
| **Approach** | Remove nappies completely, full immersion | Progressive steps, gradual nappy reduction |
| **Best for** | Bold/routine children, available parents | Cautious/spontaneous children, working parents |
| **Expect** | Lots of accidents at first, rapid progress | Slower progress, fewer accidents |
| **Success requires** | Patience, calm during accidents, consistency | Long-term consistency, gradual increases |

---

## KEY METHODOLOGY PRINCIPLES (from Go Potty)

Embed these in ALL content (guide, tips, UI copy):

1. **Science-based, NOT reward-based** — No sticker charts, candy, or external motivators. Celebrate intrinsic pride.
2. **Interest is NOT a prerequisite** — Don't wait for the child to "show interest." Readiness is developmental, not behavioral.
3. **18 months is ideal** — Starting too late (after 3) can cause health issues (incontinence, constipation, bladder infections).
4. **Personality-matched** — Approach adapts to the child's temperament, not a one-size-fits-all method.
5. **All caregivers aligned** — Consistency across home, daycare, grandparents is critical.
6. **Accidents are learning** — Never punish or shame. Use warm, neutral language.

---

## WHAT NOT TO BUILD

Do NOT build any of these in MVP:
- RevenueCat / in-app purchases (stub as premium = true)
- Push notifications (stub the UI toggle, don't implement)
- i18n / translations (English only, no i18next)
- PDF export of reports
- Night-time training tracking
- Community features
- Expert coaching
- B2B dashboards
- AI-powered personalization
- Offline sync
- Share/export functionality
- Adaptive guide content (guide is static for MVP)

---

## REFERENCE DOCUMENTS

For deep detail on any feature, read these (but this prompt should be self-contained for MVP):

| Document | What it covers |
|----------|---------------|
| `app_build_specs/01_PRD.md` | Product vision, personas, user flows |
| `app_build_specs/02_FEATURE_SPECIFICATIONS.md` | 8 features with full UI descriptions, data models, edge cases |
| `app_build_specs/03_TECHNICAL_ARCHITECTURE.md` | Full architecture (NOTE: references Flutter/PostgreSQL — IGNORE those, use Expo/Convex) |
| `website_data/FAQ.md` | Go Potty methodology Q&As (good for guide/tip content) |
| `website_data/APP_FEATURES.md` | Feature descriptions (good for marketing copy) |

**WARNING**: `03_TECHNICAL_ARCHITECTURE.md` specifies Flutter + PostgreSQL + Supabase. IGNORE that tech stack. This app uses Expo + Convex + Clerk as specified in this document.

---

## HOW TO USE THIS PROMPT

Tell Claude:

> "Read `EXPO_BUILD_PROMPT.md` and build the Go Potty app. Execute each phase sequentially, running the verification checkpoint before moving to the next phase. Start with Phase 0 (project setup)."

Or for a specific phase:

> "Read `EXPO_BUILD_PROMPT.md` and implement Phase 3 (Assessment System). The project is already set up through Phase 2."

---

*Created: February 6, 2026*
*Updated: February 6, 2026*
*Stack: Expo SDK 52 + Convex + Clerk + NativeWind v5*
*Scope: MVP (Phase 1) — Parent B2C experience*
