# Shortlist roadmap

Read `SPEC.md` first. Each step should leave the app working.

Steps are done only when their "Done when" list passes. Use each library's current docs for setup, since APIs change. The workflow and commit rules are in `../CLAUDE.md`.

## Phase 0: Foundation

**Result:** an empty app that runs locally, with a database and CI.

### 0.1 Create the app
- Create a TanStack Start app with TypeScript strict mode, Tailwind and pnpm.
- Run `git init` in `projects/shortlist`.
- Add a `.gitignore` that covers `.env*`, and commit a `.env.example`.

**Done when:** the app runs locally, and `git status` doesn't show `.env`.

### 0.2 Code quality
- Set up lint and format tools, and scripts for `lint` and `typecheck`.

**Done when:** both scripts pass.

### 0.3 Local services
- Add a Docker Compose file with Postgres and Redis, including health checks and named volumes.

**Done when:** both services report healthy, and data survives a restart.

### 0.4 Prisma and env validation
- Add Prisma with a shared client in `src/server/db.ts`.
- Validate env vars with Valibot at startup.
- Add a `/api/health` route that checks the database.

**Done when:** a missing env var stops startup with a clear error, and the health route returns OK.

### 0.5 CI
- Add a GitHub Actions workflow that runs lint, type check and build.

**Done when:** CI passes on GitHub, and a deliberate type error fails it.

**Interview angle:** why env validation fails fast at startup.

## Phase 1: Auth and API

**Result:** users can sign in, and the typed API works.

### 1.1 Better Auth
- Add email/password sign-up and sign-in, using the Prisma adapter.
- Add sign-up, sign-in and sign-out pages.

**Done when:** sessions survive a refresh, and sign-out ends them.

### 1.2 Google login
- Add Google OAuth, including linking when the email already exists.

**Done when:** Google sign-in works locally, and no duplicate user gets created.

### 1.3 oRPC and TanStack Query
- Add the oRPC handler, typed client and TanStack Query provider.
- Add a public `health` procedure, and show its result on a page.

**Done when:** changing the procedure's output causes a type error on the page.

### 1.4 Protected procedures and pages
- Add auth middleware that puts the session user in the context.
- Add a protected `me` procedure and a `/dashboard` page.
- Add Vitest, an integration test for the unauthorized case, and a test step in CI.

**Done when:** signed-out users get redirected, and the API returns 401.

**Interview angle:** database sessions versus JWTs, and why the server takes `userId` only from the session.

## Phase 2: Master resume

**Result:** users can create and edit a resume.

### 2.1 Resume schema
- Write the Valibot schema for resume data, with stable bullet IDs.
- Add the `Resume` model and migration.

**Done when:** unit tests cover valid and invalid data.

### 2.2 Resume API
- Add `resume.get` and `resume.save`, with logic in a service.

**Done when:** integration tests prove users can reach only their own resume.

### 2.3 Resume editor
- Build the form with add, remove and reorder for entries and bullets.
- Add save state and clear validation errors.

**Done when:** your real resume can be entered, saved and reloaded unchanged.

**Interview angle:** why resume data is JSONB when applications are relational.

## Phase 3: Tracker and first deploy

**Result:** a useful app without AI, live on the internet. Use it for your own applications from here on.

### 3.1 Application API
- Add the `Application` and `ApplicationEvent` models.
- Add CRUD procedures, and record status changes in one transaction.

**Done when:** tests cover access rules and event creation.

### 3.2 Tracker UI
- Build the list with status filter, the detail page, and the add and edit forms.
- Use optimistic updates for status changes.

**Done when:** a failed status update rolls back in the UI, and refreshing shows correct data.

### 3.3 Production images
- Write a multi-stage Dockerfile for the TanStack Start production build.
- Add a production Compose file, and run Prisma migrations as a separate step.

**Done when:** the production stack runs locally from images.

### 3.4 Deploy
- Deploy to the VPS behind Caddy with HTTPS.
- Add automated, encrypted Postgres backups, and test a restore.
- Add a GitHub Actions deploy, with secrets stored in GitHub.

**Done when:** a push to `main` deploys, the site works over HTTPS, and a backup has been restored successfully.

**Interview angle:** deploying before the AI work, and how migrations run safely.

## Phase 4: Job match

**Result:** paste a job post and get an explained score. This is the core feature.

### 4.1 Queue and worker
- Add BullMQ, the `AiJob` model, a worker process and `job.getStatus`.
- Start with a fake job that waits and then finishes.

**Done when:** the UI shows progress by polling, and a job still finishes after the app restarts.

### 4.2 Retries and failures
- Add backoff, up to 3 attempts, and a failed state with a retry button.
- Make processors safe to run twice.

