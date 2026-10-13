# Contributing

This document covers the workflow for changing the Wingate Associates site.

## Workflow

No issue required for a small fix. If you spot something wrong or missing, go straight to a branch. Planned work lives in GitHub Issues — see [`docs/SOPs/SOP-issue-tracking.md`](docs/SOPs/SOP-issue-tracking.md) for the labels and how to file one, or just tell Claude what to note.

### 1. Branch

Run `/branch-workflow` or follow the naming convention directly:

```
feature/short-description
fix/short-description
docs/short-description
refactor/short-description
test/short-description
experiment/short-description
```

Branch names are snake_case. Keep them short and descriptive.

### 2. Make your changes

Work atomically — one logical change per commit. Run `/commit-msg` or follow Conventional Commits format directly:

```
feat(contact): add lead-capture server action
fix(ci): correct node version file path
docs(readme): update quick start steps
refactor(db): simplify lead insert helper
```

Conventional Commits format is **expected**, not optional.

### 3. Open a PR

CI must be green. [`.github/workflows/ci.yml`](.github/workflows/ci.yml) lints, typechecks, tests and builds the app, and checks that the Docker image builds. Run the same checks locally before pushing:

```bash
npm ci
npm run lint        # ESLint + Prettier check
npm run typecheck   # tsc --noEmit
npm test            # Vitest
npm run build       # Next.js production build
```

The project also keeps the Claude Code skills under `.claude/skills/`, and [`.github/workflows/skills-ci.yml`](.github/workflows/skills-ci.yml) lints and tests the scripts they depend on. If your change touches `.claude/` or `scripts/`, run those checks too:

```bash
python3 -m pip install -r requirements-dev.txt   # pinned — same versions CI uses
bash scripts/validate_skills.sh                  # skill layout, frontmatter and size limits
bash scripts/test_validate_skills.sh
bash scripts/check_doc_claims.sh                 # docs vs. what the repo contains
bash scripts/test_check_doc_claims.sh
bash scripts/test_check_scaffolded_project.sh
bash scripts/test_sync_labels.sh
bash scripts/test_check_issues.sh
bash .claude/hooks/test_session-start-hook.sh
bash .claude/skills/init-project/scripts/test_check_inherited_docs.sh
bash .claude/skills/sync-from-template/scripts/test_compare_template.sh
ruff check .claude/skills
python3 -m pytest .claude/skills -q
```

Install from `requirements-dev.txt` rather than a bare `pip install ruff`. The pins there are what CI enforces, and a newer ruff enables rules CI does not — that difference is a green local run and a red PR.

Fill in the PR template.

### 4. Merge

Squash or merge commit, your call.

---

## Keeping the docs in sync

When you change the folder structure, add a command or skill, or update a tooling default — run `/sync-template` to check for drift between the structure and its documentation. Your future self will thank you.

## What's in scope

- The site: pages, components, the lead-capture pipeline, the database schema and migrations
- Tests, CI, Dockerfile and compose changes, and dependency updates
- New or improved commands in `.claude/commands/` and skills in `.claude/skills/` — see [`.claude/README.md`](.claude/README.md) for which of the two a workflow belongs in

## What's out of scope

- Hosted third-party services other than Resend, and additional analytics or trackers. This project self-hosts by default; see [`CLAUDE.md`](CLAUDE.md) for the constraints.
- Secrets, `.env` files or real lead data in the repo
