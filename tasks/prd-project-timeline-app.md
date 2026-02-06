# PRD: Project Timeline App

## Introduction

The Project Timeline App is a central communication hub for agile teams that transforms spoken communication into searchable, structured knowledge. Teams can record or upload audio from stand-ups, retrospectives, and ad-hoc meetings, which is automatically transcribed, summarized, and made discoverable through an intuitive timeline interface.

**Problem Solved:** Valuable information from daily agile ceremonies often gets lost. New team members lack context, decisions are forgotten, and the same discussions are repeated. This app provides a single source of truth for all team communication.

**Target Users:** Agile software development teams (5-20 people) using Scrum or Kanban methodologies, including Scrum Masters, Senior Developers, new developers, and Product Owners.

## Goals

- Enable teams to upload audio recordings (meetings, voice notes) and automatically transcribe them
- Provide AI-powered summaries at entry, day, and week levels
- Offer an intuitive horizontal timeline visualization for navigating project history
- Make all content searchable with filters for time, subteam, content type, and participants
- Support team and subteam management with role-based access control
- Deliver a complete v1.0 product with authentication, file storage, and processing infrastructure

## User Stories

### Foundation & Authentication

### US-001: Set up Next.js project with Convex and Clerk
**Description:** As a developer, I need to initialize the project with required dependencies so the app has a solid foundation.

**Acceptance Criteria:**
- [ ] Create Next.js 14+ project with App Router
- [ ] Install and configure @convex-dev/client and convex packages
- [ ] Install and configure Clerk for authentication
- [ ] Install shadcn/ui components and configure Tailwind CSS
- [ ] Set up environment variables template
- [ ] Project builds and runs locally without errors

### US-002: Configure Clerk authentication with multiple providers
**Description:** As a user, I want to sign up using email/password or social login (Google/Microsoft) so I can easily create an account.

**Acceptance Criteria:**
- [ ] Clerk component configured in layout
- [ ] Email/password authentication enabled
- [ ] Google OAuth provider configured
- [ ] Microsoft OAuth provider configured
- [ ] Sign-up and sign-in pages render correctly
- [ ] User can successfully register and login with both methods
- [ ] User session persists across page refreshes
- [ ] Verify in browser using dev-browser skill

### US-003: Create Convex data models for core entities
**Description:** As a developer, I need to define the database schema so that application data can be stored and queried.

**Acceptance Criteria:**
- [ ] Define User schema with clerkId, name, email, and role fields
- [ ] Define Team schema with name, description, and organizationId
- [ ] Define SubTeam schema with name, color, and teamId reference
- [ ] Define TeamMembership schema linking users to teams with roles
- [ ] Define Entry schema with type, title, date, status, and references
- [ ] Define EntryAttendee schema for participant tracking
- [ ] Define FileMetadata schema for MinIO file references
- [ ] Define Summary schema for AI-generated summaries
- [ ] Define Notification schema for in-app notifications
- [ ] Define ProcessingJob schema for transcription queue
- [ ] All schemas have appropriate indexes for query performance
- [ ] Convex schema validates successfully (npx convex dev)

### Team Management

### US-004: Create dashboard with team list
**Description:** As a logged-in user, I want to see all teams I'm a member of on the dashboard so I can navigate to them.

**Acceptance Criteria:**
- [ ] Dashboard displays grid of team cards
- [ ] Each team card shows: team name, member count, last activity date
- [ ] Cards show preview of 2-3 most recent entries
- [ ] Admin users see "Create Team" button
- [ ] Clicking a team card navigates to team timeline view
- [ ] Empty state when user has no teams
- [ ] Notification badge shows unread count
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Create team with admin assignment
**Description:** As an admin, I want to create new teams and assign initial admins so that teams can be set up properly.

**Acceptance Criteria:**
- [ ] "Create Team" button opens modal/form
- [ ] Form includes: team name (required), description (optional)
- [ ] Admin selector shows list of organization users
- [ ] Multiple admins can be selected
- [ ] On submit, team is created in Convex
- [ ] Selected admins are added with role "admin"
- [ ] Creator automatically becomes admin if not selected
- [ ] Success toast notification shown
- [ ] New team appears on dashboard
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Invite users to team
**Description:** As a team admin, I want to invite users to my team so they can access the team's content.

**Acceptance Criteria:**
- [ ] Team settings page shows "Invite Members" button
- [ ] Invitation modal includes email input and role selector (member/admin)
- [ ] Email input supports multiple addresses separated by commas
- [ ] System validates email format
- [ ] On submit, invitations are created and sent via email
- [ ] Invited users appear in "Pending Invitations" section
- [ ] Invitation link includes team and role information
- [ ] Accepting invitation adds user to team with specified role
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Manage subteams within a team
**Description:** As a team admin, I want to create and manage subteams so that content can be organized by functional groups.

**Acceptance Criteria:**
- [ ] Team settings shows "Subteams" section with list of existing subteams
- [ ] "Add Subteam" button opens creation form
- [ ] Form includes: name (required), color picker (required, default provided)
- [ ] Color picker provides predefined palette
- [ ] Subteams can be edited (name, color) and deleted
- [ ] Delete confirmation dialog prevents accidental deletion
- [ ] Subteam color is used throughout UI for visual identification
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Assign team members to subteams
**Description:** As a team admin, I want to assign members to subteams so that filtering and organization works correctly.

