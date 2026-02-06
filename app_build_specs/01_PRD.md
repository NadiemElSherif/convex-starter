# Product Requirements Document (PRD)
# Go Potty - Potty Training App

| Field          | Value                                      |
|----------------|--------------------------------------------|
| **Last Updated** | 2026-02-06                               |
| **Status**       | Draft                                    |
| **Owner**        | Product Team                             |
| **Version**      | 1.0                                      |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Personas](#3-user-personas)
4. [Core Features by Category](#4-core-features-by-category)
5. [User Flows](#5-user-flows)
6. [User Stories](#6-user-stories)
7. [Success Criteria & KPIs](#7-success-criteria--kpis)
8. [Assumptions & Dependencies](#8-assumptions--dependencies)

### Related Deliverables

| Document | Description |
|----------|-------------|
| [02_FEATURE_SPECIFICATIONS.md](./02_FEATURE_SPECIFICATIONS.md) | Detailed feature specs, wireframes, and acceptance criteria |
| [03_TECHNICAL_ARCHITECTURE.md](./03_TECHNICAL_ARCHITECTURE.md) | System architecture, data models, API design, infrastructure |
| [04_BUSINESS_PLAN.md](./04_BUSINESS_PLAN.md) | Revenue model, go-to-market strategy, financial projections |
| [05_IMPLEMENTATION_ROADMAP.md](./05_IMPLEMENTATION_ROADMAP.md) | Phased delivery plan, milestones, resource allocation |
| [06_COMPETITIVE_POSITIONING.md](./06_COMPETITIVE_POSITIONING.md) | Market analysis, competitor landscape, differentiation strategy |

---

## 1. Executive Summary

### Product Name

**Go Potty** -- "Saving the world one nappy at a time"

### Vision

Children potty trained 6-12 months earlier than the current average, targeting readiness at 18 months compared to the prevailing norm of approximately 3 years. By combining behavioral science, expert consultation, and personalized digital guidance, Go Potty empowers parents and caregivers to approach potty training with confidence and evidence-based methods free from nappy industry influence.

### Target Markets

Go Potty operates across three distinct market segments:

1. **Parents (B2C)** -- Individual families seeking structured, science-based potty training guidance. Monetized through a freemium model with a one-time premium purchase.
2. **Nurseries / Childcare Providers (B2B)** -- Childcare organizations looking to reduce nappy costs (30-50% reduction potential), standardize potty training approaches across staff, and demonstrate measurable outcomes to parents.
3. **Municipalities (B2B)** -- Local government bodies pursuing waste reduction targets (nappies account for approximately 7% of household waste), promoting equal developmental opportunities, and implementing community-wide early childhood programs.

### Key Differentiators

- **Science-based, not industry-influenced**: Developed by psychologists, nurses, a urologist, and a physiotherapist -- not funded or influenced by the $71B nappy industry.
- **Intrinsic motivation over rewards**: No sticker charts or candy bribes. The methodology focuses on building the child's own sense of accomplishment and autonomy.
- **Two legitimate methods**: Parents choose between an Intensive method (3-5 days, full commitment) and a Gradual method (10 weeks, incremental steps), both clinically validated.
- **Deep personalization**: Training plans adapt to child age, personality type, developmental stage, special needs, family structure, parenting style, and cultural context.
- **Expert access**: Premium users get 1-on-1 consultation with qualified professionals (psychologists, nurses, coaches).
- **100% money-back guarantee**: Full refund if the premium program does not deliver results.
- **Multilingual**: Available in 5 languages (Dutch, English, Arabic, Turkish, Polish) to serve diverse communities.
- **Proven B2B traction**: 30+ partner organizations already using the platform.

### Success Metrics (Summary)

| Metric | Target |
|--------|--------|
| Average potty training completion age | Under 24 months |
| Premium conversion rate (free to paid) | 8-12% |
| B2C user retention at 30 days | 60%+ |
| Nursery nappy cost reduction | 30-50% |
| Parent satisfaction (NPS) | 50+ |
| Municipality waste reduction (nappy-related) | 10-15% in participating areas |

---

## 2. Product Overview

### What It Does

Go Potty is a mobile-first application that guides parents and caregivers through the entire potty training journey -- from assessing a child's readiness, through selecting and executing a personalized training method, to celebrating successful completion. It replaces guesswork, conflicting internet advice, and outdated methods with a structured, expert-backed program tailored to each child and family.

For B2B partners (nurseries and municipalities), the app extends into a management and analytics layer: dashboards for tracking cohort progress, staff e-learning modules, savings calculators, and impact reporting.

### Who It Is For

**Primary users:**
- Parents and primary caregivers of children aged 18 months to 4+ years
- Nursery staff and childcare managers overseeing potty training across multiple children
- Municipal program coordinators implementing community potty training initiatives

**Secondary stakeholders:**
- Pediatricians and health visitors who may recommend the app
- Grandparents and extended family members involved in childcare
- Nappy sustainability advocates and environmental policy makers

### Core Value Proposition

> "The only potty training program built by child development experts -- not the nappy industry -- that personalizes a proven method to your child's unique personality, age, and family situation, with expert coaching and a full money-back guarantee."

### Unique Selling Points (USPs)

1. **Personalization engine**: Combines 20+ input variables (child personality, age, development, family structure, parenting style, special needs) to generate a truly individualized plan -- not a one-size-fits-all guide.
2. **Dual-method approach**: The only app offering both an Intensive (3-5 day) and Gradual (10-week) method, letting families choose what fits their lifestyle.
3. **No rewards philosophy**: Grounded in child psychology research showing intrinsic motivation produces more lasting results than external rewards.
4. **Expert human support**: Premium coaching is not chatbot-based -- it connects parents with qualified psychologists and nurses.
5. **B2B platform**: Purpose-built dashboards for nurseries and municipalities transform potty training from an individual parenting concern into a managed organizational initiative with measurable ROI.
6. **Waste impact tracking**: Quantifies environmental benefit (nappies saved, CO2 reduced, landfill avoided) for both individual families and municipal programs.

---

## 3. User Personas

### Persona 1: Sarah -- The First-Time Parent

| Attribute | Detail |
|-----------|--------|
| **Age** | 31 |
| **Location** | London, UK |
| **Family** | Married, one child (22 months), both parents work full-time |
| **Tech comfort** | High -- uses apps daily for parenting, meal planning, fitness |
| **Language** | English |

**Situation**: Sarah's daughter Mia is 22 months old and showing some signs of readiness (pulling at nappy, interest in the toilet). Sarah's mother insists Mia should have been trained months ago. Online forums give contradictory advice. The nursery has mentioned they will start "encouraging" potty use but has no structured program.

**Pain Points**:
- Overwhelmed by conflicting information online (reward charts vs. child-led vs. 3-day boot camps)
- Guilt from mother-in-law's pressure and comparison with other children
- Anxiety about "doing it wrong" and causing setbacks or psychological harm
- Limited time -- both parents work, evenings and weekends are the primary training windows
- No idea whether Mia is actually ready or if she is just curious
- Fear of regression if nursery and home approaches are inconsistent

**Needs**:
- A clear, step-by-step plan she can trust is evidence-based
- Confidence that the method suits Mia specifically (not a generic guide)
- Quick readiness assessment to know if now is the right time
- Ability to coordinate with nursery so approaches are consistent
- Access to an expert when things go sideways (accidents, refusal, regression)
- Progress tracking to see that things are moving forward

**Goals**:
- Mia reliably dry during the day within 2-4 weeks
- Reduced stress and arguments about potty training at home
- Feeling like a competent, informed parent

---

### Persona 2: David -- The Nursery Manager

| Attribute | Detail |
|-----------|--------|
| **Age** | 44 |
| **Location** | The Hague, Netherlands |
| **Role** | Manager of a nursery with 80 children (ages 0-4), 15 staff members |
| **Tech comfort** | Moderate -- uses management software, email, basic apps |
| **Language** | Dutch (staff also speak Turkish and Arabic) |

**Situation**: David's nursery spends over EUR 12,000 per year on nappies. Parents frequently ask staff for potty training advice, but approaches are inconsistent -- some staff use reward stickers, others take a passive approach. Two staff members recently disagreed in front of a parent about the "right" method. The municipality is offering subsidies for early childhood development programs and David wants to apply.

**Pain Points**:
- High and rising nappy costs eating into tight budgets
- No standardized potty training protocol across staff
- Staff lack formal training in child development around toilet learning
- Parents expect guidance but the nursery cannot give confident, consistent advice
- Tracking which children are at what stage is manual (paper notes, verbal handoffs)
- Difficulty demonstrating outcomes to parents and the municipality

**Needs**:
- A staff training program (e-learning) that establishes a shared, evidence-based approach
- A dashboard showing each child's potty training status and progress
- Cost savings tracking to justify the investment to ownership and the municipality
- Multilingual support for diverse staff and parent populations
- Easy onboarding -- staff are busy and cannot attend multi-day off-site training
- Parent communication tools (progress reports, shared plans)

**Goals**:
- Reduce nappy spend by 30-50% within 12 months
- Position the nursery as a leader in early childhood development
- Win the municipal subsidy by demonstrating measurable outcomes
- Reduce staff disagreements and parent complaints about inconsistency

---

### Persona 3: Anja -- The Municipal Program Coordinator

| Attribute | Detail |
|-----------|--------|
| **Age** | 38 |
| **Location** | Rotterdam, Netherlands |
| **Role** | Program Coordinator, Early Childhood & Family Services, Municipality of Rotterdam |
| **Tech comfort** | High -- works with policy dashboards, data analytics, CRM systems |
| **Language** | Dutch, English |

**Situation**: Rotterdam has committed to reducing household waste by 20% by 2030. Disposable nappies represent approximately 7% of household waste by weight. Anja's department is tasked with piloting programs that reduce nappy waste while also promoting child development and equal opportunities -- children from disadvantaged backgrounds are statistically potty trained later, which compounds educational inequality. She needs a program that can scale across 50+ nurseries and hundreds of families, with measurable impact data for council reporting.

**Pain Points**:
- Nappy waste is a significant, growing environmental cost with no current intervention
- Existing waste reduction programs (recycling campaigns) have plateauing returns
- Disadvantaged families lack access to expert parenting guidance, widening developmental gaps
- No standardized data on potty training age or outcomes across the municipality
- Programs must demonstrate equity impact (not just environmental) to secure continued funding
- Political pressure to show results within one budget cycle (12-18 months)

**Needs**:
- A turnkey program deployable across dozens of nurseries and community centers
- Aggregate dashboards showing participation rates, completion rates, and demographic breakdowns
- Waste reduction metrics (nappies saved, kg diverted from landfill, CO2 equivalent)
- Equity metrics (training age by neighborhood, income level, language group)
- Multilingual content to reach immigrant and non-Dutch-speaking families
- Cost-benefit analysis tools for council presentations
- Privacy-compliant data handling (GDPR, municipal data policies)

**Goals**:
- Measurably reduce nappy waste by 10-15% in participating areas within 18 months
- Demonstrate that children in the program are potty trained 6+ months earlier on average
- Secure ongoing funding by presenting clear ROI to the city council
- Expand the program city-wide after a successful pilot

---

## 4. Core Features by Category

### 4.1 Assessment & Diagnosis

These features determine whether a child is ready to begin potty training and establish a baseline for personalization.

| Feature | Description | Tier |
|---------|-------------|------|
| **Child Readiness Assessment** | Structured questionnaire evaluating physical signs (bladder control duration, motor skills), cognitive signs (follows instructions, communicates needs), and emotional signs (interest, independence). Produces a readiness score with clear recommendation. | Free |
| **Parent Readiness Assessment** | Evaluates parent/caregiver availability, stress levels, support network, and commitment capacity. Flags if timing is suboptimal (new sibling arriving, house move, etc.). | Free |
| **Personality Evaluation** | Series of scenario-based questions determining the child's personality type: Bold, Cautious, Routine-Dependent, or Spontaneous. Each type maps to different method adaptations. | Free |
| **Development Stage Assessment** | Age-adjusted evaluation of physical development (walking stability, fine motor), language development (vocabulary, comprehension), and social-emotional development (independence, peer awareness). | Free |
| **Special Needs Screening** | Optional assessment for children with autism spectrum conditions, developmental delays, sensory processing differences, or physical disabilities. Routes to specialized content and expert pathways. | Free |
| **Family Situation Profile** | Captures family structure (single/two-parent, blended, same-sex, grandparent-led, foster), cultural background, languages spoken, work schedules, and recent life changes to inform plan customization. | Free |
| **Reassessment Tool** | Periodic re-evaluation (triggered manually or after milestones) to adjust the plan based on progress, setbacks, or changed circumstances. | Premium |

### 4.2 Method Selection & Personalization

These features generate a customized training plan based on assessment results.

| Feature | Description | Tier |
|---------|-------------|------|
| **Method Preference Questionnaire** | Guided comparison of Intensive vs. Gradual methods with pros/cons tailored to the family's situation. Includes a recommendation but lets parents choose. | Free |
| **Intensive Method Plan** | Full 3-5 day structured plan: preparation checklist, day-by-day schedule, scripts for communication with the child, troubleshooting guides for common issues, and clear success criteria. | Free (basic) / Premium (full) |
| **Gradual Method Plan** | 10-week phased plan: weekly goals, daily activities, progression criteria for advancing to the next phase, and regression protocols. | Free (basic) / Premium (full) |
| **Personalized E-Guide** | Comprehensive digital guide generated from assessment inputs. Adapts language, examples, pacing, and advice to the specific child's personality, age, development stage, and family context. | Free (excerpts) / Premium (full) |
| **Start Date Planning** | Calendar tool to identify optimal start windows based on parent availability, nursery schedule, upcoming disruptions (holidays, visitors), and child's current routine. | Free |
| **Customized Daily/Weekly Lesson Plans** | Structured activities and milestones for each day (Intensive) or week (Gradual), adjustable based on progress logging. | Premium |
| **Adaptive Content Engine** | System that modifies guidance in real-time based on logged progress, setbacks, and parent feedback. If a child is progressing faster or slower than expected, the plan adjusts. | Premium |

### 4.3 Progress Tracking & Analytics

| Feature | Description | Tier |
|---------|-------------|------|
| **Daily Logging** | Quick-entry interface to log successful toilet uses, accidents, nappy changes, dry periods, and contextual notes (time, location, mood). Designed for one-handed, 5-second entries. | Free |
| **Accident Tracking** | Categorized accident logging (wee/poo, time of day, activity context, preceding events) to identify patterns and triggers. | Free |
| **Milestone Markers** | Predefined milestones (first successful sit, first self-initiated, first dry morning, first dry night, etc.) with date stamps and celebration prompts. | Free |
| **Dry Streak Counter** | Running count of consecutive dry days and nights, displayed prominently as motivation. | Free |
| **Pattern Identification** | Algorithmic analysis of logged data to surface patterns: "Mia tends to have accidents after nap time" or "Success rate is higher on days she wears the blue pants." | Premium |
| **Trend Analysis** | Weekly and monthly visualizations showing trajectory: accident frequency over time, success rate trends, time-of-day heatmaps. | Premium |
| **Progress Percentage** | Overall completion estimate based on milestones achieved, consistency metrics, and method-specific criteria. | Free |
| **Timeline Visualization** | Visual journey map showing where the child is in the training plan, milestones ahead, and estimated completion. | Premium |
| **Export & Share** | Generate progress reports (PDF or shareable link) for partners, grandparents, nursery staff, or pediatricians. | Premium |

### 4.4 Learning & Educational Content

| Feature | Description | Tier |
|---------|-------------|------|
| **Knowledge Base** | 25+ articles covering: readiness signs, method comparisons, health considerations (UTIs, constipation), communication techniques, hygiene practices, nighttime training, regression handling, and more. | Free (5 articles) / Premium (all) |
| **Challenge-Specific Guides** | Targeted content for: weeing issues (withholding, frequent accidents), pooing issues (fear, constipation, refusal), behavioral challenges (resistance, power struggles), sleep-related (bedwetting, night training), and situational (travel, new sibling, daycare transition). | Premium |
| **Special Needs Content** | Dedicated guides for autism spectrum (visual schedules, sensory considerations), developmental delays (adapted timelines, simplified steps), physical disabilities (equipment recommendations, adaptive techniques), and sensory processing differences. | Premium |
| **Video Content** | Short instructional videos demonstrating techniques, parent testimonials, and expert explanations. Subtitled in all 5 supported languages. | Premium |
| **Daily Tips** | Contextual, stage-appropriate tips delivered via push notification. Content adapts to current training phase and recent logged activity. | Free (1/day) / Premium (unlimited) |
| **Staff E-Learning (B2B)** | Structured course for nursery staff: evidence-based potty training principles, working with different personality types, communicating with parents, handling accidents, and when to escalate concerns. Includes assessment and certification. | B2B |

### 4.5 Motivation & Celebration

| Feature | Description | Tier |
|---------|-------------|------|
| **Milestone Celebrations** | In-app celebration animations and encouraging messages when milestones are reached. Designed for the parent (not the child -- the app is a parent tool, not a children's app). | Free |
| **Achievement Recognition** | Summary of achievements visible on the dashboard: milestones reached, streaks maintained, challenges overcome. | Free |
| **Parent Encouragement System** | Proactive encouragement messages during difficult phases (high accident days, regression periods). Normalizes setbacks with data ("87% of families experience a regression in week 2"). | Premium |
| **Completion Celebration** | End-of-journey celebration with summary statistics, a shareable "graduation" graphic, and a prompt to leave a review/testimonial. | Free |

### 4.6 Reminders & Notifications

| Feature | Description | Tier |
|---------|-------------|------|
| **Potty Sit Reminders** | Configurable reminders to prompt regular toilet sits (every 30/60/90 minutes). Adjustable as training progresses. | Free |
| **Logging Reminders** | Gentle nudge if no log entry has been made in a configurable period. | Free |
| **Daily Tip Notifications** | Push notification delivering the day's contextual tip. | Free (1/day) / Premium (unlimited) |
| **Method Phase Transitions** | Notification when it is time to advance to the next phase of the Gradual method, based on logged progress. | Premium |
| **Regression Alerts** | Proactive notification if logged data suggests regression, with links to relevant guidance content. | Premium |

### 4.7 Community & Social

| Feature | Description | Tier |
|---------|-------------|------|
| **Parent Community Forum** | Moderated forum for parents to share experiences, ask questions, and offer encouragement. Organized by method type, child age, and challenge category. | Free (read) / Premium (post) |
| **Success Stories** | Curated collection of anonymized success stories from families with similar profiles (child age, personality, method used). | Free |
| **Experience Sharing** | Ability to share personal milestones and tips within the community. | Premium |
| **Expert Q&A** | Periodic open Q&A sessions with Go Potty experts in the community forum. | Premium |

### 4.8 Premium Coaching & Expert Access

| Feature | Description | Tier |
|---------|-------------|------|
| **1-on-1 Expert Coaching** | Direct messaging or scheduled calls with qualified professionals (psychologists, nurses, coaches). Available for personalized advice, troubleshooting, and emotional support. | Premium |
| **Unlimited Consultation** | No cap on the number of coaching interactions during the 6-month premium period. | Premium |
| **100% Money-Back Guarantee** | Full refund if the program does not deliver results within the premium period. Clear criteria and simple claims process. | Premium |
| **Extended Content Library** | Full access to all educational content, challenge guides, special needs content, and video library. | Premium |
| **Priority Support** | Faster response times from the support team and coaching staff. | Premium |

### 4.9 Dashboards & Analytics (B2B)

| Feature | Description | Tier |
|---------|-------------|------|
| **Nursery Dashboard** | Overview of all enrolled children: individual progress status, cohort statistics, staff assignment, parent engagement metrics. | B2B Nursery |
| **Child Progress Cards** | Individual child view within the nursery dashboard: current phase, recent log entries, milestones, alerts, and notes from staff and parents. | B2B Nursery |
| **Staff Management** | Assign staff to children, track e-learning completion, manage permissions. | B2B Nursery |
| **Savings Calculator** | Real-time calculation of nappy cost savings: nappies avoided per child/cohort, cost per nappy, total savings to date, projected annual savings. | B2B Nursery |
| **Parent Communication** | In-app messaging between nursery staff and parents about individual children's potty training progress. | B2B Nursery |
| **Municipality Dashboard** | Aggregate view across all participating nurseries and families: enrollment numbers, completion rates, average training age, demographic breakdowns, geographic distribution. | B2B Municipality |
| **Waste Reduction Metrics** | Nappies diverted from landfill, estimated weight (kg), CO2 equivalent savings, comparison against municipal waste targets. | B2B Municipality |
| **Equity Analytics** | Breakdowns by neighborhood, income bracket, language group, and family structure to demonstrate equal opportunity impact. | B2B Municipality |
| **Impact Reporting** | Exportable reports for council presentations: executive summaries, detailed data tables, trend charts, cost-benefit analysis. | B2B Municipality |
| **Program Management** | Tools for managing nursery enrollment, distributing licenses, tracking participation, and coordinating with program partners. | B2B Municipality |

### 4.10 Mobile & Platform

| Feature | Description | Tier |
|---------|-------------|------|
| **iOS App** | Native or high-quality hybrid app for iPhone and iPad. | All |
| **Android App** | Native or high-quality hybrid app for Android phones and tablets. | All |
| **Web Dashboard** | Browser-based access primarily for B2B dashboards, but also available for parents who prefer desktop. | All |
| **Offline Capability** | Core features (logging, current plan view, cached tips) available without internet. Syncs when reconnected. | All |
| **Push Notifications** | Reminders, tips, milestone celebrations, and alerts delivered via platform-native push. | All |
| **Multi-Language Support** | Full app content available in Dutch, English, Arabic, Turkish, and Polish. Language selectable per user. | All |
| **Accessibility** | WCAG 2.1 AA compliance: screen reader support, high contrast mode, adjustable text sizes, one-handed operation. | All |

---

## 5. User Flows

### 5.1 Parent Journey (B2C)

```
DISCOVERY & ONBOARDING
  1. Parent discovers app (app store, referral, nursery recommendation, pediatrician)
  2. Downloads app (free)
  3. Creates account (email or social sign-in)
  4. Selects language preference
  5. Brief welcome tour (3 screens: what the app does, how it works, what's free vs premium)

ASSESSMENT PHASE
  6. Completes Child Readiness Assessment (5-7 minutes)
     - Physical readiness questions
     - Cognitive readiness questions
     - Emotional readiness questions
  7. Receives readiness score and recommendation
     a. "Ready" -> proceed to step 8
     b. "Almost ready" -> receive preparatory tips, set reminder to reassess in 2-4 weeks
     c. "Not yet ready" -> receive developmental milestone guide, set reminder to reassess
  8. Completes Parent Readiness Assessment (3 minutes)
  9. Completes Personality Evaluation for child (5 minutes)
  10. Completes Family Situation Profile (3 minutes)

METHOD SELECTION
  11. Presented with method comparison (Intensive vs Gradual) personalized to their inputs
  12. Reads summaries, watches optional explainer video
  13. Selects method
  14. Uses Start Date Planning tool to choose when to begin
  15. Receives basic version of personalized e-guide

CONVERSION POINT (FREE -> PREMIUM)
  16. Can continue with basic plan (limited daily tips, no coaching, abbreviated guide)
  17. OR upgrades to Premium (GBP 37.45, one-time, 6 months access)
      - Prompted at key moments: when viewing locked content, before training starts, after first setback
      - Clear presentation of what's included and money-back guarantee

ACTIVE TRAINING
  18. Receives daily plan (structured activities, goals, scripts)
  19. Logs activities throughout the day (quick-entry: success/accident/nappy/note)
  20. Receives contextual daily tips via push notification
  21. Views progress dashboard (streak counter, milestone tracker, trend charts)
  22. Accesses challenge-specific content as needed
  23. [Premium] Messages expert coach for advice or reassurance
  24. Plan adapts based on logged progress

MILESTONES & SETBACKS
  25. Milestone reached -> celebration, encouragement, next phase introduction
  26. Regression detected -> supportive notification, relevant content surfaced, coach prompted
  27. Challenge encountered -> matched to specific guide (e.g., "poo withholding", "daycare transition")

COMPLETION
  28. All milestones achieved -> completion celebration
  29. Summary statistics presented (total days, milestones, nappies saved)
  30. Prompted to share success story, leave review
  31. Nighttime training module offered (if not yet addressed)
  32. Premium access continues until 6-month expiry for ongoing reference
```

### 5.2 Nursery Partner Journey (B2B)

```
SALES & ONBOARDING
  1. Nursery manager contacts Go Potty (website inquiry, sales outreach, municipality referral)
  2. Consultation call: needs assessment, pricing, ROI projection
  3. Contract signed: per-child licensing + staff training package
  4. Admin account created for nursery manager
  5. Staff accounts provisioned

STAFF TRAINING
  6. Staff complete e-learning modules (self-paced, 4-6 hours total)
     - Module 1: Science of potty training readiness
     - Module 2: Intensive vs Gradual methods
     - Module 3: Personality types and adaptation
     - Module 4: Working with parents
     - Module 5: Special needs considerations
     - Module 6: Logging and using the dashboard
  7. Staff complete assessment to earn certification
  8. Manager reviews completion status on dashboard

CHILD ENROLLMENT
  9. Manager enrolls children in the program
  10. Parents receive invitation to download app and link accounts
  11. Parents complete assessments (or staff assist during drop-off)
  12. Personalized plans generated for each child

DAILY OPERATIONS
  13. Staff log potty activities for enrolled children during nursery hours
  14. Parents log at home (evenings, weekends)
  15. Dashboard shows real-time progress for all children
  16. Staff receive alerts for children needing attention (regression, stalled progress)
  17. Staff and parents communicate via in-app messaging about each child

MANAGEMENT & REPORTING
  18. Manager views aggregate dashboard: cohort progress, savings metrics, staff engagement
  19. Savings calculator shows nappy cost reduction in real-time
  20. Monthly reports generated for ownership / board
  21. Quarterly reports generated for municipality (if subsidized)
  22. Success metrics used in marketing to prospective parents
```

### 5.3 Municipality Journey (B2B)

```
PROGRAM DESIGN
  1. Municipal coordinator identifies nappy waste as intervention opportunity
  2. Contacts Go Potty for program proposal
  3. Joint program design: target neighborhoods, partner nurseries, timeline, budget
  4. Council approval with projected ROI and equity impact

PILOT LAUNCH
  5. Pilot nurseries selected (5-10 locations, diverse demographics)
  6. Nursery onboarding (see Nursery Journey above)
  7. Community outreach: flyers, social media, health visitor referrals, community center events
  8. Individual families enrolled directly (B2C flow with municipal subsidy code)

MONITORING
  9. Municipal dashboard tracks:
     - Enrollment numbers by nursery and neighborhood
     - Active participation rates
     - Completion rates and average training age
     - Demographic breakdowns (language, income area, family structure)
     - Nappy waste reduction estimates
  10. Monthly check-ins with nursery partners
  11. Quarterly impact report generated automatically

REPORTING & EXPANSION
  12. 6-month pilot report presented to council:
      - Children trained X months earlier on average
      - Y nappies diverted from landfill (Z kg, W tonnes CO2e)
      - Equity impact: gap between advantaged/disadvantaged narrowed by N%
      - Cost-benefit: program cost vs waste collection savings
  13. Decision to expand, modify, or discontinue
  14. Expansion: additional nurseries enrolled, wider community outreach, budget allocated
  15. Ongoing: annual impact reports, program refinement based on data
```

---

## 6. User Stories

### Parent Stories

1. **As a** first-time parent, **I want** to take a child readiness assessment **so that** I know whether my child is physically and emotionally ready to start potty training, rather than guessing based on age alone.

2. **As a** parent of a cautious child, **I want** a training plan adapted to my child's personality type **so that** the approach does not overwhelm or frighten them and cause resistance.

3. **As a** working parent, **I want** to select between a 3-5 day intensive method and a 10-week gradual method **so that** I can choose the approach that fits my schedule and availability.

4. **As a** parent actively training my child, **I want** to log successes and accidents in under 5 seconds **so that** tracking does not feel burdensome during an already demanding period.

5. **As a** parent experiencing a setback, **I want** to receive a reassuring notification with relevant guidance **so that** I do not panic or abandon the training.

6. **As a** premium subscriber, **I want** to message a qualified expert (psychologist or nurse) **so that** I can get personalized advice for my specific challenge rather than generic FAQ answers.

7. **As a** parent, **I want** to see my child's progress over time (dry streak, accident trends, milestones) **so that** I can feel confident that the training is working even on difficult days.

8. **As a** parent of a child with autism, **I want** specialized guidance that accounts for sensory sensitivities and communication differences **so that** the training approach is appropriate and effective for my child.

9. **As an** Arabic-speaking parent, **I want** to use the app in my native language **so that** I fully understand the guidance without relying on translation.

10. **As a** parent completing the program, **I want** to see how many nappies I have saved **so that** I feel good about the environmental and financial impact.

### Nursery Manager Stories

11. **As a** nursery manager, **I want** a dashboard showing all enrolled children's potty training status **so that** I can identify which children need extra attention and ensure consistent progress.

12. **As a** nursery manager, **I want** staff to complete e-learning modules and earn certification **so that** all caregivers follow the same evidence-based approach.

13. **As a** nursery manager, **I want** to see a real-time savings calculation **so that** I can demonstrate the program's financial ROI to ownership.

14. **As a** nursery staff member, **I want** to communicate with parents about their child's potty training progress via the app **so that** home and nursery approaches stay aligned.

### Municipal Officer Stories

15. **As a** municipal program coordinator, **I want** aggregate dashboards with demographic breakdowns **so that** I can report on both environmental impact and equity outcomes to the city council.

16. **As a** municipal program coordinator, **I want** automated quarterly impact reports **so that** I can demonstrate program value without manual data compilation.

17. **As a** municipal program coordinator, **I want** waste reduction metrics (nappies saved, kg diverted, CO2 equivalent) **so that** I can connect the program to the municipality's sustainability targets.

18. **As a** municipal program coordinator, **I want** to manage nursery enrollment and license distribution from a central dashboard **so that** I can scale the program efficiently across dozens of locations.

---

## 7. Success Criteria & KPIs

### 7.1 Engagement Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Daily Active Users (DAU) / Monthly Active Users (MAU) | DAU/MAU ratio > 40% during active training | Analytics platform |
| Average logging frequency | 3+ entries per day during active training | In-app logging data |
| Assessment completion rate | 80%+ of users who start an assessment complete it | Funnel analytics |
| Plan generation rate | 70%+ of users who complete assessment generate a plan | Funnel analytics |
| Content engagement | Average 2+ articles/tips read per week during active training | Content analytics |
| Push notification opt-in rate | 70%+ | Platform analytics |
| Community participation (Premium) | 30%+ of premium users post at least once | Forum analytics |

### 7.2 Conversion Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Free-to-Premium conversion rate | 8-12% | Payment analytics |
| Time to conversion | Median < 7 days from install | Cohort analysis |
| Conversion by trigger point | Identify top 3 conversion moments | Attribution analytics |
| Trial-to-paid (if trial offered) | 25%+ | Payment analytics |
| Refund rate (money-back guarantee) | < 10% | Finance records |

### 7.3 Retention Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Day 1 retention | 70%+ | Cohort analysis |
| Day 7 retention | 55%+ | Cohort analysis |
| Day 30 retention | 40%+ | Cohort analysis |
| Training completion rate | 65%+ of users who start actively training complete | Milestone tracking |
| Churn during training | < 20% drop off during active training phase | Retention analysis |

### 7.4 Business Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Monthly Recurring Revenue (B2B) | Growth targets per 05_IMPLEMENTATION_ROADMAP.md | Finance |
| Customer Acquisition Cost (B2C) | < GBP 5 per install, < GBP 25 per premium conversion | Marketing analytics |
| Lifetime Value (B2C Premium) | GBP 37.45 (single purchase) + referral value | Finance |
| B2B partner retention | 90%+ annual renewal | Contract tracking |
| Net Promoter Score (NPS) | 50+ | Quarterly surveys |
| App Store rating | 4.5+ stars | App stores |
| Nursery partner pipeline | 10+ new nurseries per quarter after launch | CRM |
| Municipality pipeline | 2+ new municipalities per year | CRM |

### 7.5 Impact Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Average potty training completion age | Under 24 months for children starting at 18-20 months | User data |
| Training duration (Intensive) | 80%+ complete within 5 days | Milestone tracking |
| Training duration (Gradual) | 80%+ complete within 12 weeks | Milestone tracking |
| Nursery nappy cost reduction | 30-50% within 12 months of adoption | Savings calculator |
| Nappies saved per child (estimated) | 1,500+ over remaining pre-training period | Calculation model |
| Municipal waste reduction | 10-15% nappy waste reduction in participating areas | Municipal waste data |
| Equity gap reduction | Measurable narrowing of training age gap between advantaged and disadvantaged groups | Demographic analysis |

---

## 8. Assumptions & Dependencies

### 8.1 User Assumptions

| Assumption | Risk if Invalid | Mitigation |
|------------|----------------|------------|
| Parents are motivated to potty train earlier if given confidence and guidance | Low -- market research and 30+ existing partners validate demand | Continued user research, A/B testing of messaging |
| Parents will consistently log data during training | Medium -- logging fatigue is real | Minimize friction (5-second entries), smart reminders, show value of data back to user |
| Parents trust app-based guidance over family/cultural traditions | Medium -- strong cultural influences in target demographics | Position as complementary to family wisdom, not replacement. Multilingual, culturally sensitive content. Expert human backing. |
| The intrinsic motivation (no rewards) approach appeals to parents | Medium -- reward charts are deeply ingrained | Clear educational content on why rewards can backfire. Show evidence. Allow parents to make informed choice. |
| Nursery staff will adopt and consistently use the platform | Medium -- change management in childcare settings is slow | Simple UX, manager enforcement tools, clear time-saving benefits, e-learning that counts as professional development |
| Municipalities will fund potty training programs | Medium -- novel concept for most municipalities | Pilot data from The Hague partners, clear ROI modeling, alignment with existing waste and equity mandates |

### 8.2 Technical Dependencies

| Dependency | Purpose | Risk | Mitigation |
|------------|---------|------|------------|
| **Convex** | Backend database, real-time sync, serverless functions | Low -- proven platform, strong real-time capabilities | Architecture designed for Convex strengths (see 03_TECHNICAL_ARCHITECTURE.md) |
| **Next.js** | Web frontend and potential SSR/SSG for marketing pages | Low -- industry standard, large ecosystem | Standard deployment on Vercel |
| **React Native or Expo** | Mobile app (iOS + Android) | Medium -- cross-platform trade-offs | Evaluate Flutter as alternative. Budget for platform-specific polish. |
| **Clerk** | Authentication and user management | Low -- proven auth provider with Convex integration | Abstract auth layer for potential provider swap |
| **Push notification service** | Reminders, tips, alerts | Low -- well-solved problem (FCM, APNs) | Use cross-platform service (e.g., OneSignal, Expo Notifications) |
| **Payment processing** | Premium purchases, B2B invoicing | Low -- Stripe or equivalent | Implement proper webhook handling for payment state sync |
| **Content Management System** | Educational content, tips, guides | Medium -- need flexible multilingual content pipeline | Evaluate headless CMS (Sanity, Contentful) vs Convex-native content storage |
| **Analytics platform** | Usage tracking, funnel analysis, KPI monitoring | Low -- many options (Mixpanel, Amplitude, PostHog) | Choose privacy-first option compatible with GDPR requirements |

### 8.3 Third-Party Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| **Stripe** | Payment processing for premium purchases and B2B licensing | P0 -- required for launch |
| **App Store / Google Play** | Distribution and in-app purchase (if using IAP) | P0 -- required for launch |
| **Push notification service** | Reminders and engagement notifications | P0 -- required for launch |
| **Email service (SendGrid, Postmark, etc.)** | Transactional emails (welcome, receipts, password reset) and optional marketing | P0 -- required for launch |
| **Analytics (Mixpanel, Amplitude, or PostHog)** | Product analytics, funnel tracking, retention analysis | P1 -- needed within first month |
| **Customer support (Intercom, Zendesk)** | In-app support chat, help center, ticket management | P1 -- needed at scale |
| **CMS (Sanity, Contentful)** | Multilingual content management for articles, tips, guides | P1 -- needed before content scales |
| **Translation management (Crowdin, Lokalise)** | Managing translations across 5 languages | P1 -- needed for multilingual launch |
| **Video hosting (Mux, Cloudflare Stream)** | Hosting and streaming educational video content | P2 -- post-launch |
| **Calendar API (Google, Apple)** | Start date planning integration with parent calendars | P2 -- nice to have |
| **Health data APIs** | Optional integration with pediatric health records (future) | P3 -- exploratory |

### 8.4 Regulatory & Compliance

| Requirement | Scope | Approach |
|-------------|-------|----------|
| **GDPR** | All EU users, especially Netherlands-based operations | Privacy by design, explicit consent, data minimization, right to deletion, DPO appointment |
| **Children's data protection (GDPR Article 8, COPPA equivalent)** | Data collected about children (not from children -- the app is used by parents/staff) | Minimize child PII, no direct child interaction, parental consent for all child data, data retention limits |
| **UK Data Protection Act 2018** | UK users (pricing in GBP suggests UK market) | Align with GDPR plus UK-specific requirements, ICO registration |
| **Age-Appropriate Design Code (UK)** | App relates to children, even though used by adults | Review against the 15 standards; document compliance rationale (app is for adults about children) |
| **App Store guidelines (Apple, Google)** | App distribution | Review health/medical claims restrictions, in-app purchase rules, data collection disclosures |
| **Medical device regulations** | App provides health-adjacent guidance | Legal review to confirm the app is classified as a wellness/educational tool, NOT a medical device. Avoid diagnostic language. |
| **Consumer protection (money-back guarantee)** | Premium purchase with guarantee | Clear terms and conditions, straightforward refund process, compliance with distance selling regulations |
| **Municipal data agreements** | B2B municipality contracts | Data processing agreements, anonymization for aggregate reporting, compliance with municipal IT security policies |
| **Accessibility (EN 301 549, WCAG 2.1 AA)** | EU accessibility requirements for digital services | Build accessibility into design system from day one, regular audits |

---

*This PRD serves as the foundational reference for all subsequent deliverables. For detailed feature specifications, see [02_FEATURE_SPECIFICATIONS.md](./02_FEATURE_SPECIFICATIONS.md). For technical implementation details, see [03_TECHNICAL_ARCHITECTURE.md](./03_TECHNICAL_ARCHITECTURE.md). For business model and financial projections, see [04_BUSINESS_PLAN.md](./04_BUSINESS_PLAN.md).*
