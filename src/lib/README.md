# src/lib

Shared server and client helpers that are not UI and not database schema.

## What belongs here

- Environment validation (one `zod` schema that parses `process.env`, so a missing variable fails loudly at startup)
- The Resend client and the function that sends the contact notification
- The Plausible script helper (reads `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `NEXT_PUBLIC_PLAUSIBLE_SRC`)
- Small pure utilities

## What does not belong here

- Database schema or queries (`src/db/`)
- React components (`src/components/`)
- Third-party SDKs for services other than Resend without an ADR: this project self-hosts by default (see `docs/ADRs/ADR-003-self-host-by-default.md`)

## Conventions

- Keep modules small and pure where possible, so they are easy to unit test.
- Wrap each external service behind one function, so swapping it later touches one file.