**Acceptance Criteria:**
- [ ] Team members list shows current subteam assignments
- [ ] Each member has dropdown to select subteams
- [ ] Multiple subteams can be assigned per member
- [ ] Changes save immediately on selection
- [ ] Members can belong to zero or more subteams
- [ ] Assignments are reflected in filters and UI
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Entry Management

### US-009: Create new meeting entry
**Description:** As a team member, I want to create a meeting entry so that I can upload audio from stand-ups and other meetings.

**Acceptance Criteria:**
- [ ] "New Entry" floating action button visible on team timeline
- [ ] Clicking opens modal with type selector (Meeting/Voice Note/Document/Note)
- [ ] Selecting "Meeting" shows meeting form
- [ ] Form includes: title (required), date picker (defaults to today), time picker (defaults to now)
- [ ] Attendee input with autocomplete for team members
- [ ] External attendees can be added by typing name
- [ ] Multiple attendees supported
- [ ] Audio file uploader accepts MP3, WAV, M4A (max 100MB, 4 hours)
- [ ] Upload progress bar shows during file upload
- [ ] Submit creates entry with status "pending_transcription"
- [ ] Success message confirms creation
- [ ] Entry appears on timeline
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Create voice note entry
**Description:** As a team member, I want to create a quick voice note so that I can capture ad-hoc thoughts or updates.

**Acceptance Criteria:**
- [ ] "New Entry" modal includes "Voice Note" type
- [ ] Form includes: title (required), date/time pickers
- [ ] Audio upload functionality same as meeting entry
- [ ] Voice notes have distinct visual icon/color in UI
- [ ] Entry created and appears on timeline
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Create document or note entry
**Description:** As a team member, I want to add documents or text notes so that all important content is in one place.

**Acceptance Criteria:**
- [ ] "New Entry" modal includes "Document" and "Note" types
- [ ] Document type: file uploader for PDF, DOCX, TXT (max 50MB)
- [ ] Note type: rich text editor for direct text input
- [ ] Both include title, date/time, and attendee fields
- [ ] Document entries don't require transcription
- [ ] Status set to "completed" immediately
- [ ] Entries appear on timeline with appropriate icons
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: View day overview with all entries
**Description:** As a team member, I want to see all entries for a specific day so I can understand what happened on that day.

**Acceptance Criteria:**
- [ ] Clicking timeline bubble navigates to day overview
- [ ] Day header shows full date and day of week
- [ ] Previous/next day navigation buttons
- [ ] AI-generated day summary displayed prominently (if available)
- [ ] Entries grouped by type: Meetings, Voice Notes, Documents, Notes
- [ ] Entries sorted chronologically
- [ ] Each entry card shows: title, type icon, time, attendees (avatars), content preview
- [ ] Clicking entry card navigates to entry detail
- [ ] Empty state when no entries for day
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: View entry detail with transcript and summary
**Description:** As a team member, I want to see full entry details including transcript and AI summary so I can review meeting content.

**Acceptance Criteria:**
- [ ] Entry detail page shows metadata header: title, type badge, date, creation info
- [ ] List of attendees with avatars and names
- [ ] Audio player for meeting/voice note entries (if transcript available)
- [ ] Tabs for: Transcript, Summary
- [ ] Transcript tab shows full transcription text
- [ ] Summary tab shows AI-generated summary (key points, decisions, action items)
- [ ] External links section shows any added URLs
- [ ] Edit button for own entries, delete for own or admins
- [ ] "Pending transcription" state shown when transcript not ready
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-014: Edit and delete entries
**Description:** As a team member, I want to edit or delete my entries so I can correct mistakes or remove outdated content.

**Acceptance Criteria:**
- [ ] Entry detail shows edit button for entries owned by user
- [ ] Admins see edit/delete buttons for all entries
- [ ] Edit opens modal with pre-filled form
- [ ] All fields editable except type
- [ ] Audio file can be replaced
- [ ] Save updates entry in database
- [ ] Delete shows confirmation dialog
- [ ] Delete removes entry and associated metadata
- [ ] Success notifications for both operations
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Timeline Visualization

### US-015: Implement horizontal timeline with bubbles
**Description:** As a team member, I want to see a visual timeline of all team activity so I can navigate through project history.

**Acceptance Criteria:**
- [ ] Horizontal timeline bar displayed below team header
- [ ] Timeline shows months as reference points
- [ ] Days with activity shown as bubbles on timeline
- [ ] Bubble size scales with number of entries (small: 1-2, medium: 3-5, large: 6+)
- [ ] Horizontal scrolling enabled (mouse drag, touch swipe, scroll wheel)
- [ ] Timeline extends to cover all team entries
- [ ] Current day indicator on timeline
- [ ] Bubbles clickable to navigate to day overview
- [ ] Responsive design works on desktop and tablet
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-016: Add hover preview to timeline bubbles
**Description:** As a team member, I want to preview a day's activity before clicking so I can quickly identify relevant days.

**Acceptance Criteria:**
- [ ] Hovering over bubble shows tooltip/preview card
- [ ] Preview shows: date, count of meetings, count of voice notes
- [ ] Preview lists titles of 2-3 most important entries
- [ ] Preview appears with smooth animation
- [ ] Preview positioned to not overflow screen bounds
- [ ] Preview disappears on mouse leave
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-017: Implement timeline zoom levels
**Description:** As a team member, I want to zoom the timeline to different levels so I can navigate more efficiently.

