# CLAUDE.md

This file is the primary context document for Claude (and other LLM assistants) working in this repository. Keep it current: the best time to update it is at the end of a working session, before you close the repo.

---

## Project identity

Wingate Associates is the website for an independent consulting practice (an LLC the owner is launching after leaving a W2 role). It serves three jobs at once: a formal corporate landing page, a client conversion engine (services, engagement models, lead capture), and a technical portfolio of SaaS projects, code bases and case studies.

The audience is prospective consulting clients, and, for the portfolio, technical peers and hiring contacts. The 6–12 month goal is a client or two and a growing portfolio. A client portal and billing may follow; nothing is ruled out as a future feature, so avoid choices that would block them. See `docs/foundation.md` for the founding brief.

## Stack

- **Language:** TypeScript (strict) on Node 24 LTS (`.nvmrc`); `engines` allows Node 22 and up
- **Framework:** Next.js (App Router), server-rendered, covering frontend and backend
- **Database:** PostgreSQL 17, Drizzle ORM (`drizzle-kit` migrations, `pg` driver)
- **Validation:** zod
- **Email:** Resend (the only approved hosted service)
- **Analytics:** Plausible (script tag, env-configured)
- **Booking (planned, on hold):** self-hosted scheduler, to be chosen; Cal.com closed its source in April 2026 (ADR-006 amendment)
- **Tests:** Vitest + Testing Library; Playwright for end-to-end
- **Lint/format:** ESLint (Next flat config), Prettier, `tsc --noEmit`
- **Deployment:** Docker (multi-stage image), `compose.yaml` deployed by Komodo, exposed via a Cloudflare Tunnel

## Architecture

A single Next.js app at the repo root; there is no frontend/backend split.

- `src/app/` — routes and pages, plus the lead-capture server action or route handler
- `src/components/` — reusable UI
- `src/lib/` — env validation, the Resend client, the Plausible helper
- `src/db/` — Drizzle schema and client; `drizzle/` holds generated migrations
- `tests/` — Vitest tests; `tests/e2e/` for Playwright
- `deploy/` — deployment notes; `Dockerfile` and `compose.yaml` are at the root

Data flow for a lead: the contact form posts to a server action, which validates the input with zod, inserts a row into Postgres, then sends a notification email through Resend. Each external service sits behind one function in `src/lib/` or `src/db/`, so swapping it touches one file.

In production the `web` container and Postgres run from `compose.yaml`; the Cloudflare Tunnel connector reaches `web` over the external `edge` Docker network, and no ports are published to the host.

## Constraints (non-negotiable)

1. **Self-host by default.** Resend is the only approved hosted service. Any new third-party service needs the owner's sign-off and an ADR.
2. **Reachable only through the Cloudflare Tunnel.** Never publish host ports or expose the site or database directly.
3. **No secrets in the repo.** Configuration comes from environment variables, documented in `.env.example`. Never commit `.env` or any file containing secrets.
4. **Lead data stays in the owner's Postgres.** Nothing is sent to third parties apart from the Resend notification email.
5. **Plausible is the only analytics.** Add no other trackers or tracking scripts.

## Session Config

| Value | Setting |
|---|---|
| `TEST_COMMAND` | npm test |
| `LINT_COMMAND` | npm run lint |
| `SRC_ROOT` | src/ |
| `DOCS_ROOT` | docs/ |
| `ADR_PATH` | docs/ADRs/ |
| `SNAPSHOT_PATH` | docs/session-history/ |

## Code style

- TypeScript `strict` is on. No `any` without a comment explaining why.
- File names are kebab-case, components PascalCase, exports named (except where Next requires a default, such as `page.tsx` and `layout.tsx`).
- Prettier formats application code; ESLint enforces the rest. Prettier deliberately ignores docs, workflows and scripts.
- Server components by default; add `"use client"` only where interactivity needs it.
- Validate every external input with zod before it reaches the database or Resend.
- Conventional Commits are expected (`feat(scope): ...`, `fix(scope): ...`).
- Next.js: this version differs from most training data. Follow @AGENTS.md and read `node_modules/next/dist/docs/` before writing Next.js code.

## Current state

### Done

