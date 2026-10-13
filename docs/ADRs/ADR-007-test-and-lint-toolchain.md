# ADR-007: Vitest, ESLint, Prettier and Playwright as the test and lint toolchain

**Status:** Accepted
**Date:** 2026-10-12

## Context

A TypeScript and Next.js project needs a fast unit test runner, a linter, a formatter and an end-to-end tool for the contact form.

## Decision

Use Vitest with Testing Library (`npm test`), ESLint with Next's flat config plus Prettier (`npm run lint`), `tsc --noEmit` (`npm run typecheck`), and Playwright for end-to-end tests under `tests/e2e/`. Prettier is scoped to application code and ignores docs, workflows and scripts.

## Alternatives considered

- **Jest:** slower and needs more transform configuration for ESM and TypeScript.
- **Biome:** one tool for lint and format, but less coverage of Next-specific lint rules.

## Consequences

- CI runs lint, typecheck, test and build on every PR.
- Playwright is installed but has no tests yet; the first one belongs with the contact form.
