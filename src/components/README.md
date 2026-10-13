# src/components

Reusable UI components shared across routes.

## What belongs here

- Presentational components (hero, service card, case-study card, contact form shell)
- Layout pieces used by more than one route (header, footer, section wrapper)

## What does not belong here

- Route-specific one-offs used on a single page (keep them next to that page in `src/app/`)
- Data fetching, database access or email logic

## Conventions

- One component per file, PascalCase name, kebab-case file name (`service-card.tsx` exports `ServiceCard`).
- Named exports only.
- Each component gets a test in `tests/` when it has behaviour beyond markup.