- Repo scaffolded from template, foundation.md and CLAUDE.md written.
- Next.js app skeleton: strict TypeScript, ESLint/Prettier, Vitest with one smoke test, a placeholder home page, a `leads` table schema.
- Production `Dockerfile` and `compose.yaml` for Komodo. The image builds and serves HTTP 200 locally, and `docker compose config` validates.
- CI (`ci.yml`) for lint, typecheck, test, build and image build; Dependabot for npm and Docker.
- First migration for the `leads` table (`drizzle/0000_low_fenris.sql`), applied and checked against a throwaway Postgres 17.
- Lead-capture server action (`src/app/contact/actions.ts`): zod validation, Postgres insert, Resend notification. Env is validated lazily in `src/lib/env.ts`. The insert path was checked against a throwaway Postgres 17; the live Resend call has not been exercised yet.
- Contact page (`src/app/contact/page.tsx`) with a `ContactForm` client component (`useActionState`, field errors, success state) and a honeypot field (`HONEYPOT_FIELD` in `src/lib/lead-schema.ts`): a filled honeypot returns `ok: true` without storing or emailing. There is no rate limiting yet. The home page links to `/contact`. Tests now run `cleanup` after each test (`tests/setup.ts`).
- First Playwright test (`tests/e2e/contact-form.spec.ts`): field errors and honeypot. The happy path needs Postgres and Resend, so it is not covered yet.
- Plausible script wiring (`src/components/plausible-script.tsx`, rendered in the root layout). It reads only `NEXT_PUBLIC_PLAUSIBLE_SRC` and renders nothing when unset. ADR-005 is amended to drop `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- v1 pages (#4): real Home page, combined Services page (`src/app/services/page.tsx`), and a shared header and footer in the root layout (`src/components/site-header.tsx`, `site-footer.tsx`). All copy is placeholder text flagged by `PlaceholderNotice`; the owner must replace it before launch. The pages are unstyled, like the rest of the site.

### In progress

### Not started

- Real copy for Home and Services (replace the placeholders), then #4 can close
- Portfolio and case studies: deferred past v1.
- Self-hosted booking in the compose stack: evaluate Cal.diy or another self-hostable scheduler first (ADR-006 amendment, #9)
- First deploy through Komodo and the Cloudflare Tunnel (`deploy/README.md`)

## Open questions

1. What is the success metric beyond "a client or two in 6–12 months"? Define one before first release.
2. Client portal and billing may be added later. Decide on an auth approach (the owner's self-hosted tooling is the default) before starting either.
3. Is Plausible run self-hosted or on Plausible Cloud? The env vars support both.
4. Local Node is 22 but the Docker image and `.nvmrc` target 24. Move local development to 24.

## Decision log

- [ADR-001: Next.js (App Router) with TypeScript as the full-stack framework](docs/ADRs/ADR-001-nextjs-typescript-full-stack.md) — one TypeScript codebase for the site, lead pipeline and any later portal
- [ADR-002: PostgreSQL with Drizzle ORM](docs/ADRs/ADR-002-postgres-drizzle.md) — leads in the owner's own database, with a path to portal and billing
- [ADR-003: Self-host by default, with Resend as the only hosted service](docs/ADRs/ADR-003-self-host-by-default.md) — the owner owns the tooling; email is the one exception
- [ADR-004: Docker deployment via Komodo, exposed only through a Cloudflare Tunnel](docs/ADRs/ADR-004-docker-komodo-cloudflare-tunnel.md) — no host ports, secrets as Komodo variables
- [ADR-005: Plausible as the only analytics](docs/ADRs/ADR-005-plausible-analytics.md) — env-configured script, no other trackers
- [ADR-006: Self-hosted Cal.com for booking](docs/ADRs/ADR-006-self-hosted-calcom-booking.md) — on hold: Cal.com closed its source in April 2026; re-evaluate Cal.diy or alternatives before adding to compose
- [ADR-007: Vitest, ESLint, Prettier and Playwright as the test and lint toolchain](docs/ADRs/ADR-007-test-and-lint-toolchain.md) — CI runs lint, typecheck, test and build
- [ADR-008: Build the client portal inside this repo, behind a clean boundary](docs/ADRs/ADR-008-client-portal-in-monorepo.md) — route-group separation now, extract on defined triggers

---

*Last updated: 2026-10-13 | Session: Cal.com ADR amendment and first Playwright test*
