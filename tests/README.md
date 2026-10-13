# tests

Automated tests.

## What belongs here

- Unit and component tests (`*.test.ts` / `*.test.tsx`), run by Vitest with `npm test`
- `e2e/`: Playwright end-to-end tests (`npm run test:e2e`), for flows such as submitting the contact form. Added once the contact flow exists.

## What does not belong here

- Test fixtures that contain real lead data or real credentials
- Application code

## Conventions

- Mirror `src/` in the file name: `tests/home-page.test.tsx` covers `src/app/page.tsx`.
- Mock Resend and the database at the boundary; do not call real services from unit tests.
- Follow the `testing-standards` skill when writing or reviewing a test.
