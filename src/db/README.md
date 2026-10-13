# src/db

Drizzle ORM schema and database client for PostgreSQL.

## What belongs here

- `schema.ts`: table definitions (starts with `leads`)
- `index.ts`: the connection pool and `db` client
- Query helpers that wrap a table (for example `insertLead`)

## What does not belong here

- Generated SQL migrations (those live in `drizzle/`)
- Request validation (do it in the route or action before calling in here)

## Workflow

1. Edit `schema.ts`.
2. `npm run db:generate` writes a migration into `drizzle/`.
3. `npm run db:migrate` applies it. Needs `DATABASE_URL`.
4. Commit the schema change and the generated migration together.

Lead data stays in this database and is not sent to third parties (CLAUDE.md constraint 4).
