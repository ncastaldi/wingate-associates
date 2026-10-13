# ADR-002: PostgreSQL with Drizzle ORM

**Status:** Accepted
**Date:** 2026-10-12

## Context

Leads must be stored in a database the owner controls from day one. A portal and billing may follow, which need relational data and transactions.

## Decision

Use PostgreSQL 17 as the database and Drizzle ORM (with `drizzle-kit` migrations and the `pg` driver) as the TypeScript data layer. The schema lives in `src/db/schema.ts`; generated SQL migrations live in `drizzle/`.

## Alternatives considered

- **SQLite:** simpler, no extra service, but a poor fit once a portal with concurrent writes and billing arrives.
- **Prisma:** comparable, but heavier at runtime and in the image; Drizzle's SQL-first schema was preferred.
- **Hosted database or form service:** rejected by ADR-003.

## Consequences

- Postgres is one more container to run and back up; `compose.yaml` runs it with a named volume.
- The same Postgres server can later host Cal.com's database (ADR-006).
- Migrations are committed, so schema changes are reviewable.
