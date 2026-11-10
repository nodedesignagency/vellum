// Makes a copy of the built site that opens straight from a folder (double-click index.html),
// for previewing on a computer without running a server. Run `npm run offline` after `npm run build`.
// Output: offline/vellum-site/ (git-ignored). Contains the Home page and the Project journal.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url)); // works on Windows too
const src = join(root, '.vercel/output/static');
const out = join(root, 'offline/vellum-site');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const pages = [
  { file: 'index.html', up: './' },
  { file: 'project/index.html', up: '../' },
];
const assets = new Set();
const fonts = Object.fromEntries(
  ['Geist-400', 'Geist-500', 'GeistMono-400'].map((f) => [f, readFileSync(join(root, 'public/fonts', `${f}.woff2`)).toString('base64')]),
);

for (const { file, up } of pages) {
  let html = readFileSync(join(src, file), 'utf8');

  // Browsers will not load web fonts from local files, so embed them in the page.
  html = html.replace(/<link rel="?preload"? href="?\/fonts\/[^>]*>/g, '');
  for (const [f, data] of Object.entries(fonts)) html = html.replaceAll(`url(/fonts/${f}.woff2)`, `url(data:font/woff2;base64,${data})`);

  // Links between the two pages point at their files; asset paths become folder-relative.
  html = html
    .replace(/href="\/project\/(#[^"]*)?"/g, (_, hash = '') => `href="${up}project/index.html${hash}"`)
    .replace(/href="\/(#[^"]*)?"/g, (_, hash = '') => `href="${up}index.html${hash}"`)
    .replaceAll('href="/favicon.svg"', `href="${up}favicon.svg"`)
    .replaceAll('/_astro/', `${up}_astro/`);

  for (const m of html.matchAll(/(?:\.\/|\.\.\/)(_astro\/[^\s"'),]+|favicon\.svg)/g)) assets.add(m[1]);
  mkdirSync(join(out, dirname(file)), { recursive: true });
  writeFileSync(join(out, file), html);
}

for (const f of assets) {
  mkdirSync(join(out, dirname(f)), { recursive: true });
  copyFileSync(join(src, f), join(out, f));
}
writeFileSync(
  join(out, 'README.txt'),
  `Vellum website: offline preview

Open index.html in Chrome, Safari, Firefox or Edge (double-click it).
The Home page and the Project journal both work offline: images, fonts, menu, tabs, filter,
ticker, the image viewer and the animations. If your computer is set to reduce motion,
add ?motion=on to the address to see the animations.

Not in this preview:
- The enquiry form cannot send from a local file; it shows an error. It works on the live site.
- The /keystatic editor needs the full project running (see the repository README).
`,
);
console.log(`offline/vellum-site: ${pages.length} pages + ${assets.size} files`);
