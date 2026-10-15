# ADR-006: Self-hosted Cal.com for booking

**Status:** Accepted (Cal.diy, 2026-10-15). Not yet deployed.
**Date:** 2026-10-12

## Context

Prospects should be able to book a call. The owner wants to own and deploy the tool rather than use a hosted scheduler.

## Decision

Plan to run self-hosted Cal.com alongside the site and link or embed it from the contact flow. It is not part of the first scaffold: it gets added to the compose stack when the booking page is built.

**Amendment (2026-10-13):** Per the owner, Cal.com closed-sourced its main production code in April 2026. Self-hosting is no longer a standard self-serve process for enterprise platforms, and the public open-source project continues as "Cal.diy". The decision above is on hold: before booking work starts, evaluate Cal.diy (or another self-hostable scheduler) against ADR-003, and record the outcome here or in a superseding ADR. Do not add Cal.com to `compose.yaml` until then.

**Amendment (2026-10-15):** Cal.diy is the choice, and the hold is lifted. It is MIT licensed, the code is public at `calcom/cal.diy`, and the project publishes an official image, `calcom/cal.diy` on Docker Hub, with a Dockerfile and compose file in the repo. That meets ADR-003: no hosted service, and booking data stays in the owner's Postgres.

How it is run (`compose.yaml`):

- The official image, pinned by `CAL_VERSION`, pulled from Docker Hub. The repo's own compose file points at a `scarf.sh` proxy, which is a tracking redirect, so it is not used.
- The public URL (`NEXT_PUBLIC_WEBAPP_URL`) is a build-time setting, but the image rewrites its placeholder at start-up, so no custom build is needed.
- Its own `cal` role and database on the existing Postgres server, created by a one-shot `cal-db-init` service. Redis, Prisma Studio and the separate API v2 service from Cal.diy's compose file are left out: the booking page does not need them, and Studio would expose the database.
- `CALCOM_TELEMETRY_DISABLED=1` and `NEXT_PUBLIC_DISABLE_SIGNUP=true`, to keep constraints 4 and 5.
- Booking emails use Resend's SMTP relay, so Resend remains the only hosted service.
- No host ports. It joins the `edge` network and gets its own tunnel hostname, `cal.wingate.associates`.
- The contact page embeds the public booking page in an iframe, set by the `BOOKING_URL` variable. Clicking out to a new tab is the fallback.

Open points: the SMTP relay settings and the iframe policy were written from Cal.diy's docs and `.env.example`, not yet run against a live instance. Verify both in the deploy smoke test (`deploy/README.md`). The Cloudflare edge's `X-Frame-Options` must be removed for the Cal.diy hostname, or the embed stays blank.

## Alternatives considered

- **Calendly or hosted Cal.com:** hosted, conflicts with ADR-003.
- **Email-only contact:** works, but adds back-and-forth before a first call.

## Consequences

- Cal.com is a heavier service with its own database; it can share the Postgres server (ADR-002) but needs its own database and secrets.
- Cal cannot be rolled back without its database: a version bump runs migrations forward. Back up the `cal` database before a major bump.
