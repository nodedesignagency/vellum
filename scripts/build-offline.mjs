// Makes a copy of the built Home page that opens straight from a folder (double-click index.html),
// for previewing on a computer without running a server. Run `npm run offline` after `npm run build`.
// Output: offline/vellum-site/ (git-ignored).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const src = join(root, '.vercel/output/static');
const out = join(root, 'offline/vellum-site');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let html = readFileSync(join(src, 'index.html'), 'utf8');

// Browsers will not load web fonts from local files, so embed them in the page.
html = html.replace(/<link rel="?preload"? href="?\/fonts\/[^>]*>/g, '');
for (const f of ['Geist-400', 'Geist-500', 'GeistMono-400']) {
  const data = readFileSync(join(root, 'public/fonts', `${f}.woff2`)).toString('base64');
  html = html.replaceAll(`url(/fonts/${f}.woff2)`, `url(data:font/woff2;base64,${data})`);
}

// Root-relative asset paths become folder-relative.
html = html.replaceAll('/_astro/', './_astro/').replaceAll('href="/favicon.svg"', 'href="./favicon.svg"');

const files = new Set([...html.matchAll(/\.\/(_astro\/[^\s"'),]+|favicon\.svg)/g)].map((m) => m[1]));
for (const f of files) {
  mkdirSync(join(out, dirname(f)), { recursive: true });
  copyFileSync(join(src, f), join(out, f));
}
writeFileSync(join(out, 'index.html'), html);
writeFileSync(
  join(out, 'README.txt'),
  `Vellum website: offline preview of the Home page

Open index.html in Chrome, Safari, Firefox or Edge (double-click it).
Everything works offline: images, fonts, menu, tabs, filter, ticker and animations.

Not in this preview:
- The Project journal page (still to be built), so its links go nowhere yet.
- The enquiry form cannot send from a local file; it shows an error. It works on the live site.
- The /keystatic editor needs the full project running (see the repository README).
`,
);
console.log(`offline/vellum-site: index.html + ${files.size} files`);