**Acceptance Criteria:**
- [ ] Zoom controls in team header: Year, Month, Week, Day buttons
- [ ] Year view: shows months, bubbles represent aggregate activity
- [ ] Month view: shows weeks, bubbles represent aggregate activity
- [ ] Week view: shows days, bubbles represent daily activity
- [ ] Day view: shows hours, time markers for entries
- [ ] Smooth transitions between zoom levels
- [ ] Zoom state persists in URL
- [ ] Bubbles update size and density based on zoom level
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-018: Filter timeline by subteam and content type
**Description:** As a team member, I want to filter the timeline so I can focus on specific teams or content types.

**Acceptance Criteria:**
- [ ] Filter bar below team header with subteam chips
- [ ] Subteam chips show subteam name and color
- [ ] "All Subteams" chip shows all activity
- [ ] Clicking subteam filters timeline to show only that subteam's entries
- [ ] Content type filter dropdown: All, Meetings, Voice Notes, Documents, Notes
- [ ] Filters combine (subteam AND content type)
- [ ] Filter state persists in URL
- [ ] Active filters shown as removable chips
- [ ] Timeline updates in real-time as filters change
- [ ] Empty state message when no entries match filters
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### MinIO File Storage Infrastructure

### US-019: Set up MinIO server with S3-compatible buckets
**Description:** As a developer, I need to configure MinIO for file storage so that audio files and documents can be stored reliably.

**Acceptance Criteria:**
- [ ] MinIO server installed and running (Docker or native)
- [ ] Two buckets created: `project-timeline-audio`, `project-timeline-documents`
- [ ] Access keys and secret keys generated
- [ ] Bucket policies configured to block public access
- [ ] CORS settings allow uploads from app domain
- [ ] Server accessible from Convex backend
- [ ] Connection verified with test upload/download
- [ ] MinIO SDK added to Convex project dependencies
- [ ] Environment variables documented: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY

### US-020: Implement presigned URL generation for uploads
**Description:** As a developer, I need to create Convex functions that generate presigned URLs so clients can upload directly to MinIO.

**Acceptance Criteria:**
- [ ] Convex action `generateUploadUrl` accepts file metadata (entryId, teamId, fileType, fileName, mimeType)
- [ ] Action generates object key following pattern: uploads/{type}/{teamId}/{year}/{month}/{entryId}.{ext}
- [ ] Action uses MinIO SDK to generate presigned PUT URL (15 min expiry)
- [ ] Action stores FileMetadata record in Convex with key, filename, size, mimeType
- [ ] Returns presigned URL and fileMetadataId to client
- [ ] URL includes necessary headers for Content-Type
- [ ] Error handling for invalid file types or sizes
- [ ] Typecheck passes

### US-021: Implement direct client upload to MinIO
**Description:** As a frontend developer, I need to implement file upload using presigned URLs so files go directly to MinIO without hitting the server.

**Acceptance Criteria:**
- [ ] File input component accepts audio (MP3, WAV, M4A) and documents (PDF, DOCX, TXT)
- [ ] Client validates file size (max 100MB audio, 50MB documents)
- [ ] Client calls `generateUploadUrl` Convex action on file selection
- [ ] Client uploads file directly to MinIO using presigned URL
- [ ] Upload progress indicator shows percentage
- [ ] On success, client calls Convex mutation to confirm upload
- [ ] Error handling for upload failures with retry option
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-022: Implement presigned URL generation for downloads
**Description:** As a developer, I need to create functions for generating download URLs so files can be retrieved securely.

**Acceptance Criteria:**
- [ ] Convex action `generateDownloadUrl` accepts fileMetadataId
- [ ] Action verifies user has permission to access file (team membership check)
- [ ] Action generates presigned GET URL (1 hour expiry)
- [ ] Action logs access for analytics
- [ ] Returns URL to client
- [ ] URL used for audio player and document downloads
- [ ] Error handling for expired or deleted files
- [ ] Typecheck passes

### WhisperX Transcription Infrastructure

### US-023: Set up WhisperX server with HTTP API
**Description:** As a developer, I need to deploy a WhisperX server for audio transcription so the app can convert speech to text.

**Acceptance Criteria:**
- [ ] WhisperX server deployed on dedicated machine (Docker or native)
- [ ] Server accessible via HTTP endpoint from Convex backend
- [ ] API endpoint POST /transcribe accepts: audio_url, language (auto/nl/en), model (large-v3)
- [ ] API returns: transcript text, segments (timestamps), confidence scores
- [ ] Server handles async processing with job queuing
- [ ] GET /job/{jobId} endpoint checks status
- [ ] Server logs all transcription jobs
- [ ] Server authenticated via API key
- [ ] Timeout configured for 4 hour max audio
- [ ] Documentation of API interface
- [ ] Environment variables documented: WHISPERX_API_ENDPOINT, WHISPERX_API_KEY

### US-024: Create transcription queue in Convex
**Description:** As a developer, I need to implement a processing queue so transcription jobs can be managed efficiently.

**Acceptance Criteria:**
- [ ] ProcessingJob schema includes: entryId, status (queued/processing/completed/failed), retryCount, errorMessage
- [ ] Mutation `queueTranscription` creates job with status "queued"
- [ ] Jobs automatically created when entries with audio are submitted
- [ ] Query `getPendingJobs` retrieves jobs with status "queued"
- [ ] Admin-only mutation `startBatchProcessing` triggers processing
- [ ] Jobs ordered by creation timestamp
- [ ] Retry count maxes out at 3 attempts
- [ ] Failed jobs marked with error message
- [ ] Typecheck passes

