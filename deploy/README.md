# deploy

Notes for deploying the site. The deployable artefacts themselves (`Dockerfile`, `compose.yaml`) live at the repo root.

## How it ships

1. CI builds and checks the image (`.github/workflows/ci.yml`).
2. Komodo deploys `compose.yaml` to the target server, building the `web` and `migrate` images, and supplies secrets as Komodo variables.
3. On each deploy the `migrate` service applies pending database migrations (`drizzle/`) and exits; `web` starts only after it succeeds, so a fresh database gets its tables without a manual step.
4. The `cloudflared` service in the same stack dials out to Cloudflare and reaches `web` over the `edge` Docker network. No ports are published to the host, and `cloudflared` is not on the network `db` uses.

## One-time setup

1. In the Cloudflare Zero Trust dashboard, create a remote-managed tunnel and copy its token (Networks, Tunnels). The token is the long string starting `eyJ` in the install command, not the tunnel ID (a UUID).
2. Add a public hostname to the tunnel: `wingate.associates`, service `http://web:3000`. The `web` name resolves because `cloudflared` shares the `edge` network with it. Per the new domain runbook, `www` redirects to the apex.
3. In Komodo, set the variables listed in `.env.example`, including `CLOUDFLARE_TUNNEL_TOKEN`.
4. `NEXT_PUBLIC_PLAUSIBLE_SRC` is inlined at build time, so it must be available when the stack builds the image (compose passes it as a build arg). Changing it needs a rebuild, not just a restart.
5. Deploy the stack. Nothing needs creating on the host first: `compose.yaml` defines the networks.

## First-deploy smoke test

1. `migrate` exited 0 and `web`, `db` and `cloudflared` are running.
2. `https://wingate.associates` loads, and `/services` and `/contact` too.
3. `docker ps` shows no published host ports.
4. Submit the contact form. A row appears in `leads` and the notification email arrives at `CONTACT_TO_EMAIL`.

## What does not belong here

- Secrets or `.env` files
- Anything the Dockerfile or compose file already says. Link to it instead.
