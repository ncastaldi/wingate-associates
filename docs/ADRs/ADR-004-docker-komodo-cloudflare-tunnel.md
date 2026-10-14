# ADR-004: Docker deployment via Komodo, exposed only through a Cloudflare Tunnel

**Status:** Accepted
**Date:** 2026-10-12

## Context

The site is deployed to a self-hosted server and should not expose the host directly to the internet.

## Decision

Ship a multi-stage `Dockerfile` and a `compose.yaml`. CI builds the image to prove it builds. Komodo deploys the compose stack to the target server and holds the secrets as Komodo variables. `compose.yaml` publishes no host ports; a Cloudflare Tunnel connector reaches the `web` service over an external `edge` Docker network.

## Amendment (2026-10-14)

The `cloudflared` connector now runs as a service in `compose.yaml` instead of a separate connector on the host. It uses a remote-managed tunnel: the public hostname is set in the Cloudflare dashboard and only the tunnel token lives in the stack, as the Komodo variable `CLOUDFLARE_TUNNEL_TOKEN`. `edge` is an ordinary compose network shared by `web` and `cloudflared`, so the host no longer needs it created first. `db` stays on the `internal` network only. Still no published host ports.

## Alternatives considered

- **Direct port forward behind a reverse proxy:** exposes the host's IP and ports.
- **Managed platform (Vercel, Fly.io):** rejected by ADR-003.
- **Plain `docker run` or ssh deploys:** no audit trail or UI; Komodo is already in use.

## Consequences

- The tunnel needs a public hostname configured in the Cloudflare dashboard and its token set as a Komodo variable (see `deploy/README.md`).
- Secrets never live in the repo.
- The compose file and image have been validated locally (`docker compose config`, image build and HTTP 200) but not yet deployed through Komodo.
