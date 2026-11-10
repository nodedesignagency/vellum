# Vellum website

Two pages, Home and Project journal, for Vellum, an architectural lighting-design practice.
Built with [Astro](https://astro.build), edited with [Keystatic](https://keystatic.com), hosted on [Vercel](https://vercel.com).

- **Studio editors:** see [EDITING.md](EDITING.md).
- **Design reference:** `prototype/index.html` (approved Home page), `design-system/` (tokens, brand book, fonts, logos), `CLAUDE.md` (brief).

## Run it

Needs Node 22.23 or later.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321 for the site and http://localhost:4321/keystatic for the editor. Locally the editor writes straight to the files in `src/content` and `src/assets`.

```bash
npm run build
```

`npm run dev` and `npm run build` first regenerate `src/styles/tokens.css` from `design-system/tokens.json`. Edit the JSON, never the CSS file.

## How it fits together

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | Home page, assembled from `src/components/`. |
| `src/components/` | One component per Home section, each with its own small script. |
| `src/layouts/Base.astro` | Shared head (font and hero preloads), logo symbol, contact footer, menu. |
| `src/styles/global.css` | All styles, ported rule for rule from the prototype onto the tokens. |
| `src/scripts/motion.ts` | Animations from the base sites: fade up, smooth in-page links, section name in the bar, lamp line sweep. |
| `src/content/projects/*.yaml` | One file per project (edited in Keystatic). |
| `src/content/collaborators.yaml` | The logo ticker list (edited in Keystatic). |
| `src/content.config.ts` | The content schema the pages read. |
| `keystatic.config.ts` | The editor's fields, labels and help text. |
| `src/pages/api/enquiry.ts` | Contact form endpoint (Vercel function). |
| `reference/` | The base websites, for study only. Git-ignored. |

Pages are prerendered to static HTML. Images are turned into AVIF and WebP at several widths at build time. Only `/keystatic` and `/api/*` run as functions. The public pages load no framework; React is only used by the editor.

## Deploy on Vercel

1. Merge to `main`, and make `main` the repository's default branch on GitHub. Keystatic saves to the default branch.
2. In Vercel, import the repository. Astro is detected automatically. Set the production branch to `main` and Node to 22.x.
3. Set the domain in `astro.config.mjs` (`site`) if it is not `vellum.studio`.

### Connect the editor to GitHub (once)

On the live site, the editor saves through a GitHub App.

1. Locally, run `PUBLIC_KEYSTATIC_STORAGE=github npm run dev` and open http://localhost:4321/keystatic.
2. Follow Keystatic's prompts to create the GitHub App and install it on `nodedesignagency/vellum`. It writes four variables to `.env`.
3. Copy those four (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) into Vercel's environment variables and redeploy.
4. In the GitHub App settings, add `https://<your domain>/api/keystatic/github/oauth/callback` as a callback URL.
5. Add each editor as a collaborator on the repository with write access.

### Connect the enquiry form

The form posts to `/api/enquiry`, which sends an email through [Resend](https://resend.com). Until the variables below are set it replies "not connected" and the visitor sees the prototype's message.

1. Create a Resend account and verify the sending domain.
2. In Vercel set `RESEND_API_KEY`, `ENQUIRY_TO` (the studio inbox, comma-separate several) and `ENQUIRY_FROM` (e.g. `Vellum website <website@vellum.studio>`). See `.env.example`.

## Before launch

- Collaborator logos are invented placeholders. Replace them in the editor.
- Photos and drawings are 1024px Magnific renders; swap in the full-resolution originals (the hero is soft on large screens).
- The logo was traced from the brand board; replace `src/components/LogoSymbol.astro` with the master vector.
- Email addresses, address and Instagram are placeholders (`ContactFooter.astro`, `Menu.astro`).
- Project summaries and most captions are drafted placeholders in the brand voice.

## Notes

`npm audit` reports issues in build-time dependencies (`@vercel/nft`, `@vercel/routing-utils`, a `minimatch` inside Keystatic). None runs for site visitors, and the suggested fix downgrades to years-old versions, so they are left until upstream releases patches.
