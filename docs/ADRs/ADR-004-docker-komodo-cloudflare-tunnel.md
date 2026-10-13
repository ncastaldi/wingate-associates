# ADR-004: Docker deployment via Komodo, exposed only through a Cloudflare Tunnel

**Status:** Accepted
**Date:** 2026-10-12

## Context

The site is deployed to a self-hosted server and should not expose the host directly to the internet.

## Decision

Ship a multi-stage `Dockerfile` and a `compose.yaml`. CI builds the image to prove it builds. Komodo deploys the compose stack to the target server and holds the secrets as Komodo variables. `compose.yaml` publishes no host ports; a Cloudflare Tunnel connector reaches the `web` service over an external `edge` Docker network.

## Alternatives considered

- **Direct port forward behind a reverse proxy:** exposes the host's IP and ports.
- **Managed platform (Vercel, Fly.io):** rejected by ADR-003.
- **Plain `docker run` or ssh deploys:** no audit trail or UI; Komodo is already in use.

## Consequences

- The target host needs the `edge` network and a configured tunnel hostname (see `deploy/README.md`).
- Secrets never live in the repo.
- The compose file and image have been validated locally (`docker compose config`, image build and HTTP 200) but not yet deployed through Komodo.
