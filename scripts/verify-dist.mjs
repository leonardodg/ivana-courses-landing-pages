// Verificações do dist/ antes de publicar (rodam no CI e podem ser rodadas localmente: node scripts/verify-dist.mjs).
// Falham o deploy se: página React sem pré-render, GA ou aviso de cookies no HTML, preço na Argentina,
// h1/JSON-LD fora do esperado, source map ou arquivo temporário no dist, arquivo essencial ausente.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const errors = [];
const err = (m) => errors.push(m);
const walk = (d, out = []) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p, out) : out.push(p); } return out; };
const files = walk(DIST);
const rel = (f) => path.relative(DIST, f).split(path.sep).join('/');

for (const must of ['index.html', '404.html', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'sitemap-pt-br.xml', 'sitemap-es-ar.xml']) {
  if (!fs.existsSync(path.join(DIST, must))) err(`falta ${must}`);
}
for (const f of files) {
  const r = rel(f);
  if (/\.map$/.test(r) || /(^|\/)\.DS_Store$/.test(r) || /(^|\/)__audit/.test(r) || /\.tmp\.html$/.test(r)) err(`${r}: arquivo que não deve ir para produção`);
}

let prerendered = 0, reactPages = 0;
for (const f of files.filter((x) => x.endsWith('index.html'))) {
  const r = rel(f);
  const html = fs.readFileSync(f, 'utf8');
  if (/googletagmanager|gtag\(|G-[A-Z0-9]{8,}/.test(html)) err(`${r}: GA no HTML`);
  if (html.includes('consent-title')) err(`${r}: aviso de cookies no HTML pré-renderizado`);
  if (!html.includes('id="root"')) continue; // página estática (links)
  reactPages++;
  if (!html.includes('data-prerendered="1"')) { err(`${r}: sem pré-renderização`); continue; }
  prerendered++;
  const body = html.slice(html.indexOf('data-prerendered'));
  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`${r}: ${h1} h1 no HTML pré-renderizado (esperado 1)`);
  const ld = (html.match(/application\/ld\+json/g) || []).length;
  if (ld > 1) err(`${r}: ${ld} blocos JSON-LD (esperado no máximo 1)`);
  if (r.startsWith('es-ar/') && /(\$\s?\d|ARS\s?\d|R\$\s?\d)/.test(html)) err(`${r}: preço no HTML da Argentina`);
}
if (reactPages < 29) err(`esperadas 29 páginas React, achei ${reactPages}`);

if (errors.length) {
  console.error(`✗ verify-dist: ${errors.length} problema(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ verify-dist: ${prerendered}/${reactPages} páginas pré-renderizadas, sem GA, aviso de cookies ou preço da Argentina no HTML.`);
