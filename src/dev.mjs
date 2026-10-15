// Servidor local con recarga del build al guardar cambios.
// Uso: npm run dev  →  http://localhost:4321

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;
const watchMode = !process.argv.includes('--no-watch');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.pdf': 'application/pdf', '.xml': 'application/xml',
  '.txt': 'text/plain', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const build = () => spawnSync(process.execPath, [join(ROOT, 'src/build.mjs')], { stdio: 'inherit' });
build();

if (watchMode) {
  let timer;
  for (const dir of ['content', 'src', 'public'])
    watch(join(ROOT, dir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(build, 150);
    });
}

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(DIST, path);
  if (!file.startsWith(DIST)) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'No encontrado'));
  }
}).listen(PORT, () => console.log(`\nVista previa en http://localhost:${PORT}`));
