# Vellum website: complete handoff for AI assistants and developers

Read this first. It explains what the site is, how it is built, where everything lives, which decisions the owner has made (and which are still defaults), and how to check your changes. `CLAUDE.md` holds the original brief; `START-HERE.md` is the plain-language run guide; `EDITING.md` is for the studio; `README.md` covers deployment.

## 1. What this is

Vellum is an architectural lighting-design practice. Visitors are architects, developers and interior designers deciding whether to bring Vellum onto a project. Brand line: **The room has another life.**

The site has two pages:

- **Home** (`/`): built to match the approved prototype `prototype/index.html` (within 1% pixel difference at 1440px and 375px, apart from the owner-requested changes listed in section 9).
- **Project journal** (`/project/`): every visible project in one continuous page, each opening with its concept drawings, then its finished installations.

Projects and collaborator logos are edited without code in **Keystatic** at `/keystatic`.

Status: both pages built, CMS working, base-site animations in, accessibility and performance checked (section 11). Content is still partly placeholder (section 12).

## 2. Run it

Needs **Node 22.23 or newer** (Astro 7 requires it).

| Command | Does |
| --- | --- |
| `npm install` | Install dependencies (uses `package-lock.json`) |
| `npm run dev` | Dev server at http://localhost:4321 (site, `/project/`, `/keystatic`). In a non-interactive shell Astro 7 backgrounds itself; stop with `npx astro dev stop` |
| `npm run build` | Production build into `.vercel/output/static` (static pages) plus Vercel functions |
| `npm run preview` | `scripts/serve.mjs`: zero-dependency static server for the build at http://localhost:4322 (`astro preview` does not work with the Vercel adapter) |
| `npm run offline` | After a build: `offline/vellum-site/`, a copy with relative links and embedded fonts that opens from disk (`file://`) |
| `npm run check` | `astro check` type checking (keep at 0 errors, 0 warnings) |
| `npm run tokens` | Regenerate `src/styles/tokens.css` from `design-system/tokens.json` (also runs before dev and build) |

Add `?motion=on` to any URL to see animations on a machine set to reduce motion (section 7).

## 3. Stack and why

- **Astro 7** (`astro.config.mjs`): pages prerendered to static HTML. Public pages ship **no framework JavaScript**; each component's small script is inlined into the page.
- **Keystatic** (`keystatic.config.ts`): git-based CMS. Local mode in dev (writes files here); GitHub mode in production (commits to the repo, Vercel rebuilds). `PUBLIC_KEYSTATIC_STORAGE=github npm run dev` runs the one-time GitHub App setup locally.
- **React 19**: only for the Keystatic editor screen.
- **Vercel** (`@astrojs/vercel`): host. On-demand routes: `/keystatic`, `/api/keystatic/*`, `/api/enquiry`. Everything else is static.
- **Images**: `astro:assets` `<Picture>` makes AVIF and WebP at several widths with `srcset`; everything below the hero is lazy; the hero and two fonts are preloaded. `src/image-service.ts` (set in `astro.config.mjs`) is Astro's sharp service with one change: a flat, dark photo that encodes below 0.2 bits per pixel is encoded again at AVIF 75 / WebP 90, so the encoder does not smooth its texture away (decision 18). Detailed photos are untouched.
- `build.inlineStylesheets: 'always'`: CSS is inlined (no render-blocking request).
- `env.schema`: `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM` (server secrets, optional) for the enquiry form.

