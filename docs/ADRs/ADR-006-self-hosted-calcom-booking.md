# ADR-006: Self-hosted Cal.com for booking

**Status:** Draft
**Date:** 2026-10-12

## Context

Prospects should be able to book a call. The owner wants to own and deploy the tool rather than use a hosted scheduler.

## Decision

Plan to run self-hosted Cal.com alongside the site and link or embed it from the contact flow. It is not part of the first scaffold: it gets added to the compose stack when the booking page is built.

**Amendment (2026-10-13):** Per the owner, Cal.com closed-sourced its main production code in April 2026. Self-hosting is no longer a standard self-serve process for enterprise platforms, and the public open-source project continues as "Cal.diy". The decision above is on hold: before booking work starts, evaluate Cal.diy (or another self-hostable scheduler) against ADR-003, and record the outcome here or in a superseding ADR. Do not add Cal.com to `compose.yaml` until then.

## Alternatives considered

- **Calendly or hosted Cal.com:** hosted, conflicts with ADR-003.
- **Email-only contact:** works, but adds back-and-forth before a first call.

## Consequences

- Cal.com is a heavier service with its own database; it can share the Postgres server (ADR-002) but needs its own database and secrets.
- Status is Draft until the booking work starts.
