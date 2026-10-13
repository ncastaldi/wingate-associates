# ADR-005: Plausible as the only analytics

**Status:** Accepted
**Date:** 2026-10-12

## Context

The owner already set up Plausible and needs a public site it can read. Privacy and self-hosting preferences rule out ad-tech trackers.

## Decision

Use Plausible via its script tag, configured through `NEXT_PUBLIC_PLAUSIBLE_SRC` so a self-hosted instance can be pointed at. No other analytics or tracking scripts.

**Amendment (2026-10-13):** Plausible's current per-site script identifies the site by its URL (`.../js/pa-<id>.js`), so `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `data-domain` are no longer needed. `src` is the only variable. The component renders nothing when it is unset.

## Alternatives considered

- **Google Analytics:** third-party, cookie-based, and conflicts with ADR-003.
- **No analytics:** the owner needs conversion data to judge the site.

## Consequences

- The script URL is environment-driven, so moving between Plausible Cloud and a self-hosted instance is a config change.
- Plausible needs the site served on the domain it was registered for.
- `NEXT_PUBLIC_*` values are inlined at build time, so `NEXT_PUBLIC_PLAUSIBLE_SRC` must be present when the image is built, not only when the container runs.