## 4. Folder map

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | Home page; preloads the hero AVIF via `getImage` |
| `src/pages/project/index.astro` | Project journal |
| `src/pages/api/enquiry.ts` | Enquiry form endpoint: validates, honeypot field `website`, sends with Resend; 503 `not-connected` until env vars exist |
| `src/layouts/Base.astro` | `<head>` (preloads, the `?motion=on` inline script), skip link, logo symbol, footer, menu, `scripts/motion.ts` |
| `src/components/` | One component per section (section 5) |
| `src/scripts/motion.ts` | Shared motion: fade up, smooth in-page links, section name in the bar, lamp sweep |
| `src/styles/tokens.css` | **Generated**, never edit |
| `src/styles/global.css` | All styles: the prototype's CSS ported rule for rule onto tokens, plus journal, viewer and motion styles |
| `src/content.config.ts` | Astro content schema the pages read |
| `src/lib/content.ts` | `getProjects()` and `getCollaborators()`: visible items only, in order |
| `src/content/projects/*.yaml` | One file per project (edited in Keystatic) |
| `src/content/collaborators.yaml` | Logo ticker list (edited in Keystatic) |
| `src/assets/home/` | Home page images (not CMS) |
| `src/assets/projects/`, `src/assets/collaborators/` | CMS images, in Keystatic's own file layout (section 6) |
| `keystatic.config.ts` | Editor fields, labels and help text; exports `SECTORS` |
| `public/fonts/` | Self-hosted Geist 400/500 and Geist Mono 400 (Mono now only for the logo's line in the Home hero; only Home preloads it) |
| `scripts/build-tokens.mjs`, `scripts/build-offline.mjs`, `scripts/serve.mjs` | Token generator, offline packager, local server |
| `scripts/grade-image.mjs` | Gives a Magnific render or any photo the site's champagne grade and saves a JPEG for `src/assets` (decision 17) |
| `src/image-service.ts` | Astro's sharp image service, re-encoding flat, dark photos at a higher quality (decision 18) |
| `design-system/` | Brand book (`BRAND.md`), `tokens.json`, fonts, logos, icons, boards |
| `prototype/index.html` | Approved Home design reference (has no doctype, see section 10) |
| `reference/` | The two base websites the motion came from. Git-ignored and not in the handoff zip; ask the owner if you need them |
| `preview/` | Only in the handoff zip: the built site, ready to serve |

## 5. The pages

### Home (`src/pages/index.astro`), sections in order

| # | Section | Component | Notes |
| --- | --- | --- | --- |
| 1 | Hero | `Hero.astro` | Full-bleed facade, cream logo, white H1 then a Contact us button (`.hero-copy`), `settle`/`lift` load animation |
| 2 | Docking bar | `Bar.astro` | Sticky under the hero; Menu, current-section label, logo, Enquire |
| 3 | Statement | `Statement.astro` | Three paragraphs in one held spot, changing in place as you scroll, while five photos pass around them; fixed gaps (section 7) |
| 4 | Collaborators ticker | `Collaborators.astro` | From CMS; drawn twice for a seamless loop; pause/play button |
| 5 | How we work | `Method.astro` | The page's one dark band; four tabs (WAI-ARIA tabs); timed rotation with filling gold line; stacked on phones |
| 6 | Studio principle | `Principle.astro` | Photo at its own 4:5 (34vw, 300 to 560px wide) and, beside it and centred on its height, "Vellum principle" (the section's heading, plain 18px like the Collaborators line) over the quote (decision 22) |
| 7 | Selected work | `Work.astro` | Grey band; sector filter built from CMS sectors; cards link to `/project/#<slug>` |
| 8 | After dark (night photo) | `Night.astro` | The photo fills the section (one uplit olive tree at the bottom right); on its open sky at the top left a large heading and the paragraph as wide as it; phones stack (decision 24) |
| 9 | Sectors and services | `Scope.astro` | Two lists, one rule above each |
| 10 | Contact footer | `ContactFooter.astro` (in `Base`) | Fixed under the page on large screens (`main{margin-bottom:100svh}` at 901px+ wide and 720px+ tall) |
| | Menu | `Menu.astro` (in `Base`) | Native `<dialog>`; in-page links close it and move focus to the target |

### Project journal (`src/pages/project/index.astro`)

1. Bar (docked from the top).
2. Intro in the statement style: "Project journal. Each project in order, from the first drawing to the finished room after dark." (new copy, see section 9).
3. Grey index band: one rule above the list, then rows (title, sector, year) linking to `#<slug>`.
4. One `JournalEntry.astro` per visible project, separated by a hairline rule:
   - left column: title, sector and year, location, summary; `position: sticky` so it stays pinned while the images scroll (static on phones);
   - right column: images grouped as **Drawings** then **Finished lighting**, each under a plain heading (owner decisions 13 and 16), grouped by `kind` whatever order the CMS holds them in; landscape images (ratio 1.2 or wider) full width, upright ones half width; mono label captions. A project with no journal images shows its cover.
   - each image is a link to its full-size WebP (works without JavaScript) that the viewer intercepts.
5. The page's one dark band: "Every project starts on paper. We draw where the light falls before we choose what makes it." (reused from the Home statement) and an Enquire button.
6. `Viewer.astro`: full-screen `<dialog>` stepping through that project's images (section 7).

## 6. Content model (Keystatic)

**Project** (`src/content/projects/<slug>.yaml`; the slug is the file name, generated from the title): `title`, `hidden`, `order` (lower first, then title), `sector` (one of `SECTORS`: Hospitality, Residential, Cultural, Workplace, Retail, Landscape), `location`, `year` (stored as a 4-digit string so the editor does not show "2,025"; coerced to a number in `content.config.ts`), `summary`, `cover`, `coverAlt`, and `entries[]` of `{ kind: drawing | installation, image, alt, caption, hidden }`.

**Collaborators** (`src/content/collaborators.yaml`): one list `logos[]` of `{ name, logo?, hidden }`; position in the list is the order (drag to reorder); an empty logo shows the name as text. `content.config.ts` turns the list into entries with `id` and `order`.

**Image files must follow Keystatic's layout**, or the editor renames them on the first save:
- `src/assets/projects/<slug>/cover.jpg`
- `src/assets/projects/<slug>/entries/<n>/image.jpg`
- `src/assets/collaborators/logos/<n>/logo.svg`

YAML paths are relative to the YAML file (`../../assets/projects/...` for projects, `../assets/collaborators/...` for the logo list). Keystatic drops YAML comments when it saves. Hidden projects and entries are filtered in `src/lib/content.ts`, so both pages agree.

Seed content: the six prototype projects (Courtyard restaurant hidden, as in the prototype) and the ten dummy logos. Summaries and most captions are placeholders written in the brand voice; the three Harbour Hotel captions, the facade caption and all alt text from the prototype are the prototype's own.

## 7. Motion

All motion respects `prefers-reduced-motion`. For reviewing, `?motion=on` sets `html.force-motion` (an inline script in `Base.astro`, remembered per tab in sessionStorage; `?motion=off` clears it). The reduced-motion CSS block is scoped to `html:not(.force-motion)`, and each script checks the class inline.

| Effect | Code | Taken from | With reduced motion |
| --- | --- | --- | --- |
| Hero settle and headline lift | `global.css` `.hero img`, `.hero-copy` keyframes | prototype | off |
| Statement: paragraphs held and swapped in place, photos pass around them | `Statement.astro` sets `--p` (0 to 1) and the sticky `top` on `.story-stage`, and `.is-on` on the paragraph for each third of the hold; start points and travel `.d0..d4` in `global.css` | review feedback and owner requests, replacing 333 South Wabash's second-section drift | nothing held; paragraphs stack, photos rest halfway |
| Fade up on scroll | `motion.ts`, `[data-reveal]` gets `.rv`, then `.is-in` | 333 `.reveal` (`js/site.js:6-8`) | nothing hidden |
| Smooth in-page links, focus follows, fixed footer reached by scrolling to the end | `motion.ts` click handler; offset from `scroll-padding-top` | Airloom (`js/site.js:8-53`) | jumps |
| Current section or project name in the bar | `motion.ts`, `[data-label]`; shown only once the bar is docked; hidden on phones | Airloom header label (`js/site.js:54-82`) | text swaps without sliding |
| Bar logo appears as the bar docks (Home only) | `motion.ts` watches `.hero` and sets `.bar[data-dock]` to `hero` or `docked`; `global.css` hides `.bar-mark` under `html.js` (set inline in `Base.astro`), so without JavaScript it always shows | review feedback | appears without fading |
| Lamp line sweeping along hairline rules (the rules left after decision 19: Selected work's top rules, the rule above each list in Sectors and services and the journal index, and the rule above each journal project) | `motion.ts`, `[data-sweep]` gets `.sweep`, then `.is-swept` | Airloom feature rule (`js/site.js:110`, `css/site.css:82-84`) | off |
| Logo ticker | CSS `marq` 40s; pause button | prototype / Airloom | starts paused |
| How we work timed stages | `Method.astro`: `STAGE_MS = 7000`, active line fills via `--p`, loops | Airloom feature tabs (`js/site.js:168-229`) | starts stopped; Play runs it |
| Menu panel rise | `Menu.astro`, `.menu.in` | prototype | off |
| Footer revealed under the page | CSS | prototype / Airloom | n/a |
| Pinned journal heading | CSS `position: sticky` on `.entry-head` | 333 pinned type (`js/site.js:10`) | n/a |
| Image viewer | `Viewer.astro` | 333 gallery (`js/site.js:31`) and Airloom dialog (`js/site.js:231`) | no fades |

Details that matter:
- **Statement hold**: `.story-stage` is only as tall as the paragraph plus fixed gaps (`--sg`: clamp(72px, 9vw, 120px) above and below on desktop; on phones 32px, then a photo row, then 32px, each side). The three paragraphs sit in `.story-lines`; with motion they share one grid cell (the tallest sets its height; top-aligned on desktop so the indented first line stays put, centred vertically on phones, owner request) and crossfade (`.is-on`, 0.6s), one per third of the hold. With motion the stage is sticky, and the script sets its `top` so it sits centred in the screen under the bar (or right under the bar if taller), while the reader scrolls through `.story-hold` (`210svh`, 70svh per paragraph); `--p` runs 0 to 1 across that. Each photo sits at a start point and moves by its travel x `--p`. Desktop: the paragraphs span columns 2 to 6; photos rise up column 1 (three photos 0.7 screens apart, about 0.57x the scroll) and column 7 (two photos 1.1 screens apart, about 0.76x), from below the screen to above it; `.story` has `overflow: clip` (not hidden, so sticky still works), which clips them at its edges. So `place()` in `Statement.astro` sets each photo's start (`top`) and its column's travel (`--ty`, px) from the real screen, block and photo sizes: the lowest photo of a column must finish the hold whole above the section's bottom edge (which rises past photos slower than the scroll), and a column that then rises faster than the scroll starts low enough not to catch the section's top edge while it is still on screen (owner requests: no photo cut as the effect starts or ends). Without the hold, two photos rest inside the block. Checked frame by frame at 15 sizes from 320x568 to 2560x1300: no photo cut at the start, sliced by the section's top or bottom edge, over the text, or over another photo; two to four photos in view through the hold. Phones: a top row sliding left (`--dx: -110`) and a bottom row sliding right (`--dx: 110`), photos at most 11svh wide so short phones fit. Photos outside the view are clipped, so lazy loading would wait until they slide in; the script switches them to eager loading once the section is within a screen.
- **How we work**: clicking a stage (or arrow keys) jumps there and restarts its line from empty; the rotation carries on. Only the pause button stops it. It holds while **keyboard** focus (`:focus-visible`) is in the band, while the band is less than 30% visible, and while the tab is hidden. It does not hold on hover (the owner found that read as static).
- **Viewer**: opens from any journal image; Previous/Next buttons, Left/Right keys, swipe (40px); Escape closes; focus returns to the image; the page behind is locked (`html.viewer-open`); it clones the page's `<picture>` with `sizes="100vw"` so the largest file loads; new images are announced in a live region.
- **Not brought across, deliberately**: 333's scroll-jacking smooth scroll (breaks find-in-page and assistive tech), its WebGL type intro with scroll lock, loaders, scroll-scrubbed video. A light page-load fade (Airloom) was offered and not chosen.

## 8. Design system and styles

- Tokens: `design-system/tokens.json` becomes `src/styles/tokens.css` (Day theme on `:root`, Night under `[data-theme="night"]`). Use token variables, not raw values.
- Layout variables in `global.css`: `--g` gutter (24px, 18px on phones), `--gl/--gr` with safe areas, `--bar` (56px, 52px on phones), `--col` (one of 7 columns), `--ease` `cubic-bezier(.19,1,.22,1)`.
- Breakpoint: phones are `max-width: 700px`. The fixed footer applies at `min-width: 901px and min-height: 720px`.
- Type: Geist 400 for everything, including labels and captions: `--label` (13px, `ink-muted` or `on-dark-muted`, sentence case, normal spacing; tabular figures for numbers). Geist Mono uppercase with wide tracking is kept for the logo's line only (owner decision 16, departing from `BRAND.md`). Emphasis is tone (ink vs ink-muted), never weight.
- Colour: one dark band per page; `lamp`/`lamp-glow` marks light (active line, moon, the active filter, the chosen dropdown option), never text on white. The prototype's `#e8c391` (`--lamp-glow`) is used wherever the prototype used gold.
- `picture{display:contents}` lets the `<img>` lay out as the prototype's bare `<img>` did, and **`picture>source{display:none}` is required**: without it the `<source>` elements become grid items and push content around.
- Brand rules: `design-system/BRAND.md` (except where owner decision 16 departs from it). Caption content stays data: fitting reference, colour temperature, dim level, separated by commas (decision 19). Headings carry no punctuation.

## 9. Decisions (owner's, in order) and open defaults

Owner decided:
1. Stack: Astro + Keystatic. Host: **Vercel**.
2. Base websites: **333 South Wabash** ("the red website") and **Airloom**. Bring across the six recommended effects (fade up, smooth links, section name in the bar, lamp sweep, pinned heading, image viewer).
3. Statement: use **333's second-section animation**; then, from a screen recording of 333, keep the photos locked to the text. **Superseded by 15.**
4. How we work: **stack the four stages on phones**; make them **advance on a timer with the gold line filling**; **clicking a stage restarts its timer** rather than stopping.
5. Project page: **one continuous journal page** (not a page per project), **white throughout with one closing dark band** (not installations on dark).
6. Hero headline: **raise its contrast** (review feedback: the grey "Drawn on paper, finished on site." was hard to read where it crosses the uplit base of the facade, 1.75:1 at 1440px wide). Done with a soft shade behind the headline only (now `.hero-copy::before` in `global.css`, 50% black, sized in em so it follows the type), leaving the text colours and the rest of the photo as they were. The grey line itself was later replaced (8).
7. Hero on phones: **drop the top-right caption** ("Facade uplight study, 2700K · 15° · 40% dim"; review feedback: its lines did not line up with the logo and it competed with it) and **tidy the margins**: the logo now sits 18px from the top, the same as the side margin, so logo, strapline and headline share one left edge inside one margin. Above 700px the caption stays at the bottom right as in the prototype.
8. Hero headline: **remove "Drawn on paper, finished on site." and put a Contact us button in its place** (owner request). The headline is now one white sentence; the button is the site's outlined dark button (`.btn btn-dark`, as on the journal's closing band) with the arrow, linking to `#contact` like Enquire. Headline and button sit together in `.hero-copy`, which carries the position, the `lift` animation and the shade.
9. Studio principle photo on phones: **shorter** (review feedback: too tall, a long scroll). Phones use the photo's own 4:5 (339x424 at 375px wide instead of 339x900), which shows the whole staircase and makes the section about 480px shorter.
10. Menu: **labels only** (review feedback: the small descriptions under each item, such as "Four stages", were not needed).
11. Bar logo on Home: **hidden until the bar docks** (review feedback: it repeated the hero logo). It fades up as the hero scrolls out and the bar sticks to the top, and hides again on the way back up. While hidden it is out of the tab order (the hero logo links to the same place). The Project page has no hero, so its bar logo always shows.
12. Contact footer: **more room around the edges** and **custom dropdowns** (review feedback). The footer has its own side margin, `--fx` = clamp(24px, 3.4vw, 56px), and a top margin of clamp(48px, 8svh, 88px); phones keep the page gutter with 64px top. On the fixed desktop footer the big logo takes the height left over (at most 36svh), so the legal line never leaves the screen (checked 901x720 to 2560x1300). Contact details go to one column under 420px. Project type and Stage are select-only comboboxes (WAI-ARIA APG pattern) built by the script in `ContactFooter.astro` over the native selects, which stay in the form hidden (`.dd-native`) so the values post unchanged and show as normal selects without JavaScript. Keys: arrows, Home/End, PageUp/PageDown, Enter/Space, Escape, Tab (chooses), Alt+Up, and typing letters (the same letter cycles). The chosen option carries the gold lamp marker; the list opens upwards when there is no room below and lines up with the field's right edge when it would run past the form.
13. Journal group headings: **a plain heading over each group, nothing else** (review feedback, then owner request). "Drawn on paper" over the drawings and "Finished on site" over the finished photos, as `h3.j-label` (16px, ink). The square markers, the stage strips with rules, and the pinned stage list with a side line that were tried in between are all gone.
14. Image viewer: **every image fits the screen** (owner request: portrait images opened full width and ran past the bottom). The image is placed against `.viewer-stage` itself (`picture` is `display: contents`; the `img` is absolutely positioned with auto margins and `max-width`/`max-height: 100%`), so it is as large as the space between the top and bottom rows allows, keeps its aspect ratio and is never cropped. Checked portrait and landscape at 375x812, 812x375, 1280x720, 1440x900 and 2560x1300.
15. Statement: **three paragraphs in one held spot, changing in place, with fixed spacing** (review feedback, then owner requests). The 333-style drift sent three large paragraphs and the photos through a long scroll, so reading meant scrolling back and forth. Then: one paragraph held while the photos pass around it, never across it; spacing a fixed gap, not shared-out space; the other two paragraphs briefly removed, then brought back to show one at a time in the same place. Now "This is Vellum…", "We work beside architects…" and "Every project starts on paper…" crossfade in turn as the reader scrolls through the hold. Type is up to 66px (was 88px). Reduced motion or no JavaScript: nothing is held, the three paragraphs stack and the photos rest around them.
16. Copy, headings and labels: **a plain copy pass, no punctuation in headings, no mono labels** (review feedback). Formulaic and tagline-like lines were rewritten as plain, specific sentences: hero "We design how buildings and interiors look after dark"; Statement leads "Vellum is an architectural lighting studio", "We work with architects, developers and interior designers", "Every project starts with drawings"; How we work "One team through all four stages" (was "From first sketch to final focus."); principle "We plan what stays dark as carefully as what gets lit"; night band "We are on site for the final focus"; scope "Sectors and services"; footer "Tell us about your project"; journal groups "Drawings" and "Finished lighting" (were "Drawn on paper" and "Finished on site"); journal close "Talk to us at concept stage"; two project summaries ("One light idea per room", "A dark room with one beam in it") rewritten. Headings carry no punctuation; where a two-tone heading had a second sentence, that sentence is now its own grey paragraph (`.h2-pair` in How we work and the journal close, `.j-title-rest` in the journal intro). Labels and captions (hero note, bar caption, card and entry meta, numbers, journal index, image captions, How we work stage numbers, panel captions and schedule, footer legal line, viewer) moved from Geist Mono uppercase with wide tracking to `--label`; the gold squares beside the bar and menu captions are gone, and the dropdown marks the chosen option with a check. Mono stays only in the logo's line. Checked: no heading with punctuation, no em dashes, no other mono or uppercase text on either page; axe 0 violations at 1440 and 375.
17. Images: **more variety, full resolution** (review feedback). There were only nine images, all 645 to 1024px copies, reused across sections (the stair, beam and graze photos three times each on Home). Now: the site uses the full-size Magnific originals; six unused renders from the owner's Magnific history joined the library (hotel lobby, timber-slat stair, gallery with one beam, corridor scallops, limestone pillar, facade fins; three bright daylight renders were left out as off-brand); Home sections have their own images (`src/assets/home`: `drift-*` for the Statement, `principle.jpg` the pillar, `night.jpg` the gallery, `method-*`), and each project gained a second finished photo. On Home only the graze repeats (Harbour card and How we work's commissioning panel). Grading: the shipped photos had been graded by hand from amber to champagne; `scripts/grade-image.mjs` recovers that curve from the originals (within 2 to 4 levels in 255 on photos it was not fitted on) for amber renders, and `--match` gives any other photo the same palette by lightness; drawings are not graded (`--no-grade`). srcset widths now reach the file sizes; the hero's phone `sizes` reflects its tall crop; the Stone facade cover is an upright crop so the card does not upscale it. Checked: every image at least one file pixel per screen pixel at 1440 on a 2x screen, 2560 and a 3x phone, except the hero and night band (see Before launch). Then, with the owner's approval (about 470 credits): the hero facade upscaled 2x with Magnific Precision (4096x2286, `hero.jpg`), a new 4k courtyard at night for the night band (three uplit olive trees under a navy sky, `night.jpg`, curve grade) and a new 4k commissioning photo for How we work's fourth panel (a step ladder and one spotlight aimed at a limestone wall, `method-commissioning.jpg`, `--match` grade; caption "Focus night · 23:40 · D04 aimed at the wall"). The night band's text now sits in the sky above the trees (`place-items:start center`, line kept to 34ch over the shorter middle tree, a taller band under 900px): heading at least 17:1 and line at least 11.6:1 at seven sizes. srcset `sizes` match how wide each cropped image really shows (hero and night band on small screens, How we work panels on phones). On Home only the detail drawing appears twice (How we work's Detail tab and, cropped, one Statement photo).
18. Two project photos looked **blurred** (review feedback): the North Gallery beam and the Atelier offices scallop wall. Two causes. The 1650px renders were soft, and AVIF at Astro's default quality (50) had smoothed what texture they had: flat, dark photos encode to almost nothing (the North Gallery card was a 9KB file at 960px) and lose about 60 to 70% of their fine detail. Fixes: with the owner's approval (435 credits) both scenes were re-rendered at 4k with sharp concrete and plaster texture (Nano Banana 2.1 from the old renders, 3712x4608, curve grade; covers, first journal entries and the hidden Courtyard restaurant's cover). The beam keeps its composition; the scallop wall took a second render with crisp, hard-edged scallops and the three downlights in view, since soft scallops read as blur at card size whatever the resolution; and `src/image-service.ts` re-encodes any photo below 0.2 bits per pixel at AVIF 75 / WebP 90 (those two cards are now 36 to 38KB; detailed photos keep their sizes).
19. **Cleanup of decorative patterns** (review feedback: dividers, interpuncts, captions and step numbers read as formulaic, AI-generated UI). Removed: the hero's corner caption ("Facade uplight study", already gone on phones), the bar's "Architectural lighting" label, the menu's "Vellum" label, the "Vellum / Studio principle" attribution under the quote, How we work's step numbers (01 to 04) and its three panel captions, the project numbers in the journal index and above each project, and two journal captions that repeated the photo before them (North Gallery and Atelier offices, second photos); the rule above the logo ticker and the vertical rules between logos (cells are now 64px, logos centred), the frame around the How we work panel, the table's row rules (the header rule stays), the rule above Sectors and services, the rules between list rows, between journal index rows and above each card on phones. Kept, because they do a job: the docked bar's bottom edge, How we work's progress track (on phones only the active stage's gold line, since stacked tracks read as list dividers), one rule above each group (Selected work, each list in Sectors and services, the journal index, each journal project; the lamp sweep runs along these), form field underlines and the dropdown and button outlines. Interpuncts: none left. Journal captions use commas ("D04 adjustable downlight, 3000K, 15°, 60%"; the Keystatic help and `EDITING.md` say so); the schedule's control and circuit are two columns; the schedule's caption is kept for screen readers only; the viewer counts "2 of 4" instead of "02 / 04"; the Project page title is "Project journal, Vellum Lighting". Checked at 1440 and 375: no interpuncts or step numbers in either built page; axe 0 violations on both pages at both widths.
20. Night band: **a planned layout and natural line breaks** (review feedback: the centred text floating over the photo felt unplanned and the paragraph wrapped awkwardly, e.g. "every / fitting"). The text now sits on the 7-column grid in a band of the photo's own sky (`--sky` #0e1421, sampled from its top edge), heading at `.h2` size in columns 1 to 4 and the paragraph (18px, line height 1.3) in columns 6 to 7 (5 to 7 below 1100px), both resting on one line (`align-items:end`); it was the only centred section on a left-aligned site. The photo follows at its own aspect ratio, tucked up under the text by its empty sky (`margin-top: calc(56px - 10.4%)`: the left tree's top is 18.7% down the photo, 10.4% of its width), its top 16% fading into the band, so the seam does not show and the text keeps 56px clear of the trees at every width (48px on phones, where the photo is a 118vw-tall crop fitted to its height). Below 900px heading and paragraph stack. Line breaks: each phrase starts its own line (`span.l`, block, balanced): "We are on site / for the final focus"; "Commissioning happens at night, / when every fitting is aimed and dimmed. / We do it ourselves, so the result / matches the scheme you approved." Checked 320 to 2560 wide: the same breaks everywhere (at 320 the second line wraps once more, after "is"); text on the sky band is at least 12:1; axe 0 violations.

21. After dark section: **the photo behind the words again; the heading large and the paragraph small under it, at the top left** (owner requests). First the sky band of 20 was not liked and something different from Mobbin was asked for; a framed photo beside the text on the white page (In Common With and MOUTHWASH Studio) was tried and not liked: the owner wants the photo in the background with the content on top, using 20 as the base. Then a heading and paragraph at one size with the paragraph's first line indented two columns (MOUTHWASH Studio and TinyWins) was not liked either: the two lines did not fit together. Now: 20's structure (photo full width, its top fading into a band of its own sky, `--sky` #0e1421, tucked up under the text so the copy never crosses the trees; clearance above the left tree 56 to 80px, `clamp(56px, 4.2vw, 80px)`), with the words at the top left on one edge: the heading in white over two lines, "We are on site / for the final focus" (`span.l`), at clamp(40px, 3.7vw, 57px), and under it the paragraph in #cfcfcf at clamp(17px, 1.42vw, 22px), line height 1.35, each phrase on its own line (`span.l`): "Commissioning happens at night, / when every fitting is aimed and dimmed. / We do it ourselves, so the result / matches the scheme you approved." The heading stays about 2.6 times the paragraph's size, so its wider line comes out within about 10% of the paragraph's widest at every width (owner: the one-line heading was much wider than the paragraph and looked odd; measured 0.90 to 1.07 from 320 to 2560). Phones: heading clamp(32px, 9.4vw, 40px), paragraph 16px; the photo a tall crop as in 20. Of the three variants mocked up (one size stacked, heading over paragraph, heading beside paragraph) this one read best; heading beside paragraph was close to 20. The framed layout, its rules and the lights-up fade are gone. Checked 320 to 1905 wide (at 320 "when every fitting is" wraps before "aimed"); axe 0 violations at 1440 and 375 with reduced motion.

22. Studio principle: **a shorter photo and the quote held close to it** (owner request: the photo felt too tall for the section, and the words, at the top of the far half with a big gap below, read as apart from it rather than supporting it; the owner's screenshot was of an older build, with the stair photo, the earlier quote and the "Vellum / Studio principle" line, but the current build had the same two problems: a 448x900 photo and the quote alone at the top of the right half, about 500px from the photo at 1905 wide). Now the photo shows at its own 4:5, 34vw wide (300 to 560px, at most 700px tall); the quote follows after one fixed gap (clamp(40px, 6vw, 120px)), centred on the photo's height, larger (clamp(26px, 2.6vw, 40px), was up to 32px), each sentence on its own balanced lines, with "a&nbsp;room" kept together so the second sentence breaks "Without contrast, a room / at night looks flat." Phones: photo full width at 4:5, quote 28px under it (was 40px). Section height at 1440x900: 890px, was 1178px. Of three variants mocked up (quote at the photo's foot, centred and larger, at the foot and larger) centred and larger read best. This departs from the prototype's 900px photo (see 9 for phones). Then, owner requests: **"Vellum principle" as the heading over the quote**, first as a chip (an outlined tag), then "make that chip like" the Collaborators line "Architects and developers we have worked with": so it is plain text in that line's style (`.lede`: 18px, line height 1.12, ink), with no outline. It is the section's `h2` (the section is `aria-labelledby` it); heading and quote sit together in `.principle-t`, 16 to 24px apart, and that pair is what is centred on the photo. Sentence case as all labels (decision 16; the owner typed "vellum Principle"). The bar label for the section is now "Vellum principle" too (was "Studio principle"). This brings back a label over the quote after decision 19 removed the "Vellum / Studio principle" attribution under it, at the owner's request.

24. After dark: **a slide-like layout and a new photo with the subject at the bottom right** (owner request, after a Superside slide: a small line, a large heading with an italic serif phrase, the photo's subject at the bottom right, "keep our image style"). The old courtyard (three trees across the whole width, sky only in a strip along the top) could not be cropped that way, so with the owner's approval (290 credits, two options) a new photo was rendered in Magnific: Nano Banana 2.1 at 4k, 16:9, the old courtyard render as the style reference, prompt for one old olive tree uplit by a narrow warm beam in the lower right, a low dry-stone wall and pale gravel along the bottom, and open navy sky over the whole upper left. Of the two, the one with the tree lower and further right was chosen (the other's canopy reached almost to the top). It went through the site's curve grade (`scripts/grade-image.mjs`, default; lit leaves 146,118,81 against the old photo's 151,121,82; sky #09111f) and replaced `src/assets/home/night.jpg` (3840x2143; the old courtyard is in git history and in the Personal project). Layout: the photo fills the section (`object-fit: cover`, kept at 80% 100% so cropping takes sky, not tree), the section as tall as the photo at full width but at most a screen less the bar, at least 420px; at the top left the heading "We are on site / for the final focus" at clamp(40px, 5.2vw, 108px), then the paragraph at clamp(18px, 1.5vw, 26px), as wide as the heading: `.night-t` is `width: fit-content`, so the heading sets its width, and the paragraph has `width: 0; min-width: 100%`, so it fills that width without widening it, its lines running almost the full width (measured 320 to 2560: the paragraph box equals the heading's widest line). Owner follow-ups: first "final focus" was set in Cormorant Garamond italic, as the reference's italic phrase, then removed ("use normal": one font throughout, the font file dropped); first the paragraph kept 21's phrase-per-line breaks, which left it much narrower than the heading ("weird"), so it now wraps to the heading's width. The sky band, its fade and the tucked-up photo of 20 and 21 are gone on desktop. Phones (up to 700px): the words on a band of the photo's sky, the photo below, 100vw tall, cropped to its right side so the whole tree shows, its top 30% fading into the band. Text contrast measured against the photo behind every line, 320 to 2560 wide: heading and line at least 16:1, paragraph at least 10.2:1. axe 0 violations at 1440 and 375 with reduced motion. Later the small "After dark" line over the heading (18px, like the reference's top line) was removed (owner request); the bar still names the section "After dark".

Defaults chosen by the assistant, not yet confirmed by the owner (change freely if asked):
- Prototype greys below WCAG AA replaced by the `ink-muted` token (#6f6f6f); footer legal text #808080; filter buttons at least 24px tall on desktop; ticker button changes its label instead of also toggling `aria-pressed`.
- Gold for lit details stays `#e8c391` (`lamp-glow`); the tokens' `lamp` `#d9ad82` is unused.
- All copy was rewritten in a plain pass (owner decision 16); the journal's closing band and the Home statement no longer share a line.
- Bar labels "Collaborators" and "Sectors and services" are new words ("The practice", "How we work", "Selected work", "After dark" come from the prototype; "Vellum principle" matches the chip the owner asked for, decision 22).
- Enquiry success message when email is connected: "Thanks, {first}. Your enquiry has been sent to the studio." (new copy).

## 10. Gotchas

- **Keep each page script self-contained.** If two `<script>` blocks import a shared module, Astro splits them into separate files: extra requests on the live site, and the offline copy breaks because browsers will not load module imports from `file://`. That is why the reduced-motion check is repeated inline.
- **Compare against the prototype with a doctype added.** `prototype/index.html` has none, so on its own it renders in quirks mode (forms gain a 16px bottom margin). Prepend `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` to a copy.
- **Lazy images in screenshots**: set `loading="eager"` and await `img.decode()` before capturing, or drift photos come out blank.
- **`naturalWidth` with `srcset`** reports the density-corrected display width, not the file width. Compare `currentSrc` against the largest `srcset` entry instead.
- **Fixed footer**: an anchor to `#contact` cannot scroll to a fixed element; `motion.ts` scrolls to the end of the page instead.
- **Fonts from `file://`** are blocked by browsers, so `build-offline.mjs` embeds them as data URLs.
- Astro 7's `astro dev` backgrounds itself when not attached to a terminal; `npx astro dev stop` stops it.
- `npm audit` flags build-time dependencies (`@vercel/nft`, `@vercel/routing-utils`, a `minimatch` in Keystatic). None runs for visitors; the suggested fixes downgrade to very old versions. Left as is.

## 11. How the work was checked (repeat after changes)

- **Prototype match**: Playwright screenshots of each Home section at 1440x900 and 375x812 with reduced motion, prototype (with doctype) against the build, compared with pixelmatch (threshold 0.1). Result: every section within 1% except the owner-requested How we work stack on phones. Differences left are image compression and the AA greys.
- **Accessibility**: axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice) on both pages at both sizes, with menu and viewer open: 0 violations. Re-run with a footer dropdown open (axe-core 4.10.3, Home at 1440 and 375, journal at 1440): 0 violations.
- **Hero text over the photo** (axe cannot judge text on images): screenshot the hero with the text hidden, then each text part alone in white on black as a mask, and compute the contrast of every glyph pixel against the photo behind it, at 375, 430, 768, 1024, 1280, 1440, 1920 and 2560px wide. Result: headline at least 8.4:1 (worst at 1440x900), Contact us button text at least 19:1, caption at least 10.8:1 (shown above 700px only).
- **Behaviour**: scripted checks for every effect in section 7, including reduced motion, no JavaScript, keyboard paths and phones (Home 22, journal 24, timed stages 16; all passing).
- **Performance**: Lighthouse mobile. Home 99 / 100 / 100 / 100 (LCP 1.9s, CLS 0, about 200KB). Journal 98 / 100 / 100 / 100 (LCP 1.5s, CLS 0).
- **Offline copy**: opened from `file://`: fonts, images, links between pages, viewer, menu.
- Always run `npm run check` (0 errors, 0 warnings) and `npm run build`.

## 12. Before launch

- Replace the ten collaborator logos (invented placeholders) in the editor.
- Real project summaries, captions and images. The photos are Magnific renders at full size (1650 to 5504px), graded with `scripts/grade-image.mjs`; every image gets at least one file pixel per screen pixel at 1440 on a 2x screen, at 2560 and on a 3x phone. Swap in real project photography when it exists (Keystatic; real photos need no grading).
- Replace `src/components/LogoSymbol.astro` with the master logo vector (current one was traced from a brand board).
- Real email addresses, studio address and Instagram (`ContactFooter.astro`, `Menu.astro`).
- Set `site` in `astro.config.mjs` if the domain is not `vellum.studio`.
- Deploy on Vercel, connect Keystatic to GitHub and Resend to the studio inbox (steps in `README.md`). Make `main` the default branch; Keystatic saves there.

## 13. Copy rules

Keep all prototype copy unless the owner changes it. **No em dashes anywhere in copy.** **No interpuncts (·) between words or data**: use commas (decision 19). No numbered labels (01, 02) where the layout already shows the order. Plain, specific, calm; real units (2700K, 24°, UGR<16); no superlatives. See `design-system/BRAND.md`.

## 14. Where to change common things

| To change | Edit |
| --- | --- |
| Projects, journal images, logos | `/keystatic` (or the YAML in `src/content/`) |
| Colours, spacing, sizes | `design-system/tokens.json`, then `npm run tokens` |
| How long each How we work stage shows | `STAGE_MS` in `src/components/Method.astro` |
| Statement photos' start points or travel, the gaps, or how long each paragraph is held | desktop: `lanes` (lift, gap, speed) in `Statement.astro`; phones: `.d0` to `.d4` (`left`/`top`, `--dx`) in the phone block of `global.css`; gaps `--sg`; `.story.is-moving .story-hold` height (70svh per paragraph) |
| Fade-up distance or timing | `.rv` in `global.css` |
| Sweep length or timing | `.sweep::after` and `@keyframes sweep` in `global.css` |
| Bar label words | `data-label` on each section component |
| Journal layout | `src/components/JournalEntry.astro` and the PROJECT JOURNAL block in `global.css` |
| Editor labels and help text | `keystatic.config.ts` |
| Enquiry email | env vars in Vercel; `src/pages/api/enquiry.ts` |
