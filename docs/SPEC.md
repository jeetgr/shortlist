# Shortlist spec

Shortlist helps job seekers tailor an honest resume to each job and learn which versions get replies.

## Problem

Job seekers send one resume everywhere, or lose track of many edited copies. Tailoring takes time, and many AI tools make it worse by adding keywords and claims the person can't back up.

## Users

- **First user:** Jeet, applying for full-stack roles.
- **Target user:** developers and recent graduates in India who are actively applying.
- **Launch goal:** 50 real users, with enough usage data to report honest numbers.

## Product rules

1. **Never invent experience.** AI can reword what the resume says. It can't add skills, employers, dates or numbers.
2. **Show gaps as gaps.** A missing skill stays on the missing list, and the user decides what to do about it.
3. **The user approves every change.** No AI text reaches a resume version without approval.
4. **Scores explain themselves.** Every match score lists the requirements behind it, with resume evidence for each match.
5. **Resumes are private.** Users can only reach their own data, and they can delete all of it.

## Features

### Master resume

- One resume per user, stored as structured data: contact, summary, skills, experience, projects, education.
- Created by a form first, with PDF import added later.
- Experience and project bullets have stable IDs, so tailoring can point to exactly what it changes.

### Application tracker

- Save a job: company, title, URL, job post text, and notes.
- Statuses: `saved`, `applied`, `replied`, `interview`, `offer`, `rejected`, `withdrawn`.
- Each status change is recorded with its time, which later powers reply rates.
- A follow-up date can be set per application.

### Job match

- Pasting a job post creates a background job.
- AI pulls out the requirements and marks each as `required` or `preferred`.
- AI compares them to the master resume and returns `matched`, `partial` or `missing`, with the bullet IDs used as evidence.
- The score is calculated by our code from those results, not chosen by the model. See "Scoring" below.

### Tailoring

- AI suggests bullet rewrites and reordering for one application.
- Each suggestion shows old text, new text and the reason.
- The user accepts, edits or rejects each one.
- Accepted changes create a new resume version. The master resume doesn't change.

### Resume versions and export

- A version is a saved copy of resume data, linked to an application.
- Exported as a one-page, single-column, text-based PDF.

### Reply rate

- Shows reply rate overall, by resume version, and by match score range.
- A reply means the application reached `replied`, `interview` or `offer`.
- Small samples are labeled, so 1 reply from 2 applications doesn't read as a 50% result.

## Not in scope for now

Auto-apply, browser extensions, job scraping, cover letters, payments, teams, mobile apps, and resume templates beyond one good default.

## Tech stack

| Area | Choice | Why |
|---|---|---|
| Framework | TanStack Start | One deployable app, and Jeet already uses it in production and can move fast |
| API | oRPC | End-to-end types, and it works with TanStack Query |
| Client data | TanStack Query | Caching, polling and mutations |
| UI | Tailwind, shadcn/ui | Fast to build, and the components live in your code |
| Database | PostgreSQL, Prisma | Relational data with typed access |
| Queue | Redis, BullMQ | Retries and backoff for slow AI work |
| Auth | Better Auth | Self-hosted sessions with Google login |
| AI | Vercel AI SDK, Gemini Flash-Lite | Paid for by monthly Cloud credits at first, with structured output and easier provider changes |
| Validation | Valibot | One set of small, modular schemas for API, env and AI output |
| Tests | Vitest, Playwright | Unit, integration and end-to-end tests |
| CI | GitHub Actions | Lint, type check, tests and build on every push |
| Hosting | VPS with Docker Compose and Caddy, AWS later | Low cost first, then fills the AWS gap |

## Architecture

```
Browser
  │  oRPC + TanStack Query
  ▼
TanStack Start (UI, auth, API) ────► PostgreSQL
  │                                      ▲
  │ add job                              │ save result
  ▼                                      │
Redis (BullMQ) ───► Worker ───► Gemini API
```

- This is one TanStack Start project, not a monorepo. The app and worker are separate processes built from the same codebase.
- The worker has its own entry point, `src/worker/index.ts`, and can't import framework-only code from TanStack Start.
- The app never calls the AI provider during a web request.
- The client polls job status with TanStack Query. Live updates aren't needed yet.

### Folder layout

```
src/
  routes/         file-based routes and pages
  components/     UI
  server/
    api/          oRPC routers
    services/     business logic used by the API and worker
    auth.ts
    db.ts
  ai/             provider, prompts, schemas, mock
  jobs/           queue definitions
  worker/         worker entry point and processors
  lib/            shared helpers
prisma/
evals/            AI test cases
```

Routers stay thin. Business logic goes in `services/`, so the API and worker can share it and tests can call it directly.

## Data model

Better Auth owns `user`, `session`, `account` and `verification`.

