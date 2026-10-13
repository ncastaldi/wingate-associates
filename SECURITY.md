# Security Policy

## Supported versions

This is the source for the Wingate Associates website. It is deployed: a Docker image built from `main` runs on a self-hosted server and is reachable only through a Cloudflare Tunnel. Only the latest commit on `main` is supported; there are no versioned releases to patch.

## Reporting a vulnerability

If you find a security issue in the site or its configuration — for example, a flaw in the contact form, an exposed secret, or a misconfiguration in `.github/`, the `Dockerfile` or `compose.yaml` — please report it privately rather than opening a public issue.

**How to report:**
Use GitHub's private vulnerability reporting feature:
`Security` tab → `Report a vulnerability`

**Response time:**
This is a solo-maintained project. Expect an initial response within 7 days. Critical issues will be prioritized.

## Data handling

The contact form stores leads (name, email, message) in the project's own PostgreSQL database. A notification email is sent through Resend; no lead data goes to any other third party. Secrets are supplied as environment variables (Komodo variables in production) and are never committed.

## Dependency vulnerabilities

Dependabot is enabled on this repo and runs weekly. It watches the ecosystems listed in [`.github/dependabot.yml`](.github/dependabot.yml) — currently `github-actions`, `pip`, `npm` and `docker`. `npm` covers the application dependencies in `package.json`, `docker` covers the base images in the `Dockerfile`, and `pip` covers the pinned lint and test tooling for the scripts under `.claude/skills/` in `requirements-dev.txt`.

`scripts/check_doc_claims.sh` verifies that the ecosystems named in this section match what `.github/dependabot.yml` actually configures, so this paragraph cannot quietly drift out of date. If you spot a vulnerable dependency that Dependabot hasn't caught, please report it using the process above.
