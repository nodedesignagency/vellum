# Vellum website

Vellum is an architectural lighting-design practice. Visitors are architects, developers and interior designers deciding whether to bring Vellum onto a project. The site has two pages, **Home** and **Project**, and presents the work as a considered visual sequence.

Brand line: **The room has another life.**

## What is in this folder

| Path | What it is |
| --- | --- |
| `prototype/index.html` | The approved Home page as one self-contained HTML file. This is the design reference: match its layout, copy, spacing and behaviour. |
| `prototype/img/` | Every image the Home page uses (see Assets below). |
| `design-system/tokens.json` | Colour, type, spacing, radius and size tokens. Day theme = the website. Night theme = brand print and after-dark use. |
| `design-system/BRAND.md` | Brand book: voice, colour rules, type roles, photography, icons, logo rules. Read it before writing any copy or styles. |
| `design-system/fonts/` | Geist (100 to 900), Geist Mono (400, 500), Cormorant Garamond (300 to 500, roman and italic). All OFL. Self-host these. |
| `design-system/logos/` | Wordmark in ink and cream, and the moon mark on its own. |
| `design-system/icons/` | 16 lighting icons (24px grid, 1.5 stroke, navy ink, gold light). |
| `design-system/imagery/` | Board images of the colours, type and imagery, for reference only. |
| `reference/` | Empty until the user uploads the base website zip. See "The base website". |

## Home page (already designed, build it as it is)

Sections in order, as in `prototype/index.html`:

1. **Hero**: full-bleed facade image, cream logo top left, H1 bottom left: white "At Vellum, every room gets a second life after dark." then grey "Drawn on paper, finished on site."
2. **Docking bar**: a 56px white bar that sits under the hero and sticks to the top on scroll. Menu (left), small logo (centre), caption and Enquire (right).
3. **Statement**: oversized indented paragraphs, lead phrase in ink and the rest in grey, with images drifting over the text at different scroll speeds (parallax).
4. **Collaborators ticker**: a scrolling logo row with a pause button. Logos are dummies for now.
5. **How we work**: one dark band with four tabs (Concept, Detail, Specification, Commissioning) switching a large panel below: two drawings, a luminaire schedule table, a photo.
6. **Studio principle**: photo on the left, quote on the right.
7. **Selected work**: grey band, sector filter on the left, project cards on the right, link to the Project page.
8. **Night band**: full-bleed image with one line of copy.
9. **Sectors and services**: two ruled lists.
10. **Contact footer**: black footer revealed underneath the page as you scroll to the end (the page lifts off it), enquiry form, contact details, large logo.

Plus a full-screen menu panel.

## Project page (built: `/project/`)

Brief: the Project page reads as **one continuous, curated journal**, not separate project blocks. Each project opens with **concept drawings** and then shows the **finished lighting installations**, with short copy explaining the work. Use the Home page's system (type scale, rules, mono captions, the dark and grey bands). Captions follow the label style: fitting reference, colour temperature, dim level.

## Content model (must be editable without code)

The studio needs to **add, reorder and hide projects and images** themselves. Today the prototype keeps projects and collaborator logos as JSON inside the HTML. Move them into a content source that both pages read:

- Project: `slug`, `title`, `sector`, `location`, `year`, `order`, `hidden`, `summary` (short copy), `cover`, and an ordered list of `entries`, each with `image`, `alt`, `kind` (`drawing` or `installation`), `caption`, `hidden`.
- Collaborator: `name`, `logo`, `order`, `hidden`.

Pick a setup a non-developer can edit (for example Astro content collections with a git-based CMS such as Keystatic or Decap, or Framer CMS if we build in Framer). Confirm the choice with the user before scaffolding.

## Requirements

- **Fast:** responsive images (AVIF/WebP with `srcset`), lazy-load everything below the hero, preload the hero and fonts, no heavy libraries for simple motion.
- **Accessible:** WCAG 2.2 AA. Keep the prototype's alt text, focus states, tab keyboard support, the ticker pause button and `prefers-reduced-motion` handling.
- **Phones:** everything must work at 375px. The prototype's mobile rules are the starting point.

## Assets

- Photos and drawings in `prototype/img/` were generated in Magnific and colour-graded to the logo's gold (#e8c391). They are 1024px wide, so the hero is soft on large screens. The full-resolution originals are in the user's Magnific project; ask the user for them before launch.
- Collaborator logos in `prototype/img/clients/` are invented dummies. Replace with real clients before launch.
- The logo was traced from a brand board image. Ask the user for the master vector before launch.
- Email, address and Instagram are placeholders.

