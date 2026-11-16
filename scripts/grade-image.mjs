// Gives a photo the site's champagne-gold grade and saves it as a JPEG for src/assets.
//
//   node scripts/grade-image.mjs <in.png|jpg> <out.jpg> [--max 2400] [--match] [--no-grade]
//
// Two ways to grade, both landing on the look of the site's photos (lit areas about 207,167,111, near the logo's
// #e8c391; shadows near black):
//
// default   For Magnific renders that already went through the amber edit ("make every light a rich warm golden
//           yellow, about 2200K"), which come out at about 216,153,44 in the lit areas. A curve fitted from those
//           renders against the graded copies the site shipped with (least squares, RGB polynomial up to cubic;
//           within about 2 to 4 levels in 255 on photos it was not fitted on).
// --match   For any other photo. Works in Lab: for each lightness, moves the photo's colour to the colour the site's
//           graded photos have at that lightness, keeping 40% of the photo's own variation around it (so a navy
//           sky stays navy). The reference photos are listed in REFS below.
//
// Drawings were never graded: pass --no-grade. --max caps the longest side. Needs only sharp (installed by Astro).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const W = [
  [0.001654, 0.001419, 0.011499], [0.915701, 0.22651, 0.023457], [0.202116, 0.733659, 0.053976],
  [-0.036647, -0.003344, 0.662683], [-0.257076, -0.286739, -1.27037], [-2.207141, -3.955888, -6.463349],
  [-0.738472, -0.422053, 0.33376], [1.699305, 3.574512, 7.829551], [-1.411093, -2.591187, -3.955073],
  [2.132865, 3.901695, 5.003008], [-0.005441, -0.310878, -0.617442], [0.482573, 0.358866, 0.027704],
  [0.284616, -0.270643, -0.823303],
];
// graded photos whose colour --match copies (paths from the project root)
const REFS = [
  'src/assets/projects/harbour-hotel/cover.jpg',
  'src/assets/projects/gallery-house/cover.jpg',
  'src/assets/projects/north-gallery/cover.jpg',
  'src/assets/projects/atelier-offices/cover.jpg',
  'src/assets/home/hero.jpg',
];
const KEEP = 0.4; // share of the photo's own colour variation kept by --match
const BINS = 25;

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/grade-image.mjs <in> <out.jpg> [--max 2400] [--match] [--no-grade]');
  process.exit(1);
}
const max = rest.includes('--max') ? Number(rest[rest.indexOf('--max') + 1]) : 0;
const mode = rest.includes('--no-grade') ? 'none' : rest.includes('--match') ? 'match' : 'curve';

// sRGB <-> Lab (D65)
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const fl = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
function toLab(r, g, b) {
  r = lin(r); g = lin(g); b = lin(b);
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const fx = fl(x), fy = fl(y), fz = fl(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function fromLab(L, a, bb) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - bb / 200;
  const x = fi(fx) * 0.95047, y = fi(fy), z = fi(fz) * 1.08883;
  const r = 3.2406 * x - 1.5372 * y - 0.4986 * z;
  const g = -0.9689 * x + 1.8758 * y + 0.0415 * z;
  const b = 0.0557 * x - 0.204 * y + 1.057 * z;
  return [r, g, b].map((v) => Math.max(0, Math.min(1, gam(Math.max(0, v)))));
}
// mean a and b for each lightness band
function profile(data) {
  const n = new Float64Array(BINS), A = new Float64Array(BINS), B = new Float64Array(BINS);
  for (let i = 0; i < data.length; i += 3) {
    const [L, a, b] = toLab(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
    const k = Math.min(BINS - 1, Math.floor((L / 100) * BINS));
    n[k]++; A[k] += a; B[k] += b;
  }
  // fill empty bands from their neighbours so every lightness has a target
  const out = [];
  for (let k = 0; k < BINS; k++) out.push(n[k] ? [A[k] / n[k], B[k] / n[k]] : null);
  for (let k = 0; k < BINS; k++) if (!out[k]) {
    let j = 1;
    while (!out[k - j] && !out[k + j] && j < BINS) j++;
    out[k] = out[k - j] ?? out[k + j] ?? [0, 0];
  }
  return out;
}
const at = (prof, L) => {
  const x = Math.max(0, Math.min(BINS - 1, (L / 100) * BINS - 0.5));
  const k = Math.floor(x), t = x - k, k2 = Math.min(BINS - 1, k + 1);
  return [prof[k][0] * (1 - t) + prof[k2][0] * t, prof[k][1] * (1 - t) + prof[k2][1] * t];
};

let img = sharp(input).removeAlpha().toColourspace('srgb');
if (max) img = img.resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

if (mode === 'curve') {
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const f = [1, r, g, b, r * r, g * g, b * b, r * g, r * b, g * b, r * r * r, g * g * g, b * b * b];
    for (let c = 0; c < 3; c++) {
      let v = 0;
      for (let k = 0; k < 13; k++) v += f[k] * W[k][c];
      data[i + c] = Math.max(0, Math.min(255, Math.round(v * 255)));
    }
  }
} else if (mode === 'match') {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const refPixels = [];
  for (const ref of REFS) {
    const r = await sharp(root + ref).removeAlpha().resize({ width: 400 }).raw().toBuffer();
    refPixels.push(r);
  }
  const target = profile(Buffer.concat(refPixels));
  const small = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).resize({ width: 400 }).raw().toBuffer();
  const source = profile(small);
  for (let i = 0; i < data.length; i += 3) {
    const [L, a, b] = toLab(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
    const [sa, sb] = at(source, L), [ta, tb] = at(target, L);
    const rgb = fromLab(L, ta + KEEP * (a - sa), tb + KEEP * (b - sb));
    data[i] = Math.round(rgb[0] * 255); data[i + 1] = Math.round(rgb[1] * 255); data[i + 2] = Math.round(rgb[2] * 255);
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } })
  .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(output);
console.log(`${output}: ${info.width}x${info.height}${mode === 'none' ? '' : `, graded (${mode})`}`);
