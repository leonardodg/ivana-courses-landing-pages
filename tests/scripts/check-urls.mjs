// Confere as URLs do site construído (dist/). Rode depois de `npm run build`:  npm run check:urls
// Falha (exit 1) se achar: canonical errado, hreflang sem página ou sem retorno, link interno quebrado
// (no HTML e nos textos de src/), URL do sitemap inexistente, página fora do sitemap ou caminho antigo
// (/pt_br/, /es_ar/) em uso. Ver docs/URLS.md.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const SRC = path.resolve('src');
const SITE = 'https://courses.ivana.academy';
const errors = [];
const err = (m) => errors.push(m);

const walk = (dir, out = []) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    fs.statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};

// URL pública (caminho) de cada HTML do dist
const pages = new Map(); // urlPath -> file
for (const f of walk(DIST)) {
  if (!f.endsWith('index.html')) continue;
  const rel = path.relative(DIST, path.dirname(f)).split(path.sep).join('/');
  pages.set(rel ? `/${rel}/` : '/', f);
}

const exists = (urlPath) => {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (pages.has(clean.endsWith('/') ? clean : `${clean}/`) && !path.extname(clean)) return true;
  const file = path.join(DIST, clean);
  return fs.existsSync(file) && fs.statSync(file).isFile();
};

const attr = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const htmlCache = new Map();
const read = (f) => (htmlCache.has(f) ? htmlCache.get(f) : (htmlCache.set(f, fs.readFileSync(f, 'utf8')), htmlCache.get(f)));

// 1) canonical e hreflang
for (const [url, file] of pages) {
  const html = read(file);
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/g)[0];
  if (canonical && canonical !== SITE + url) err(`${url}: canonical é ${canonical}, esperado ${SITE + url}`);
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }));
  if (alts.length) {
    if (!alts.some((a) => a.href === SITE + url) && !alts.some((a) => a.lang === 'x-default' && a.href === SITE + url)) {
      err(`${url}: hreflang não aponta para a própria página`);
    }
    for (const a of alts) {
      if (!a.href.startsWith(SITE)) { err(`${url}: hreflang fora do domínio: ${a.href}`); continue; }
      const target = a.href.slice(SITE.length);
      if (!pages.has(target)) { err(`${url}: hreflang ${a.lang} aponta para página inexistente ${target}`); continue; }
      if (a.lang === 'x-default') continue;
      const back = [...read(pages.get(target)).matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => m[2]);
      if (!back.includes(SITE + url)) err(`${target}: não devolve hreflang para ${url} (link não recíproco)`);
    }
  }
}

// 2) links internos no HTML estático (href/src absolutos do site)
for (const [url, file] of pages) {
  const html = read(file);
  for (const v of attr(html, /(?:href|src)="(\/[^"]*)"/g)) {
    if (v.startsWith('//')) continue;
    if (!exists(v)) err(`${url}: link interno quebrado ${v}`);
  }
}

// Arquivos opcionais: o componente funciona sem eles (o selo do herói some se o logo não existir).
const OPTIONAL = new Set(['/images/ar/grassi-logo.png']);

// 3) caminhos escritos nos arquivos de src/ (links dos componentes React)
for (const f of walk(SRC)) {
  if (!/\.(tsx?|html)$/.test(f)) continue;
  const rel = path.relative(process.cwd(), f);
  const txt = fs.readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/['"`](\/(?:pt-br|es-ar|images|assets)\/[A-Za-z0-9\-_/.#?=&%]*)['"`]/g)) {
    if (/\$\{/.test(m[1]) || /\.tsx?$/.test(m[1])) continue; // template ou módulo de origem (<script src="…/main.tsx">)
    if (!OPTIONAL.has(m[1]) && !exists(m[1])) err(`${rel}: caminho inexistente ${m[1]}`);
  }
  for (const m of txt.matchAll(/['"`](\/(?:agenda|interest|links|velas|saboaria|apostila)\/?)['"`]/g)) err(`${rel}: caminho ANTIGO ${m[1]}`);
  if (/\/(pt_br|es_ar)\//.test(txt) && !rel.includes('check-urls')) err(`${rel}: ainda usa /pt_br/ ou /es_ar/`);
}

// 4) sitemaps
const sitemapFiles = walk(DIST).filter((f) => /sitemap[^/]*\.xml$/.test(f));
const inSitemap = new Set();
for (const f of sitemapFiles) {
  const xml = fs.readFileSync(f, 'utf8');
  if (xml.includes('<sitemapindex')) {
    for (const loc of attr(xml, /<loc>([^<]+)<\/loc>/g)) {
      if (!loc.startsWith(SITE) || !fs.existsSync(path.join(DIST, loc.slice(SITE.length)))) err(`sitemap.xml: filho inexistente ${loc}`);
    }
    continue;
  }
  for (const loc of attr(xml, /<loc>([^<]+)<\/loc>/g)) {
    if (!loc.startsWith(SITE) || !pages.has(loc.slice(SITE.length))) err(`${path.basename(f)}: URL inexistente ${loc}`);
    else inSitemap.add(loc.slice(SITE.length));
  }
}
const NOT_INDEXED = (u) => /^\/(pt-br|es-ar)\/links\/$/.test(u);
for (const url of pages.keys()) if (!inSitemap.has(url) && !NOT_INDEXED(url)) err(`${url}: página fora do sitemap`);

// 5) restos antigos no build
for (const f of walk(DIST)) {
  if (!/\.(html|js|xml|txt)$/.test(f)) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (/(["'(\s=])\/(pt_br|es_ar)\//.test(t) || /academy\/(pt_br|es_ar)\//.test(t)) err(`${path.relative(DIST, f)}: ainda cita /pt_br/ ou /es_ar/`);
}

// 6) prévia de link (WhatsApp, Facebook, LinkedIn, X): og:image em JPG/PNG 1200x630, até 300 KB, com tipo, largura, altura e alt
const jpegSize = (buf) => {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
};
for (const [url, file] of pages) {
  if (NOT_INDEXED(url) || url === '/404/') continue;
  const html = read(file);
  const img = attr(html, /property="og:image"\s+content="([^"]+)"/g)[0];
  if (!img) { err(`${url}: sem og:image`); continue; }
  if (!img.startsWith(`${SITE}/`)) { err(`${url}: og:image precisa de URL absoluta em ${SITE} (${img})`); continue; }
  const local = path.join(DIST, img.slice(SITE.length));
  if (!/\.(jpe?g|png)$/i.test(local)) err(`${url}: og:image deve ser JPG ou PNG, não WebP (${img})`);
  if (!fs.existsSync(local)) { err(`${url}: og:image não existe no build (${img})`); continue; }
  const buf = fs.readFileSync(local);
  if (buf.length > 300 * 1024) err(`${url}: og:image com ${Math.round(buf.length / 1024)} KB (máximo 300 KB)`);
  if (/\.jpe?g$/i.test(local)) {
    const d = jpegSize(buf);
    if (!d || d.w !== 1200 || d.h !== 630) err(`${url}: og:image deve ter 1200x630 (tem ${d ? `${d.w}x${d.h}` : '?'})`);
  }
  for (const k of ['type', 'width', 'height', 'alt']) if (!new RegExp(`property="og:image:${k}"`).test(html)) err(`${url}: falta og:image:${k}`);
  if (!/name="twitter:card"\s+content="summary_large_image"/.test(html)) err(`${url}: twitter:card deve ser summary_large_image`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ URLs ok: ${pages.size} páginas, ${inSitemap.size} no sitemap, hreflang e links internos conferidos.`);