### US-025: Implement transcription processing action
**Description:** As a developer, I need to create a Convex action that processes transcription jobs so audio files can be converted to text.

**Acceptance Criteria:**
- [ ] Convex action `processTranscriptionJob` accepts jobId
- [ ] Action updates job status to "processing"
- [ ] Action generates presigned download URL for audio file
- [ ] Action sends POST request to WhisperX API with audio URL
- [ ] Action polls GET /job/{jobId} endpoint every 30 seconds
- [ ] On completion, action saves transcript to Entry.transcript field
- [ ] Action updates Entry.status to "transcribed"
- [ ] Action updates job status to "completed"
- [ ] On failure, action increments retryCount and marks "failed" if max retries reached
- [ ] Action calls `generateEntrySummary` to trigger AI summarization
- [ ] Error handling for network failures and timeouts
- [ ] Typecheck passes

### US-026: Create admin processing queue UI
**Description:** As a super admin, I want to manage the transcription queue so I can monitor and control processing jobs.

**Acceptance Criteria:**
- [ ] Admin-only page at /admin/processing
- [ ] Page shows table of all processing jobs
- [ ] Columns: Entry title, status, created time, retry count, error message
- [ ] Status filters: All, Queued, Processing, Completed, Failed
- [ ] "Start Batch Processing" button triggers job processing
- [ ] Failed jobs show "Retry" button
- [ ] "Cancel" button for queued/processing jobs
- [ ] Real-time updates via Convex subscriptions
- [ ] Empty state when queue is empty
- [ ] Pagination for large job lists
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### AI Summarization Features

### US-027: Set up OpenRouter integration for LLM access
**Description:** As a developer, I need to configure OpenRouter so the app can generate AI summaries.

**Acceptance Criteria:**
- [ ] OpenRouter account created and API key obtained
- [ ] OpenRouter SDK added to Convex dependencies
- [ ] Environment variables set: OPENROUTER_API_KEY, OPENROUTER_MODEL (default: claude-3.5-sonnet)
- [ ] Fallback model configured: gpt-4-turbo
- [ ] Convex action `callLLM` accepts prompt and returns response
- [ ] Action handles rate limiting with exponential backoff
- [ ] Action implements 60 second timeout
- [ ] Error handling for API failures
- [ ] Usage tracking for cost monitoring
- [ ] Typecheck passes

### US-028: Generate entry-level summaries
**Description:** As a team member, I want AI-generated summaries for each entry so I can quickly understand the key points.

**Acceptance Criteria:**
- [ ] Convex action `generateEntrySummary` triggered when transcript is completed
- [ ] Action formats prompt with transcript and entry metadata
- [ ] Prompt instructs LLM to extract: key points, decisions, action items
- [ ] Response parsed and stored in Summary table linked to entry
- [ ] Summary level set to "entry"
- [ ] Summary displayed in entry detail view
- [ ] Failed generations stored with error message for debugging
- [ ] Typecheck passes

### US-029: Generate daily summaries
**Description:** As a team member, I want an AI-generated summary of each day so I can see what was discussed at a high level.

**Acceptance Criteria:**
- [ ] Scheduled job runs at end of each day (or triggered manually)
- [ ] Convex action `generateDaySummary` accepts teamId and date
- [ ] Action retrieves all completed entries for that day
- [ ] Entries grouped by subteam if applicable
- [ ] Action formats prompt with entry summaries or transcripts
- [ ] Prompt instructs LLM to create: overview of topics, decisions made, action items, notable points
- [ ] Response stored in Summary table with level "day" and date
- [ ] Summary displayed prominently on day overview page
- [ ] "Generate Now" button for manual generation in day view
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-030: Generate weekly summaries
**Description:** As a team member, I want a weekly summary so I can review the team's progress over the week.

**Acceptance Criteria:**
- [ ] Scheduled job runs every Friday evening
- [ ] Convex action `generateWeekSummary` accepts teamId, week start and end dates
- [ ] Action retrieves all day summaries for the week
- [ ] Action formats prompt with day summaries
- [ ] Prompt instructs LLM to create: progress overview, recurring themes, key decisions, attention points for next week
- [ ] Response stored in Summary table with level "week"
- [ ] In-app notification sent to team members when summary is ready
- [ ] Notification links to reports page
- [ ] Summary shown on Reports tab under "Week" section
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-031: Implement custom report generation
**Description:** As a team member, I want to generate custom reports for specific periods so I can get targeted insights.

**Acceptance Criteria:**
- [ ] Reports page includes "Custom Report" section
- [ ] Form includes: date range picker, source type selector (summaries/transcripts), instructions text area
- [ ] Instructions field supports custom queries like "Focus on database migration discussions"
- [ ] Submit shows loading state during generation
- [ ] Convex action `generateCustomReport` accepts parameters
- [ ] Action retrieves entries or summaries based on date range and source type
- [ ] Action formats prompt with retrieved content and user instructions
- [ ] Response stored in Summary table with level "custom"
- [ ] Report displayed in new modal or page
- [ ] Report can be regenerated with same/different parameters
- [ ] Report can be downloaded as markdown
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-032: Create reports overview page
**Description:** As a team member, I want to browse all available reports so I can find and read summaries.

