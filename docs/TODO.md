# Shortlist progress

Claude manages this file. Step details are in `ROADMAP.md`.

Current step: 3.2

## Phase 0: Foundation

- [x] 0.1 Create the app
- [x] 0.2 Code quality
- [x] 0.3 Local services
- [x] 0.4 Prisma and env validation
- [x] 0.5 CI (failure test skipped by Jeet)

## Phase 1: Auth and API

- [x] 1.1 Better Auth
- [x] 1.2 Google login (linking to verified accounts tested in 7.2)
- [x] 1.3 oRPC and TanStack Query
- [x] 1.4 Protected procedures and pages

## Phase 2: Master resume

- [x] 2.1 Resume schema
- [x] 2.2 Resume API (hand-checked, tests deferred to 7.4)
- [x] 2.3 Resume editor

## Phase 3: Tracker and first deploy

- [x] 3.1 Application API (hand-checked, tests deferred to 7.4)
- [ ] 3.2 Tracker UI
- [ ] 3.3 Production images
- [ ] 3.4 Deploy

## Phase 4: Job match

- [ ] 4.1 Queue and worker
- [ ] 4.2 Retries and failures
- [ ] 4.3 AI layer with mock
- [ ] 4.4 Requirement extraction
- [ ] 4.5 Matching and scoring
- [ ] 4.6 Caching and limits
- [ ] 4.7 First evals

## Phase 5: Tailoring

- [ ] 5.1 Suggestions
- [ ] 5.2 Honesty checks
- [ ] 5.3 Review UI
- [ ] 5.4 Resume versions

## Phase 6: PDF import and export

- [ ] 6.1 PDF export
- [ ] 6.2 PDF import

## Phase 7: Launch

- [ ] 7.1 Reply rates
- [ ] 7.2 Account safety
- [ ] 7.3 Monitoring
- [ ] 7.4 Test suite
- [ ] 7.5 Launch

## Phase 8: Scale and AWS

- [ ] 8.1 Load test
- [ ] 8.2 Move to AWS
- [ ] 8.3 Decide what's next

## Follow-ups

- 7.2: add size limits to `resumeSchema` arrays and text, so one user can't store an unbounded resume.
- 6.1: restrict `resumeSchema` URLs to http and https before rendering them as links, because `v.url` accepts `javascript:`.
- 7.2: after adding email verification, test that Google links to a verified password account. Until then, Better Auth blocks linking to unverified accounts.
- 7.2: show a friendly message when Google sign-in fails with `account_not_linked`.
- 3.3: add `compose.prod.yaml` with app and worker images, strong secrets, and no public Postgres or Redis ports.
- 3.3: `nitro` is a pinned beta, so check for a stable release before the production build.
- 3.3: remove the unused `@sentry` external from `vite.config.ts`, unless Sentry gets added in 7.3.
- 7.5: replace the starter page title and README.

## Ideas for later

None yet.
