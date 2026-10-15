# deploy

Notes for deploying the site. The deployable artefacts themselves (`Dockerfile`, `compose.yaml`) live at the repo root.

## How it ships

1. CI builds and checks the image (`.github/workflows/ci.yml`).
2. Komodo deploys `compose.yaml` to the target server, building the `web` and `migrate` images, and supplies secrets as Komodo variables.
3. On each deploy the `migrate` service applies pending database migrations (`drizzle/`) and exits; `web` starts only after it succeeds, so a fresh database gets its tables without a manual step.
4. The `cloudflared` service in the same stack dials out to Cloudflare and reaches `web` over the `edge` Docker network. No ports are published to the host, and `cloudflared` is not on the network `db` uses.

## One-time setup

1. In the Cloudflare Zero Trust dashboard, create a remote-managed tunnel and copy its token (Networks, Tunnels). The token is the long string starting `eyJ` in the install command, not the tunnel ID (a UUID).
2. Under the tunnel's Routes, add published applications for `wingate.associates` and `www.wingate.associates`, both with service `http://web:3000`. The `web` name resolves because `cloudflared` shares the `edge` network with it. Without a route the connector shows healthy but the site does not load. The runbook's `www`-to-apex redirect is a separate Cloudflare Redirect Rule.
3. Paste `.env.example` into the Komodo stack's Environment and fill in the blanks. Each line is `NAME=value`; check the name is not pasted twice (`NAME=NAME=value`).
4. In the Komodo stack settings, add `migrate` to Ignore Services. It runs once and exits, and Komodo otherwise reports the stack as unhealthy.
5. `NEXT_PUBLIC_PLAUSIBLE_SRC` is inlined at build time, so it must be available when the stack builds the image (compose passes it as a build arg). Changing it needs a rebuild, not just a restart.
6. Email lives in Resend for both directions. The domain is verified for sending (DKIM `resend._domainkey`, plus `send` and `rsend` CNAMEs) and for receiving (root MX `inbound-smtp.us-east-1.amazonaws.com`, priority 5), and `hello@wingate.associates` is a Resend inbox. `_dmarc` is `v=DMARC1; p=none; rua=mailto:hello@wingate.associates`. Cloudflare Email Routing must stay off: it adds its own locked MX records, and a domain can deliver to only one provider.
7. Deploy the stack. Nothing needs creating on the host first: `compose.yaml` defines the networks and the volume.

## Things that bite

- **Komodo's deploy log prints every secret.** The Compose Config stage shows the resolved environment. Delete that stage before sharing a log; the Compose Up stage and `docker logs <container>` are enough to debug.
- **Environment changes need a redeploy.** A container keeps the values it was created with. Check what it actually has with `sudo docker exec wingate-associates-web-1 printenv CONTACT_TO_EMAIL | cat -A`.
- **`POSTGRES_PASSWORD` is read only when the `db-data` volume is first created.** Changing it later makes `migrate` fail with `password authentication failed`. With real leads stored, change it inside the database first (`ALTER USER wingate PASSWORD '...'`), then in Komodo. With no data worth keeping, recreate the volume instead:
  1. Destroy the stack in Komodo. This runs `docker compose down`, which keeps volumes.
  2. `sudo docker ps -a --filter name=wingate-associates` lists nothing.
  3. `sudo docker volume rm wingate-associates_db-data`. This deletes every stored lead.
  4. Deploy. The log shows `Volume wingate-associates_db-data Creating`.
- **No MX record means notifications vanish, then stay blocked.** Until 2026-10-14 the domain had no MX, so mail to `hello@` sat as `delivery_delayed` and then bounced. Resend puts a bounced address on its suppression list and refuses every later send to it (status `suppressed`). After fixing MX, remove the address from Resend's suppression list (dashboard, or the Resend connector), then send a test.
- **A bad email setting does not lose leads.** The lead is stored first; the web log shows `Lead notification failed` with Resend's reason.

## First-deploy smoke test

Passed on 2026-10-14.

1. `migrate` exited 0 and `web`, `db` and `cloudflared` are running.
2. `https://wingate.associates` loads, and `/services`, `/contact`, `/robots.txt` and `/sitemap.xml` too.
3. `sudo docker ps --filter name=wingate-associates` shows no published host ports (`3000/tcp` and `5432/tcp` are container-only).
4. Submit the contact form. A row appears in `leads` and the notification email arrives at `CONTACT_TO_EMAIL`:
   `sudo docker exec wingate-associates-db-1 psql -U wingate -d wingate -c 'select id, name, created_at from leads;'`

## What does not belong here

- Secrets or `.env` files
- Anything the Dockerfile or compose file already says. Link to it instead.