**Acceptance Criteria:**
- [ ] Reports page accessible from team navigation
- [ ] Tabs for: Day, Week, Custom reports
- [ ] Each tab shows list of available reports
- [ ] Report cards show: date/title, type badge, generation time, preview (first 200 chars)
- [ ] Clicking report card opens full report
- [ ] Day/Week tabs include calendar picker for date selection
- [ ] Regenerate button for each report
- [ ] Empty state when no reports available
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Search Functionality

### US-033: Implement basic keyword search
**Description:** As a team member, I want to search for specific keywords so I can find relevant discussions.

**Acceptance Criteria:**
- [ ] Search bar prominent in team header or dedicated search page
- [ ] Search accepts text input and submits on Enter or button click
- [ ] Convex query `searchEntries` accepts teamId and search query
- [ ] Query searches across: entry titles, transcripts, summaries
- [ ] Query uses text indexing for performance
- [ ] Results show entry title, type, date, and matching snippet with highlighted keyword
- [ ] Results ordered by relevance (frequency and position of matches)
- [ ] Clicking result navigates to entry detail with search term highlighted
- [ ] Search query persists in URL
- [ ] Empty state when no results found
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-034: Add advanced search filters
**Description:** As a team member, I want to filter search results so I can narrow down to specific content.

**Acceptance Criteria:**
- [ ] Search page shows filter panel next to results
- [ ] Date range filter with start and end date pickers
- [ ] Subteam filter dropdown (All, or specific subteams)
- [ ] Content type filter: All, Meetings, Voice Notes, Documents, Notes
- [ ] Participant filter with autocomplete for team members
- [ ] Filters combine (AND logic)
- [ ] Active filters shown as removable chips
- [ ] Filter state persists in URL
- [ ] Results update in real-time as filters change
- [ ] "Clear All Filters" button
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-035: Display search context in results
**Description:** As a team member, I want to see surrounding context for matches so I can better understand the result.

**Acceptance Criteria:**
- [ ] Search results show 50 characters before and after match
- [ ] Multiple matches per entry shown (max 3)
- [ ] Context shown in expandable/collapsible format
- [ ] "Show more context" expands to 200 characters
- [ ] Context preserves transcript formatting (paragraphs, speakers)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Notifications

### US-036: Implement notification system
**Description:** As a team member, I want to receive in-app notifications so I can stay updated on important events.

**Acceptance Criteria:**
- [ ] Notification bell icon in header with unread count badge
- [ ] Clicking opens dropdown with recent notifications
- [ ] Notifications show: type icon, message, time ago
- [ ] Clicking notification navigates to relevant content
- [ ] Notification marked as read on click
- [ ] "Mark all as read" button in dropdown
- [ ] Dropdown shows max 10 notifications with "View All" link
- [ ] Notifications persist in database
- [ ] Real-time updates via Convex subscriptions
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-037: Generate notifications for key events
**Description:** As a team member, I want to be notified of important events so I don't miss updates.

**Acceptance Criteria:**
- [ ] Notification created when week summary is ready (for all team members)
- [ ] Notification when transcript is completed (for entry creator)
- [ ] Notification when user is invited to team
- [ ] Notification when new entry is created (optional, user preference)
- [ ] Notifications include relevant data (entryId, teamId, etc.)
- [ ] Notifications grouped per day
- [ ] Stale notifications (older than 30 days) auto-deleted
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Admin & Permissions

### US-038: Implement role-based access control
**Description:** As a developer, I need to enforce permissions so users can only access appropriate features.

**Acceptance Criteria:**
- [ ] Convex middleware checks authentication on all functions
- [ ] Role check for admin-only functions (team settings, member management)
- [ ] Role check for super-admin functions (processing queue, system settings)
- [ ] Team membership check for accessing team data
- [ ] Entry ownership check for edit/delete operations
- [ ] Unauthorized access returns 403 with helpful message
- [ ] Frontend hides/shows UI elements based on user role
- [ ] Typecheck passes

### US-039: Create team settings page for admins
**Description:** As a team admin, I want to manage team settings so I can configure the team properly.

**Acceptance Criteria:**
- [ ] Team settings accessible from team header (admin only)
- [ ] Tabs for: General, Members, Subteams
- [ ] General tab: team name and description (editable)
- [ ] Members tab: list of members with roles, invite button, remove button
- [ ] Subteams tab: list of subteams with edit/delete, add subteam button
- [ ] Changes save immediately with success toast
- [ ] Cancel button discards unsaved changes
- [ ] Delete team button (with confirmation, super-admin only)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-040: Create system settings page for super admins
**Description:** As a super admin, I want to configure system settings so I can manage integrations and limits.

**Acceptance Criteria:**
- [ ] System settings accessible at /admin/settings (super-admin only)
- [ ] Section for WhisperX configuration: API endpoint, API key (masked)
- [ ] Section for OpenRouter configuration: API key (masked), model selector
- [ ] Section for MinIO configuration: endpoint (read-only), bucket names
- [ ] Section for app settings: max file size, max audio length
- [ ] Test connection buttons for each external service
- [ ] Changes require confirmation before saving
- [ ] Changes update environment variables or configuration storage
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### Polish & Optimization

### US-041: Implement loading states and skeletons
**Description:** As a user, I want to see loading indicators so I know the app is working on my request.

