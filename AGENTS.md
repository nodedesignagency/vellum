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
- **Images**: `astro:assets` `<Picture>` makes AVIF and WebP at several widths with `srcset`; everything below the hero is lazy; the hero and two fonts are preloaded.
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
| `public/fonts/` | Self-hosted Geist 400/500 and Geist Mono 400 (all the site uses) |
| `scripts/build-tokens.mjs`, `scripts/build-offline.mjs`, `scripts/serve.mjs` | Token generator, offline packager, local server |
| `design-system/` | Brand book (`BRAND.md`), `tokens.json`, fonts, logos, icons, boards |
| `prototype/index.html` | Approved Home design reference (has no doctype, see section 10) |
| `reference/` | The two base websites the motion came from. Git-ignored and not in the handoff zip; ask the owner if you need them |
| `preview/` | Only in the handoff zip: the built site, ready to serve |

## 5. The pages

### Home (`src/pages/index.astro`), sections in order

| # | Section | Component | Notes |
| --- | --- | --- | --- |
| 1 | Hero | `Hero.astro` | Full-bleed facade, cream logo, two-tone H1, `settle`/`lift` load animation |
| 2 | Docking bar | `Bar.astro` | Sticky under the hero; Menu, current-section label, logo, caption, Enquire |
| 3 | Statement | `Statement.astro` | Indented two-tone paragraphs; five photos fly up through the text (section 7) |
| 4 | Collaborators ticker | `Collaborators.astro` | From CMS; drawn twice for a seamless loop; pause/play button |
| 5 | How we work | `Method.astro` | The page's one dark band; four tabs (WAI-ARIA tabs); timed rotation with filling gold line; stacked on phones |
| 6 | Studio principle | `Principle.astro` | Photo 900px tall as the prototype rendered it |
| 7 | Selected work | `Work.astro` | Grey band; sector filter built from CMS sectors; cards link to `/project/#<slug>` |
| 8 | Night band | `Night.astro` | Full-bleed image, one line |
| 9 | Sectors and services | `Scope.astro` | Two ruled lists |
| 10 | Contact footer | `ContactFooter.astro` (in `Base`) | Fixed under the page on large screens (`main{margin-bottom:100svh}` at 901px+ wide and 720px+ tall) |
| | Menu | `Menu.astro` (in `Base`) | Native `<dialog>`; in-page links close it and move focus to the target |

### Project journal (`src/pages/project/index.astro`)

1. Bar (docked from the top).
2. Intro in the statement style: "Project journal. Each project in order, from the first drawing to the finished room after dark." (new copy, see section 9).
3. Grey index band: ruled rows (number, title, sector, year) linking to `#<slug>`.
4. One `JournalEntry.astro` per visible project, separated by a hairline rule:
   - left column: number, title, sector and year, location, summary; `position: sticky` so it stays pinned while the images scroll (static on phones);
   - right column: images grouped as **Drawn on paper** (hollow marker) then **Finished on site** (lit lamp marker), grouped by `kind` whatever order the CMS holds them in; landscape images (ratio 1.2 or wider) full width, upright ones half width; mono label captions. A project with no journal images shows its cover.
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
| Hero settle and headline lift | `global.css` `.hero img`, `.hero-h1` keyframes | prototype | off |
| Statement photos fly up through the text | `Statement.astro`; start points `.story.is-moving .d0..d4` in `global.css` | 333 South Wabash, second section (`reference/333southwabash-com/source/js/site.js:9`, `css/site.css` story rules) | photos rest at the prototype's positions |
| Fade up on scroll | `motion.ts`, `[data-reveal]` gets `.rv`, then `.is-in` | 333 `.reveal` (`js/site.js:6-8`) | nothing hidden |
| Smooth in-page links, focus follows, fixed footer reached by scrolling to the end | `motion.ts` click handler; offset from `scroll-padding-top` | Airloom (`js/site.js:8-53`) | jumps |
| Current section or project name in the bar | `motion.ts`, `[data-label]`; shown only once the bar is docked; hidden on phones | Airloom header label (`js/site.js:54-82`) | text swaps without sliding |
| Lamp line sweeping along hairline rules | `motion.ts`, `[data-sweep]` gets `.sweep`, then `.is-swept` | Airloom feature rule (`js/site.js:110`, `css/site.css:82-84`) | off |
| Logo ticker | CSS `marq` 40s; pause button | prototype / Airloom | starts paused |
| How we work timed stages | `Method.astro`: `STAGE_MS = 7000`, active line fills via `--p`, loops | Airloom feature tabs (`js/site.js:168-229`) | starts stopped; Play runs it |
| Menu panel rise | `Menu.astro`, `.menu.in` | prototype | off |
| Footer revealed under the page | CSS | prototype / Airloom | n/a |
| Pinned journal heading | CSS `position: sticky` on `.entry-head` | 333 pinned type (`js/site.js:10`) | n/a |
| Image viewer | `Viewer.astro` | 333 gallery (`js/site.js:31`) and Airloom dialog (`js/site.js:231`) | no fades |

