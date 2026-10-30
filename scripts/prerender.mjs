// Pré-renderização: depois do `vite build`, abre cada página do dist/ num Chrome sem janela e grava no HTML o
// conteúdo que o React monta em <div id="root">. O <head> (título, meta, OG, JSON-LD) NÃO é tocado.
// O React continua montando por cima com createRoot (sem hidratação), então nada muda para quem navega.
//
// Uso:  npm run build:ssg          (vite build + este script)
//       node scripts/prerender.mjs [filtro-de-caminho]
// Variáveis: CHROME_PATH (caminho do Chrome), PRERENDER=off (pula tudo), PRERENDER_STRICT=1 (falha se algo ficar sem pré-render),
//            PRERENDER_CONCURRENCY (padrão 4).
// Regras (docs/PLANO-PRE-RENDER.md): viewport desktop (cards completos no HTML), sem rede externa, feed da agenda
// "pendurado" (a página fica em "carregando", sem datas velhas), aviso de cookies removido, nada de GA.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

if (process.env.PRERENDER === 'off') {
  console.log('PRERENDER=off: pré-renderização ignorada.');
  process.exit(0);
}

const DIST = path.resolve('dist');
const STRICT = process.env.PRERENDER_STRICT === '1';
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 4);
const FILTER = process.argv[2];
const TIMEOUT = 20000;

const chrome = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('Chrome não encontrado: defina CHROME_PATH.');
  process.exit(STRICT ? 1 : 0);
}

// ── servidor estático do dist/ (porta efêmera) ─────────────────────────────
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'text/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(DIST, p);
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404, { 'content-type': MIME['.html'] }).end(fs.existsSync(path.join(DIST, '404.html')) ? fs.readFileSync(path.join(DIST, '404.html')) : 'Not found'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

// ── páginas ────────────────────────────────────────────────────────────────
const walk = (d, out = []) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p, out) : out.push(p); } return out; };
const pages = walk(DIST)
  .filter((f) => f.endsWith(`${path.sep}index.html`) || f === path.join(DIST, 'index.html'))
  .map((f) => ({ file: f, url: '/' + path.relative(DIST, path.dirname(f)).split(path.sep).join('/') + '/' }))
  .map((p) => ({ ...p, url: p.url === '//' ? '/' : p.url }))
  .filter((p) => !FILTER || p.url.includes(FILTER))
  .sort((a, b) => a.url.localeCompare(b.url));

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] });
const report = [];

async function render(p) {
  const html = fs.readFileSync(p.file, 'utf8');
  const row = { url: p.url, status: 'ok', notes: [] };
  if (!html.includes('<div id="root"></div>')) {
    row.status = 'pulada';
    row.notes.push('sem <div id="root"> vazio (página estática ou já pré-renderizada)');
    return row;
  }
  const lang = /<html[^>]*lang="([^"]+)"/.exec(html)?.[1] || 'pt-BR';
  const context = await browser.createBrowserContext(); // perfil limpo: sem localStorage, sem consentimento
  const page = await context.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.emulateTimezone('America/Sao_Paulo');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setExtraHTTPHeaders({ 'Accept-Language': lang });
    await page.setRequestInterception(true);
    const external = new Set();
    page.on('request', (req) => {
      const u = new URL(req.url());
      if (u.origin === ORIGIN) return req.continue();
      if (u.hostname === 'webhook.ivana.academy') return; // feed da agenda e formulários: nunca responde (a página fica em "carregando")
      external.add(u.hostname);
      req.abort('blockedbyclient');
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message || e).slice(0, 160)));

    await page.goto(ORIGIN + p.url, { waitUntil: 'load', timeout: TIMEOUT });
    await page.waitForFunction(() => (document.getElementById('root')?.children.length || 0) > 0, { timeout: TIMEOUT });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 500)); // efeitos de montagem

    const out = await page.evaluate(() => {
      const root = document.getElementById('root');
      // o aviso de cookies não é conteúdo da página
      root.querySelectorAll('[role="dialog"][aria-labelledby="consent-title"]').forEach((e) => e.remove());
      return { html: root.innerHTML, h1: root.querySelectorAll('h1').length, text: root.innerText.replace(/\s+/g, ' ').trim().length, main: !!root.querySelector('main') };
    });

    if (errors.length) row.notes.push(`erro de JS: ${errors[0]}`);
    if (out.h1 !== 1) row.notes.push(`${out.h1} h1 (esperado 1)`);
    if (out.text < 300) row.notes.push(`pouco texto (${out.text} caracteres)`);
    if (!out.main) row.notes.push('sem <main>');
    if (/googletagmanager|gtag\(|G-[A-Z0-9]{8,}|consent-title/.test(out.html)) row.notes.push('GA ou aviso de cookies no HTML pré-renderizado');
    if (row.notes.length) row.status = 'aviso';
    if (row.status === 'aviso' && out.text < 300) { row.status = 'falhou'; return row; } // não grava página vazia

    fs.writeFileSync(p.file, html.replace('<div id="root"></div>', `<div id="root" data-prerendered="1">${out.html}</div>`));
    row.chars = out.text;
    row.kb = Math.round(fs.statSync(p.file).size / 1024);
    row.blocked = [...external].sort().join(', ');
  } catch (e) {
    row.status = 'falhou';
    row.notes.push(String(e.message || e).slice(0, 160));
  } finally {
    await context.close();
  }
  return row;
}

const queue = [...pages];
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  while (queue.length) {
    const p = queue.shift();
    const row = await render(p);
    report.push(row);
    console.log(`${row.status === 'ok' ? '✓' : row.status === 'pulada' ? '·' : row.status === 'aviso' ? '!' : '✗'} ${row.url}${row.kb ? `  ${row.kb} KB, ${row.chars} car.` : ''}${row.notes.length ? `  [${row.notes.join('; ')}]` : ''}`);
  }
}));

await browser.close();
server.close();
report.sort((a, b) => a.url.localeCompare(b.url));
fs.writeFileSync('prerender-report.json', JSON.stringify({ generatedAt: new Date().toISOString(), pages: report }, null, 2));
const bad = report.filter((r) => r.status === 'falhou' || r.status === 'aviso');
console.log(`\nPré-renderização: ${report.filter((r) => r.status === 'ok').length} ok, ${bad.length} com aviso/falha, ${report.filter((r) => r.status === 'pulada').length} puladas (relatório: prerender-report.json)`);
if (STRICT && bad.length) process.exit(1);
