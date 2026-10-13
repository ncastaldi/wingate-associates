## Session Goals
Take #7 (Plausible script) and then the first slice of #4 (contact page).

## Accomplishments
- #7, PR #21 (`d248c8c`): `PlausibleScript` (`src/components/plausible-script.tsx`) loads the per-site
  script and its `window.plausible` init snippet with `next/script`, rendered in the root layout.
  It renders nothing unless `NEXT_PUBLIC_PLAUSIBLE_SRC` is set.
  - Plausible's per-site script identifies the site by URL, so `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is
    dropped. ADR-005 carries a dated amendment; `.env.example` and `deploy/README.md` are updated.
  - `NEXT_PUBLIC_*` values are inlined at build time, so the Dockerfile takes an `ARG` and
    `compose.yaml` passes it under `build.args`, not runtime `environment`. Checked with
    `docker compose config` and a `docker build` whose output contained the URL.
- #4 first slice, PR #25 (`b39279d`): `/contact` page and `ContactForm` client component
  (`useActionState`; field errors tied to inputs, form-level alert, success state, typed values kept
  after a failed submit). Hidden honeypot field: a filled honeypot makes `submitLead` return
  `ok: true` without storing or emailing. `HONEYPOT_FIELD` lives in `src/lib/lead-schema.ts`
  because a `"use server"` file may only export async functions. Home page links to `/contact`.
  `tests/setup.ts` now runs Testing Library `cleanup` after each test (Vitest has no globals).
- Tests went from 22 to 35. Lint and build pass; `next build` with no secrets set prerenders
  `/contact`, the first proof that lazy env works on the action path.
- Filed #22 (rate limiting for the contact form). PR #25 was `Refs #4`, so #4 stays open; commented
  there on what shipped and what remains.

## Technical Debt / Pending
- Duplicate issues #23 and #24 (identical to #22) are still open. I created them by retrying a POST
  after `gh api --jq` failed silently; the close was denied by the auto-mode classifier, so it is
  left to the owner. Keep #22.
- Label cleanup: #7 is closed but still `status:in-progress`; #4 is still `status:planned` and
  should be `status:in-progress` while the other pages are open.
- `NEXT_PUBLIC_PLAUSIBLE_SRC` must be set as a Komodo variable available at build time (the
  instance's `.../js/pa-<id>.js` URL). Nothing has been deployed, so Plausible is unverified.
- The live Resend send and a real form-to-Postgres submit have never run. `next build` imports
  `submitLead` but does not call it.
- No rate limiting on the contact action (#22). Priorities are still unset on #4, #8-#10, #22.
- `getEnv()` caches its first result, and `getDb()` calls `getEnv()`, so a missing Resend variable
  also fails database access.
- `gh api` quirks seen this session: the `{owner}/{repo}` placeholder stopped resolving partway
  through, and `--jq` produced no output with exit 1 on writes that had succeeded. Check a write's
  result before retrying it, and use explicit repo paths.
- Dependabot #14 (ESLint 10) and #15 (TypeScript 7) wait on upstream support. Local Node is 22
  while `.nvmrc` and the image target 24. Vitest warns that `vitest.config.ts` loads as CommonJS.
- Open questions in CLAUDE.md (v1 page list, success metric, portal auth, Plausible hosting) are
  unchanged; the page list blocks the rest of #4.

## Next Steps
1. Run /session-start. Close #23 and #24, fix the #7 and #4 labels, set priorities on #4, #8-#10, #22.
2. Answer open question 1 (v1 page list), then build the services, engagement models and
   portfolio pages for #4, with a shared header and footer for navigation.
3. #8: first Playwright test for the contact form (now unblocked).
4. Try one real Resend send (local key and verified domain) before the first deploy (#10).
5. #22: rate limiting, using `cf-connecting-ip` behind the tunnel and no hosted CAPTCHA.
6. Set `NEXT_PUBLIC_PLAUSIBLE_SRC` in Komodo for the first deploy (#10).
7. Move local development to Node 24. Re-check #14 and #15 when upstream releases support.