| Model | Key fields |
|---|---|
| `Resume` | `userId` (unique), `data` (JSONB), `updatedAt` |
| `Application` | `userId`, `company`, `title`, `url`, `jobPostText`, `status`, `followUpAt`, `notes` |
| `ApplicationEvent` | `applicationId`, `fromStatus`, `toStatus`, `createdAt` |
| `Match` | `applicationId`, `resumeHash`, `jobHash`, `score`, `result` (JSONB) |
| `Suggestion` | `applicationId`, `bulletId`, `originalText`, `suggestedText`, `reason`, `status` |
| `ResumeVersion` | `applicationId`, `data` (JSONB), `createdAt` |
| `AiJob` | `userId`, `type`, `status`, `error`, `attempts`, `createdAt`, `finishedAt` |
| `AiUsage` | `userId`, `aiJobId`, `model`, `inputTokens`, `outputTokens`, `costUsd`, `createdAt` |

Indexes come from real queries. Start with `Application(userId, status)` and `AiUsage(userId, createdAt)`, then check slow queries with `EXPLAIN ANALYZE`.

Resume data is JSONB because it's always read and written whole, and it gets validated by a Valibot schema. Applications and their events stay relational because they get filtered and counted.

## API

All procedures need a signed-in user and filter by `userId`, using the session and never a client-sent ID.

- `resume`: `get`, `save`
- `application`: `list`, `get`, `create`, `update`, `changeStatus`, `delete`
- `match`: `start`, `getLatest`
- `tailor`: `start`, `listSuggestions`, `decide`, `createVersion`
- `version`: `list`, `get`, `exportPdf`
- `job`: `getStatus`
- `stats`: `replyRates`
- `account`: `exportData`, `delete`

## Background jobs

1. The API checks limits and cache, creates an `AiJob`, adds it to BullMQ, and returns its ID.
2. The worker calls the AI, validates the output, runs checks, and saves the result.
3. The client polls `job.getStatus`.

- **Retries:** up to 3 attempts with exponential backoff, for rate limits, timeouts and invalid output.
- **Safe to repeat:** each processor saves its result in one transaction, keyed by job ID, so a retry can't create duplicates.
- **Final failures:** marked `failed` with a readable error, and the user can retry.

## AI design

- **Provider interface:** `src/ai/` exposes functions such as `extractRequirements`. Everything else calls those.
- **Mock mode:** `AI_PROVIDER=mock` returns saved responses, so local work and CI cost nothing.
- **Model:** set by the `AI_MODEL` env var. Start with the cheapest Flash-Lite model that passes the evals.
- **Billing:** the API key belongs to a project on the Cloud billing account that holds the AI Pro credits. Billing must stay on, so Google doesn't use prompts and responses to improve its products.
- **Structured output:** every call uses a Valibot schema.
- **Prompt safety:** job posts and resumes are untrusted input. They're passed as clearly marked data, and instructions inside them must be ignored.

### Honesty checks

These run in code after each tailoring response. A suggestion that fails is dropped and logged.

- `bulletId` must exist in the resume.
- Any number in the new text must appear in the original bullet.
- Any known skill or tool in the new text must already appear somewhere in the resume.

### Scoring

```
score = (points earned / points possible) × 100
required: matched 3, partial 1.5, missing 0, possible 3
preferred: matched 1, partial 0.5, missing 0, possible 1
```

The score compares a resume to one job post. It doesn't predict hiring, and the UI says so.

### Evals

`evals/` holds real job posts with expected results and hand-written bad cases. Run them when prompts or models change, and track:

- Requirement accuracy
- Number of invented claims, which should be 0
- Average cost per run

## Cost limits

- Cache match results by `resumeHash` and `jobHash`.
- Limit each user to 10 AI jobs per day at launch, adjustable by env var.
- Enforce a global monthly spending limit in code, at or below the $10 credit, and return a clear "paused" message once it's reached.
- Set a Google Cloud budget alert, because usage beyond the credit gets charged to the billing account.
- Record tokens and cost for every call.
- Send only the text the task needs, and limit job post length.

## Security and privacy

- Every query is scoped to the session user, with tests proving one user can't read another's data.
- Secrets live in env vars, validated at startup. `.env` is never committed.
- Rate limit auth and API routes with Redis.
- Uploaded PDFs are parsed and then discarded in the first release.
- Logs never contain resume or job post text.
- Users can export or delete their data. Deleting removes it from the database immediately.
- A plain privacy page explains that resume text is sent to the AI provider.
- Backups are automated, encrypted, and test-restored.

## Testing

- **Unit:** scoring, honesty checks, and Valibot schemas.
- **Integration:** services and access rules against a real test Postgres.
- **Worker:** retries and repeated runs, using the mock provider.
- **End-to-end:** sign up, add resume, add job, match, tailor, export.

## Metrics for the resume

Record only measured numbers, and label load test numbers as load tests.

- Registered and weekly active users
- Applications tracked and matches run
- Suggestions accepted, and invented claims caught
- AI cost per active user, and cache hit rate
- p95 API latency and job completion time