**Acceptance Criteria:**
- [ ] Skeleton screens for team cards on dashboard
- [ ] Skeleton for timeline while loading
- [ ] Skeleton for entry cards
- [ ] Loading spinners for buttons during async operations
- [ ] Progress bars for file uploads
- [ ] Loading overlay for full-page transitions
- [ ] Skeletons match actual component dimensions
- [ ] Loading states show for minimum 500ms to avoid flicker
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-042: Implement error boundaries and error handling
**Description:** As a user, I want helpful error messages when something goes wrong so I can understand what happened.

**Acceptance Criteria:**
- [ ] React Error Boundary catches component errors
- [ ] Error page shows friendly message and "Go back" button
- [ ] Convex error handling in all actions/mutations
- [ ] User-friendly error messages (not raw error objects)
- [ ] Toast notifications for recoverable errors
- [ ] Retry buttons for transient failures
- [ ] Error logging to console for debugging
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-043: Optimize timeline performance for large datasets
**Description:** As a user, I want the timeline to remain responsive even with hundreds of entries so I can navigate smoothly.

**Acceptance Criteria:**
- [ ] Timeline implements virtualization for large datasets
- [ ] Entries loaded in chunks (pagination or infinite scroll)
- [ ] Timeline renders only visible bubbles
- [ ] Convex indexes optimized for common queries
- [ ] Image/avatar loading lazy
- [ ] Audio file loading deferred until play clicked
- [ ] Lighthouse performance score > 90
- [ ] Timeline maintains 60fps during scroll
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-044: Implement responsive design for mobile and tablet
**Description:** As a user, I want the app to work well on different screen sizes so I can use it on any device.

**Acceptance Criteria:**
- [ ] Layout adapts to mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)
- [ ] Timeline becomes vertically scrollable on mobile
- [ ] Navigation collapses to hamburger menu on mobile
- [ ] FAB remains accessible on all screen sizes
- [ ] Modals fit within screen bounds on mobile
- [ ] Touch gestures work on timeline (swipe, pinch-to-zoom)
- [ ] Text remains readable (minimum 14px body text)
- [ ] Buttons meet minimum touch target size (44x44px)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-045: Add accessibility features
**Description:** As a user with disabilities, I want the app to be accessible so I can use assistive technologies.

**Acceptance Criteria:**
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] ARIA labels on buttons, inputs, and icons
- [ ] Alt text on all images
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces important state changes
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Keyboard shortcuts documented (e.g., "/" for search)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

### Authentication & Authorization
- FR-1: System must support user registration via email/password
- FR-2: System must support OAuth authentication via Google and Microsoft
- FR-3: System must maintain user sessions across page refreshes
- FR-4: System must enforce role-based permissions (member, admin, super_admin)
- FR-5: System must prevent unauthorized access to team data and settings

### Team Management
- FR-6: System must allow admins to create teams with name and description
- FR-7: System must allow admins to invite users via email with role assignment
- FR-8: System must allow admins to create and manage subteams with name and color
- FR-9: System must allow admins to assign members to subteams
- FR-10: System must display dashboard with all teams user is member of

### Entry Management
- FR-11: System must allow creation of meeting entries with title, date, attendees, and audio
- FR-12: System must allow creation of voice note entries with title, date, and audio
- FR-13: System must allow creation of document entries with file upload
- FR-14: System must allow creation of text notes with rich text input
- FR-15: System must allow tagging attendees with autocomplete for team members
- FR-16: System must allow adding external (non-team) attendees by name
- FR-17: System must support file uploads up to 100MB for audio, 50MB for documents
- FR-18: System must support MP3, WAV, M4A audio formats
- FR-19: System must support PDF, DOCX, TXT document formats
- FR-20: System must allow users to edit their own entries
- FR-21: System must allow admins to edit any entry in their team
- FR-22: System must allow users to delete their own entries
- FR-23: System must allow admins to delete any entry in their team

### Timeline Visualization
- FR-24: System must display horizontal timeline with time-based navigation
- FR-25: System must show days with activity as bubbles on timeline
- FR-26: System must scale bubble size based on number of entries per day
- FR-27: System must support horizontal scrolling via mouse drag, touch swipe, and scroll wheel
- FR-28: System must show hover preview on timeline bubbles with date and entry counts
- FR-29: System must support zoom levels: Year, Month, Week, Day
- FR-30: System must navigate to day overview when bubble is clicked
- FR-31: System must filter timeline by subteam
- FR-32: System must filter timeline by content type (meetings, voice notes, documents, notes)

### File Storage (MinIO)
- FR-33: System must generate presigned URLs for direct-to-cloud uploads
- FR-34: System must store file metadata in Convex database
- FR-35: System must organize files in bucket structure: uploads/{type}/{teamId}/{year}/{month}/{entryId}.{ext}
- FR-36: System must generate presigned URLs for secure downloads
- FR-37: System must enforce 15-minute expiry on upload URLs
- FR-38: System must enforce 1-hour expiry on download URLs
- FR-39: System must validate file size and type before upload

### Transcription (WhisperX)
- FR-40: System must queue audio entries for transcription when created
- FR-41: System must allow admins to trigger batch processing
- FR-42: System must send audio URLs to WhisperX API for processing
- FR-43: System must poll WhisperX API for job completion
- FR-44: System must store completed transcripts in Entry record
- FR-45: System must update entry status to "transcribed" upon completion
- FR-46: System must retry failed transcriptions up to 3 times
- FR-47: System must support Dutch and English language detection
- FR-48: System must handle mixed-language conversations