## The base website

The user has a zip of a base website they want to reuse animations and interaction patterns from. When they upload it:

1. Unzip it into `reference/` (never edit it there).
2. List its animations and interactions (scroll effects, page transitions, loaders, hover states, menu behaviour, marquee, footer reveal and so on), with the file each one lives in.
3. Show the user that list and ask which to bring across, then reimplement the chosen ones in the Vellum codebase using Vellum's tokens. Do not copy its images, fonts, logos or copy.

## Copy rules

- Keep all copy from the prototype unless the user changes it.
- No em dashes anywhere in copy.
- Plain, specific, calm. Real units (2700K, 24°, UGR<16). See `design-system/BRAND.md`.

## Codebase (built)

Astro 7 + Keystatic + Vercel. **`AGENTS.md` is the complete handoff** (structure, content model, every animation, owner decisions, gotchas, checks). `START-HERE.md` is the plain-language run guide, `README.md` covers deploy, `EDITING.md` is the studio's guide.

- Projects and collaborators live in `src/content/` and are edited in Keystatic (`/keystatic`). Keystatic stores images as `src/assets/projects/<slug>/cover.jpg`, `.../entries/<n>/image.jpg` and `src/assets/collaborators/logos/<n>/logo.svg`; keep new seed content in that layout. Keystatic drops YAML comments on save.
- `src/styles/tokens.css` is generated from `design-system/tokens.json` (`npm run tokens`). Never edit it.
- Animations from the base sites are in `src/scripts/motion.ts`, driven by `data-reveal`, `data-sweep` and `data-label` attributes. 5 (pinned project heading) is CSS sticky in the journal; 6 (image viewer) is `src/components/Viewer.astro`.
- Project journal (`src/pages/project/index.astro`, approved by the user as one continuous page, white throughout with one closing dark band): statement-style intro, grey index band linking to each project, then per project (`src/components/JournalEntry.astro`) a heading pinned in the left column and its images grouped as "Drawn on paper" then "Finished on site" (grouped by kind whatever order the CMS has; landscape images full width, upright ones half). A project with no journal images shows its cover. Each image links to its full-size file (works without JS) and opens the viewer, which steps through that project's images. The bar label shows the current project. Intro line is new copy proposed by Claude; the closing band reuses the Home statement's last line.
- The Statement's photos move like 333 South Wabash's second section (`reference/333southwabash-com/source/js/site.js:9`): translateY of -(scroll x speed x 0.13)% of their own height (0.16 on phones), speeds 2.2/4/2/3.5/1.8, locked to the native scroll (no separate smoothing: lagging photos read as floaty against the text), start points measured from 333 against the text block. Code in `src/components/Statement.astro`; with reduced motion or no JS the photos rest at the prototype's positions.
- Reduced motion is respected everywhere; `?motion=on` in the address (remembered per tab, `?motion=off` clears) plays the animations anyway for reviewing on a machine with the setting on. It sets `html.force-motion` from an inline head script; each script checks it inline. Keep page scripts free of shared imports: an import splits them into separate files (extra requests, and the offline copy cannot load them from disk).
- `npm run offline` (after a build) writes `offline/vellum-site/`, a copy that opens by double-clicking `index.html`.
- Deliberate departures from the prototype: token `ink-muted` (#6f6f6f) replaces the prototype's #7a7a7a and #767676 to pass AA; footer legal text #808080; a soft shade behind the hero headline (`.hero-h1::before`, review feedback: the grey line was unreadable on the lit facade, now at least 4.6:1); filter buttons at least 24px tall on desktop (WCAG 2.2 target size); the ticker button changes its label instead of also toggling aria-pressed; on phones the How we work tabs stack in one column (user request; the prototype had two by two), with Up/Down keys and aria-orientation set to match. How we work also advances on its own (user request, Airloom's progress tabs): 7s per stage (`STAGE_MS` in `Method.astro`) with the active gold line filling (`--p`), looping; a pause/play button (the ticker's, on the dark band) for WCAG 2.2.2; picking a stage jumps there and restarts its line, the rotation carrying on (user request); it holds while keyboard focus (:focus-visible) is inside, off screen and on a hidden tab, not on hover; starts stopped with reduced motion. The Principle photo is 900px tall as the prototype rendered it (its height attribute overrode `aspect-ratio:4/5`).
- Compare against the prototype with a doctype added: without one the file renders in quirks mode (forms gain a 16px bottom margin).