Details that matter:
- **Statement photos**: `translateY(-(p x speed x k)%)` of the photo's own height, `p` = scroll distance since the section's top reached the bottom of the screen, speeds `2.2 / 4 / 2 / 3.5 / 1.8` (333's), `k = 0.13` (0.16 on phones). On screen they move at 1.52 to 2.16 times scroll speed (333: 1.55 to 2.23). They are **locked to the native scroll every frame**; an earlier version smoothed them separately and read as floaty against the text. Start points are 333's, measured against the text block (48% to 163% of its height), so most begin below the text.
- **How we work**: clicking a stage (or arrow keys) jumps there and restarts its line from empty; the rotation carries on. Only the pause button stops it. It holds while **keyboard** focus (`:focus-visible`) is in the band, while the band is less than 30% visible, and while the tab is hidden. It does not hold on hover (the owner found that read as static).
- **Viewer**: opens from any journal image; Previous/Next buttons, Left/Right keys, swipe (40px); Escape closes; focus returns to the image; the page behind is locked (`html.viewer-open`); it clones the page's `<picture>` with `sizes="100vw"` so the largest file loads; new images are announced in a live region.
- **Not brought across, deliberately**: 333's scroll-jacking smooth scroll (breaks find-in-page and assistive tech), its WebGL type intro with scroll lock, loaders, scroll-scrubbed video. A light page-load fade (Airloom) was offered and not chosen.

## 8. Design system and styles

- Tokens: `design-system/tokens.json` becomes `src/styles/tokens.css` (Day theme on `:root`, Night under `[data-theme="night"]`). Use token variables, not raw values.
- Layout variables in `global.css`: `--g` gutter (24px, 18px on phones), `--gl/--gr` with safe areas, `--bar` (56px, 52px on phones), `--col` (one of 7 columns), `--ease` `cubic-bezier(.19,1,.22,1)`.
- Breakpoint: phones are `max-width: 700px`. The fixed footer applies at `min-width: 901px and min-height: 720px`.
- Type: Geist 400 for everything, Geist Mono 400 uppercase with letter spacing for labels and captions. Emphasis is tone (ink vs ink-muted), never weight.
- Colour: one dark band per page; `lamp`/`lamp-glow` marks light (active line, lit marker, moon), never text on white. The prototype's `#e8c391` (`--lamp-glow`) is used wherever the prototype used gold.
- `picture{display:contents}` lets the `<img>` lay out as the prototype's bare `<img>` did, and **`picture>source{display:none}` is required**: without it the `<source>` elements become grid items and push content around.
- Brand rules: `design-system/BRAND.md`. Captions follow the label style: fitting reference, colour temperature, dim level.

## 9. Decisions (owner's, in order) and open defaults

Owner decided:
1. Stack: Astro + Keystatic. Host: **Vercel**.
2. Base websites: **333 South Wabash** ("the red website") and **Airloom**. Bring across the six recommended effects (fade up, smooth links, section name in the bar, lamp sweep, pinned heading, image viewer).
3. Statement: use **333's second-section animation**; then, from a screen recording of 333, keep the photos locked to the text.
4. How we work: **stack the four stages on phones**; make them **advance on a timer with the gold line filling**; **clicking a stage restarts its timer** rather than stopping.
5. Project page: **one continuous journal page** (not a page per project), **white throughout with one closing dark band** (not installations on dark).
6. Hero headline: **raise its contrast** (review feedback: the grey "Drawn on paper, finished on site." was hard to read where it crosses the uplit base of the facade, 1.75:1 at 1440px wide). Done with a soft shade behind the headline only (`.hero-h1::before` in `global.css`, 50% black, sized in em so it follows the type), leaving the text colours and the rest of the photo as they were.

Defaults chosen by the assistant, not yet confirmed by the owner (change freely if asked):
- Prototype greys below WCAG AA replaced by the `ink-muted` token (#6f6f6f); footer legal text #808080; filter buttons at least 24px tall on desktop; ticker button changes its label instead of also toggling `aria-pressed`.
- Studio principle photo kept 900px tall, as the prototype rendered it (its `height` attribute overrode `aspect-ratio: 4/5`). Delete one marked line in `global.css` for 4:5.
- Gold for lit details stays `#e8c391` (`lamp-glow`); the tokens' `lamp` `#d9ad82` is unused.
- Journal intro line is new copy; the closing band reuses the statement's last line.
- Bar labels "Collaborators" and "Sectors and services" are new words ("The practice", "How we work", "Studio principle", "Selected work", "After dark" come from the prototype).
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
- **Accessibility**: axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice) on both pages at both sizes, with menu and viewer open: 0 violations.
- **Hero text over the photo** (axe cannot judge text on images): screenshot the hero with the text hidden, then each text part alone in white on black as a mask, and compute the contrast of every glyph pixel against the photo behind it, at 375, 430, 768, 1024, 1280, 1440, 1920 and 2560px wide. Result: grey line at least 4.66:1 (worst at 1440x900), white line at least 8.95:1, caption at least 9.36:1.
- **Behaviour**: scripted checks for every effect in section 7, including reduced motion, no JavaScript, keyboard paths and phones (Home 22, journal 24, timed stages 16; all passing).
- **Performance**: Lighthouse mobile. Home 99 / 100 / 100 / 100 (LCP 1.9s, CLS 0, about 200KB). Journal 98 / 100 / 100 / 100 (LCP 1.5s, CLS 0).
- **Offline copy**: opened from `file://`: fonts, images, links between pages, viewer, menu.
- Always run `npm run check` (0 errors, 0 warnings) and `npm run build`.

## 12. Before launch

- Replace the ten collaborator logos (invented placeholders) in the editor.
- Real project summaries, captions and images. Photos are 1024px Magnific renders colour-graded to the logo's gold; ask the owner for the full-resolution originals (the hero is soft on large screens).
- Replace `src/components/LogoSymbol.astro` with the master logo vector (current one was traced from a brand board).
- Real email addresses, studio address and Instagram (`ContactFooter.astro`, `Menu.astro`).
- Set `site` in `astro.config.mjs` if the domain is not `vellum.studio`.
- Deploy on Vercel, connect Keystatic to GitHub and Resend to the studio inbox (steps in `README.md`). Make `main` the default branch; Keystatic saves there.

## 13. Copy rules

Keep all prototype copy unless the owner changes it. **No em dashes anywhere in copy.** Plain, specific, calm; real units (2700K, 24°, UGR<16); no superlatives. See `design-system/BRAND.md`.

## 14. Where to change common things

| To change | Edit |
| --- | --- |
| Projects, journal images, logos | `/keystatic` (or the YAML in `src/content/`) |
| Colours, spacing, sizes | `design-system/tokens.json`, then `npm run tokens` |
| How long each How we work stage shows | `STAGE_MS` in `src/components/Method.astro` |
| Statement photo speeds or start points | `drifts` speeds in `Statement.astro`; `.story.is-moving .dN` in `global.css` |
| Fade-up distance or timing | `.rv` in `global.css` |
| Sweep length or timing | `.sweep::after` and `@keyframes sweep` in `global.css` |
| Bar label words | `data-label` on each section component |
| Journal layout | `src/components/JournalEntry.astro` and the PROJECT JOURNAL block in `global.css` |
| Editor labels and help text | `keystatic.config.ts` |
| Enquiry email | env vars in Vercel; `src/pages/api/enquiry.ts` |
