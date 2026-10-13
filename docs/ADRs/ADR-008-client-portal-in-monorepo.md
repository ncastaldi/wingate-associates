# ADR-008: Build the client portal inside this repo, behind a clean boundary

**Status:** Draft
**Date:** 2026-10-13

## Context

A client portal and billing may follow the public site (see `docs/foundation.md`). Neither exists yet, so any repo split drawn today would be a guess. The public site and a portal differ in trust profile (anonymous vs. authenticated client data), release cadence and, eventually, blast radius. They also share a lot early on: the Postgres server (ADR-002), the Resend wrapper, env validation and UI components.

## Decision

Keep the portal in this repo and this Next.js app when it is built, but keep it separable:

1. Put portal routes in their own route group, `src/app/(portal)/`, with its own layout and auth middleware. Public routes never depend on it.
2. Public and portal code do not import from each other. Shared code lives in `src/lib/`, `src/db/` and `src/components/`.
3. Keep every external service behind a single function in `src/lib/` or `src/db/`, as already required.
4. Namespace portal tables (a separate Postgres schema or a table prefix) so they can move to their own database later.
5. Delegate portal authentication to the owner's self-hosted identity provider (Authentik, per ADR-003) rather than writing custom auth into the public app.

Extract the portal into its own repo and deployment when any of these becomes true:

- Real client data or billing is being stored.
- The portal needs a different release cadence or access control from the public site.
- The portal needs its own database or secrets boundary.
- A portal fault or migration should not be able to take down the landing page.

## Alternatives considered

- **Separate repo from day one:** clean isolation, but two Dockerfiles, CI pipelines, Komodo stacks and tunnel routes for a one-person practice, with the boundary drawn before the portal's shape is known.
- **Portal mixed into the public routes with no boundary:** fastest to start, but makes a later split expensive and puts authenticated code in the anonymous surface.

## Consequences

- One deploy and one CI pipeline for now; lower overhead while the portal is hypothetical.
- The boundary rules above are the cost: they need enforcing in review (or an ESLint import restriction once the portal exists).
- Extraction later should be mostly a copy plus deleting the route group, if the rules were followed.
- Resolves part of the CLAUDE.md open question on portal auth: default to Authentik. Revisit if that changes.
- Status is Draft until the portal work starts; confirm or supersede it then.