### AI Summarization (OpenRouter)
- FR-49: System must automatically generate entry-level summaries when transcript is completed
- FR-50: System must generate daily summaries at end of each day
- FR-51: System must generate weekly summaries every Friday evening
- FR-52: System must allow users to generate custom reports with date range and instructions
- FR-53: System must allow custom reports to use summaries or full transcripts as source
- FR-54: System must extract key points, decisions, and action items in summaries
- FR-55: System must store all summaries in Summary table with level indicator

### Search
- FR-56: System must support keyword search across titles, transcripts, and summaries
- FR-57: System must display search results with relevant snippets
- FR-58: System must highlight search terms in results
- FR-59: System must filter search results by date range
- FR-60: System must filter search results by subteam
- FR-61: System must filter search results by content type
- FR-62: System must filter search results by participant
- FR-63: System must show surrounding context (50 chars before/after) for matches

### Notifications
- FR-64: System must generate notification when week summary is ready
- FR-65: System must generate notification when transcript is completed
- FR-66: System must generate notification when user is invited to team
- FR-67: System must display unread notification count in header
- FR-68: System must show notification dropdown with recent notifications
- FR-69: System must mark notifications as read when clicked
- FR-70: System must allow "mark all as read" action
- FR-71: System must navigate to relevant content when notification is clicked

### Admin Features
- FR-72: System must provide team settings page for admins
- FR-73: System must allow admins to edit team name and description
- FR-74: System must allow admins to manage team members (invite, remove, change roles)
- FR-75: System must allow admins to manage subteams (create, edit, delete)
- FR-76: System must provide processing queue page for super admins
- FR-77: System must allow super admins to start batch transcription processing
- FR-78: System must allow super admins to retry failed transcription jobs
- FR-79: System must allow super admins to cancel queued transcription jobs
- FR-80: System must provide system settings page for super admins
- FR-81: System must allow configuration of WhisperX API endpoint and key
- FR-82: System must allow configuration of OpenRouter API key and model
- FR-83: System must allow configuration of file size and audio length limits

### UI/UX
- FR-84: System must show loading states for all async operations
- FR-85: System must display skeleton screens during data loading
- FR-86: System must show progress bar for file uploads
- FR-87: System must provide helpful error messages for all failure scenarios
- FR-88: System must implement error boundaries to catch component errors
- FR-89: System must support keyboard navigation for all interactive elements
- FR-90: System must meet WCAG AA accessibility standards

## Non-Goals (Out of Scope)

The following features are explicitly **NOT** part of v1.0:

- **Semantic/RAG Search:** Natural language Q&A and vector-based semantic search (planned for Phase 2)
- **Search Alerts:** Notifications when new content matches saved searches (Phase 2)
- **Integrations:** Slack, Calendar, Jira/Linear integrations (Phase 3)
- **Live Transcription:** Real-time transcription during meetings (Phase 4)
- **Speaker Identification:** Automatic detection of who is speaking (Phase 4)
- **Action Item Tracking:** Dedicated system for tracking and following up on action items (Phase 4)
- **Sentiment Analysis:** Meeting energy/mood analysis over time (Phase 4)
- **Native Mobile Apps:** iOS and Android applications (Phase 5)
- **Offline Mode:** Recording and working without internet connection (Phase 5)
- **Advanced Analytics:** Charts, graphs, and metrics dashboards (future version)
- **Email Digests:** Daily or weekly email summaries (notifications are in-app only)
- **Video Support:** Upload or transcription of video files (audio only)
- **Real-time Collaboration:** Multiple users editing simultaneously
- **Version History:** Tracking changes to entries over time
- **Export Features:** Exporting data to PDF, CSV, or other formats
- **Public Sharing:** Sharing entries or reports via public links
- **Advanced Permissions:** Granular permissions beyond admin/member roles
- **Custom Branding:** Team logos, colors, or themes
- **Multi-language UI:** Interface localization (Dutch only for v1.0)

## Design Considerations

### Visual Design Principles
- **Clarity over density:** Prioritize readability and white space over showing more information
- **Progressive disclosure:** Show simple view first, reveal details on interaction
- **Visual hierarchy:** Use size, color, and position to guide attention
- **Consistency:** Reuse components and patterns across the application

