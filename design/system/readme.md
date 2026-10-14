# Wingate Associates design system

Wingate Associates is Nathan Castaldi's one-person IT operations consultancy in Atlanta. He fixes the process and data problems underneath IT: slow ticket queues, messy accounts and access, knowledge stuck in one person's head. Clients are companies of 20 to 500 people with an MSP or a small IT team and nobody who owns making IT run well.

There is one product: the marketing site at `https://wingate.associates` (Home, Services, Contact). Its one job is that a prospect understands within about 10 seconds that he fixes their kind of problem, believes he can, and fills in the contact form.

The visual direction is an "operations console": a faint background grid, thin rules, big tight headlines, calm body text, and status dots used sparingly.

## Sources

- GitHub: https://github.com/ncastaldi/wingate-associates (branch `main`). Next.js app. Read for this system: `src/app/globals.css`, `src/app/page.tsx`, `src/components/site-header.tsx`, `site-footer.tsx`, `contact-form.tsx`, `brand/README.md`, `docs/voice/README.md`, `docs/foundation.md`. Explore it further for routes, the lead pipeline and tests.
- Logo: `brand/wingate-logo.png` from the repo (also uploaded as `uploads/Gemini_Generated_Image_.png`). 1376×768 PNG, no vector original.
- Brief: the owner's written brief, including the final copy for all three pages.
- The "operations console" screenshot described in the brief was not in the uploads. Only the logo was. The look here is built from the written description.

## Index

- `styles.css`: entry point. Only `@import` lines.
- `tokens/`: `fonts.css`, `colors.css` (light, plus a `prefers-color-scheme: dark` block), `typography.css`, `spacing.css`, `effects.css` (borders, radii, elevation, grid pattern, motion), `tokens.json` (same values as JSON).
- `site/site.css`: every component, written against semantic HTML. `site/illustration.css`: the diagram style.
- `dist/globals.css`: all of the above in one file, font paths set to `/fonts/`. Drop it in as `app/globals.css`.
- `fonts/`: self-hosted woff2 files.
- `assets/`: logo files (see Iconography).
- `guidelines/`: foundation specimen cards.
- `components/`: React wrappers that output the same markup, with `.d.ts` and `.prompt.md`.
- `ui_kits/website/`: Home (`index.html`), `services.html`, `contact.html` in plain HTML, plus `pages.html` showing all three at 1280 and 375 in light and dark.
- `preview/`: preview-only CSS (`theme.css` forces a scheme with `data-theme`, `states.css` freezes hover/focus for cards). Not for production.
- `SKILL.md`: Agent Skill entry point.

## Components

Each is a thin React wrapper over semantic markup that `site/site.css` styles. In Next.js you can write the markup directly.

- SiteHeader: `<header>` with mark, name, `<nav aria-label="Main">`. Mobile: nav on its own row.
- SiteFooter: `<footer>` with © line and LinkedIn.
- Button: `<a data-button="primary|secondary">` or `<button type="submit">`, with the arrow.
- Section: `<section aria-labelledby>` + `<h2>` with the square marker.
- ProblemList: `<ul data-list="queue">`.
- CardList: `<ul data-list="cards">`; a card with `<h3><a>` is fully clickable.
- EngagementTiles: `<ul data-list="tiles">`.
- StatCallout: `<figure data-stat>` with two `<data>` values and a `<figcaption>`.
- StatusDot: any element with `data-status="ok|warn|critical|idle"`.
- Notice: `<p role="note">`, optional `data-status`.
- Field: `<div><label><input|textarea><p id="…-error"></div>` with `aria-invalid` and `aria-describedby`.
- ContactForm: the form with all states: field errors, sending, `role="alert"` form errors, `role="status"` success.
- SystemsDiff, QueueDrain, DriftScan: the three illustrations, `<figure data-illustration role="img">`.

The CSS hooks are the elements and roles plus five data attributes: `data-hero`, `data-button`, `data-list`, `data-stat`, `data-status` (and `data-illustration` / `data-flag` inside diagrams). There are no classes.

Intentional additions: SystemsDiff, QueueDrain and DriftScan exist because the brief asked for a defined illustration style; StatusDot is split out because the dot is the system's one motif.

