# 02 - Feature Specifications

| Field          | Value                                      |
|----------------|--------------------------------------------|
| Last Updated   | 2026-02-06                                 |
| Status         | Draft                                      |
| Owner          | Product Team                               |
| Version        | 1.0                                        |
| Document ID    | SPEC-02                                    |

---

## Related Documents

| Document                          | Reference            |
|-----------------------------------|----------------------|
| Product Requirements Document     | `01_PRD.md`          |
| Technical Architecture            | `03_TECHNICAL_ARCHITECTURE.md` |
| Data Model & Schema               | `04_DATA_MODEL.md`   |
| API Reference                     | `05_API_REFERENCE.md` |
| UI/UX Design System               | `06_UI_UX_DESIGN.md` |
| Internationalization (i18n)       | `07_I18N.md`         |
| Testing Strategy                  | `08_TESTING.md`      |

---

## Table of Contents

1. [Feature 1: Readiness Assessment System](#feature-1-readiness-assessment-system)
2. [Feature 2: Method Selection Tool](#feature-2-method-selection-tool)
3. [Feature 3: Personalized E-Guide Generator](#feature-3-personalized-e-guide-generator)
4. [Feature 4: Progress Tracking Dashboard](#feature-4-progress-tracking-dashboard)
5. [Feature 5: Tips & Reminders System](#feature-5-tips--reminders-system)
6. [Feature 6: Premium Coaching Portal](#feature-6-premium-coaching-portal)
7. [Feature 7: Community Features](#feature-7-community-features)
8. [Feature 8: Analytics Dashboard (B2B)](#feature-8-analytics-dashboard-b2b)

---

## Foundational Principles

All features are designed around the following principles drawn from the Go Potty methodology:

- **Science-based, NOT reward-based.** The app never suggests sticker charts, candy rewards, or external motivators. All guidance promotes intrinsic motivation: pride, autonomy, and the natural satisfaction of growing up.
- **Personalized to the child.** Age alone is never the determining factor. Personality type, developmental readiness, family situation, and previous attempts all shape the experience.
- **Multilingual from day one.** All user-facing content is available in Dutch, English, Arabic, Turkish, and Polish. Content is culturally adapted, not just translated.
- **Freemium model.** Readiness tests and method selection are free. The full training journey (e-guide, tracking, tips, coaching) requires a premium subscription (GBP 37.45 for 6 months, one-time payment).
- **Privacy-first for children.** No child photos are required. Child data is stored under the parent account and never shared externally without explicit consent.

---

## Feature 1: Readiness Assessment System

### 1.1 Overview

The Readiness Assessment System determines whether a child and their family are prepared to begin potty training. It consists of two separate assessments plus a personality evaluation. This feature is **free tier** and serves as the primary acquisition funnel into the premium product.

A core insight of the Go Potty methodology: parents should NOT wait for a child to "show interest" in the potty. Many developmental signals indicate readiness independent of expressed interest. The assessment is designed to surface these signals.

### 1.2 User Interface Description

#### Screen 1: Assessment Landing

- Hero section with heading: "Is your child ready for potty training?"
- Two prominent cards side by side:
  - **Child Readiness Test** -- icon of a child, subtitle: "Assess your child's physical, mental, and emotional development"
  - **Parent & Family Readiness Test** -- icon of a family, subtitle: "Evaluate your schedule, lifestyle, and family alignment"
- Below the cards, a progress indicator showing which tests have been completed (0/2, 1/2, 2/2)
- If both tests are complete, a third card appears: **Personality Evaluation** -- "Help us understand your child's temperament"
- Bottom CTA: "View Your Readiness Report" (enabled only after all assessments are complete)

#### Screen 2: Child Readiness Test

- Step-by-step questionnaire, one question per screen with large tap targets
- Progress bar at top (e.g., "Question 4 of 16")
- Questions use simple language, with optional "Why we ask this" expandable hint
- Answer formats: Yes/No/Sometimes, frequency scales (Never / Rarely / Sometimes / Often / Always), multiple choice
- Back button to revisit previous answers
- "Save & Continue Later" button -- answers persist in draft state

**Question domains:**

| Domain | Example Questions |
|--------|-------------------|
| Physical development | "Can your child stay dry for at least 1-2 hours during the day?", "Can your child pull their pants up and down independently?", "Does your child show regular bowel movement patterns?" |
| Mental/cognitive development | "Can your child follow two-step instructions?", "Does your child understand the concept of 'before' and 'after'?", "Can your child identify body parts?" |
| Emotional maturity | "Does your child express discomfort when their nappy is wet or soiled?", "Can your child cope with small frustrations without extended meltdowns?", "Does your child show pride when accomplishing tasks independently?" |
| Communication ability | "Can your child tell you (verbally or with gestures) when they need something?", "Does your child have words or signs for wee and poo?", "Can your child say 'no' or shake their head?" |

#### Screen 3: Parent & Family Readiness Test

- Same step-by-step format
- Questions cover:

| Domain | Example Questions |
|--------|-------------------|
| Schedule & availability | "Can you or a caregiver dedicate focused time for the next 1-2 weeks?", "Is the household going through any major changes (new baby, moving, separation)?" |
| Family alignment | "Are all primary caregivers (partner, grandparents, nursery) willing to follow the same approach?", "Have you discussed potty training with your child's daycare provider?" |
| Readiness level | "How would you rate your own confidence about starting potty training?" (1-5 scale), "Have you attempted potty training before? If so, what happened?" |
| Lifestyle factors | "What is your typical daily routine?", "Does your child attend nursery or daycare? How many days per week?" |

#### Screen 4: Personality Evaluation

- Scenario-based questions rather than direct personality labels
- Example: "When your child encounters a new toy, they usually..." (a) Jump right in and start playing, (b) Watch others first before trying, (c) Follow a familiar pattern with it, (d) Try it in an unexpected way
- 8-12 questions mapping to four personality archetypes:
  - **Bold/Adventurous** -- eager, impulsive, wants to do things themselves
  - **Cautious/Observer** -- careful, watches first, needs reassurance
  - **Routine-Dependent** -- thrives on predictability, resists sudden changes
  - **Spontaneous/Creative** -- unpredictable, easily bored, needs novelty

#### Screen 5: Readiness Report

- Summary card at top with overall readiness verdict: "Ready to Start", "Almost Ready", or "Not Yet -- Here's What to Work On"
- Readiness score displayed as a visual gauge (e.g., 0-100)
- Four domain breakdowns (physical, mental, emotional, communication) each with their own sub-score and traffic-light indicator (green/amber/red)
- Personality type result with description and illustration
- Family readiness summary
- "Areas to develop" section with specific, actionable recommendations (e.g., "Practice pulling pants up and down during diaper changes for the next 2 weeks")
- Estimated timeline: "Based on your results, your child may be ready to start in approximately X weeks"
- CTA: "Choose Your Training Method" (links to Feature 2)
- Option to retake individual tests
- Share/export report as PDF

### 1.3 Data Model

```
assessments
  _id                   Id<"assessments">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  type                  "child_readiness" | "parent_readiness" | "personality"
  status                "in_progress" | "completed"
  answers               Record<string, any>       // questionId -> answer value
  scores                {
                          overall: number,          // 0-100
                          physical?: number,
                          mental?: number,
                          emotional?: number,
                          communication?: number,
                          schedule?: number,
                          alignment?: number,
                          confidence?: number,
                        }
  personalityType       "bold" | "cautious" | "routine" | "spontaneous" | null
  completedAt           number | null              // timestamp
  _creationTime         number

childProfiles
  _id                   Id<"childProfiles">
  userId                Id<"users">
  name                  string
  dateOfBirth           string                     // ISO date
  gender                "male" | "female" | "other" | "prefer_not_to_say"
  specialNeeds          string | null
  previousAttempts      number                     // 0, 1, 2+
  attendsDaycare        boolean
  daycareSchedule       string | null              // e.g., "3 days/week"
  siblings              { count: number, ages: number[] }
  language              "nl" | "en" | "ar" | "tr" | "pl"
  _creationTime         number

readinessReports
  _id                   Id<"readinessReports">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  childAssessmentId     Id<"assessments">
  parentAssessmentId    Id<"assessments">
  personalityAssessmentId Id<"assessments">
  overallScore          number                     // 0-100
  verdict               "ready" | "almost_ready" | "not_yet"
  domainScores          {
                          physical: number,
                          mental: number,
                          emotional: number,
                          communication: number,
                          familyReadiness: number,
                        }
  personalityType       "bold" | "cautious" | "routine" | "spontaneous"
  recommendations       string[]                   // list of action items
  estimatedStartWeeks   number                     // weeks until ready
  _creationTime         number
```

See `04_DATA_MODEL.md` for full schema definitions including indexes.

### 1.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `query` | `assessments:getByChild` | Required | Free | Get all assessments for a child profile |
| `query` | `assessments:getDraft` | Required | Free | Get in-progress assessment by type |
| `mutation` | `assessments:startAssessment` | Required | Free | Create a new assessment (or resume draft) |
| `mutation` | `assessments:saveAnswers` | Required | Free | Save partial answers (auto-save on each question) |
| `mutation` | `assessments:completeAssessment` | Required | Free | Mark assessment as complete, trigger scoring |
| `query` | `readinessReports:getByChild` | Required | Free | Get the latest readiness report |
| `mutation` | `readinessReports:generate` | Required | Free | Generate report from three completed assessments |
| `action` | `readinessReports:exportPdf` | Required | Free | Generate PDF export of report |

### 1.5 Scoring Algorithm

The scoring algorithm is deterministic and runs inside a Convex mutation (no external API needed).

```
Physical score    = weighted sum of physical domain answers (weight: 0.30)
Mental score      = weighted sum of mental domain answers (weight: 0.25)
Emotional score   = weighted sum of emotional domain answers (weight: 0.25)
Communication     = weighted sum of communication answers (weight: 0.20)

Child readiness   = (Physical * 0.30) + (Mental * 0.25) + (Emotional * 0.25) + (Communication * 0.20)
Family readiness  = weighted sum of parent assessment answers

Overall score     = (Child readiness * 0.70) + (Family readiness * 0.30)

Verdict:
  >= 75  -> "ready"
  50-74  -> "almost_ready"
  < 50   -> "not_yet"
```

Personality type is determined by highest-scoring archetype across scenario questions, with tie-breaking rules favoring the child's age bracket tendencies.

### 1.6 Validation Rules

- Child date of birth must be between 12 months and 6 years old
- All questions in a domain must be answered before that domain is scored
- Parent assessment requires at least one caregiver alignment question answered
- Personality evaluation requires all questions answered (no partial scoring)
- Assessments expire after 30 days in draft state (soft-delete, can be restarted)
- A child profile can have at most one active (in_progress) assessment per type

### 1.7 Error Handling

| Scenario | Handling |
|----------|----------|
| Network loss during questionnaire | Answers auto-saved after each question; "Save & Continue Later" always available; resume from last saved answer |
| Assessment already completed | Show existing report with option to retake (creates new assessment, archives old) |
| Child age out of range | Prevent assessment start with message: "This assessment is designed for children 12 months to 6 years" |
| Scoring failure | Retry scoring up to 3 times; if persistent, show "We're having trouble generating your report -- please try again in a few minutes" |
| Incomplete assessments at report generation | Block report generation; show which assessments still need completion |

### 1.8 Accessibility Requirements

- All questions must be navigable via keyboard (Tab, Enter, Arrow keys)
- Screen reader support: each question has proper ARIA labels; progress is announced on navigation
- Minimum touch target size: 44x44px for all interactive elements
- Color is never the sole indicator -- traffic-light scores also include text labels and icons
- Language selector available on every screen (all 5 supported languages)
- Font size respects system accessibility settings
- High contrast mode support

### 1.9 Edge Cases

- **Twins/multiples:** Each child gets their own profile and assessments; parent assessment is shared
- **Retaking after regression:** Allow full retake; show comparison with previous report ("Your child has grown! Physical readiness improved from 62 to 78")
- **Child with special needs:** Special needs flag on child profile triggers supplementary questions and adjusts scoring weights; report includes tailored recommendations
- **Disagreeing caregivers:** If family alignment score is low, the report surfaces this prominently with specific advice on getting everyone on the same page before starting
- **Very young children (12-18 months):** Assessment is permitted but messaging emphasizes that low scores are normal and not cause for concern
- **Non-primary-language families:** If the parent's preferred language differs from the child's primary language environment, assessment notes this for method recommendations

---

## Feature 2: Method Selection Tool

### 2.1 Overview

After completing the Readiness Assessment, parents choose between two training methods: Intensive (3-5 days) or Gradual (10 weeks). The Method Selection Tool guides this decision through a structured questionnaire and provides an algorithmic recommendation based on the child's personality, family situation, and lifestyle constraints. This feature is **free tier**.

### 2.2 User Interface Description

#### Screen 1: Method Overview

- Side-by-side comparison of both methods in card format:

| | Intensive Method | Gradual Method |
|---|---|---|
| Duration | 3-5 days | 10 weeks |
| Commitment | Full-time, stay home | Integrates into daily routine |
| Best for | Bold/adventurous children, families with flexible schedules | Cautious children, working parents, daycare situations |
| Approach | Full immersion, remove nappies completely | Small progressive steps, gradual nappy reduction |
| Success requirements | At least one caregiver fully available, household consistency | Consistency across environments, patience with slower progress |

- Below comparison: "Not sure which is right for you? Take our Method Preference Quiz" CTA

#### Screen 2: Method Preference Questionnaire

- 10-15 questions, one per screen, same UX pattern as readiness assessment
- Questions cover:

| Factor | Example Questions |
|--------|-------------------|
| Time availability | "Can you or a caregiver take 3-5 consecutive days off from work/commitments?" |
| Child personality fit | "How does your child typically react to big changes?" (pre-populated from personality evaluation if available) |
| Parenting style | "Do you prefer to dive into new challenges quickly or ease into them gradually?" |
| Household logistics | "How many caregivers are regularly involved in your child's routine?", "Does your child attend daycare during the week?" |
| Previous experience | "Have you attempted potty training before? What approach did you use?" |
| Comfort level | "On a scale of 1-5, how comfortable are you with a few intense days of accidents?" |
| Family situation | "Are there upcoming disruptions (holidays, new baby, house move) in the next 3 months?" |

#### Screen 3: Recommendation Result

- Large recommendation card: "We recommend the **[Intensive/Gradual]** Method for [Child Name]"
- Confidence indicator (Strong Match / Good Match / Consider Both)
- Key reasons (3-4 bullet points explaining why this method suits their situation)
- "What this looks like" -- brief day-by-day or week-by-week preview
- "Why not the other method" -- honest assessment of why the alternative may be less suitable
- Hybrid approach callout: "You can also combine elements of both methods. Your personalized e-guide will show you how."
- Two CTAs: "Start with [Recommended Method]" (primary) and "Choose the other method instead" (secondary)
- Both link to Feature 3 (E-Guide Generator) with method pre-selected

### 2.3 Data Model

```
methodSelections
  _id                   Id<"methodSelections">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  questionnaireAnswers  Record<string, any>
  recommendedMethod     "intensive" | "gradual"
  confidence            "strong" | "good" | "consider_both"
  reasons               string[]
  selectedMethod        "intensive" | "gradual" | "hybrid"  // what the parent actually chose
  readinessReportId     Id<"readinessReports"> | null
  _creationTime         number
```

### 2.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `mutation` | `methodSelections:saveAnswers` | Required | Free | Save questionnaire answers |
| `mutation` | `methodSelections:generateRecommendation` | Required | Free | Run recommendation algorithm |
| `mutation` | `methodSelections:confirmSelection` | Required | Free | Record parent's final method choice |
| `query` | `methodSelections:getByChild` | Required | Free | Get method selection for a child |

### 2.5 Recommendation Algorithm

```
Score factors (all normalized to 0-1):

timeAvailability       // High = intensive, Low = gradual
childBoldness          // From personality: bold/spontaneous = intensive, cautious/routine = gradual
disruptionTolerance    // Parent comfort with accidents: High = intensive
householdConsistency   // Number of aligned caregivers: High = intensive
daycareConflict        // Attends daycare during week: penalizes intensive
upcomingDisruptions    // Near-term life changes: penalizes intensive
previousFailedIntensive // Tried intensive before and failed: favors gradual

intensiveScore = (timeAvailability * 0.25) + (childBoldness * 0.20) + (disruptionTolerance * 0.15)
               + (householdConsistency * 0.15) - (daycareConflict * 0.10) - (upcomingDisruptions * 0.10)
               - (previousFailedIntensive * 0.05)

gradualScore = 1 - intensiveScore  // complementary

Confidence:
  |intensiveScore - gradualScore| > 0.3  -> "strong"
  |intensiveScore - gradualScore| > 0.1  -> "good"
  else                                    -> "consider_both"
```

### 2.6 Validation Rules

- Method selection requires a completed readiness report with verdict "ready" or "almost_ready"
- If verdict is "not_yet", method selection is blocked with a message linking back to the readiness report recommendations
- All questionnaire questions must be answered
- Parents can change their selected method at any time before starting the e-guide

### 2.7 Error Handling

| Scenario | Handling |
|----------|----------|
| No readiness report found | Redirect to readiness assessment with explanation |
| Algorithm produces equal scores | Show "consider_both" with detailed pros/cons for each |
| Parent changes mind after starting guide | Allow method switch; warn that guide content will reset; preserve progress tracking data |

### 2.8 Accessibility Requirements

- Comparison table is screen-reader accessible with proper table semantics (th, td, scope)
- Recommendation card uses semantic heading hierarchy
- Confidence indicator uses text + icon (not color alone)
- All interactive elements have focus indicators

### 2.9 Edge Cases

- **Single parent with no support:** Algorithm heavily favors gradual method; messaging acknowledges the difficulty and offers encouragement
- **Both methods score equally:** Present both options with equal weight; "consider_both" confidence; suggest starting with gradual and switching if the child responds well
- **Child personality not yet evaluated:** Questionnaire includes personality-proxy questions; recommendation works without personality data but confidence is capped at "good"
- **Parent insists on non-recommended method:** Allow selection with a gentle notice: "You know your child best. Here are some tips to make [selected method] work for your situation."

---

## Feature 3: Personalized E-Guide Generator

### 3.1 Overview

The Personalized E-Guide is the core premium product. It generates a tailored potty training guide based on the child's profile, personality, family situation, selected method, and any special circumstances. The guide is not a static document -- it evolves as the parent logs progress and encounters challenges. This feature requires **premium subscription**.

### 3.2 User Interface Description

#### Screen 1: Guide Setup Wizard

- Multi-step form collecting any information not already gathered from Features 1 and 2:

| Step | Data Collected |
|------|----------------|
| 1. Child Details | Pre-filled from child profile; confirm or update age, name, special needs |
| 2. Family Situation | Single parent / two parents / extended family / blended family; number of caregivers; languages spoken at home |
| 3. Method Confirmation | Pre-filled from Feature 2; option to change |
| 4. Living Situation | House/apartment, bathroom accessibility, number of bathrooms, garden access |
| 5. Daycare Coordination | Daycare provider details, willingness to coordinate, schedule |
| 6. Previous Attempts | Number of attempts, methods tried, what went wrong, child's reaction |
| 7. Equipment Check | Interactive checklist: potty seat, step stool, training pants, waterproof mattress protector, cleaning supplies |
| 8. Start Date | Calendar picker for training start date |

- Each step shows: why we're asking, how it personalizes the guide

#### Screen 2: Guide Home (Main Navigation)

- Top section: child name, training day/week counter, current phase label
- Navigation cards:
  - **Preparation Phase** (before start date) -- checklist, equipment, caregiver briefing guide
  - **Daily Plan** -- today's specific tasks, schedule, focus areas
  - **Weekly Overview** (gradual method) / **Day-by-Day Plan** (intensive method)
  - **Milestone Guide** -- what to expect and when
  - **Troubleshooting** -- searchable library of common challenges with solutions
  - **Equipment Guide** -- recommended products with explanations
- Floating action button: "Log an event" (quick access to progress tracking)

#### Screen 3: Daily Plan View

- Time-of-day structured schedule:
  - Morning routine (wake-up potty sit, breakfast routine)
  - Mid-morning (scheduled sits, activity suggestions)
  - Lunch / afternoon (post-meal sits, nap handling)
  - Evening (dinner routine, bedtime preparation)
  - Night (nighttime approach based on current phase)
- Each time block includes:
  - What to do (specific instructions)
  - What to say (example phrases matching personality type)
  - What NOT to do (common mistakes to avoid)
  - Estimated duration
- Cards are collapsible; completed items can be checked off
- Adaptive: if the parent logged an accident in the morning, afternoon guidance may adjust

#### Screen 4: Milestone Guide

- Visual timeline showing expected milestones:
  - First successful potty sit
  - First self-initiated request
  - First dry morning
  - First dry nap
  - Consecutive dry days (3, 7, 14)
  - Pooing on potty (often separate, later milestone)
  - Nighttime dryness
  - Full independence
- Each milestone has: description, "you'll know they're there when...", celebration ideas (NOT rewards -- intrinsic motivation), "if this hasn't happened yet" guidance
- Milestones adjust based on method and child personality

### 3.3 Data Model

```
eGuides
  _id                   Id<"eGuides">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  methodSelectionId     Id<"methodSelections">
  method                "intensive" | "gradual" | "hybrid"
  status                "setup" | "preparation" | "active" | "completed" | "paused"
  setupData             {
                          familySituation: string,
                          caregiverCount: number,
                          homeSituation: object,
                          daycareInfo: object,
                          previousAttempts: object,
                          equipmentChecklist: Record<string, boolean>,
                        }
  startDate             string                     // ISO date
  currentPhase          string                     // e.g., "day_1", "week_3", "maintenance"
  personalizations      {
                          personalityType: string,
                          language: string,
                          familyType: string,
                          specialAdaptations: string[],
                        }
  _creationTime         number

guideContent
  _id                   Id<"guideContent">
  eGuideId              Id<"eGuides">
  contentType           "daily_plan" | "milestone" | "troubleshooting" | "preparation" | "equipment"
  phase                 string                     // e.g., "day_1", "week_3"
  dayNumber             number | null
  weekNumber            number | null
  title                 string
  sections              {
                          timeBlock?: string,
                          instructions: string,
                          examplePhrases: string[],
                          avoidList: string[],
                          duration?: string,
                          personalityNotes?: string,
                        }[]
  isAdaptive            boolean                    // true if content was modified based on progress
  adaptationSource      string | null              // e.g., "regression_detected", "milestone_achieved"
  language              "nl" | "en" | "ar" | "tr" | "pl"
  _creationTime         number

guideTemplates
  _id                   Id<"guideTemplates">
  method                "intensive" | "gradual" | "hybrid"
  personalityType       "bold" | "cautious" | "routine" | "spontaneous" | "any"
  phase                 string
  contentType           string
  templateBody          string                     // template with placeholders
  language              "nl" | "en" | "ar" | "tr" | "pl"
  _creationTime         number
```

### 3.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `mutation` | `eGuides:create` | Required | Premium | Initialize e-guide with setup data |
| `mutation` | `eGuides:updateSetup` | Required | Premium | Update setup wizard data |
| `mutation` | `eGuides:activate` | Required | Premium | Move from setup/preparation to active |
| `mutation` | `eGuides:pause` | Required | Premium | Pause the guide (preserves state) |
| `mutation` | `eGuides:resume` | Required | Premium | Resume a paused guide |
| `mutation` | `eGuides:switchMethod` | Required | Premium | Change method mid-journey |
| `query` | `eGuides:getActive` | Required | Premium | Get the active guide for a child |
| `query` | `guideContent:getForPhase` | Required | Premium | Get all content for current phase |
| `query` | `guideContent:getDailyPlan` | Required | Premium | Get today's daily plan |
| `query` | `guideContent:getMilestones` | Required | Premium | Get milestone timeline |
| `query` | `guideContent:searchTroubleshooting` | Required | Premium | Search troubleshooting library |
| `action` | `guideContent:generateAdaptive` | Required | Premium | Generate adapted content based on progress data |

### 3.5 Content Generation Strategy

Guide content is generated through a template system, not real-time LLM generation:

1. **Template database** contains pre-written content blocks for every combination of method x personality x phase x content type
2. **Personalization engine** (Convex mutation) selects and assembles templates, filling placeholders with child name, specific family details, etc.
3. **Adaptive content** is triggered by progress tracking events (Feature 4): regressions, plateaus, or faster-than-expected progress cause the system to swap in alternative content blocks
4. **Expert review**: all template content is written and reviewed by the Go Potty expert team (psychologists, nurses, coaches)

This approach ensures content quality, avoids LLM hallucination risks for child health content, and allows full multilingual support through professional translation.

### 3.6 Validation Rules

- E-guide creation requires an active premium subscription
- Start date must be in the future (at least 1 day from today) to allow preparation phase
- Equipment checklist must have at least the essential items checked (potty seat or toilet insert, step stool)
- Method switch is allowed but limited to 2 switches per guide to prevent thrashing
- Paused guides auto-expire after 90 days with a reminder notification at 60 days

### 3.7 Error Handling

| Scenario | Handling |
|----------|----------|
| Subscription expires mid-guide | Grace period of 7 days; guide content remains readable but adaptive updates stop; progress tracking continues |
| Template not found for combination | Fall back to "any" personality template; log as content gap for editorial team |
| Adaptive content generation fails | Keep current content; schedule retry; show notice: "We're updating your guide based on recent progress" |
| Start date passes without activation | Send push notification reminder; guide remains in preparation state until manually activated |

### 3.8 Accessibility Requirements

- Daily plan view supports screen readers with time-block landmarks
- Collapsible sections use proper ARIA expanded/collapsed states
- Checklist items have accessible labels
- Timeline visualization has text-based alternative view
- All example phrases are copyable (for parents using screen readers or translation tools)
- Content follows WCAG 2.1 AA reading level guidelines

### 3.9 Edge Cases

- **Twins being trained simultaneously:** Separate guides per child; shared preparation checklist; daily plan can show both children's schedules interleaved
- **Switching from intensive to gradual mid-training:** System recalculates phase based on days elapsed and progress logged; content bridges the transition
- **Child with autism or developmental delays:** Special needs flag triggers supplementary content modules; adjusted milestones with longer expected timelines; sensory-specific guidance
- **Non-English family using English guide:** Language can be switched at any time; progress data is preserved; only content is swapped
- **Guide completed but nighttime training not done:** Guide can remain in "maintenance" phase focused on nighttime; does not auto-complete until parent confirms

---

## Feature 4: Progress Tracking Dashboard

### 4.1 Overview

The Progress Tracking Dashboard is the data backbone of the training journey. Parents log events throughout the day (successes, accidents, potty sits), and the system analyzes patterns, detects regressions, and feeds data into the adaptive e-guide (Feature 3) and tips engine (Feature 5). This feature requires **premium subscription**.

### 4.2 User Interface Description

#### Screen 1: Quick Logger (Primary Interaction)

- Accessible from floating action button on all premium screens
- Large, thumb-friendly buttons:
  - **Successful Wee** (green)
  - **Successful Poo** (green)
  - **Accident - Wee** (neutral amber -- never red/negative)
  - **Accident - Poo** (neutral amber)
  - **Dry Check** (blue) -- child was checked and was dry
  - **Potty Sit (no result)** (neutral) -- sat on potty but nothing happened
- Each button tap opens a brief detail form:
  - Time (defaults to now, adjustable)
  - Location (home / daycare / out and about / grandparents / other)
  - Initiated by (child asked / parent prompted / scheduled)
  - Notes (optional free text)
- One-tap logging for speed; detail form is optional

#### Screen 2: Daily View

- Timeline view of today's events, chronologically ordered
- Color-coded event dots on a vertical timeline
- Summary stats at top: "Today: 4 successes, 1 accident, 6 potty sits"
- Success rate percentage prominently displayed
- Quick-add button to log missed events retroactively
- Day selector to view previous days

#### Screen 3: Progress Dashboard

- **Summary Cards** at top:
  - Current dry streak (days)
  - Longest dry streak
  - This week's success rate
  - Total successful uses

- **Progress Chart**: Line graph showing daily success rate over time (7-day, 30-day, all-time views)

- **Separate Tracking Panels** (tabbed or segmented control):
  - Daytime Wee Progress
  - Daytime Poo Progress
  - Nighttime Dryness
  - Each panel has its own success rate and trend indicator

- **Pattern Analysis Section**:
  - "Best time of day" -- when most successes occur
  - "Challenging time" -- when most accidents occur
  - "Trigger insights" -- correlations detected (e.g., "Accidents are more common after daycare")

- **Milestones Achieved**: Visual badges/checkmarks for reached milestones

#### Screen 4: Weekly/Monthly Report

- Auto-generated summary of the past week/month
- Key metrics comparison (this week vs. last week)
- Trend arrows (improving, stable, regressing)
- Regression alerts with guidance links
- Plateau detection with encouragement and next-step suggestions
- Shareable summary (for co-parent, grandparent, or nursery)

### 4.3 Data Model

```
progressEvents
  _id                   Id<"progressEvents">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  eGuideId              Id<"eGuides">
  eventType             "success_wee" | "success_poo" | "accident_wee" | "accident_poo"
                        | "dry_check" | "potty_sit_no_result"
  eventTime             number                     // timestamp
  location              "home" | "daycare" | "out" | "grandparents" | "other"
  initiatedBy           "child" | "parent" | "scheduled"
  isNighttime           boolean
  notes                 string | null
  _creationTime         number

  // Indexes
  index("by_child_date", ["childProfileId", "eventTime"])
  index("by_guide", ["eGuideId", "eventTime"])

progressAnalytics
  _id                   Id<"progressAnalytics">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  eGuideId              Id<"eGuides">
  periodType            "daily" | "weekly" | "monthly"
  periodStart           string                     // ISO date
  periodEnd             string                     // ISO date
  metrics               {
                          totalSuccesses: number,
                          totalAccidents: number,
                          totalPottySits: number,
                          successRateWee: number,    // 0-100
                          successRatePoo: number,
                          dryDays: number,
                          dryNights: number,
                          longestDryStreak: number,
                          childInitiatedCount: number,
                          bestTimeOfDay: string | null,
                          worstTimeOfDay: string | null,
                        }
  trendDirection        "improving" | "stable" | "regressing"
  alerts                string[]                   // e.g., ["regression_detected", "plateau_3_days"]
  _creationTime         number

milestoneAchievements
  _id                   Id<"milestoneAchievements">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  eGuideId              Id<"eGuides">
  milestoneType         "first_success_wee" | "first_success_poo" | "first_self_initiated"
                        | "first_dry_morning" | "first_dry_nap" | "dry_streak_3"
                        | "dry_streak_7" | "dry_streak_14" | "nighttime_dry"
                        | "full_independence" | "custom"
  customLabel           string | null              // for custom milestones
  achievedAt            number                     // timestamp
  _creationTime         number
```

### 4.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `mutation` | `progressEvents:log` | Required | Premium | Log a new event |
| `mutation` | `progressEvents:update` | Required | Premium | Edit a logged event |
| `mutation` | `progressEvents:delete` | Required | Premium | Delete a logged event |
| `query` | `progressEvents:getByDay` | Required | Premium | Get all events for a specific day |
| `query` | `progressEvents:getByRange` | Required | Premium | Get events within a date range |
| `query` | `progressAnalytics:getLatest` | Required | Premium | Get most recent analytics for each period type |
| `query` | `progressAnalytics:getHistory` | Required | Premium | Get analytics history for charting |
| `mutation` | `progressAnalytics:recalculate` | Required | Premium | Trigger analytics recalculation |
| `query` | `milestoneAchievements:getAll` | Required | Premium | Get all achieved milestones |
| `mutation` | `milestoneAchievements:addCustom` | Required | Premium | Add a custom milestone |
| `action` | `progressAnalytics:generateWeeklyReport` | Required | Premium | Generate shareable weekly report |

### 4.5 Analytics Computation

Analytics are computed by a scheduled Convex mutation that runs nightly (see `03_TECHNICAL_ARCHITECTURE.md` for cron configuration). Real-time summary stats (today's counts) are computed client-side from the reactive `progressEvents:getByDay` query.

Pattern detection logic:

- **Regression:** Success rate drops below 50% for 3+ consecutive days after previously being above 70%
- **Plateau:** Success rate stays within +/-5% for 7+ consecutive days below 90%
- **Best/worst time:** Calculated from hourly bucketing of events across the past 7 days
- **Trigger identification:** Location and initiatedBy correlations surfaced when a pattern has statistical significance (at least 10 events in the category)

### 4.6 Validation Rules

- Event time cannot be more than 48 hours in the past (prevents bulk back-dating)
- Event time cannot be in the future
- Maximum 50 events per child per day (prevents spam/accidental duplicates)
- Duplicate detection: warn if same event type logged within 5 minutes
- Nighttime flag is automatically set for events between 8 PM and 6 AM (adjustable per family)

### 4.7 Error Handling

| Scenario | Handling |
|----------|----------|
| Rapid duplicate logging | Show confirmation: "You logged a successful wee 2 minutes ago. Log another?" |
| Analytics computation failure | Serve last successful analytics; retry computation; never show stale data without indicator |
| Event deletion after analytics computed | Mark analytics as dirty; recompute on next cycle |
| No events logged for 3+ days | Send gentle reminder notification; do not mark as regression |

### 4.8 Accessibility Requirements

- Quick logger buttons have distinct shapes in addition to colors
- Chart data is available as an accessible data table alternative
- Timeline events can be navigated with swipe gestures and keyboard
- Summary stats use screen-reader-friendly number formatting
- Trend arrows have text labels ("improving", "stable", "needs attention")

### 4.9 Edge Cases

- **Multiple caregivers logging simultaneously:** Events are stored independently; deduplication runs on display (events within 2 minutes of same type are grouped with a note)
- **Daycare logging:** Caregiver can be granted limited logging access via a share code; logs appear in parent's dashboard with "logged by daycare" indicator
- **Timezone changes (travel):** Events store UTC timestamps; display adjusts to device timezone; analytics use the child's home timezone
- **Child regresses after illness:** Regression detection accounts for gaps in logging; system does not flag regression if there is a 3+ day logging gap followed by lower success rate (treats it as a restart)
- **Night-time tracking starts later:** Nighttime panel shows "Not yet tracking" until parent enables nighttime tracking; does not penalize overall success rate

---

## Feature 5: Tips & Reminders System

### 5.1 Overview

The Tips & Reminders System delivers personalized, contextual guidance throughout the training journey. Tips are not generic -- they are selected based on the child's personality, current training phase, recent progress data, and specific challenges reported. Reminders keep the training on track without being intrusive. This feature requires **premium subscription**.

### 5.2 User Interface Description

#### Screen 1: Tips Feed (In-App)

- Card-based feed, similar to a social media timeline but all content is expert-curated
- Each card contains:
  - Category icon and label (e.g., "Daily Tip", "Challenge Help", "Encouragement")
  - Tip title
  - Tip body (2-4 sentences)
  - "Helpful?" thumbs up/down for feedback
  - "Save" bookmark icon
  - "Share" button (generates shareable text for co-parent)
- Feed is personalized; order reflects relevance to current situation
- Filter tabs at top: All | Daily | Challenges | Encouragement | Saved

#### Screen 2: Tip Categories (Browse)

- Grid of category cards:
  - **Getting Started** -- preparation tips, equipment advice
  - **Potty Sits** -- making sits comfortable, timing, duration
  - **Accidents** -- how to handle without shame, cleanup, language to use
  - **Poo Challenges** -- withholding, fear, constipation-related issues
  - **Nighttime** -- when to start, bedtime routines, managing wet beds
  - **Daycare** -- coordinating with providers, consistency across environments
  - **Regression** -- why it happens, how to respond, when to worry
  - **Siblings** -- managing jealousy, preventing regression in older child
  - **Travel** -- public bathrooms, portable potty, road trips
  - **Celebrations** -- intrinsic motivation ideas (NOT rewards)
- Each category opens a scrollable list of tips

#### Screen 3: Notification/Reminder Settings

- Toggle groups:
  - **Potty sit reminders** -- frequency (every 30/45/60/90 minutes), active hours, days of week
  - **Hygiene reminders** -- hand washing prompts after potty use
  - **Daily tip** -- preferred delivery time
  - **Encouragement** -- end-of-day summary notification
  - **Milestone alerts** -- notify when a milestone is detected
  - **Regression alerts** -- notify if regression pattern detected
- Quiet hours setting
- Notification tone/vibration preferences
- "Snooze all" for holidays or breaks

### 5.3 Data Model

```
tips
  _id                   Id<"tips">
  category              "getting_started" | "potty_sits" | "accidents" | "poo_challenges"
                        | "nighttime" | "daycare" | "regression" | "siblings" | "travel"
                        | "celebrations" | "encouragement" | "general"
  title                 string
  body                  string
  applicablePhases      string[]                   // e.g., ["day_1", "day_2", "week_1"]
  applicableMethods     ("intensive" | "gradual" | "hybrid" | "any")[]
  personalityTypes      ("bold" | "cautious" | "routine" | "spontaneous" | "any")[]
  triggerConditions     {
                          minDayInTraining?: number,
                          maxDayInTraining?: number,
                          recentAccidents?: number,    // show if accidents > N in last 24h
                          recentSuccesses?: number,
                          regressionDetected?: boolean,
                          plateauDetected?: boolean,
                          challengeReported?: string,  // specific challenge type
                        } | null
  priority              number                     // 1-10, for feed ordering
  language              "nl" | "en" | "ar" | "tr" | "pl"
  _creationTime         number

tipDeliveries
  _id                   Id<"tipDeliveries">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  tipId                 Id<"tips">
  deliveryChannel       "in_app" | "push_notification"
  deliveredAt           number
  readAt                number | null
  feedback              "helpful" | "not_helpful" | null
  saved                 boolean
  _creationTime         number

reminderSchedules
  _id                   Id<"reminderSchedules">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  reminderType          "potty_sit" | "hygiene" | "daily_tip" | "encouragement"
                        | "milestone_alert" | "regression_alert"
  enabled               boolean
  frequency             number | null              // minutes, for recurring reminders
  preferredTime         string | null              // HH:mm, for scheduled reminders
  activeHoursStart      string | null              // HH:mm
  activeHoursEnd        string | null              // HH:mm
  activeDays            number[]                   // 0=Sun, 6=Sat
  quietHoursStart       string | null
  quietHoursEnd         string | null
  _creationTime         number
```

### 5.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `query` | `tips:getFeed` | Required | Premium | Get personalized tip feed for a child |
| `query` | `tips:getByCategory` | Required | Premium | Browse tips by category |
| `query` | `tips:getSaved` | Required | Premium | Get bookmarked tips |
| `mutation` | `tipDeliveries:markRead` | Required | Premium | Mark a tip as read |
| `mutation` | `tipDeliveries:submitFeedback` | Required | Premium | Submit helpful/not helpful |
| `mutation` | `tipDeliveries:toggleSave` | Required | Premium | Bookmark or un-bookmark a tip |
| `query` | `reminderSchedules:getAll` | Required | Premium | Get all reminder settings |
| `mutation` | `reminderSchedules:update` | Required | Premium | Update reminder settings |
| `mutation` | `reminderSchedules:snoozeAll` | Required | Premium | Snooze all reminders for N hours |

### 5.5 Tip Selection Algorithm

The tip feed is constructed by a Convex query that:

1. Retrieves the child's current training phase, method, personality type
2. Retrieves the last 48 hours of progress events
3. Filters the `tips` table by: applicable phase, method, personality
4. Applies trigger conditions against progress data
5. Excludes already-delivered tips (from `tipDeliveries`) unless > 14 days ago
6. Sorts by: trigger match strength (specific challenges first), priority, recency
7. Returns top 10 tips

Push notifications are dispatched by a scheduled action that runs every 15 minutes, checking reminder schedules against current time and delivering the highest-priority undelivered tip.

### 5.6 Validation Rules

- Potty sit reminder frequency: minimum 15 minutes, maximum 180 minutes
- Active hours must span at least 4 hours
- Quiet hours cannot overlap with active hours for potty sit reminders
- Maximum 20 push notifications per day per user (prevent notification fatigue)
- Tip feedback can only be submitted once per tip delivery (no vote changing)

### 5.7 Error Handling

| Scenario | Handling |
|----------|----------|
| Push notification delivery failure | Retry up to 3 times with exponential backoff; fall back to in-app delivery |
| No matching tips for current situation | Show general encouragement tips; log content gap |
| User disables all notifications | Respect choice; continue in-app feed; periodic in-app prompt (max once per week) asking if they'd like to re-enable |

### 5.8 Accessibility Requirements

- Tip cards have sufficient contrast ratios (WCAG 2.1 AA)
- Feedback buttons (thumbs up/down) have text labels for screen readers
- Notification content is compatible with screen reader announcement
- Timer-based reminders can be adjusted for users who need more time
- Categories have descriptive labels, not just icons

### 5.9 Edge Cases

- **Parent turns off all reminders then forgets to log:** After 3 days of no logging and reminders off, send a single gentle notification: "Haven't heard from you in a few days -- everything okay?"
- **Bilingual household:** Tips can be delivered in one language while the guide is in another; language setting is per-feature
- **Challenge reported but no matching tip:** Queue for expert review (coaching portal); deliver closest-match tip with "Contact a coach for personalized help" CTA
- **Conflicting tips:** Tip database includes mutual exclusion flags; if tip A is delivered, incompatible tip B is suppressed for 48 hours

---

## Feature 6: Premium Coaching Portal

### 6.1 Overview

The Premium Coaching Portal connects parents with qualified potty training experts for personalized, one-on-one guidance. Coaches include educationalists, children's psychologists, children's coaches, and licensed professionals with 5-10+ years of experience. Coaching is included in the premium subscription and continues until the child achieves success. This feature requires **premium subscription**.

### 6.2 User Interface Description

#### Screen 1: Coaching Home

- Welcome message explaining the coaching service
- Expert credentials display: "Your coaches are licensed professionals with 5-10+ years of experience in child development"
- Three consultation options presented as cards:
  - **Email Consultation** -- "Describe your situation and receive expert advice within 24-48 hours"
  - **Phone Call** -- "Schedule a call with an expert for real-time guidance"
  - **Video Call** -- "Face-to-face consultation for complex situations" (marked as "Coming Soon" if not yet available)
- Active consultations section showing open threads
- Past consultations section with searchable history

#### Screen 2: Email Consultation Thread

- Messaging interface (similar to email but within the app)
- Pre-populated context panel (collapsible) showing:
  - Child name, age, personality type
  - Current method and phase
  - Recent progress summary (last 7 days)
  - Active challenges
- Message composer with:
  - Rich text input
  - Ability to attach progress screenshots or photos
  - Category selector: General question / Specific challenge / Regression help / Method change / Emergency
- Thread view showing full conversation history
- Expected response time indicator: "Typical response within 24-48 hours"

#### Screen 3: Call Scheduling

- Calendar view showing available time slots
- Time zone auto-detection with manual override
- Call duration options: 15 minutes (quick question), 30 minutes (detailed discussion)
- Pre-call questionnaire: "Briefly describe what you'd like to discuss so your coach can prepare"
- Confirmation screen with calendar invite download
- Post-call summary delivered to the consultation thread

#### Screen 4: Money-Back Guarantee Info

- Clear display of the guarantee policy:
  - "100% money-back guarantee -- no questions asked"
  - "If you're not satisfied with the coaching, email hello@gopottynow.com"
  - "Full refund processed within 14 business days"
- FAQ about the guarantee

### 6.3 Data Model

```
coachingConsultations
  _id                   Id<"coachingConsultations">
  userId                Id<"users">
  childProfileId        Id<"childProfiles">
  eGuideId              Id<"eGuides"> | null
  consultationType      "email" | "phone" | "video"
  status                "open" | "awaiting_response" | "responded" | "scheduled" | "completed" | "closed"
  category              "general" | "challenge" | "regression" | "method_change" | "emergency"
  assignedCoachId       Id<"coaches"> | null
  scheduledAt           number | null              // for calls
  callDuration          15 | 30 | null
  contextSnapshot       {
                          childAge: string,
                          personalityType: string,
                          method: string,
                          currentPhase: string,
                          recentSuccessRate: number,
                          activeChallenges: string[],
                        }
  satisfactionRating    number | null              // 1-5, post-consultation
  _creationTime         number

coachingMessages
  _id                   Id<"coachingMessages">
  consultationId        Id<"coachingConsultations">
  senderId              Id<"users"> | Id<"coaches">
  senderRole            "parent" | "coach"
  content               string
  attachments           { fileName: string, storageKey: string, mimeType: string }[]
  readAt                number | null
  _creationTime         number

coaches
  _id                   Id<"coaches">
  name                  string
  title                 string                     // e.g., "Children's Psychologist"
  qualifications        string[]
  yearsExperience       number
  languages             ("nl" | "en" | "ar" | "tr" | "pl")[]
  specializations       string[]                   // e.g., ["regression", "special_needs", "nighttime"]
  availability          {
                          dayOfWeek: number,
                          slots: { start: string, end: string }[],
                        }[]
  maxActiveConsultations number
  isActive              boolean
  _creationTime         number
```

### 6.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `mutation` | `coachingConsultations:create` | Required | Premium | Start a new consultation |
| `query` | `coachingConsultations:getActive` | Required | Premium | Get open consultations |
| `query` | `coachingConsultations:getHistory` | Required | Premium | Get past consultations |
| `mutation` | `coachingMessages:send` | Required | Premium | Send a message in a consultation |
| `query` | `coachingMessages:getByConsultation` | Required | Premium | Get all messages in a thread |
| `query` | `coaches:getAvailableSlots` | Required | Premium | Get available call time slots |
| `mutation` | `coachingConsultations:scheduleCall` | Required | Premium | Book a call slot |
| `mutation` | `coachingConsultations:cancelCall` | Required | Premium | Cancel a scheduled call |
| `mutation` | `coachingConsultations:rate` | Required | Premium | Submit satisfaction rating |
| `mutation` | `coachingConsultations:close` | Required | Premium | Close a consultation thread |

### 6.5 Coach Assignment Logic

1. When a new consultation is created, the system filters coaches by: language match, availability, specialization match (based on consultation category and active challenges)
2. Among matching coaches, the one with the fewest active consultations is assigned
3. If no coach matches all criteria, language match takes priority, then availability
4. Emergency consultations are flagged and pushed to the top of all assigned coaches' queues
5. If the parent has an existing relationship with a coach (previous consultations), the same coach is preferred

### 6.6 Validation Rules

- Maximum 3 active (open/awaiting) email consultations per user at a time
- Call scheduling requires at least 24 hours advance notice
- Call cancellation must be at least 4 hours before the scheduled time
- Message attachments: maximum 5 files, maximum 10MB each, allowed types: jpg, png, pdf
- Satisfaction rating can only be submitted once per consultation
- Consultations auto-close after 14 days of inactivity with a notification

### 6.7 Error Handling

| Scenario | Handling |
|----------|----------|
| No coach available for language | Show message: "Our [language] coaches are currently at capacity. We'll notify you when one becomes available. In the meantime, would you like to consult in English?" |
| Coach response exceeds 48 hours | Auto-escalate to coaching manager; send parent notification acknowledging the delay |
| Call no-show (parent) | Mark consultation as "missed"; allow rescheduling within 48 hours |
| Call no-show (coach) | Auto-apologize to parent; reschedule with priority; escalate internally |
| Attachment upload failure | Retry up to 3 times; allow text-only message submission; "Try attaching again" option |

### 6.8 Accessibility Requirements

- Messaging interface is fully keyboard-navigable
- Messages are announced by screen reader in chronological order
- Call scheduling calendar supports keyboard navigation and screen reader date announcement
- Attachment descriptions are required for images (alt text)
- Video calls (when available) must support closed captioning

### 6.9 Edge Cases

- **Parent requests refund via coaching portal:** Coach provides the hello@gopottynow.com email; coach cannot process refunds directly
- **Coach identifies medical concern:** Predefined response template advising the parent to consult their pediatrician; consultation notes flagged for follow-up
- **Language mismatch after assignment:** If parent switches app language, allow reassignment to a coach who speaks the new language
- **Parent becomes abusive in messages:** Moderation flag system; coach can escalate to manager; coaching code of conduct displayed to both parties
- **Consultation spans subscription expiry:** Active consultations continue until closed, even if subscription lapses (honor the "until success" commitment)

---

## Feature 7: Community Features

### 7.1 Overview

The Community Features connect parents going through the potty training journey, enabling experience sharing, mutual encouragement, and the discovery of parents in similar situations. The community is moderated for safety and privacy, with strict rules around child information. Community access is available to **premium subscribers**.

### 7.2 User Interface Description

#### Screen 1: Community Home

- Top section: "Welcome to the Go Potty Community" with community guidelines link
- Feed of recent posts, sorted by recency with engagement weighting
- Post types indicated by icons:
  - **Question** (question mark icon)
  - **Success Story** (celebration icon)
  - **Tip** (lightbulb icon)
  - **Support Request** (heart icon)
- Each post card shows:
  - Author display name (never child name by default)
  - Post type badge
  - Title and preview text
  - Engagement counts (likes, replies)
  - Time posted
- Floating "New Post" button
- Filter/sort options: All | Questions | Success Stories | Tips | Support

#### Screen 2: Topic Groups

- Curated groups that parents can join:
  - **By Method:** "Intensive Method Support" / "Gradual Method Support"
  - **By Challenge:** "Poo Withholding Support" / "Nighttime Training" / "Regression Support" / "Daycare Coordination"
  - **By Situation:** "Single Parents" / "Working Parents" / "Special Needs" / "Twins & Multiples"
  - **By Language:** Groups in each of the 5 supported languages
- Each group shows: member count, recent activity, description
- Join/leave toggle

#### Screen 3: Post Detail

- Full post content
- Author info (display name, how far into their journey, child age range -- NOT exact age)
- Reply thread (flat or nested, configurable)
- Reaction options: Heart, High Five, Hug, "Me Too"
- "Report" flag button
- Related posts suggestion at bottom

#### Screen 4: Create Post

- Post type selector (Question, Success Story, Tip, Support Request)
- Title field (required)
- Body field (rich text with basic formatting)
- Topic group selector (optional, can post to multiple groups)
- Privacy toggle: "Share my training method and phase" (default off)
- Reminder banner: "For your child's safety, please don't share their name, photos, or identifying details"
- Preview before posting

#### Screen 5: User Profile (Community)

- Display name (user-chosen, not real name)
- Journey badge: "Day 3 of Intensive Training" or "Week 6 of Gradual Training" (opt-in)
- Post history
- Groups joined
- Reputation: number of helpful marks received
- Privacy settings link

### 7.3 Data Model

```
communityPosts
  _id                   Id<"communityPosts">
  userId                Id<"users">
  displayName           string
  postType              "question" | "success_story" | "tip" | "support_request"
  title                 string
  body                  string
  groupIds              Id<"communityGroups">[]
  sharedContext         {                          // only if user opted in
                          method?: string,
                          phase?: string,
                          childAgeRange?: string,  // e.g., "2-3 years" (never exact)
                        } | null
  likeCount             number
  replyCount            number
  isModerated           boolean                    // true if flagged and reviewed
  moderationStatus      "approved" | "removed" | "pending" | null
  isPinned              boolean
  language              "nl" | "en" | "ar" | "tr" | "pl"
  _creationTime         number

  // Indexes
  index("by_group", ["groupIds"])
  index("by_user", ["userId"])
  index("by_type", ["postType", "_creationTime"])

communityReplies
  _id                   Id<"communityReplies">
  postId                Id<"communityPosts">
  userId                Id<"users">
  displayName           string
  parentReplyId         Id<"communityReplies"> | null   // for nested replies
  body                  string
  likeCount             number
  isModerated           boolean
  moderationStatus      "approved" | "removed" | "pending" | null
  _creationTime         number

communityGroups
  _id                   Id<"communityGroups">
  name                  string
  description           string
  category              "method" | "challenge" | "situation" | "language"
  language              "nl" | "en" | "ar" | "tr" | "pl" | "all"
  memberCount           number
  isActive              boolean
  _creationTime         number

communityMemberships
  _id                   Id<"communityMemberships">
  userId                Id<"users">
  groupId               Id<"communityGroups">
  _creationTime         number

communityReactions
  _id                   Id<"communityReactions">
  userId                Id<"users">
  targetType            "post" | "reply"
  targetId              Id<"communityPosts"> | Id<"communityReplies">
  reactionType          "heart" | "high_five" | "hug" | "me_too"
  _creationTime         number

communityReports
  _id                   Id<"communityReports">
  reporterId            Id<"users">
  targetType            "post" | "reply" | "user"
  targetId              string
  reason                "inappropriate" | "child_safety" | "spam" | "harassment" | "misinformation" | "other"
  description           string | null
  status                "pending" | "reviewed" | "actioned" | "dismissed"
  reviewedBy            Id<"users"> | null         // admin/moderator
  _creationTime         number
```

### 7.4 API Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `query` | `communityPosts:getFeed` | Required | Premium | Get paginated post feed |
| `query` | `communityPosts:getByGroup` | Required | Premium | Get posts in a specific group |
| `query` | `communityPosts:getById` | Required | Premium | Get single post with replies |
| `mutation` | `communityPosts:create` | Required | Premium | Create a new post |
| `mutation` | `communityPosts:update` | Required | Premium | Edit own post (within 24 hours) |
| `mutation` | `communityPosts:delete` | Required | Premium | Delete own post |
| `mutation` | `communityReplies:create` | Required | Premium | Reply to a post |
| `mutation` | `communityReplies:delete` | Required | Premium | Delete own reply |
| `mutation` | `communityReactions:toggle` | Required | Premium | Add or remove a reaction |
| `query` | `communityGroups:getAll` | Required | Premium | List all groups |
| `mutation` | `communityMemberships:join` | Required | Premium | Join a group |
| `mutation` | `communityMemberships:leave` | Required | Premium | Leave a group |
| `mutation` | `communityReports:create` | Required | Premium | Report content |
| `query` | `communityReports:getPending` | Required | Admin | Get pending reports for moderation |
| `mutation` | `communityReports:review` | Required | Admin | Review and action a report |

### 7.5 Moderation System

**Automated moderation (pre-publish):**
1. Text is scanned for: child names (cross-referenced against child profiles), explicit content, external links (blocked by default), personal information patterns (phone numbers, addresses, emails)
2. Posts containing flagged content are held for manual review
3. First-time posters have their first 3 posts automatically queued for review

**Manual moderation:**
1. Reported content enters a moderation queue visible to admin users
2. Moderators can: approve, remove (with reason notification to author), or edit (with notification)
3. Users with 3+ removed posts receive a warning; 5+ results in community suspension

**Community guidelines** are displayed on first visit and accessible from every screen. Key rules:
- No child names, photos, or identifying information
- No medical advice (direct to professionals)
- No promotion of reward-based methods
- No commercial promotion
- Be kind and supportive

### 7.6 Validation Rules

- Display name: 3-30 characters, no special characters, profanity filter applied
- Post title: 5-100 characters
- Post body: 10-5000 characters
- Reply body: 5-2000 characters
- Maximum 10 posts per user per day
- Maximum 50 replies per user per day
- Posts can be edited within 24 hours of creation; edits are marked with "edited" label
- Reactions: one reaction type per user per target (can change, not stack)

### 7.7 Error Handling

| Scenario | Handling |
|----------|----------|
| Post flagged by automated moderation | "Your post is being reviewed by our team. This usually takes less than 24 hours." |
| User attempts to post child name | Pre-publish warning: "It looks like you may have included a child's name. For safety, we recommend using initials or a nickname." (not blocked, just warned) |
| Community group has no members | Show group with "Be the first to join!" messaging; seed with curated content |
| Post deleted by moderator | Author sees: "Your post was removed because [reason]. If you believe this was an error, contact support." |

### 7.8 Accessibility Requirements

- Posts and replies use semantic HTML (article, section, heading hierarchy)
- Reaction buttons have text labels visible to screen readers
- Report flow is keyboard-accessible
- Community feed supports infinite scroll with proper focus management
- Images in posts require alt text (enforced at creation)

### 7.9 Edge Cases

- **Cross-language interaction:** Posts are tagged with language; users see their language by default but can toggle "Show all languages"; no auto-translation (to avoid mistranslation of sensitive content)
- **Parent shares harmful advice (e.g., punishment):** Flagged by automated keyword detection; removed promptly; educational message sent about science-based approaches
- **Viral success story:** Pinning system allows moderators to feature exceptional stories; rate limiting prevents engagement spam
- **User deletes account:** Posts are anonymized ("Deleted User") but not removed; replies remain intact
- **Sensitive topics (bedwetting, shame, family conflict):** "Support Request" post type has higher moderation priority and supportive auto-response: "Remember, every child develops at their own pace"

---

## Feature 8: Analytics Dashboard (B2B)

### 8.1 Overview

The Analytics Dashboard serves two B2B audiences: nurseries/daycare centers and municipalities/government bodies. Nurseries track individual children's progress, manage staff training, and demonstrate cost savings. Municipalities track aggregate outcomes across their region, including environmental impact (nappy waste reduction) and equity metrics. These dashboards are **separate products** with their own access controls and pricing (see `01_PRD.md` for B2B pricing model).

### 8.2 User Interface Description

#### Nursery Dashboard

##### Screen 1: Nursery Overview

- Top metrics bar:
  - Total enrolled children
  - Active trainers (currently in a program)
  - Average success rate across all children
  - Nappy cost savings this month
- Quick status grid showing all enrolled children with traffic-light indicators (on track, needs attention, not yet started)
- Staff e-learning completion progress bar
- Recent activity feed (latest events logged by staff)

##### Screen 2: Per-Child View

- Individual child progress dashboard (subset of Feature 4 data, shared with parent consent)
- Key metrics: current phase, days in training, success rate, milestones achieved
- Staff notes and observations log
- Parent coordination section: messages shared between nursery staff and parent about the child's training
- Print-friendly report for parent conferences

##### Screen 3: Group Overview

- Comparative view: bar chart of all children's progress side by side
- Cohort analysis: children started this month vs. last month
- Average time to completion by method
- Common challenges across the group
- Staff activity metrics: events logged per staff member

##### Screen 4: Cost Savings Calculator

- Input fields:
  - Number of children in nappies (before program)
  - Average nappy cost per day
  - Number of nappy changes per day
- Calculated outputs:
  - Monthly nappy costs (before)
  - Current monthly nappy costs (after children potty trained)
  - Monthly savings (absolute and percentage)
  - Projected annual savings
  - Environmental impact: nappies saved, kilos of waste prevented
- Visual comparison chart (before vs. after)
- Exportable report for management/board presentations

##### Screen 5: Staff E-Learning

- Course modules list with completion status per staff member
- Modules cover: Go Potty methodology, handling accidents, parent communication, logging best practices
- Quiz completion tracking
- Certificate generation for completed courses

#### Municipality Dashboard

##### Screen 1: Regional Overview

- Map view (if applicable) showing participating nurseries/health centers
- Top-level metrics:
  - Total participating nurseries
  - Total children enrolled
  - Total children successfully trained
  - Average training duration
  - Participation rate (enrolled vs. eligible)

##### Screen 2: Environmental Impact

- Large feature metrics:
  - **Nappies saved** (total count)
  - **Kilos of nappy waste prevented** (calculated: avg 150g per nappy)
  - **CO2 reduction** (calculated: lifecycle CO2 per disposable nappy)
  - **Landfill space saved** (estimated cubic meters)
- Trend charts: monthly progression of environmental metrics
- Comparison with municipality targets/goals
- Downloadable impact report for council presentations

##### Screen 3: Equity & Inclusion Metrics

- **Equal opportunity tracking:**
  - Children not potty trained by school age (4-5 years) -- this is a known equity issue
  - Breakdown by neighborhood/area (anonymized)
  - Participation rates across different demographic segments
  - Language distribution of participants
- **Program effectiveness:**
  - Success rates by method
  - Average time to success
  - Dropout rates and reasons
  - Coaching utilization rates

##### Screen 4: Program Management

- Nursery enrollment management (add/remove nurseries from the program)
- Bulk license management
- Budget tracking: program costs vs. savings achieved
- Reporting period configuration
- Automated report generation (monthly/quarterly) for council meetings
- Export formats: PDF, CSV, Excel

##### Screen 5: Historical Reporting

- Date range selector
- Custom report builder: select metrics, filters, groupings
- Year-over-year comparison
- Trend analysis with projections
- Data export with full audit trail

### 8.3 Data Model

```
organizations
  _id                   Id<"organizations">
  name                  string
  type                  "nursery" | "municipality" | "health_center"
  parentOrgId           Id<"organizations"> | null  // municipality -> nursery relationship
  address               { street: string, city: string, region: string, country: string, postalCode: string }
  contactEmail          string
  contactPhone          string | null
  subscriptionTier      "basic" | "professional" | "enterprise"
  maxChildren           number                     // license limit
  isActive              boolean
  _creationTime         number

organizationMembers
  _id                   Id<"organizationMembers">
  userId                Id<"users">
  organizationId        Id<"organizations">
  role                  "admin" | "manager" | "staff" | "viewer"
  permissions           string[]                   // granular permissions
  _creationTime         number

  // Indexes
  index("by_user", ["userId"])
  index("by_org", ["organizationId"])

childEnrollments
  _id                   Id<"childEnrollments">
  childProfileId        Id<"childProfiles">
  organizationId        Id<"organizations">
  parentUserId          Id<"users">
  parentConsentGiven    boolean
  consentDate           number | null
  enrollmentStatus      "active" | "completed" | "withdrawn"
  staffAssignedId       Id<"users"> | null
  _creationTime         number

  // Indexes
  index("by_org", ["organizationId", "enrollmentStatus"])

staffNotes
  _id                   Id<"staffNotes">
  childEnrollmentId     Id<"childEnrollments">
  staffUserId           Id<"users">
  noteType              "observation" | "concern" | "milestone" | "parent_communication"
  content               string
  isSharedWithParent    boolean
  _creationTime         number

eLearningModules
  _id                   Id<"eLearningModules">
  title                 string
  description           string
  contentUrl            string                     // link to module content
  quizQuestions         { question: string, options: string[], correctIndex: number }[]
  estimatedMinutes      number
  order                 number
  language              "nl" | "en" | "ar" | "tr" | "pl"
  _creationTime         number

eLearningProgress
  _id                   Id<"eLearningProgress">
  userId                Id<"users">
  organizationId        Id<"organizations">
  moduleId              Id<"eLearningModules">
  status                "not_started" | "in_progress" | "completed"
  quizScore             number | null              // percentage
  completedAt           number | null
  _creationTime         number

  // Indexes
  index("by_user_org", ["userId", "organizationId"])

aggregateMetrics
  _id                   Id<"aggregateMetrics">
  organizationId        Id<"organizations">
  periodType            "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  periodStart           string                     // ISO date
  periodEnd             string                     // ISO date
  metrics               {
                          totalEnrolled: number,
                          activeTrainers: number,
                          completedTrainers: number,
                          averageSuccessRate: number,
                          averageTrainingDays: number,
                          dropoutCount: number,
                          nappiesSaved: number,
                          wasteKgPrevented: number,
                          co2KgReduced: number,
                          costSavings: number,
                          methodBreakdown: {
                            intensive: number,
                            gradual: number,
                            hybrid: number,
                          },
                          languageBreakdown: Record<string, number>,
                        }
  _creationTime         number

  // Indexes
  index("by_org_period", ["organizationId", "periodType", "periodStart"])
```

### 8.4 API Endpoints

#### Nursery Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `query` | `b2b:nursery:getOverview` | Org Required | B2B | Get nursery overview metrics |
| `query` | `b2b:nursery:getChildren` | Org Required | B2B | List enrolled children with status |
| `query` | `b2b:nursery:getChildDetail` | Org Required | B2B | Get individual child progress (consent required) |
| `mutation` | `b2b:nursery:enrollChild` | Org Admin | B2B | Enroll a child (triggers parent consent flow) |
| `mutation` | `b2b:nursery:addStaffNote` | Org Staff | B2B | Add a note for a child |
| `query` | `b2b:nursery:getStaffNotes` | Org Required | B2B | Get notes for a child |
| `query` | `b2b:nursery:getCostSavings` | Org Required | B2B | Calculate cost savings |
| `query` | `b2b:nursery:getELearningStatus` | Org Required | B2B | Get staff e-learning progress |
| `mutation` | `b2b:nursery:completeModule` | Org Required | B2B | Submit module completion/quiz |

#### Municipality Endpoints

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `query` | `b2b:municipality:getOverview` | Org Required | B2B | Get regional overview |
| `query` | `b2b:municipality:getEnvironmentalImpact` | Org Required | B2B | Get environmental metrics |
| `query` | `b2b:municipality:getEquityMetrics` | Org Required | B2B | Get equity and inclusion data |
| `query` | `b2b:municipality:getNurseries` | Org Required | B2B | List participating nurseries |
| `mutation` | `b2b:municipality:enrollNursery` | Org Admin | B2B | Add nursery to program |
| `mutation` | `b2b:municipality:removeNursery` | Org Admin | B2B | Remove nursery from program |
| `query` | `b2b:municipality:getAggregateMetrics` | Org Required | B2B | Get metrics for a period |
| `action` | `b2b:municipality:generateReport` | Org Required | B2B | Generate downloadable report |
| `action` | `b2b:municipality:exportData` | Org Admin | B2B | Export data as CSV/Excel |

### 8.5 Environmental Calculations

```
nappiesSavedPerChild = (avgNappiesPerDay * daysTrainedEarlierThanAverage)
  where avgNappiesPerDay = 5 (configurable)
  where daysTrainedEarlierThanAverage = max(0, (nationalAvgAgeMonths - childCompletionAgeMonths) * 30)

wasteKgPerNappy = 0.15  // 150 grams average disposable nappy weight when used
co2KgPerNappy = 0.55    // lifecycle CO2 of one disposable nappy (production + disposal)

totalNappiesSaved = SUM(nappiesSavedPerChild) for all completed children
totalWasteKg = totalNappiesSaved * wasteKgPerNappy
totalCo2Kg = totalNappiesSaved * co2KgPerNappy
```

These constants are configurable at the organization level and sourced from published environmental research (references provided in the dashboard footnotes).

### 8.6 Validation Rules

- Parent consent is required before any child data is visible to the nursery
- Consent must be explicitly granted through the parent's app (not assumed)
- Municipality users can only see aggregate data -- never individual child data
- Organization roles enforce permission boundaries (staff cannot access billing; viewers cannot modify data)
- Aggregate metrics are computed from anonymized data; no PII in aggregate tables
- Data export requires admin role and generates an audit log entry
- Cost savings calculator inputs must be positive numbers within reasonable ranges

### 8.7 Error Handling

| Scenario | Handling |
|----------|----------|
| Parent revokes consent | Immediately remove child from nursery view; retain anonymized aggregate contribution; notify nursery admin |
| Nursery exceeds license limit | Block new enrollments; show upgrade prompt; existing enrollments unaffected |
| Aggregate computation fails | Serve last successful aggregation with timestamp; retry computation; alert system admin |
| Report generation times out | Queue report for background generation; notify user via email when ready for download |
| Municipality requests data for non-participating nursery | Return empty state with "This nursery is not enrolled in the program" |

### 8.8 Accessibility Requirements

- All charts and graphs have tabular data alternatives
- Dashboard cards use semantic headings and landmarks
- Color coding includes pattern/icon differentiation
- Data tables support keyboard navigation and sorting
- Export formats include accessible PDF (tagged) option
- Map view has list-based alternative
- Print stylesheets for all report views

### 8.9 Edge Cases

- **Child enrolled at multiple nurseries:** Show combined data at each nursery with a "shared enrollment" indicator; avoid double-counting in municipality aggregates
- **Nursery staff turnover:** Departing staff's notes are preserved; assigned children are flagged for reassignment; e-learning progress is per-individual (not transferable)
- **Municipality spans multiple countries/languages:** Dashboard language follows user preference; aggregate reports can be generated in any of the 5 supported languages
- **Data retention after program ends:** Aggregate metrics are retained indefinitely; individual child data is anonymized 12 months after completion; nurseries can request earlier anonymization
- **Very small nursery (< 5 children):** Suppress per-child breakdowns in municipality view to prevent re-identification; show only aggregate
- **Seasonal patterns:** Analytics account for holiday periods (configurable school calendar); metrics exclude paused periods from averages
- **Pilot program with partial rollout:** Municipality can mark nurseries as "pilot" vs. "full rollout"; separate dashboards for each cohort

---

## Cross-Feature Integration Map

The following table summarizes how features interact with each other:

| Source Feature | Target Feature | Integration Point |
|----------------|----------------|-------------------|
| 1. Readiness Assessment | 2. Method Selection | Assessment results feed recommendation algorithm; personality type passed through |
| 1. Readiness Assessment | 3. E-Guide Generator | Child profile, personality, readiness scores inform guide personalization |
| 2. Method Selection | 3. E-Guide Generator | Selected method determines guide structure (daily vs. weekly plans) |
| 3. E-Guide Generator | 4. Progress Tracking | Guide provides the phase context for logging; progress data triggers guide adaptation |
| 4. Progress Tracking | 5. Tips & Reminders | Progress events trigger contextual tips; regression/plateau detection drives tip selection |
| 4. Progress Tracking | 6. Coaching Portal | Recent progress summary auto-included in coaching consultation context |
| 4. Progress Tracking | 8. B2B Analytics | Child progress data (with consent) populates nursery and aggregate dashboards |
| 5. Tips & Reminders | 3. E-Guide Generator | Tips complement daily plans; guide phases determine tip eligibility |
| 6. Coaching Portal | 3. E-Guide Generator | Coach recommendations can trigger guide adjustments (manual) |
| 7. Community | 6. Coaching Portal | Unanswered community questions can be escalated to coaching |
| 8. B2B Analytics | 4. Progress Tracking | Nursery staff log events that appear in parent's progress dashboard |

---

## Appendix A: Shared Enumerations

The following enumerations are used across multiple features and should be defined once in the schema:

```typescript
// Training methods
type Method = "intensive" | "gradual" | "hybrid";

// Personality types
type PersonalityType = "bold" | "cautious" | "routine" | "spontaneous";

// Supported languages
type Language = "nl" | "en" | "ar" | "tr" | "pl";

// Child age ranges (for community display, never exact age)
type AgeRange = "under_18mo" | "18mo_2yr" | "2_3yr" | "3_4yr" | "4plus";

// Training phases - Intensive
type IntensivePhase = "preparation" | "day_1" | "day_2" | "day_3" | "day_4" | "day_5"
                    | "first_week_after" | "maintenance" | "nighttime" | "completed";

// Training phases - Gradual
type GradualPhase = "preparation" | "week_1" | "week_2" | "week_3" | "week_4" | "week_5"
                  | "week_6" | "week_7" | "week_8" | "week_9" | "week_10"
                  | "maintenance" | "nighttime" | "completed";

// Family situations
type FamilySituation = "single_parent" | "two_parents" | "extended_family"
                     | "blended_family" | "co_parenting";

// Subscription tiers
type SubscriptionTier = "free" | "premium";

// B2B organization tiers
type OrgTier = "basic" | "professional" | "enterprise";
```

## Appendix B: Data Privacy & GDPR Considerations

All features must comply with the following data privacy requirements (detailed in `03_TECHNICAL_ARCHITECTURE.md`):

1. **Child data is always stored under the parent's account** -- children do not have their own accounts
2. **Right to deletion:** Parents can request full deletion of all child data; system must cascade across all features
3. **Data portability:** Parents can export all data related to their child in a machine-readable format (JSON)
4. **Consent management:** Nursery access to child data requires explicit, revocable consent
5. **Data minimization:** Community features never expose exact child age, name, or identifiable details
6. **Retention policy:** Active accounts retain data indefinitely; inactive accounts are prompted after 12 months; data is anonymized after 24 months of inactivity
7. **Processing transparency:** Parents can view what data is used for what purpose in a dedicated privacy dashboard

## Appendix C: Subscription & Paywall Boundaries

| Feature | Free Tier | Premium Tier | B2B Tier |
|---------|-----------|--------------|----------|
| 1. Readiness Assessment | Full access | Full access | Via nursery enrollment |
| 2. Method Selection | Full access | Full access | Via nursery enrollment |
| 3. E-Guide Generator | Preview only (first 3 pages) | Full access | Staff guide version |
| 4. Progress Tracking | Not available | Full access | Staff + parent views |
| 5. Tips & Reminders | 1 tip per day | Full access + push notifications | Staff tips included |
| 6. Coaching Portal | Not available | Full access | Dedicated nursery coach |
| 7. Community | Read-only | Full participation | Staff community |
| 8. Analytics Dashboard | Not available | Not available | Full access |
