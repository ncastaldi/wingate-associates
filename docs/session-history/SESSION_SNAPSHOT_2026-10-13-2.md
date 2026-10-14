## Session Goals
Record that Cal.com closed its source (ADR-006, #9), then take #8 (first Playwright test for the
contact form). This note covers two Claude sessions run back to back; the first was closed by
accident and its transcript was read to recover its work.

## Accomplishments
- Cal.com, PR #27 (open, not merged): Cal.com closed its main production code in April 2026 and the
  open-source project continues as Cal.diy. ADR-006 carries a dated 2026-10-13 amendment putting the
  decision on hold until Cal.diy or another self-hostable scheduler is evaluated against ADR-003,
  and saying not to add Cal.com to `compose.yaml` until then. `CLAUDE.md` (Stack, Not started,
  decision log) matches. Commented on #9 that it needs rescoping; its labels are unchanged. The
  fact was taken from the owner's report and not independently verified.
- #8, PR #28 (open, not merged, `Closes #8`): `tests/e2e/contact-form.spec.ts` with two cases,
  field errors that keep what was typed, and the honeypot reporting success. Both run without
  Postgres or Resend. Six runs passed (three repeats of each case). Lint, typecheck and the 35 unit
  tests pass. `tests/README.md` and `CLAUDE.md` updated.
- Chromium for Playwright was installed locally with `npx playwright install chromium`.

## Technical Debt / Pending
- PRs #27 and #28 both edit `CLAUDE.md`; whichever merges second may need a rebase.
- The e2e suite does not run in CI. The workflow needs a Playwright browser install step.
- The e2e happy path (insert a lead, send the email) is untested; it needs a throwaway Postgres and
  a Resend stub or a real key.
- I did not run `npm run build` for #28.
- `next dev` generated an untracked `AGENTS.md` in the repo root (a Next.js agent-rules block). It
  was left uncommitted; decide whether to commit or gitignore it.
- Still open from the previous snapshot: duplicates #23 and #24 of #22; #4 is `status:planned` and
  should be `status:in-progress`; #7 is closed but may carry `status:in-progress`; #4, #8, #9, #10
  and #22 have no priority label; the live Resend send has never run.
- A `git push` hung once (120 s timeout) and succeeded on retry. Check `git status -sb` after a
  timed-out push before assuming it landed.
- Open questions in CLAUDE.md (v1 page list, success metric, portal auth, Plausible hosting, Node 24)
  are unchanged.

## Next Steps
1. Merge #27 and #28 once CI is green (resolve any `CLAUDE.md` conflict); #8 closes with #28.
2. Run /session-start. Close #23 and #24, fix the #7 and #4 labels, set priorities.
3. Answer open question 1 (v1 page list), then build the pages for #4.
4. #10: try one real Resend send before the first deploy, and set `NEXT_PUBLIC_PLAUSIBLE_SRC` in Komodo.
5. #9: after #27 merges, evaluate Cal.diy and alternatives, then rescope the issue.
6. #22: rate limiting. Optionally add an issue for running Playwright in CI.
