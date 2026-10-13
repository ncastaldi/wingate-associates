# src/app

Next.js App Router routes. Each folder is a URL segment; `page.tsx` is the page, `layout.tsx` wraps it.

## What belongs here

- Pages: landing, services, engagement models, portfolio and case studies, contact
- Route handlers (`route.ts`) and server actions, including the lead-capture endpoint
- Per-route metadata (title, description) for SEO

## What does not belong here

- Reusable UI (goes in `src/components/`)
- Database queries or email-sending logic (go in `src/db/` and `src/lib/`, called from here)
- Secrets or env reads scattered across files (read env through `src/lib/` only)

## Conventions

- Server components by default; add `"use client"` only where interactivity needs it.
- Validate every form or request body with `zod` before it touches the database or Resend.
- Files are kebab-case, components PascalCase, exports named except where Next requires a default (`page.tsx`, `layout.tsx`).
