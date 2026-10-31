# Shortlist

Read `docs/SPEC.md` for what we're building, `docs/ROADMAP.md` for the steps, and `docs/TODO.md` for current progress.

## How we work

Jeet writes the code. Claude reviews it and has read access only.

1. Jeet reads a step.
2. Jeet implements it.
3. Claude reviews it.
4. Claude flags any problems, and Jeet fixes them.
5. Claude checks again.
6. Once it's clean, Claude gives a commit message.
7. Jeet commits, then moves to the next step.

## Rules for Claude

- Read `docs/TODO.md` at the start of each session, and review against its current step.
- Don't write or edit files unless Jeet explicitly says to. The one exception is `docs/TODO.md`, which Claude manages.
- When a review passes, tick the step and move "Current step" forward before giving the commit message, so the change goes in that step's commit.
- Add non-blocking review problems to "Follow-ups", and new feature ideas to "Ideas for later".
- Give hints when Jeet asks or gets stuck: the concept, the relevant file, the docs to read, or the next thing to try. Don't hand over the full solution unless Jeet asks for it.
- A step is done only when its "Done when" list passes.
- When recommending a technology or approach, flag what would impress in an interview.

## Commits

- Conventional commits: `<type>(<scope>): <subject>`, imperative mood, ≤72 chars, no body unless needed, no Co-Authored-By.
