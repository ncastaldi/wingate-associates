# design

`system/` is the Wingate Associates design system, made in Claude Design on 2026-10-14 and kept here exactly as delivered. Start with `system/readme.md`: it covers the tokens, the components, the illustration style and the usage rules.

## How the site uses it

- `src/app/globals.css` is `system/dist/globals.css` with a header comment. Change the look in `system/` first (`tokens/`, `site/`), then copy `dist/globals.css` across, or edit `globals.css` and mirror the change back.
- The fonts (Instrument Sans and IBM Plex Mono, SIL Open Font License 1.1) are in `public/fonts/` with their licence texts. They are the latin subsets from Fontsource, byte for byte.
- The header marks `public/logo-mark.png` (light) and `public/logo-mark-badge.png` (dark) are 96px versions of `system/assets/wingate-mark.png` and `wingate-mark-badge.png`.
- Pages follow the markup in `system/ui_kits/website/`. The hero diagram is `src/components/systems-diff.tsx`.

## Where the site differs from `system/readme.md`

- **Plausible stays.** The design readme says the brief rules out analytics. The brief's wording was too broad: Plausible is the site's one approved analytics tool (ADR-005, CLAUDE.md constraint 5).
- `preview/`, `components/*.card.html` and `ui_kits/website/preview.js` are preview tools. The card files load React from a CDN, so never ship them.
