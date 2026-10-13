# deploy

Notes for deploying the site. The deployable artefacts themselves (`Dockerfile`, `compose.yaml`) live at the repo root.

## How it ships

1. CI builds and checks the image (`.github/workflows/ci.yml`).
2. Komodo deploys `compose.yaml` to the target server and supplies secrets as Komodo variables.
3. A Cloudflare Tunnel connector reaches the `web` service over the external `edge` Docker network. No ports are published to the host.

## One-time setup on the target host

- Create the shared network: `docker network create edge`
- Point the Cloudflare Tunnel's public hostname at `http://web:3000`
- Set the variables listed in `.env.example` as Komodo variables
- `NEXT_PUBLIC_PLAUSIBLE_SRC` is inlined at build time, so it must be available when the stack builds the image (compose passes it as a build arg). Changing it needs a rebuild, not just a restart.

## What does not belong here

- Secrets or `.env` files
- Anything the Dockerfile or compose file already says. Link to it instead.
