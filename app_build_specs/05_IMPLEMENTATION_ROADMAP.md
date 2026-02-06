# 05 — Implementation Roadmap

| Field              | Value                                                        |
|--------------------|--------------------------------------------------------------|
| **Document ID**    | 05_IMPLEMENTATION_ROADMAP                                    |
| **Version**        | 1.0                                                          |
| **Last Updated**   | 2026-02-06                                                   |
| **Status**         | Draft                                                        |
| **Owner**          | Product & Engineering                                        |
| **Related Docs**   | [01_PRD.md](./01_PRD.md), [02_USER_STORIES.md](./02_USER_STORIES.md), [03_TECHNICAL_ARCHITECTURE.md](./03_TECHNICAL_ARCHITECTURE.md), [04_DATA_MODELS.md](./04_DATA_MODELS.md) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Timeline Overview](#2-timeline-overview)
3. [Pre-Launch Phase — Months 1-3](#3-pre-launch-phase--months-1-3)
   - 3.1 [Month 1: Foundation](#31-month-1-foundation)
   - 3.2 [Month 2: Core Features](#32-month-2-core-features)
   - 3.3 [Month 3: Polish and Beta](#33-month-3-polish-and-beta)
4. [Launch Phase — Months 4-6](#4-launch-phase--months-4-6)
   - 4.1 [Month 4: Launch Preparation](#41-month-4-launch-preparation)
   - 4.2 [Month 5: Public Launch](#42-month-5-public-launch)
   - 4.3 [Month 6: Optimize](#43-month-6-optimize)
5. [Post-Launch Growth — Months 7-12](#5-post-launch-growth--months-7-12)
   - 5.1 [Months 7-8: Premium and Coaching](#51-months-7-8-premium-and-coaching)
   - 5.2 [Months 9-10: B2B Foundation](#52-months-9-10-b2b-foundation)
   - 5.3 [Months 11-12: Scale and Iterate](#53-months-11-12-scale-and-iterate)
6. [Year 2 Plan — Months 13-24](#6-year-2-plan--months-13-24)
   - 6.1 [Q1: Months 13-15](#61-q1-months-13-15)
   - 6.2 [Q2: Months 16-18](#62-q2-months-16-18)
   - 6.3 [Q3: Months 19-21](#63-q3-months-19-21)
   - 6.4 [Q4: Months 22-24](#64-q4-months-22-24)
7. [Critical Success Factors](#7-critical-success-factors)
8. [Team Scaling Plan](#8-team-scaling-plan)
9. [Technology Milestones](#9-technology-milestones)
10. [Risk Register and Mitigation](#10-risk-register-and-mitigation)

---

## 1. Executive Summary

This document defines the phased implementation roadmap for the Go Pipi potty training platform, a mobile-first application inspired by Go Potty that spans three market segments: parents (B2C freemium), nurseries (B2B), and municipalities (B2B). The roadmap covers 24 months from project inception through enterprise-grade platform maturity.

The plan is structured around four major phases:

| Phase            | Months | Objective                                        |
|------------------|--------|--------------------------------------------------|
| Pre-Launch       | 1-3    | Build foundation, core features, and beta test   |
| Launch           | 4-6    | Ship to app stores, acquire first users, optimize|
| Post-Launch      | 7-12   | Premium coaching, B2B nursery/municipality MVPs  |
| Year 2           | 13-24  | Scale B2B, expand regions, advanced AI features  |

The platform targets 150+ features across 5 languages, delivered incrementally. The technical stack — Flutter (iOS + Android), cloud backend, B2B web dashboards — is defined in [03_TECHNICAL_ARCHITECTURE.md](./03_TECHNICAL_ARCHITECTURE.md). Data models are specified in [04_DATA_MODELS.md](./04_DATA_MODELS.md). User stories driving each sprint are catalogued in [02_USER_STORIES.md](./02_USER_STORIES.md).

---

## 2. Timeline Overview

The following Gantt-style table provides a high-level view of all workstreams across the 24-month plan.

```
Month    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24
         |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
INFRA    ████ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░
AUTH     ████ ░░░░ ░░░░ ░░░░
ASSESS        ████ ████
E-GUIDE       ████ ████ ░░░░
TRACKING      ████ ████ ░░░░ ░░░░ ░░░░ ████ ████
TIPS               ████ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░
PAYMENTS                  ████ ░░░░
ANALYTICS                 ████ ░░░░ ████ ████ ████ ████ ████ ████
COACHING                            ████ ████ ░░░░ ░░░░ ░░░░ ░░░░ ████ ████ ████
NURSERY B2B                                   ████ ████ ░░░░ ░░░░ ████ ████ ████ ████ ████
MUNI B2B                                                ████ ████ ░░░░ ░░░░ ████ ████ ████ ████
COMMUNITY          ░░░░ ░░░░ ████ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ████ ████
L10N          ░░░░ ████           ░░░░ ░░░░ ████ ████                          ████ ████ ████
SPECIAL NEEDS                                                                 ████ ████ ████
EXPANSION                                                                                    ████ ████ ████ ████ ████ ████

████ = Active development    ░░░░ = Maintenance / iteration
```

**Key milestones:**

| Milestone              | Target Month | Gate                                |
|------------------------|--------------|-------------------------------------|
| Beta launch            | Month 3      | 100-500 beta testers recruited      |
| App store go-live      | Month 5      | iOS + Android approval              |
| 1,000 active users     | Month 6      | Retention rate above 30% at Day 30  |
| Premium coaching live   | Month 8      | 3+ consultants onboarded            |
| First nursery pilot    | Month 10     | 2-3 nursery partners signed         |
| Municipality MVP       | Month 12     | 1+ municipality pilot running       |
| 50+ nursery partners   | Month 15     | Scalable B2B onboarding flow        |
| Regional expansion     | Month 21     | 3+ countries live                   |
| Enterprise-grade       | Month 24     | SOC2/ISO compliance path started    |

---

## 3. Pre-Launch Phase — Months 1-3

### 3.1 Month 1: Foundation

**Objective:** Establish technical infrastructure, authentication, onboarding, and design system.

#### 3.1.1 Project Setup

| Task                                 | Duration | Dependencies | Owner          |
|--------------------------------------|----------|--------------|----------------|
| Initialize Flutter project (iOS + Android) | 2 days   | None         | Lead Dev       |
| Backend infrastructure provisioning  | 3 days   | None         | Lead Dev       |
| CI/CD pipeline (GitHub Actions, Fastlane) | 3 days   | Project init | Lead Dev       |
| Development, staging, production environments | 2 days | CI/CD        | Lead Dev       |
| Code quality tooling (linting, formatting, pre-commit hooks) | 1 day | Project init | Lead Dev |

> **Ref:** Infrastructure requirements are detailed in [03_TECHNICAL_ARCHITECTURE.md, Section: Infrastructure](./03_TECHNICAL_ARCHITECTURE.md).

#### 3.1.2 Database Schema Design

| Task                                  | Duration | Dependencies    | Owner          |
|---------------------------------------|----------|-----------------|----------------|
| Core schema design (users, children, assessments, progress) | 3 days | Infrastructure | Lead Dev |
| Schema implementation and migrations  | 2 days   | Schema design   | Backend Dev    |
| Seed data scripts for development     | 1 day    | Schema impl     | Backend Dev    |
| Database backup and recovery procedures | 1 day   | Schema impl     | Lead Dev       |

> **Ref:** Full data model specifications in [04_DATA_MODELS.md](./04_DATA_MODELS.md).

#### 3.1.3 Authentication System

| Task                                 | Duration | Dependencies | Owner          |
|--------------------------------------|----------|--------------|----------------|
| Email/password registration and login | 3 days  | Schema       | Backend Dev    |
| Social login (Google, Apple Sign-In) | 3 days   | Auth base    | Backend Dev    |
| Password reset flow                  | 1 day    | Auth base    | Backend Dev    |
| Session management and token refresh | 2 days   | Auth base    | Backend Dev    |
| Account deletion (GDPR requirement)  | 1 day    | Auth base    | Backend Dev    |

#### 3.1.4 User Onboarding Flow

| Task                                 | Duration | Dependencies | Owner          |
|--------------------------------------|----------|--------------|----------------|
| Account creation screens             | 2 days   | Auth         | Frontend Dev   |
| Language selection (EN, NL initially)| 1 day    | Account flow | Frontend Dev   |
| Welcome tutorial (3-5 screen walkthrough) | 3 days | Design system | Designer + Frontend Dev |
| Child profile creation               | 2 days   | Schema       | Frontend Dev   |
| Onboarding state persistence         | 1 day    | Backend      | Backend Dev    |

#### 3.1.5 Design System and Component Library

| Task                                 | Duration | Dependencies | Owner          |
|--------------------------------------|----------|--------------|----------------|
| Brand colors, typography, spacing tokens | 2 days | None        | Designer       |
| Core Flutter widget library (buttons, inputs, cards, modals) | 5 days | Brand tokens | Designer + Frontend Dev |
| Illustration and icon set            | 3 days   | Brand tokens | Designer       |
| Child-friendly visual language (mascot, stickers, badges) | 3 days | Brand tokens | Designer |
| Accessibility audit of component library | 1 day  | Widget library | Designer     |

#### 3.1.6 Readiness Assessment Database

| Task                                 | Duration | Dependencies | Owner          |
|--------------------------------------|----------|--------------|----------------|
| Research and compile assessment questions (expert-reviewed) | 5 days | None | Content + PM |
| Question database schema and seed data | 2 days | Schema       | Backend Dev    |
| Scoring algorithm design             | 2 days   | Questions    | PM + Backend Dev |

**Month 1 Deliverables:**
- Running Flutter app with auth on both platforms
- Backend deployed to staging environment
- CI/CD pushing builds on every merge
- Design system documented and implemented as Flutter package
- Readiness assessment question bank compiled

---

### 3.2 Month 2: Core Features

**Objective:** Build the three signature features — readiness assessment, method selection, and progress tracking.

#### 3.2.1 Child Readiness Assessment

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Assessment questionnaire UI (multi-step form) | 3 days | Design system, Question DB | Frontend Dev |
| Scoring algorithm implementation     | 2 days   | Algorithm design   | Backend Dev    |
| Result display screen (score, readiness level, explanation) | 2 days | Scoring | Frontend Dev |
| "Not yet ready" guidance path        | 1 day    | Results            | Frontend Dev   |
| Assessment history and re-take logic | 1 day    | Backend            | Backend Dev    |

#### 3.2.2 Parent Readiness Assessment

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Parent-focused questionnaire (lifestyle, schedule, commitment) | 2 days | Question DB | Frontend Dev |
| Scoring and result display           | 1 day    | Scoring engine     | Backend Dev    |
| Recommendations based on combined child+parent scores | 2 days | Both assessments | Backend Dev |

#### 3.2.3 Method Selection Tool

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Method questionnaire (preferences, child temperament, schedule) | 3 days | Design system | Frontend Dev |
| Recommendation engine (rule-based, maps answers to methods) | 3 days | Question design | Backend Dev |
| Method detail screens (description, pros/cons, daily schedule) | 2 days | Content | Frontend Dev |
| Method comparison view               | 1 day    | Method data        | Frontend Dev   |

> **Ref:** Method definitions and recommendation logic detailed in [01_PRD.md, Section: Method Selection](./01_PRD.md).

#### 3.2.4 Basic E-Guide Generator

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Template system (section templates per method) | 3 days | Method data | Backend Dev |
| Personalization engine (child name, age, method, preferences injected into templates) | 3 days | Templates | Backend Dev |
| PDF generation and display           | 2 days   | Templates          | Backend Dev    |
| E-Guide download and offline viewing | 1 day    | PDF generation     | Frontend Dev   |

#### 3.2.5 Progress Tracking — Daily Logging

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Daily log entry screen (success/accident, time, location, notes) | 3 days | Design system | Frontend Dev |
| Log persistence and sync             | 2 days   | Schema             | Backend Dev    |
| Basic progress timeline view (calendar or list) | 3 days | Log data    | Frontend Dev   |
| Daily summary and streak counter     | 1 day    | Log data           | Frontend Dev   |

#### 3.2.6 Basic Dashboard

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Dashboard layout (current day, child status, quick actions) | 2 days | Design system | Frontend Dev |
| Progress chart (successes vs. accidents over time) | 2 days | Log data | Frontend Dev |
| Quick-log widget on dashboard        | 1 day    | Daily log          | Frontend Dev   |
| Today's tip card                     | 1 day    | Tip content        | Frontend Dev   |

**Month 2 Deliverables:**
- Both readiness assessments functional with scoring
- Method selection tool recommending from 5+ methods
- Personalized e-guide generation
- Daily progress logging with timeline view
- Dashboard with progress charts

---

### 3.3 Month 3: Polish and Beta

**Objective:** Add supporting features, localize, recruit beta testers, and stabilize.

#### 3.3.1 Tips and Reminders System

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Tips content database (100+ tips, tagged by method, phase, challenge) | 5 days | Content team | Content + PM |
| Tip delivery logic (contextual: based on child age, method, day of training) | 3 days | Tip DB | Backend Dev |
| Push notification integration (Firebase Cloud Messaging) | 2 days | Infrastructure | Backend Dev |
| Reminder scheduling (customizable times, frequency) | 2 days | Push notifications | Backend Dev |
| Tip display cards with save/bookmark | 1 day    | Tip delivery       | Frontend Dev   |

#### 3.3.2 Basic Milestone Celebrations

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Milestone definition (first success, 3-day streak, dry night, etc.) | 1 day | PM | PM |
| Milestone detection logic            | 2 days   | Progress data      | Backend Dev    |
| Celebration animations and badges    | 3 days   | Design system      | Designer + Frontend Dev |
| Badge collection screen              | 1 day    | Badges             | Frontend Dev   |

#### 3.3.3 FAQ Section

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| FAQ content compilation (30+ questions, expert-reviewed) | 3 days | None | Content + PM |
| Searchable FAQ interface             | 2 days   | FAQ content        | Frontend Dev   |
| Deep linking from tips/guides to FAQ | 1 day    | FAQ                | Frontend Dev   |

#### 3.3.4 Settings and Profile Management

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Profile editing (parent info, child info) | 2 days | Auth          | Frontend Dev   |
| Notification preferences             | 1 day    | Push notifications | Frontend Dev   |
| Language switching                   | 1 day    | L10n framework     | Frontend Dev   |
| Data export (GDPR)                   | 1 day    | Backend            | Backend Dev    |
| Account deletion with confirmation   | 1 day    | Auth               | Backend Dev    |

#### 3.3.5 Beta Testing

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| TestFlight (iOS) and internal testing (Android) setup | 1 day | CI/CD | Lead Dev |
| Beta tester recruitment (parenting forums, social media, existing Go Potty users) | 5 days | Marketing | PM + Marketing |
| In-app feedback mechanism            | 2 days   | Infrastructure     | Frontend Dev   |
| Beta feedback collection and triage  | Ongoing  | Beta launch        | PM             |
| Bug fixing sprint (2 weeks)          | 10 days  | Beta feedback      | All Devs       |

#### 3.3.6 Performance and UX Optimization

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| App startup time optimization (target: under 2 seconds) | 2 days | All features | Lead Dev |
| Offline mode (cache assessments, logs, tips) | 3 days | All features | Backend Dev |
| Image/asset optimization             | 1 day    | Design assets      | Frontend Dev   |
| UX audit and refinement              | 3 days   | Beta feedback      | Designer       |

#### 3.3.7 Localization Framework

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Flutter l10n setup (ARB files, intl package) | 2 days | None         | Frontend Dev   |
| English string extraction            | 2 days   | All UI             | Frontend Dev   |
| Dutch translation                    | 3 days   | English strings    | Translator     |
| RTL layout preparation (for Arabic later) | 1 day | L10n setup    | Frontend Dev   |

**Month 3 Deliverables:**
- 100+ contextual tips with push notification delivery
- Milestone celebrations with badges
- Searchable FAQ
- Settings and profile management
- 100-500 beta testers actively using the app
- English and Dutch localization
- App startup under 2 seconds
- Offline mode for core features

---

## 4. Launch Phase — Months 4-6

### 4.1 Month 4: Launch Preparation

**Objective:** Prepare for public release — payments, legal compliance, app store submission.

#### 4.1.1 App Store Submission

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|---------------------|----------------|
| App Store Connect setup (screenshots, description, keywords) | 3 days | Stable build | PM + Designer |
| Google Play Console setup            | 2 days   | Stable build       | PM + Designer  |
| App review guidelines compliance check | 2 days  | Both stores        | Lead Dev       |
| Age rating classification            | 1 day    | Store setup        | PM             |
| Submit for review (allow 1-2 week buffer) | 1 day | All above         | Lead Dev       |

#### 4.1.2 Marketing Website

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Landing page finalization (value prop, screenshots, testimonials) | 5 days | Design | Designer + Frontend Dev |
| SEO optimization                     | 2 days   | Website            | Marketing      |
| App store badge links                | 1 day    | Store listings     | Frontend Dev   |
| Blog setup for content marketing     | 2 days   | Website            | Marketing      |

#### 4.1.3 Payment Integration

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| RevenueCat SDK integration (iOS + Android) | 3 days | None          | Backend Dev    |
| Stripe backend setup for web payments | 2 days  | None               | Backend Dev    |
| Premium subscription products (6-month at 37.45 GBP) | 1 day | RevenueCat | PM + Backend Dev |
| Free trial flow (if applicable)      | 1 day    | Products           | Frontend Dev   |
| Premium feature gating (coaching, advanced analytics, full e-guide) | 3 days | Products | Frontend Dev |
| Receipt validation and entitlement sync | 2 days | RevenueCat        | Backend Dev    |
| Subscription management UI (cancel, restore) | 1 day | Entitlements  | Frontend Dev   |

> **Ref:** Pricing tiers defined in [01_PRD.md, Section: Pricing](./01_PRD.md).

#### 4.1.4 Analytics Setup

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Mixpanel/Amplitude SDK integration   | 2 days   | None               | Backend Dev    |
| Core event tracking (sign-up, assessment, log entry, tip viewed, premium conversion) | 3 days | SDK | Backend Dev |
| Funnel definitions (onboarding, assessment-to-tracking, free-to-premium) | 1 day | Events | PM |
| Dashboard creation for key metrics   | 1 day    | Events             | PM             |
| Crash reporting (Sentry/Crashlytics) | 1 day    | None               | Lead Dev       |

#### 4.1.5 Legal and Compliance

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Terms of Service drafting            | 3 days   | Legal counsel      | PM + Legal     |
| Privacy Policy (GDPR-compliant, child data provisions) | 3 days | Legal counsel | PM + Legal |
| Cookie consent (web)                 | 1 day    | Privacy Policy     | Frontend Dev   |
| Data Processing Agreement template (for B2B later) | 2 days | Legal counsel | PM + Legal |
| In-app consent flows                 | 1 day    | ToS + Privacy      | Frontend Dev   |

#### 4.1.6 Customer Support System

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Help desk setup (Intercom/Zendesk)   | 2 days   | None               | PM             |
| In-app support chat widget           | 1 day    | Help desk          | Frontend Dev   |
| FAQ integration with help desk       | 1 day    | FAQ + Help desk    | PM             |
| Support response templates           | 2 days   | Help desk          | Support Lead   |

**Month 4 Deliverables:**
- Apps submitted to both stores
- Payment system live with premium gating
- Analytics tracking all core events
- Legal documents published
- Customer support system operational

---

### 4.2 Month 5: Public Launch

**Objective:** Go live, execute marketing plan, acquire first users.

#### 4.2.1 App Store Go-Live

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| App store approval monitoring        | Ongoing  | Submission         | Lead Dev       |
| Launch day checklist execution       | 1 day    | Approval           | All            |
| Post-launch smoke testing            | 1 day    | Go-live            | QA             |
| Hotfix readiness (fast-track CI/CD)  | Ongoing  | Go-live            | Lead Dev       |

#### 4.2.2 Marketing Campaign

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Social media campaign (Instagram, Facebook, TikTok — parenting audiences) | Ongoing | Go-live | Marketing |
| Content marketing (blog posts: potty training tips, sustainability) | Ongoing | Blog | Marketing |
| Influencer outreach (parenting bloggers, eco-conscious influencers) | 10 days | Go-live | Marketing |
| Paid acquisition testing (Facebook Ads, Google UAC) | Ongoing | Budget approval | Marketing |
| PR campaign (sustainability angle: nappy waste, anti-nappy-industry narrative) | 5 days | Go-live | Marketing + PR |

**Initial user acquisition targets:**

| Metric               | Month 5 Target | Month 6 Target |
|-----------------------|----------------|----------------|
| Downloads             | 1,000          | 3,000          |
| Registered users      | 700            | 2,000          |
| DAU                   | 200            | 500            |
| Assessment completed  | 500            | 1,500          |

#### 4.2.3 Community Features (Basic)

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Success story submission form        | 2 days   | Auth               | Frontend Dev   |
| Success story feed (moderated)       | 3 days   | Submission form    | Frontend + Backend Dev |
| Experience sharing (text posts)      | 2 days   | Feed               | Frontend Dev   |
| Content moderation queue             | 2 days   | Posts              | Backend Dev    |
| Report/flag mechanism                | 1 day    | Posts              | Frontend Dev   |

#### 4.2.4 Customer Support Ramp-Up

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Support team training on product     | 2 days   | Help desk          | PM             |
| Escalation procedures                | 1 day    | Training           | Support Lead   |
| Response time SLA (under 24 hours)   | Ongoing  | Training           | Support Lead   |
| Weekly support ticket review         | Ongoing  | Go-live            | PM             |

**Month 5 Deliverables:**
- Apps live on both stores
- Marketing campaigns running
- Community features (basic) live
- Customer support handling tickets within SLA
- First 1,000 downloads

---

### 4.3 Month 6: Optimize

**Objective:** Analyze launch data, optimize conversion, begin coaching portal.

#### 4.3.1 Launch Metrics Analysis

| Metric                  | Target         | Action if Below Target                    |
|-------------------------|----------------|-------------------------------------------|
| Day 1 retention         | > 60%          | Revise onboarding, reduce friction        |
| Day 7 retention         | > 40%          | Improve push notification relevance       |
| Day 30 retention        | > 25%          | Add engagement loops, more content        |
| Assessment completion   | > 70% of new users | Shorten or simplify assessment         |
| Free-to-premium conversion | > 3%        | Adjust paywall placement, add trial       |
| App store rating        | > 4.0          | Prioritize bug fixes, add rating prompt   |
| NPS                     | > 40           | Address top complaints                    |

#### 4.3.2 A/B Testing

| Test                              | Duration | Hypothesis                              |
|-----------------------------------|----------|-----------------------------------------|
| Onboarding length (3 vs. 5 screens) | 2 weeks | Shorter onboarding increases completion |
| Paywall timing (day 3 vs. day 7) | 2 weeks  | Later paywall increases trial conversion |
| Assessment result framing         | 2 weeks  | Positive framing increases retention     |
| Push notification frequency       | 2 weeks  | 2x/day outperforms 1x/day for engagement|

#### 4.3.3 Premium Conversion Optimization

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Premium value proposition refinement | 2 days   | Usage data         | PM             |
| In-app upsell moments (contextual)  | 3 days   | Analytics          | Frontend Dev   |
| Social proof (testimonials, user count) | 1 day  | Community data     | Frontend Dev   |
| Limited-time offer experiment        | 1 day    | Payment system     | PM + Backend Dev |

#### 4.3.4 Coaching Portal Development (Begin)

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Coaching feature requirements finalization | 3 days | User feedback  | PM             |
| Consultant-side web dashboard wireframes | 3 days | Requirements   | Designer       |
| Parent-side coaching UI mockups      | 2 days   | Requirements       | Designer       |
| Backend schema for coaching (appointments, messages, notes) | 3 days | Schema | Backend Dev |

> **Ref:** Coaching user stories in [02_USER_STORIES.md, Section: Coaching](./02_USER_STORIES.md).

#### 4.3.5 Content Expansion

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Additional tips (target: 200+ total) | Ongoing  | Tip database       | Content        |
| Challenge-specific guides (regression, refusal, fear of toilet, night-time) | 5 days | Content research | Content + PM |
| Expert Q&A content                   | 3 days   | Expert input       | Content        |

**Month 6 Deliverables:**
- Comprehensive analytics dashboard
- At least 2 A/B tests completed with results
- Premium conversion rate at or above 3%
- Coaching portal wireframes approved
- 200+ tips in content library
- 3,000+ total downloads

---

## 5. Post-Launch Growth — Months 7-12

### 5.1 Months 7-8: Premium and Coaching

**Objective:** Launch premium coaching, advanced analytics, and expand language support.

#### 5.1.1 Premium Coaching Portal

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Consultant web dashboard (React/Next.js) | 8 days | Wireframes      | Frontend Dev   |
| Consultant profile and availability management | 3 days | Dashboard    | Frontend Dev   |
| Parent-consultant matching algorithm | 3 days   | Consultant profiles| Backend Dev    |
| In-app messaging (parent to consultant) | 5 days | Schema           | Full-stack Dev |
| Appointment scheduling (calendar integration) | 4 days | Dashboard    | Full-stack Dev |
| Session notes (consultant-side)      | 2 days   | Dashboard          | Frontend Dev   |
| Video/voice call integration (optional: Twilio/Agora) | 5 days | Infrastructure | Backend Dev |

#### 5.1.2 Consultant Onboarding

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Consultant application and vetting flow | 3 days | Dashboard        | Backend Dev    |
| Onboarding training materials        | 3 days   | Dashboard          | Content + PM   |
| Credential verification system       | 2 days   | Application flow   | Backend Dev    |
| Consultant agreement and contracts   | 2 days   | Legal              | PM + Legal     |

**Target:** 3+ consultants onboarded and active by end of Month 8.

#### 5.1.3 Guarantee Tracking and Refund Process

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Guarantee eligibility criteria implementation (e.g., used app for 30+ days, completed program) | 3 days | Progress data | Backend Dev |
| Refund request flow (in-app form)    | 2 days   | Eligibility logic  | Frontend Dev   |
| Refund processing (Stripe/RevenueCat) | 2 days  | Payment system     | Backend Dev    |
| Guarantee dashboard (admin view)     | 1 day    | Refund system      | Frontend Dev   |

#### 5.1.4 Advanced Progress Analytics

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Pattern detection (time-of-day trends, day-of-week patterns) | 3 days | Progress data | Backend Dev |
| Regression detection and alerts      | 3 days   | Pattern detection  | Backend Dev    |
| Predictive completion estimate ("your child is X% through") | 2 days | Patterns | Backend Dev |
| Advanced charts (heatmaps, trend lines) | 3 days | Analytics data   | Frontend Dev   |
| Push notification for regression alerts | 1 day  | Regression detect  | Backend Dev    |

#### 5.1.5 Additional Languages

| Language | Duration | Dependencies       | Owner          |
|----------|----------|--------------------|----------------|
| Arabic   | 5 days   | RTL layout support | Translator + Frontend Dev |
| Turkish  | 3 days   | L10n framework     | Translator     |
| Polish   | 3 days   | L10n framework     | Translator     |

**Post-Month 8: 5 languages live** (English, Dutch, Arabic, Turkish, Polish).

**Months 7-8 Deliverables:**
- Premium coaching with messaging and scheduling
- 3+ active consultants
- 100% guarantee tracking and refund flow
- Advanced analytics with regression alerts
- 5 languages supported

---

### 5.2 Months 9-10: B2B Foundation

**Objective:** Build and pilot the nursery dashboard — the first B2B product.

#### 5.2.1 Nursery Dashboard MVP

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Nursery admin web portal (Next.js)   | 8 days   | Design             | Frontend Dev   |
| Child progress overview (aggregated view across enrolled children) | 5 days | Progress data | Full-stack Dev |
| Staff account management (invite, roles, permissions) | 4 days | Auth system | Backend Dev |
| Savings calculator (nappy cost savings per child, CO2 reduction) | 3 days | Data models | Full-stack Dev |
| Nursery branding customization (logo, colors) | 2 days | Dashboard      | Frontend Dev   |
| Reporting (weekly/monthly PDF reports) | 3 days  | Progress data      | Backend Dev    |

> **Ref:** B2B data models in [04_DATA_MODELS.md, Section: Organization Models](./04_DATA_MODELS.md).

#### 5.2.2 Staff E-Learning Module

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| E-learning content creation (5-10 modules on potty training methods) | 10 days | Expert input | Content + PM |
| Module delivery system (video + text + quiz) | 5 days | Content       | Full-stack Dev |
| Completion tracking and certificates | 2 days   | Module system      | Backend Dev    |
| Staff progress dashboard             | 2 days   | Tracking           | Frontend Dev   |

#### 5.2.3 Nursery Onboarding Flow

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Nursery registration and verification | 3 days  | Dashboard          | Backend Dev    |
| Bulk child enrollment (CSV import)   | 2 days   | Dashboard          | Backend Dev    |
| Parent consent collection workflow   | 3 days   | Legal              | Full-stack Dev |
| Nursery-parent linking (parents receive app invite) | 2 days | Auth  | Backend Dev    |

#### 5.2.4 Nursery Pilot Program

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Recruit 2-3 nursery partners         | 10 days  | Dashboard MVP      | PM + BD        |
| Pilot onboarding (in-person or video) | 2 days per nursery | Recruitment | PM       |
| Weekly check-in calls with pilot nurseries | Ongoing | Pilot start   | PM             |
| Feedback collection and iteration    | Ongoing  | Pilot              | PM + Dev team  |

**Pilot success criteria:**
- 80%+ staff complete e-learning
- 50%+ enrolled children have active app usage by parents
- Positive NPS from nursery staff (> 30)
- At least 1 testimonial / case study

#### 5.2.5 Organization Management

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Multi-user organization accounts     | 3 days   | Auth               | Backend Dev    |
| Role-based access control (admin, staff, viewer) | 3 days | Org accounts | Backend Dev |
| Organization billing (B2B invoicing) | 3 days   | Payment system     | Backend Dev    |
| Organization settings and preferences | 1 day   | Org accounts       | Frontend Dev   |

**Months 9-10 Deliverables:**
- Nursery dashboard MVP with child progress and staff accounts
- Staff e-learning with 5+ modules
- 2-3 nursery pilots running
- Organization management with RBAC
- B2B billing infrastructure

---

### 5.3 Months 11-12: Scale and Iterate

**Objective:** Launch municipality MVP, build B2B sales pipeline, and reflect on Year 1.

#### 5.3.1 Municipality Dashboard MVP

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Municipality admin portal            | 8 days   | Nursery dashboard  | Frontend Dev   |
| Aggregate data dashboard (participation rates, completion rates across nurseries) | 5 days | Data pipeline | Backend Dev |
| Waste reduction tracking (nappies saved, kg waste avoided) | 3 days | Participation data | Backend Dev |
| CO2 impact calculator and visualization | 2 days | Waste data        | Full-stack Dev |
| Exportable reports (PDF, CSV) for municipal reporting | 3 days | Dashboard     | Backend Dev    |
| Multi-nursery management (add/remove nurseries under municipality) | 2 days | Org management | Backend Dev |

#### 5.3.2 B2B Sales Tools

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Sales deck and pitch materials       | 5 days   | Pilot results      | PM + Marketing |
| ROI calculator (input: number of children; output: cost savings, waste reduction) | 3 days | Data | Full-stack Dev |
| Case studies from nursery pilots     | 5 days   | Pilot data         | Marketing + PM |
| Demo environment (pre-populated with sample data) | 2 days | Dashboard   | Backend Dev    |
| B2B pricing page on website          | 2 days   | Pricing model      | Frontend Dev   |

#### 5.3.3 Advanced Community Features

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Community categories (by method, age group, challenge) | 2 days | Community base | Backend Dev |
| Search functionality within community | 2 days  | Categories         | Backend Dev    |
| Expert-marked answers                | 1 day    | Moderation         | Backend Dev    |
| Community guidelines and automated moderation (keyword filters) | 2 days | Moderation | Backend Dev |

#### 5.3.4 Year 1 Retrospective

| Activity                             | Duration | Owner              |
|--------------------------------------|----------|--------------------|
| Comprehensive metrics review         | 2 days   | PM + Leadership    |
| User interview synthesis (10+ interviews) | 3 days | PM + UX Research |
| Technical debt audit                 | 2 days   | Lead Dev           |
| Product roadmap refinement for Year 2 | 3 days  | PM + Leadership    |
| Team growth planning                 | 2 days   | Leadership         |

**Year 1 target metrics:**

| Metric                          | Target       |
|---------------------------------|--------------|
| Total downloads                 | 15,000+      |
| Monthly active users (MAU)      | 5,000+       |
| Premium subscribers             | 500+         |
| B2B nursery partners            | 5-10         |
| B2B municipality pilots         | 1-2          |
| Languages supported             | 5            |
| App store rating                | 4.3+         |
| NPS                             | 45+          |
| Monthly recurring revenue (MRR) | 5,000+ GBP   |

**Months 11-12 Deliverables:**
- Municipality dashboard MVP with impact tracking
- B2B sales collateral and case studies
- Advanced community features
- Year 1 retrospective completed
- Year 2 roadmap approved

---

## 6. Year 2 Plan — Months 13-24

### 6.1 Q1: Months 13-15

**Theme:** Scale B2B partnerships, advance AI personalization.

#### 6.1.1 Nursery Partnership Scaling

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Self-serve nursery onboarding (no manual intervention) | 5 days | Onboarding flow | Full-stack Dev |
| Nursery directory and discovery      | 3 days   | Onboarding         | Full-stack Dev |
| Referral program for nurseries       | 3 days   | Billing            | Backend Dev    |
| Dedicated B2B account manager workflows | 2 days | CRM               | PM + Sales     |

**Target: 50+ nursery partners by end of Month 15.**

#### 6.1.2 Municipality Expansion

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Municipality onboarding playbook     | 3 days   | Pilot learnings    | PM + Sales     |
| Cross-municipality benchmarking      | 3 days   | Multi-muni data    | Backend Dev    |
| Public impact dashboard (shareable link) | 3 days | Municipality data | Full-stack Dev |
| Integration with municipal data systems (API) | 5 days | API design     | Backend Dev    |

**Target: 5+ cities in pilot or active by Month 15.**

#### 6.1.3 AI-Powered Personalization

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| ML model for tip recommendation (collaborative filtering on anonymized usage data) | 10 days | Analytics data | ML Engineer |
| Personalized daily schedule suggestions | 5 days | ML model          | Backend Dev    |
| Adaptive difficulty (adjust expectations based on child's pace) | 3 days | Progress data | Backend Dev |
| AI-generated encouragement messages  | 3 days   | LLM integration    | Backend Dev    |

#### 6.1.4 Advanced B2B Reporting

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Custom report builder (select metrics, date range, filters) | 5 days | Dashboard | Full-stack Dev |
| Scheduled report delivery (email)    | 2 days   | Report builder     | Backend Dev    |
| Comparative analytics (nursery vs. nursery, region vs. region) | 3 days | Multi-org data | Backend Dev |
| White-label report branding          | 2 days   | Report builder     | Frontend Dev   |

**Q1 Deliverables:**
- Self-serve nursery onboarding
- 50+ nursery partners
- 5+ municipality pilots
- AI-driven tip personalization
- Custom B2B reporting

---

### 6.2 Q2: Months 16-18

**Theme:** Special needs support, advanced coaching, partner APIs.

#### 6.2.1 Special Needs Features

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Expert consultation on special needs potty training (autism, developmental delays, physical disabilities) | 5 days | Expert network | PM + Content |
| Adapted assessment questionnaires    | 5 days   | Expert input       | Content + Backend Dev |
| Modified methods and timelines       | 5 days   | Expert input       | Content + Backend Dev |
| Sensory-friendly UI mode (reduced animations, high contrast, simplified layouts) | 3 days | Design | Frontend Dev |
| Special needs e-guide templates      | 5 days   | Expert input       | Content + Backend Dev |
| Healthcare provider integration (share progress with pediatrician) | 4 days | API | Backend Dev |

#### 6.2.2 Advanced Coaching Tools

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Video call integration (1:1 sessions via Twilio/Agora) | 5 days | Coaching portal | Backend Dev |
| Screen sharing for guided walkthroughs | 3 days | Video calls       | Frontend Dev   |
| Coaching session recording and playback | 3 days | Video calls       | Backend Dev    |
| Consultant analytics (session count, client outcomes, ratings) | 3 days | Coaching data | Backend Dev |
| Group coaching sessions (webinar-style for common challenges) | 5 days | Video infra | Full-stack Dev |

#### 6.2.3 B2B API for Partner Integrations

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| REST API design (OpenAPI spec)       | 3 days   | Data models        | Backend Dev    |
| API authentication (API keys, OAuth2) | 3 days  | API design         | Backend Dev    |
| Core endpoints: children, progress, reports | 5 days | API auth      | Backend Dev    |
| Rate limiting and usage tracking     | 2 days   | API                | Backend Dev    |
| API documentation portal             | 3 days   | API                | Technical Writer |
| Webhook support (events: child enrolled, milestone reached) | 3 days | API | Backend Dev |

#### 6.2.4 Content Library Expansion

| Content Type                | Target Quantity | Duration |
|-----------------------------|-----------------|----------|
| Tips                        | 500+ total      | Ongoing  |
| Challenge-specific guides   | 50+ total       | Ongoing  |
| Video tutorials             | 20+             | 10 days  |
| Expert interviews / articles | 10+            | 5 days   |
| Special needs resources     | 30+             | 5 days   |

**Q2 Deliverables:**
- Special needs support across all app features
- Video coaching with recording
- Public B2B API with documentation
- 500+ tips, 50+ challenge guides
- Group coaching capability

---

### 6.3 Q3: Months 19-21

**Theme:** Regional expansion, cultural adaptation, advanced training modules.

#### 6.3.1 Regional Expansion

| Market      | Activities                                        | Duration |
|-------------|---------------------------------------------------|----------|
| UK          | Localization review, NHS/health visitor outreach, local marketing | 6 weeks |
| Germany     | German translation, local legal review (Datenschutz), nursery partnerships | 6 weeks |
| Nordics     | Swedish/Norwegian/Danish translations, municipal waste program alignment | 6 weeks |

For each new market:
- Local legal compliance review (2 days)
- Cultural content adaptation (potty training norms vary by culture) (5 days)
- Local payment methods (if applicable) (2 days)
- Local app store optimization (ASO) (2 days)
- Local PR and marketing plan (3 days)
- Local nursery/municipality partnership outreach (Ongoing)

#### 6.3.2 Cultural Adaptation

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Cultural research (toilet training norms by country) | 5 days | Market research | PM + Content |
| Method library expansion (culture-specific approaches) | 5 days | Research | Content |
| Age-norm calibration by market       | 2 days   | Research           | Backend Dev    |
| Local expert review of content       | 3 days   | Adapted content    | PM             |

#### 6.3.3 Advanced Night-Time Training Module

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Night-time readiness assessment      | 3 days   | Assessment system  | Full-stack Dev |
| Night-time specific methods and tips | 5 days   | Content research   | Content + PM   |
| Bedwetting tracking (separate from daytime) | 3 days | Progress system | Full-stack Dev |
| Night-time milestone celebrations    | 1 day    | Milestone system   | Frontend Dev   |
| Waterproof mattress protector partner integration (affiliate) | 2 days | Partnerships | PM |

#### 6.3.4 Sibling Management

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Multi-child profile management       | 3 days   | Profile system     | Full-stack Dev |
| Per-child progress and assessments   | 2 days   | Multi-child        | Backend Dev    |
| Sibling-aware tips (how to handle training with older/younger sibling) | 3 days | Content | Content |
| Dashboard switching between children | 1 day    | Multi-child        | Frontend Dev   |

**Q3 Deliverables:**
- Live in 3+ new markets (UK, Germany, Nordics)
- Cultural adaptations per market
- Night-time training module
- Multi-child / sibling support
- 8+ languages total

---

### 6.4 Q4: Months 22-24

**Theme:** Platform maturity, healthcare partnerships, research validation.

#### 6.4.1 Platform Scaling and Maturity

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Performance audit and optimization (handle 100K+ MAU) | 5 days | Infrastructure | Lead Dev |
| Database optimization (query performance, indexing) | 3 days | Audit           | Backend Dev    |
| CDN and edge caching for global content delivery | 2 days | Infrastructure  | Backend Dev    |
| Automated testing coverage to 80%+  | 5 days   | Codebase           | All Devs       |
| SOC2 / ISO 27001 compliance path (initial assessment) | 5 days | Legal + Security | Lead Dev + PM |
| Disaster recovery and business continuity plan | 3 days | Infrastructure   | Lead Dev       |

#### 6.4.2 Healthcare Provider Partnerships

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Pediatrician portal (view child progress with parent consent) | 5 days | API | Full-stack Dev |
| Health visitor integration (UK NHS) | 3 days   | UK market          | Backend Dev    |
| Referral pathway from healthcare to app | 3 days | Partnerships      | PM + BD        |
| Clinical-grade data export           | 2 days   | Portal             | Backend Dev    |
| Healthcare provider onboarding materials | 3 days | Portal            | Content + PM   |

#### 6.4.3 Research Publication (Leiden University)

| Task                                 | Duration | Dependencies       | Owner          |
|--------------------------------------|----------|--------------------|----------------|
| Data anonymization pipeline for research | 3 days | Data models      | Backend Dev    |
| Research data export tools           | 2 days   | Anonymization      | Backend Dev    |
| Collaboration with university research team | Ongoing | Partnership  | PM + Leadership |
| IRB/ethics approval support          | 2 days   | University         | PM + Legal     |

#### 6.4.4 Year 2 Retrospective and Growth Planning

| Activity                             | Duration | Owner              |
|--------------------------------------|----------|--------------------|
| Comprehensive Year 2 metrics review  | 3 days   | PM + Leadership    |
| Product-market fit analysis by segment | 2 days | PM + Leadership    |
| Technical architecture review for Year 3 scale | 3 days | Lead Dev + CTO |
| Year 3 roadmap and OKR planning      | 5 days   | Leadership         |
| Fundraising preparation (if applicable) | Ongoing | Leadership       |

**Year 2 target metrics:**

| Metric                          | Target         |
|---------------------------------|----------------|
| Total downloads                 | 100,000+       |
| MAU                             | 30,000+        |
| Premium subscribers             | 3,000+         |
| B2B nursery partners            | 100+           |
| B2B municipality partners       | 10+            |
| Countries active                | 5+             |
| Languages supported             | 8+             |
| App store rating                | 4.5+           |
| NPS                             | 55+            |
| ARR                             | 200,000+ GBP   |
| Team size                       | 20-25          |

**Q4 Deliverables:**
- Platform handling 100K+ MAU
- Healthcare provider portal
- Research data pipeline with Leiden University
- SOC2 compliance path initiated
- Year 3 roadmap approved

---

## 7. Critical Success Factors

### 7.1 Phase-Level Success Criteria

#### Pre-Launch (Months 1-3)

| Factor                       | Metric / Gate                                      |
|------------------------------|---------------------------------------------------|
| Technical foundation         | CI/CD green, staging environment stable            |
| Feature completeness         | All Month 2 core features passing QA               |
| Beta recruitment             | 100-500 testers recruited                          |
| Beta engagement              | 60%+ of beta testers complete assessment           |
| Bug density                  | Fewer than 5 P1 bugs at end of Month 3             |
| Performance                  | App startup under 2 seconds, no ANRs               |
| **Go/No-Go for Launch:**     | Beta NPS > 30, fewer than 3 P1 bugs, both store submissions accepted |

**Risk mitigation checkpoints:**
- Week 4: Infrastructure load test (simulate 1,000 concurrent users)
- Week 8: Feature freeze; only bug fixes after this point
- Week 10: Beta feedback triage complete; P1s resolved

**Resources:** 2 developers, 1 designer, 1 PM, 1 content writer. Budget: ~30,000 GBP/month.

#### Launch (Months 4-6)

| Factor                       | Metric / Gate                                      |
|------------------------------|---------------------------------------------------|
| Store approval               | Both iOS and Android approved                      |
| Downloads                    | 3,000+ by end of Month 6                           |
| Day 7 retention              | > 40%                                              |
| Premium conversion           | > 3%                                               |
| Crash-free rate              | > 99.5%                                            |
| Support response time        | < 24 hours average                                 |
| **Go/No-Go for Growth:**     | 2,000+ MAU, 3%+ conversion, 40%+ D7 retention     |

**Risk mitigation checkpoints:**
- Week 1 post-launch: Crash rate review, hotfix readiness
- Week 2 post-launch: Retention curve analysis
- Month 6: Comprehensive launch retrospective

**Resources:** 2 developers, 1 designer, 1 PM, 1 marketing, 3 consultants. Budget: ~45,000 GBP/month.

**Dependencies and blockers:**
- App store review timelines (allow 2-week buffer)
- Stripe/RevenueCat account approval
- Legal review completion

#### Post-Launch (Months 7-12)

| Factor                       | Metric / Gate                                      |
|------------------------------|---------------------------------------------------|
| Premium coaching uptake      | 50+ coaching sessions by Month 8                   |
| B2B pipeline                 | 10+ nursery leads, 2-3 signed pilots               |
| Nursery pilot satisfaction   | NPS > 30 from pilot nurseries                      |
| Revenue growth               | MRR 5,000+ GBP by Month 12                        |
| Platform stability           | 99.9% uptime                                       |
| **Go/No-Go for Year 2:**     | 5,000+ MAU, 5+ B2B partners, positive unit economics trajectory |

**Risk mitigation checkpoints:**
- Month 8: Coaching model viability review (consultant costs vs. revenue)
- Month 10: Nursery pilot mid-point review
- Month 12: Full Year 1 retrospective

**Resources:** 3 developers, 1 designer, 1 PM, 1 marketing, 1 B2B sales, 3+ consultants, 1 customer success. Budget: ~65,000 GBP/month.

**Dependencies and blockers:**
- Consultant recruitment and training
- Nursery partner willingness to pilot
- Municipality budget cycles (may delay pilots)

#### Year 2 (Months 13-24)

| Factor                       | Metric / Gate                                      |
|------------------------------|---------------------------------------------------|
| B2B scale                    | 100+ nurseries, 10+ municipalities                 |
| Revenue                      | ARR 200,000+ GBP                                   |
| Geographic expansion         | 5+ countries                                       |
| Platform reliability         | 99.95% uptime, < 200ms API p95                    |
| Team scaling                 | 20-25 team members                                 |
| **Go/No-Go for Year 3:**     | Positive contribution margin, clear path to profitability |

**Risk mitigation checkpoints:**
- Month 15: B2B scaling review (is self-serve onboarding working?)
- Month 18: Regional expansion ROI review
- Month 21: Technical debt and architecture review
- Month 24: Full Year 2 retrospective and fundraising readiness

**Resources:** 5-7 developers, 2 designers, 2 PMs, 2 marketing, 2 B2B sales, 5+ consultants, 2 customer success, 1 CTO, 1 content manager. Budget: ~120,000 GBP/month.

---

### 7.2 Universal Key Metrics Dashboard

The following metrics should be tracked continuously across all phases:

| Category        | Metric                  | Tracking Tool        | Review Cadence |
|-----------------|-------------------------|----------------------|----------------|
| Acquisition     | Downloads               | App Store Connect / Play Console | Daily |
| Acquisition     | Registration rate       | Mixpanel             | Daily          |
| Activation      | Assessment completion   | Mixpanel             | Daily          |
| Engagement      | DAU / MAU               | Mixpanel             | Daily          |
| Engagement      | Logs per user per week  | Internal analytics   | Weekly         |
| Retention       | D1 / D7 / D30 retention | Mixpanel             | Weekly         |
| Revenue         | MRR / ARR               | Stripe / RevenueCat  | Weekly         |
| Revenue         | Free-to-premium conversion | Mixpanel          | Weekly         |
| Satisfaction    | NPS                     | In-app survey        | Monthly        |
| Satisfaction    | App store rating        | App Store Connect    | Weekly         |
| B2B             | Nursery partners        | CRM                  | Weekly         |
| B2B             | Municipality partners   | CRM                  | Monthly        |
| Quality         | Crash-free rate         | Sentry / Crashlytics | Daily          |
| Quality         | Support ticket volume   | Intercom / Zendesk   | Daily          |

---

## 8. Team Scaling Plan

### 8.1 Team Composition by Phase

```
                    M1-3     M4-5     M6       M9       M12      M18      M24
                    ----     ----     --       --       ---      ---      ---
Developers           2        2       3        4        5        6        7
Designer             1        1       1        1        1        2        2
Product Manager      1        1       1        1        1        2        2
Marketing            0        1       1        1        1        1        2
B2B Sales            0        0       0        1        1        2        2
Consultants          3        3       3        3        5        5        5+
Customer Success     0        0       1        1        1        2        2
Content Manager      0        0       0        0        1        1        1
CTO / Tech Lead      0        0       0        0        1        1        1
ML Engineer          0        0       0        0        0        1        1
                    ---      ---      --       --       ---      ---      ---
TOTAL                7        8       10       12       17       23       25
```

### 8.2 Key Hiring Milestones

| Role              | Hire By   | Rationale                                          |
|-------------------|-----------|----------------------------------------------------|
| 3rd Developer     | Month 6   | Coaching portal development; reduce bus factor      |
| Customer Success  | Month 6   | Handle growing support volume post-launch           |
| Marketing Lead    | Month 4   | Pre-launch campaign preparation                     |
| B2B Sales         | Month 9   | Nursery partnership outreach requires dedicated effort |
| 4th Developer     | Month 9   | B2B dashboard development parallel to consumer app  |
| CTO / Tech Lead   | Month 12  | Technical leadership as team grows; architecture decisions |
| Content Manager   | Month 12  | Scaling content production (500+ tips, guides, e-learning) |
| ML Engineer       | Month 15  | AI personalization, predictive analytics            |
| 2nd Designer      | Month 18  | Multiple products (consumer app, nursery dashboard, municipality dashboard) |
| 2nd PM            | Month 18  | Dedicated B2B product management                    |

### 8.3 Consultant Team

| Phase         | Consultant Count | Focus                                      |
|---------------|------------------|--------------------------------------------|
| Months 1-6    | 3                | Beta testing support, content review, early coaching |
| Months 7-12   | 5                | Active premium coaching, nursery training   |
| Months 13-18  | 5-8              | Scaled coaching, special needs expertise    |
| Months 19-24  | 8-12             | Multi-language coaching, regional experts   |

---

## 9. Technology Milestones

### 9.1 Progressive Architecture Evolution

```
Month 1:  INFRASTRUCTURE & AUTH
          ┌─────────────────────────────────────────┐
          │  Flutter App (iOS + Android)             │
          │  ├── Auth (email + social)               │
          │  └── Onboarding flow                     │
          │                                          │
          │  Backend API                             │
          │  ├── User management                     │
          │  ├── Database (PostgreSQL)               │
          │  └── CI/CD pipeline                      │
          └─────────────────────────────────────────┘

Month 2:  CORE FEATURE SET
          ┌─────────────────────────────────────────┐
          │  + Assessments engine                    │
          │  + Method recommendation engine          │
          │  + E-Guide template + personalization    │
          │  + Progress tracking + daily logging     │
          │  + Dashboard with charts                 │
          └─────────────────────────────────────────┘

Month 3:  BETA-READY
          ┌─────────────────────────────────────────┐
          │  + Push notifications (FCM)              │
          │  + Tip delivery engine                   │
          │  + Milestone detection                   │
          │  + Offline mode (local cache + sync)     │
          │  + Localization framework (EN + NL)      │
          │  + Beta distribution (TestFlight + APK)  │
          └─────────────────────────────────────────┘

Month 4:  PRODUCTION-READY
          ┌─────────────────────────────────────────┐
          │  + Payment (RevenueCat + Stripe)         │
          │  + Premium feature gating                │
          │  + Analytics (Mixpanel)                  │
          │  + Crash reporting (Sentry)              │
          │  + Legal consent flows                   │
          │  + Customer support (Intercom)           │
          └─────────────────────────────────────────┘

Month 6:  ANALYTICS & OPTIMIZATION
          ┌─────────────────────────────────────────┐
          │  + A/B testing framework                 │
          │  + Funnel analytics                      │
          │  + Push notification A/B testing         │
          │  + Event-driven architecture (for        │
          │    real-time metric computation)          │
          └─────────────────────────────────────────┘

Month 9:  B2B PLATFORM
          ┌─────────────────────────────────────────┐
          │  + Nursery web dashboard (Next.js)       │
          │  + Multi-tenant organization model       │
          │  + RBAC (role-based access control)      │
          │  + E-learning module delivery system     │
          │  + B2B billing and invoicing             │
          └─────────────────────────────────────────┘

Month 12: FULL PLATFORM
          ┌─────────────────────────────────────────┐
          │  + Municipality dashboard                │
          │  + Aggregate analytics pipeline          │
          │  + Impact calculators (CO2, waste, cost) │
          │  + Advanced community (search, moderation│
          │  + PDF report generation                 │
          │  + 5 languages                           │
          └─────────────────────────────────────────┘

Month 18: AI & ADVANCED FEATURES
          ┌─────────────────────────────────────────┐
          │  + ML-driven tip personalization         │
          │  + Predictive analytics (completion est) │
          │  + Video call integration (coaching)     │
          │  + Public B2B REST API + webhooks        │
          │  + Special needs adaptations             │
          │  + 8+ languages                          │
          └─────────────────────────────────────────┘

Month 24: ENTERPRISE-GRADE PLATFORM
          ┌─────────────────────────────────────────┐
          │  + SOC2 compliance path                  │
          │  + Healthcare provider portal            │
          │  + Research data pipeline                │
          │  + 100K+ MAU capacity                    │
          │  + Disaster recovery                     │
          │  + Automated test coverage 80%+          │
          │  + Multi-region deployment               │
          └─────────────────────────────────────────┘
```

### 9.2 Technical Debt Management

Technical debt is addressed continuously but with dedicated sprints:

| Sprint         | Timing      | Focus                                          |
|----------------|-------------|------------------------------------------------|
| Debt Sprint 1  | Month 6     | Post-launch cleanup, remove beta-only code     |
| Debt Sprint 2  | Month 9     | Pre-B2B architecture review, database indexing  |
| Debt Sprint 3  | Month 12    | Year 1 comprehensive cleanup, dependency updates|
| Debt Sprint 4  | Month 15    | Scalability preparation, API versioning         |
| Debt Sprint 5  | Month 18    | Security hardening, compliance preparation      |
| Debt Sprint 6  | Month 21    | Multi-region prep, performance optimization     |
| Debt Sprint 7  | Month 24    | Enterprise readiness, architecture documentation|

**Rule:** No more than 20% of any sprint should be new technical debt creation. Allocate 15-20% of each sprint to debt reduction.

---

## 10. Risk Register and Mitigation

| ID   | Risk                                          | Probability | Impact | Mitigation                                           | Owner     |
|------|-----------------------------------------------|-------------|--------|------------------------------------------------------|-----------|
| R01  | App store rejection (content/privacy issues)  | Medium      | High   | Pre-submission compliance audit; 2-week buffer        | Lead Dev  |
| R02  | Low user retention after launch               | Medium      | High   | Strong onboarding, push notifications, A/B testing    | PM        |
| R03  | Premium conversion below 2%                   | Medium      | High   | Multiple paywall tests, value demonstration, trials   | PM        |
| R04  | Consultant recruitment difficulties            | Low         | Medium | Partner with training institutes; competitive pay     | PM + HR   |
| R05  | B2B sales cycle longer than expected           | High        | Medium | Start outreach early (Month 7); offer free pilots     | Sales     |
| R06  | Municipality budget/procurement delays         | High        | Medium | Align with budget cycles; offer pilot at no cost      | Sales     |
| R07  | Competitor launches similar app                | Medium      | Medium | Focus on expert content, 100% guarantee, B2B moat     | Leadership|
| R08  | Key developer leaves                          | Low         | High   | Documentation, code reviews, knowledge sharing        | Lead Dev  |
| R09  | Data breach / GDPR violation                  | Low         | Critical | Security audits, encryption, access controls, DPO  | Lead Dev  |
| R10  | Content quality issues (wrong advice)          | Low         | Critical | Expert review process, medical disclaimer, versioning | PM + Content |
| R11  | Scaling issues at 50K+ users                  | Medium      | High   | Load testing quarterly, auto-scaling, caching         | Lead Dev  |
| R12  | Translation quality in new languages           | Medium      | Medium | Native speaker review, in-context QA, community feedback | PM    |
| R13  | Burnout in small team                         | Medium      | High   | Sustainable pace, hire ahead of need, no crunch        | Leadership|

---

*This roadmap is a living document. It will be reviewed and updated monthly during the first year and quarterly during the second year. All timeline estimates assume adequate funding and hiring proceeding on schedule. Significant deviations from key metrics should trigger a roadmap review.*

*Cross-references: [01_PRD.md](./01_PRD.md) | [02_USER_STORIES.md](./02_USER_STORIES.md) | [03_TECHNICAL_ARCHITECTURE.md](./03_TECHNICAL_ARCHITECTURE.md) | [04_DATA_MODELS.md](./04_DATA_MODELS.md)*