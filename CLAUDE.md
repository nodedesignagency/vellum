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

1. **Hero**: full-bleed facade image, cream logo top left, H1 bottom left: white "We design how buildings and interiors look after dark" then a "Contact us" button to the contact footer (user request: replaces the prototype's grey "Drawn on paper, finished on site.").
2. **Docking bar**: a 56px white bar that sits under the hero and sticks to the top on scroll. Menu (left), small logo (centre), Enquire (right).
3. **Statement**: three oversized indented paragraphs, lead phrase in ink and the rest in grey, shown one at a time in one held spot (changing in place as you scroll) while five photos pass around them at different speeds (review feedback and owner requests replaced the prototype's images drifting over the text).
4. **Collaborators ticker**: a scrolling logo row with a pause button. Logos are dummies for now.
5. **How we work**: one dark band with four tabs (Concept, Detail, Specification, Commissioning) switching a large panel below: two drawings, a luminaire schedule table, a photo.
6. **Studio principle**: photo on the left at its own 4:5 (at most 560x700); on the right after one fixed gap, centred on the photo's height, a "Vellum principle" chip (the section's heading, brand tag style) over the quote (owner requests: the 900px photo was too tall and the quote read as apart from it; the chip asked for by name).
7. **Selected work**: grey band, sector filter on the left, project cards on the right, link to the Project page.
8. **After dark**: the courtyard-at-night photo full width as the background, its top fading into a band of its own night sky; on top of it, at the top left on one edge, the heading large in white over two lines and the paragraph small in grey under it, each phrase on its own line, the two blocks about the same width (owner requests; a framed photo beside the text, and a same-size heading and paragraph with an indented first line, were tried and not liked).
9. **Sectors and services**: two lists, one rule above each.
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

- Photos and drawings were generated in Magnific (the user's Personal project) and the photos colour-graded to the logo's gold (#e8c391). The site uses the full-size originals, graded with `scripts/grade-image.mjs` (`--match` for renders that skipped the amber edit, `--no-grade` for drawings); the hero is a 2x Magnific upscale (4096px) and the night band, How we work's commissioning photo and the North Gallery and Atelier offices photos are 4k renders, so every image is sharp on large and high-density screens. `prototype/img/` keeps the old 1024px copies as the design reference. New Magnific renders or upscales cost credits: ask first.
- Collaborator logos in `prototype/img/clients/` are invented dummies. Replace with real clients before launch.
- The logo was traced from a brand board image. Ask the user for the master vector before launch.
- Email, address and Instagram are placeholders.

## The base website

The user has a zip of a base website they want to reuse animations and interaction patterns from. When they upload it:

1. Unzip it into `reference/` (never edit it there).
2. List its animations and interactions (scroll effects, page transitions, loaders, hover states, menu behaviour, marquee, footer reveal and so on), with the file each one lives in.
3. Show the user that list and ask which to bring across, then reimplement the chosen ones in the Vellum codebase using Vellum's tokens. Do not copy its images, fonts, logos or copy.

## Copy rules

- The copy was rewritten in a plain pass at the owner's request (see AGENTS.md decision 16): natural, direct sentences instead of tagline-like lines. Keep that register.
- Headings carry no punctuation (no full stops, commas or question marks). Body copy keeps normal punctuation.
- No interpuncts (·) between words or data: captions use commas ("G01 linear graze, 2700K, 40%"). No numbered labels (01, 02) where the layout already shows the order.
- No em dashes anywhere in copy.
- Plain, specific, calm. Real units (2700K, 24°, UGR<16). See `design-system/BRAND.md`.

## Codebase (built)

Astro 7 + Keystatic + Vercel. **`AGENTS.md` is the complete handoff** (structure, content model, every animation, owner decisions, gotchas, checks). `START-HERE.md` is the plain-language run guide, `README.md` covers deploy, `EDITING.md` is the studio's guide.

- Projects and collaborators live in `src/content/` and are edited in Keystatic (`/keystatic`). Keystatic stores images as `src/assets/projects/<slug>/cover.jpg`, `.../entries/<n>/image.jpg` and `src/assets/collaborators/logos/<n>/logo.svg`; keep new seed content in that layout. Keystatic drops YAML comments on save.
- `src/styles/tokens.css` is generated from `design-system/tokens.json` (`npm run tokens`). Never edit it.
- `src/image-service.ts` (set in `astro.config.mjs`) is Astro's sharp image service, re-encoding flat, dark photos below 0.2 bits per pixel at AVIF 75 / WebP 90: at the default quality the encoder smoothed their texture away and they looked blurred (review feedback).
- Animations from the base sites are in `src/scripts/motion.ts`, driven by `data-reveal`, `data-sweep` and `data-label` attributes. 5 (pinned project heading) is CSS sticky in the journal; 6 (image viewer) is `src/components/Viewer.astro`.
- Project journal (`src/pages/project/index.astro`, approved by the user as one continuous page, white throughout with one closing dark band): statement-style intro, grey index band linking to each project, then per project (`src/components/JournalEntry.astro`) a heading pinned in the left column and its images grouped as "Drawings" then "Finished lighting", each under a plain heading (`h3.j-label`) and nothing else: no markers, rules or side lines (owner request) (grouped by kind whatever order the CMS has; landscape images full width, upright ones half). A project with no journal images shows its cover. Each image links to its full-size file (works without JS) and opens the viewer, which steps through that project's images; in the viewer every image, portrait or landscape, fits within the screen at its own aspect ratio (owner request). The bar label shows the current project. Intro line is new copy proposed by Claude; the closing band reuses the Home statement's last line.
- The Statement's three paragraphs share one held spot and crossfade in turn as you scroll, while the photos move around them (review feedback and owner requests; it replaced 333 South Wabash's second-section drift, which sent the paragraphs through a long scroll). `.story-stage` is the paragraphs plus fixed gaps; with motion it sticks centred on screen while the reader scrolls through `.story-hold` (70svh per paragraph), and `Statement.astro` sets `--p` 0 to 1 across it and `.is-on` on one paragraph per third. Desktop: text in columns 2 to 6, photos rise up columns 1 and 7 at two speeds, each photo's start and travel set by `place()` in `Statement.astro` so none is cut by the section's edges as the hold starts or ends. Phones: a photo row 32px above and below the text, sliding sideways. Photos never cross the text (checked 320x568 to 2560x1300). Reduced motion or no JS: nothing held, paragraphs stacked, photos at rest.
- Reduced motion is respected everywhere; `?motion=on` in the address (remembered per tab, `?motion=off` clears) plays the animations anyway for reviewing on a machine with the setting on. It sets `html.force-motion` from an inline head script; each script checks it inline. Keep page scripts free of shared imports: an import splits them into separate files (extra requests, and the offline copy cannot load them from disk).
- `npm run offline` (after a build) writes `offline/vellum-site/`, a copy that opens by double-clicking `index.html`.
- Deliberate departures from the prototype: labels and captions are Geist (`--label`: 13px grey, sentence case, normal spacing), not Geist Mono uppercase with wide tracking, which is kept for the logo's line only (review feedback, departing from `BRAND.md`); no gold squares beside captions; token `ink-muted` (#6f6f6f) replaces the prototype's #7a7a7a and #767676 to pass AA; footer legal text #808080; the hero's grey second line replaced by a Contact us button (user request); a soft shade behind the hero headline and button (`.hero-copy::before`, review feedback: text was unreadable on the lit facade); the hero caption (top right in the prototype) is gone, and on phones the logo sits 18px from the top, the same as the side margin (review feedback: the hero did not feel aligned); menu items are labels only, without the small descriptions (review feedback); on Home the bar's centre logo stays hidden until the bar docks, so it never shows alongside the hero logo (review feedback; `.bar[data-dock]` set by `motion.ts`, hidden only under `html.js`); the contact footer has wider margins of its own (`--fx`) and its Project type and Stage dropdowns are custom comboboxes over hidden native selects (review feedback; script in `ContactFooter.astro`, native selects still post and show without JS); filter buttons at least 24px tall on desktop (WCAG 2.2 target size); the ticker button changes its label instead of also toggling aria-pressed; on phones the How we work tabs stack in one column (user request; the prototype had two by two), with Up/Down keys and aria-orientation set to match. How we work also advances on its own (user request, Airloom's progress tabs): 7s per stage (`STAGE_MS` in `Method.astro`) with the active gold line filling (`--p`), looping; a pause/play button (the ticker's, on the dark band) for WCAG 2.2.2; picking a stage jumps there and restarts its line, the rotation carrying on (user request); it holds while keyboard focus (:focus-visible) is inside, off screen and on a hidden tab, not on hover; starts stopped with reduced motion. The Principle photo is no longer the prototype's 900px: it shows at its own 4:5, 34vw wide (300 to 560px), with the quote beside it after one fixed gap and centred on its height (owner request, AGENTS.md decision 22); phones show it full width at 4:5.
- Decorative patterns were cleaned out (review feedback, AGENTS.md decision 19): no interpuncts, no step or project numbers, no non-essential captions or labels (hero corner caption, bar caption, menu label, principle attribution, How we work panel captions; the principle's "Vellum principle" chip heading is an owner request, not one of these), and rules only where they do a job: the docked bar's edge, How we work's progress track, one rule above each group (Selected work, each Sectors and services list, the journal index, each journal project; the lamp sweep runs along these) and form fields. Do not add dividers between rows, logos or cards, or frames around panels.
- Compare against the prototype with a doctype added: without one the file renders in quirks mode (forms gain a 16px bottom margin).
