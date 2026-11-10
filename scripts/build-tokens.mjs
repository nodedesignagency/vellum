// Turns design-system/tokens.json into src/styles/tokens.css.
// Runs before `npm run dev` and `npm run build`, so the site always uses the current tokens.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const tokens = JSON.parse(await readFile(new URL('design-system/tokens.json', root), 'utf8'));

const day = [];
const night = [];

for (const t of tokens.color.tokens) {
  if (typeof t.value === 'string') {
    day.push(`--${t.name}:${t.value}`);
  } else {
    day.push(`--${t.name}:${t.value.day}`);
    night.push(`--${t.name}:${t.value.night}`);
  }
}
for (const [name, stack] of Object.entries(tokens.type.families)) day.push(`--font-${name}:${stack}`);
for (const group of ['spacing', 'radius', 'size']) {
  for (const t of tokens[group].tokens) day.push(`--${t.name}:${t.value}`);
}

const css = `/* Generated from design-system/tokens.json by scripts/build-tokens.mjs. Edit the JSON, not this file. */
:root{
  ${day.join(';\n  ')};
}
/* Night (brand) theme: for after-dark pages. The website itself uses Day. */
[data-theme="night"]{
  ${night.join(';\n  ')};
}
`;

await mkdir(new URL('src/styles/', root), { recursive: true });
await writeFile(new URL('src/styles/tokens.css', root), css);
console.log(`tokens.css: ${day.length} day tokens, ${night.length} night overrides`);
