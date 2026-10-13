# ADR-001: Next.js (App Router) with TypeScript as the full-stack framework

**Status:** Accepted
**Date:** 2026-10-12

## Context

The site must be a landing page, a conversion funnel and a portfolio, and may later grow a client portal and billing. Plausible analytics and SEO both favour server-rendered pages. The owner wants one language and one codebase.

## Decision

Use Next.js (App Router) with strict TypeScript on Node 24 LTS. Pages are server-rendered. The lead-capture endpoint is a server action or route handler in the same app. Output mode is `standalone` so it packages into a small Docker image.

## Alternatives considered

- **Astro:** lighter and faster for static content, but a later client portal would need a second app or heavy client islands.
- **SvelteKit / Remix:** viable, but the owner has no preference for them and Next.js has the widest ecosystem for the portal and billing work that may follow.
- **Client-side SPA (React + Vite):** poorer for SEO and first load on a marketing site.

## Consequences

- One codebase serves the site, the lead pipeline and, later, the portal.
- Next.js releases move fast; Dependabot and CI must keep it current.
- The `standalone` output couples the Dockerfile to Next's build layout.
