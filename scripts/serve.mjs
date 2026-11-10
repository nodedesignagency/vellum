// A tiny local web server for the built site. No install needed, just Node (18 or later).
//   node scripts/serve.mjs                 serves the production build (.vercel/output/static), after `npm run build`
//   node scripts/serve.mjs preview         serves the ready-made copy in the handoff zip
//   node scripts/serve.mjs <folder> 8080   any folder, any port
// Then open the address it prints. Stop with Ctrl+C.
// The enquiry form gets the same "not connected yet" answer as the live site before email is set up.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || '.vercel/output/static');
const port = Number(process.argv[3] || process.env.PORT || 4322);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
};

try {
  await stat(join(root, 'index.html'));
} catch {
  console.error(`No index.html in ${root}.\nRun "npm run build" first, or pass the folder to serve, e.g. node scripts/serve.mjs preview`);
  process.exit(1);
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname.startsWith('/api/enquiry')) {
    res.writeHead(503, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ ok: false, reason: 'not-connected' }));
  }
  let path = normalize(join(root, decodeURIComponent(url.pathname)));
  if (path !== root && !path.startsWith(root + sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': types[extname(path).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Vellum site: http://localhost:${port}/  (Project journal: http://localhost:${port}/project/)`);
  console.log('Press Ctrl+C to stop.');
});