**Done when:** tests prove a repeated job doesn't create duplicate results.

### 4.3 AI layer with mock
- Add the provider interface, the mock provider and the Valibot output schemas.

**Done when:** tests and CI run with no API key.

### 4.4 Requirement extraction
- Activate the AI Pro Cloud credits, link them to a billing account, and set a budget alert.
- Add the real Gemini call, treating job post text as untrusted input.
- Record usage and cost for every call.

**Done when:** 5 real job posts give sensible results, costs are recorded, and Google Cloud billing shows the charges coming off your credits.

### 4.5 Matching and scoring
- Compare requirements to the resume, including evidence bullet IDs.
- Calculate the score in code, and add unit tests for it.
- Reject evidence IDs that don't exist.

**Done when:** the scoring tests pass, and the result page shows the evidence behind each match.

### 4.6 Caching and limits
- Add the hash-based cache, daily per-user limit, and global spending limit.

**Done when:** tests show a repeat request makes no AI call, and each limit returns a clear message.

### 4.7 First evals
- Add 10 job posts with expected requirements, and a command that reports accuracy and cost.

**Done when:** you have a baseline in the repo. Then use job match on your next 5 real applications, and fix whatever doesn't help you before moving on.

**Interview angle:** why slow AI work runs in a worker, how retries stay safe, and the real cost per match.

## Phase 5: Tailoring

**Result:** approved, honest rewrites saved as a resume version.

### 5.1 Suggestions
- Add the `Suggestion` model and a tailoring job that uses match results.

**Done when:** suggestions point to real bullets and save correctly.

### 5.2 Honesty checks
- Add the three code checks from the spec.
- Add bad examples to the evals, such as made-up numbers and skills.

**Done when:** every bad example gets blocked, and invented claims in evals are 0.

### 5.3 Review UI
- Show old and new text with the reason, and accept, edit and reject actions.

**Done when:** every decision saves and survives a refresh.

### 5.4 Resume versions
- Create a version from accepted suggestions, linked to the application.

**Done when:** the master resume is unchanged, and old versions stay readable.

**Interview angle:** why code checks AI output instead of trusting the prompt.

## Phase 6: PDF import and export

**Result:** users can start from an existing resume and download a tailored one.

### 6.1 PDF export
- Generate a one-page, single-column, text-based PDF.

**Done when:** text extraction returns correct reading order, and overflow beyond one page shows a warning.

### 6.2 PDF import
- Validate file type and size, and extract text in a worker job.
- Use AI to convert it into resume data, then let the user review it before saving.
- Discard the file after parsing.

**Done when:** your own resume imports correctly, and a bad file fails with a clear error.

**Interview angle:** handling untrusted uploads safely.

## Phase 7: Launch

**Result:** ready for real users.

### 7.1 Reply rates
- Add `stats.replyRates` and the page for it, with labels on small samples.
- Check its query with `EXPLAIN ANALYZE`, and add indexes if the plan calls for them.

**Done when:** numbers match a hand-checked test dataset.

### 7.2 Account safety
- Add password reset and email verification.
- Add API and auth rate limits.
- Add data export and account deletion.
- Add privacy and terms pages.

**Done when:** deleting an account removes all of that user's data, confirmed by a test.

### 7.3 Monitoring
- Add error tracking, uptime checks and structured logs without resume text.
- Add a small admin view for jobs, failures and AI spend.

**Done when:** a forced error raises an alert.

### 7.4 End-to-end tests
- Add Playwright for sign-up through export, using the mock provider, and run it in CI.

**Done when:** it passes in CI.

### 7.5 Launch
- Write the README with an architecture diagram and decisions, and record a short demo.
- Launch to friends and batchmates first, then on LinkedIn and relevant communities.
- Watch 5 people use it, and fix what confuses them.

**Done when:** real people outside your circle are using it.

**Add it to your resume** at this point, using only measured numbers.

## Phase 8: Scale and AWS

**Result:** tested limits and AWS experience. Start this only after launch.

### 8.1 Load test
- Run k6 against realistic flows, and find what fails first.
- Fix the top bottleneck, and record before and after numbers.

**Done when:** results and fixes are written up in the repo.

### 8.2 Move to AWS
- Move containers to ECS Fargate or EC2, the database to RDS, and Redis to ElastiCache.
- Define it with Terraform, and set billing alerts before creating anything.
- Plan the database move and a rollback, and record the actual downtime.

**Done when:** production runs on AWS, and you can explain the cost difference from the VPS.

### 8.3 Decide what's next
Choose from real user feedback. Don't plan this phase in advance.

**Interview angle:** a real migration, with real load test numbers and costs.
