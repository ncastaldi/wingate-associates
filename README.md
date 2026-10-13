# Wingate Associates

The website for Wingate Associates, an independent consulting practice. It is a corporate landing page, a client conversion engine (services, engagement models and a lead-capture pipeline) and a technical portfolio of SaaS projects and case studies.

---

## Stack

- **Language:** TypeScript (strict) on Node 24 LTS (`.nvmrc`; `engines` allows Node 22 and up)
- **Framework:** Next.js (App Router), server-rendered, for both the frontend and the lead-capture backend
- **Database:** PostgreSQL with Drizzle ORM
- **Email:** Resend, the one hosted service. Everything else is self-hosted
- **Analytics:** Plausible
- **Booking (planned):** self-hosted Cal.com
- **Tests and lint:** Vitest + Testing Library, Playwright for end-to-end, ESLint, Prettier
- **Deployment:** Docker image, deployed by Komodo, reached only through a Cloudflare Tunnel

## Quick Start

```bash
nvm use                      # Node 24 (22 also works)
npm ci
cp .env.example .env         # then fill in the values
docker compose up -d db      # local Postgres (needs POSTGRES_* from .env)
npm run db:migrate
npm run dev                  # http://localhost:3000
```

Before pushing, run what CI runs:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Project Structure

```
src/app/          Next.js routes and pages, including the lead-capture endpoint
src/components/   Reusable UI components
src/lib/          Env validation, Resend client, Plausible helper
src/db/           Drizzle schema and database client
drizzle/          Generated SQL migrations
tests/            Vitest unit tests; tests/e2e/ for Playwright
public/           Static assets
deploy/           Deployment notes (Komodo, Cloudflare Tunnel)
Dockerfile        Production image
compose.yaml      Stack Komodo deploys (web + Postgres)
.claude/          Claude Code commands and skills
docs/             All project documentation
scripts/          Dev-time utilities (not shipped)
```

For architecture decisions, see `docs/ADRs/`.
For technical specs, see `docs/specs/`.
For SOPs and runbooks, see `docs/SOPs/`.
For the founding brief, see `docs/foundation.md`.

### Staying current with the template

`.template-version` records which template version this repo was scaffolded from — leave it in place. The **sync-from-template** skill reads it to report how far behind the project has fallen, rather than just diffing every file blind.