## Decisions

**Palette.** Two palettes are compared in `guidelines/palettes.html`. A uses the logo's navy `#0e2745` and teal `#296e7b`. B keeps the screenshot's green. **A is recommended and is what the tokens ship.** It matches the mark, and teal stays clearly separate from the green "ok" dot, so a status colour always means status. With B, the accent and "ok" are the same hue. B's values are kept in `tokens.json` under `alternatePalette_green` for reference. B's exact green is an estimate, because the screenshot wasn't available.

**Hero illustration.** The stock rising line is gone. The Home hero shows HR, AD and Entra ID side by side with one person flagged: left in HR, still active in both directories. That is what Nexus does. Two more diagrams use the same style: a ticket queue before and after, and a drift scan with one finding.

**Dark mode.** It is designed, not inverted. The background is a deep navy (`#0b1420`) taken from the logo's navy, not neutral black. The primary button flips from navy to teal because navy disappears on navy. Status colours are re-tuned for a dark ground. Shadows are replaced with a 1px lifted border. The grid lines turn faintly teal. The logo mark sits on its own paper disc (`wingate-mark-badge.png`) because its navy strokes vanish on a dark background.

## Content fundamentals

The voice comes from `docs/voice/README.md` in the repo and the brief.

- First person singular. "I", never "we". The name may imply more people; the copy never claims a team.
- Short declarative sentences, about 15 words on average. Point first, qualification after. Paragraphs of three sentences at most.
- Plain words. Name tools specifically: Active Directory, Entra ID, Workday, MSP. Not "identity platforms".
- Confidence through specifics: "24 roles down to 7", "MTTR from 5.05 days to 4.65". No claims of greatness.
- A little dry about organisational dysfunction: "nobody-noticed-until-it-was-a-crisis problems". Never cynical.
- Sentence case for headings and buttons. "Tell me what's broken", not "Tell Me What's Broken".
- Curly quotes and apostrophes (’ “ ”). The ellipsis character in "Sending…".
- Never: em dashes, rhetorical questions, emoji, exclamation marks. Never these words: synergy, leverage, alignment, delve, passionate, cutting-edge, solutions, empower, unlock (plus the repo's longer list: circle back, move the needle, deep dive, bandwidth, touch base, testament).
- No email address or phone number anywhere. The form is the only way in.
- The page copy is final. Shorten for layout if needed; never reword.

Labels added in this system that are not in the copy: "HR", "AD", "Entra ID", "Left", "Active", "1 mismatch" (home diagram); "Before", "After", "Scan", "Drift", "1 finding" (other diagrams). Each diagram also has an `aria-label` sentence describing it for screen readers. In the Services page, the two result sentences moved from the service paragraphs into the stat captions, unchanged. The Home CTAs are ordered primary first ("Tell me what's broken"), then "See services".

## Visual foundations

- **Colour.** Navy ink on warm paper (`#f6f6f2`, the logo's background). White cards. Teal for the accent, links (`#1f6470` light, `#7fcbd3` dark) and the focus ring. Status colours (ok, warning, critical) are the only other hues and appear in small doses. Each status has three tones: text (AA on the page), dot (3:1 graphic) and a tinted panel. Every text pairing passes WCAG AA in both schemes; see `guidelines/colors-contrast.html`.
- **Type.** Instrument Sans for everything readable, IBM Plex Mono for labels, counters and diagram text. Headlines are semibold with tight negative tracking (display −0.035em). Body is 17px at 1.6 with a 38rem measure. Mono labels are 12–13px caps with +0.06em tracking.
- **Background.** A 32px hairline grid on the page (`--grid-pattern`). No images, gradients, textures or photos. Cards and diagrams sit on white (or the dark surface) above the grid.
- **Lines.** 1px rules everywhere: header, footer, section headings, queue rows, cards. One 1.5px navy rule tops each engagement tile. Section headings run a hairline from the title to the edge.
- **Corners.** Near square. 4px on cards, buttons, inputs and notices; 2px on small chips. The only round things are status dots.
- **Elevation.** Flat. One raised shadow, only for a linked card on hover. In dark mode that becomes a 1px lighter border.
- **Cards.** White, 1px border, 4px radius, 24px padding, no shadow at rest, no coloured edges.
- **Hover.** Links go from teal to navy and the underline thickens from 1px to 2px. Primary buttons lighten one step. Secondary buttons fill with the surface and darken their border. Button arrows move 3px right. Linked cards raise.
- **Press.** One step darker background. No shrinking or bouncing.
- **Focus.** A 2px teal outline with a 3px offset on everything keyboard-reachable. On a linked card, the ring goes around the whole card.
- **Motion.** 120ms for colour, 200ms for card hover, 480ms for diagram rows fading in once with a 60ms stagger. One easing curve. Nothing loops. Under `prefers-reduced-motion` all durations are 0 and the diagram animation is not declared at all.
- **Transparency and blur.** None, apart from the alpha in the grid lines and focus/selection tints.
- **Layout.** Mobile first, from 375px. Full-bleed bands with a 72rem centred column and a fluid 20–40px gutter. The queue goes to two columns at 768px, tiles to three, and the Home hero splits 7/5 at 1024px. Nothing is fixed or sticky.
- **Imagery.** None. No stock photos, no photo of Nathan. Diagrams take the place of pictures.

## Iconography

- No icon set or icon font. The UI uses two glyphs: an arrow (buttons, stat callouts) and an up-right arrow (off-site links). Both are Lucide paths (ISC licence), embedded as CSS mask data URIs in `site/site.css` (`--icon-arrow`, `--icon-external`), so they take `currentColor` and need no requests. Lucide is the substitute here; the repo has no icons of its own.
- Status dots are the one motif: an 8px circle followed by a word. Use them for a real state only (a finding, an error, a success). One critical per view. Never as bullets or decoration, never colour alone.
- No emoji. No unicode symbols as icons, apart from the · separator in the footer.
- Logo files in `assets/`:
  - `wingate-logo.png`: full lockup on paper, from the repo.
  - `wingate-mark.png`: the circular WA mark cut from the logo with a transparent background. Use on light.
  - `wingate-mark-badge.png`: the mark on its paper disc. Use on dark.
  - `wingate-wordmark.png` / `wingate-wordmark-reversed.png`: the wordmark alone, navy and off-white.
  - `logo-mark.png` (96px) and `icon.png` (256px): the repo's existing header and favicon images.
  - In the header, the mark is 32px and the name is set in Instrument Sans, not the logo's wordmark.

## Illustration style

- Built from interface parts: 1px rules, 6px skeleton bars standing in for records, mono caps labels, and status dots.
- Records are bars, never fake names or numbers. Labels use real system names only.
- Each diagram has exactly one finding: one tinted row with a dot and a word. Everything else is ok or neutral.
- Diagrams sit on a surface panel with a 1px border. No gradients, shadows, perspective or charts.
- Mark each one `role="img"` with an `aria-label` that says what it shows.

## Usage notes

Do:
- Use one `h1` per page and an `h2` for each section, inside `<section aria-labelledby>`.
- Use one primary button per view. The primary action is almost always the contact form.
- Keep links underlined. Off-site links get the external arrow automatically.
- Label every field with a visible `<label>`. Show errors under the field and link them with `aria-describedby`.
- Check new pages at 375px, in both schemes, with the keyboard only.
- Take real numbers from real work for stat callouts.

Don't:
- Add colours outside the tokens, or use status colours for decoration.
- Add photos, stock imagery, charts that imply data you don't have, or gradients.
- Round corners past 4px or add shadows to things at rest.
- Add classes or utility frameworks. Use elements, roles and the five data attributes.
- Add analytics, trackers or third-party scripts. (The repo currently loads Plausible via `src/components/plausible-script.tsx`; the brief rules that out.)
- Add an email address or phone number.

## Using it in Next.js

1. Copy `dist/globals.css` to `src/app/globals.css`.
2. Copy `fonts/*.woff2` to `public/fonts/`.
3. Copy `assets/wingate-mark.png` and `assets/wingate-mark-badge.png` to `public/` and use a `<picture>` with a `prefers-color-scheme: dark` source in the header (see `ui_kits/website/index.html`).
4. Write pages as semantic HTML following `ui_kits/website/*.html`. Leave out `preview/` and `preview.js`.