### Color System
- **Primary:** Blue (#3B82F6) for primary actions and links
- **Secondary:** Slate (#64748B) for secondary text and icons
- **Success:** Green (#10B981) for positive states and confirmations
- **Warning:** Yellow (#F59E0B) for warnings and pending states
- **Error:** Red (#EF4444) for errors and destructive actions
- **Subteam Colors:** User-defined colors for subteam differentiation
- **Background:** White (#FFFFFF) for main content, light gray (#F1F5F9) for backgrounds

### Typography
- **Font Family:** Inter for UI text, monospace for code/transcripts
- **Headings:** Semibold, 24px (h1), 20px (h2), 18px (h3)
- **Body:** Regular, 16px for main content, 14px for secondary
- **Small:** Medium, 12px for labels and metadata

### Component Library (shadcn/ui)
Reuse existing components where possible:
- Button, Card, Dialog, Dropdown Menu
- Input, Label, Textarea
- Tabs, Toast, Alert
- Avatar, Badge, Calendar
- Select, Checkbox, Radio Group
- Scroll Area, Skeleton
- Command (for command palette/search)
- Popover, Tooltip

### Responsive Breakpoints
- **Mobile:** < 768px (single column, stacked layout)
- **Tablet:** 768px - 1024px (two columns, adjusted timeline)
- **Desktop:** > 1024px (full layout, horizontal timeline)

## Technical Considerations

### Architecture
- **Serverless Backend:** Convex for database, real-time subscriptions, and serverless functions
- **External Processing:** WhisperX and OpenRouter called via Convex actions
- **File Storage:** MinIO for S3-compatible object storage
- **Authentication:** Clerk for user management and session handling

### Data Management
- **Real-time Sync:** All UI updates via Convex subscriptions
- **Optimistic Updates:** Update UI immediately, rollback on error
- **Pagination:** Load entries in chunks for performance
- **Indexing:** Convex indexes on teamId, date, status for query performance

### Performance Targets
- **Upload Speed:** Files up to 100MB upload within 30 seconds on normal connection
- **Transcription Time:** Complete within 2x audio length (30 min audio = max 60 min processing)
- **Search Response:** Results returned within 2 seconds
- **Page Load:** Initial render within 3 seconds
- **Timeline FPS:** Maintain 60fps during scroll/interaction

### Security
- **Authentication:** All pages protected by Clerk middleware
- **Authorization:** Role checks in Convex functions for admin operations
- **File Access:** Presigned URLs with time-based expiry
- **Input Validation:** Validate all user inputs on client and server
- **Rate Limiting:** Implement rate limiting on external API calls
- **Environment Variables:** All secrets stored as environment variables, never in code

### Scalability Considerations
- **Database:** Convex scales automatically, no manual sharding needed
- **File Storage:** MinIO can scale horizontally with multiple servers
- **Transcription:** WhisperX server can be scaled independently
- **Cost Management:** Monitor OpenRouter token usage, implement caching

### Error Handling Strategy
- **Client Errors:** Show toast notification with helpful message, don't crash
- **Network Errors:** Retry with exponential backoff (max 3 attempts)
- **Server Errors:** Log to console, show generic error message to user
- **Upload Failures:** Allow user to retry upload without re-entering data
- **Transcription Failures:** Queue for retry, show error in admin queue UI

### Testing Strategy
- **Unit Tests:** Critical business logic in Convex functions
- **Integration Tests:** API endpoints and external service integrations
- **E2E Tests:** Key user flows (login, create entry, view timeline)
- **Visual Regression:** Ensure UI consistency across updates
- **Manual Testing:** Browser testing using dev-browser skill for all UI stories

## Success Metrics

### User Adoption
- 80% of invited users register within 1 week
- 60% of users create at least one entry in first week
- 40% of users return to app at least 3 times per week

### Feature Usage
- Average of 5 entries created per team per week
- 70% of audio entries transcribed within 24 hours
- 50% of users use search at least once per week
- 80% of users read weekly summaries

### Performance
- 95% of page loads complete within 3 seconds
- 90% of searches return results within 2 seconds
- Transcription queue clears within 48 hours
- 99% uptime for core functionality

### User Satisfaction
After 4 weeks of use:
- 80% agree "I can find information faster than before"
- 80% agree "I have better overview of team discussions"
- 70% agree "Weekly summaries are valuable"
- < 5% report critical bugs or usability issues

### Technical Metrics
- Zero data loss incidents
- 99.9% of uploads succeed on first attempt
- < 2% transcription failure rate
- Average 4.5/5 star rating from user feedback

## Open Questions

1. **Transcription Cost Management:** Should we implement usage quotas or alerts to prevent excessive WhisperX/OpenRouter costs in the initial version?

2. **Data Retention Policy:** Should entries, transcripts, or summaries be auto-deleted after a certain period (e.g., 2 years) to manage storage costs?

3. **Batch Processing Schedule:** Should batch transcription be scheduled automatically (e.g., every hour at :00) or remain admin-triggered only?

4. **Audio Recording Direct in App:** Should v1.0 include browser-based audio recording, or only file upload?

5. **Notification Preferences:** Should users be able to opt-out of specific notification types in v1.0, or is that a future feature?

6. **Team Creation Permissions:** Should any admin be able to create teams, or only organization admins (super_admin)?

7. **Default Subteam Behavior:** Should new members be assigned to all subteams by default, or none?

8. **Summary Regeneration:** Should week summaries be auto-regenerated if new entries are added retroactively, or only on scheduled runs?

9. **Search Indexing:** Should we implement full-text search indexing immediately, or start with simple substring matching?

10. **Mobile-First vs Responsive:** Given mobile apps are Phase 5, should we optimize for desktop/tablet only in v1.0, or ensure mobile responsiveness?

## Next Steps

1. **Infrastructure Setup:** Set up MinIO and WhisperX servers (US-019, US-023)
2. **Project Skeleton:** Initialize Next.js with all dependencies (US-001)
3. **Data Model:** Implement Convex schemas (US-003)
4. **Authentication:** Integrate Clerk with both auth methods (US-002)
5. **Core Features:** Build team management, entries, and timeline (US-004 through US-018)
6. **File Storage:** Implement MinIO integration (US-019 through US-022)
7. **Transcription Pipeline:** Build WhisperX integration and queue (US-023 through US-026)
8. **AI Features:** Implement summarization (US-027 through US-032)
9. **Search:** Build search functionality (US-033 through US-035)
10. **Notifications:** Add notification system (US-036 through US-037)
11. **Admin & Polish:** Complete admin features and optimization (US-038 through US-045)
12. **Testing:** Comprehensive testing and bug fixes
13. **Deployment:** Production deployment and monitoring setup
