// Fase 2 do plano de pré-render: PARIDADE do texto e DESEMPENHO (FCP, LCP, CLS) com e sem pré-renderização.
// Uso:  node scripts/prerender-audit.mjs --base /caminho/dist-sem-prerender --pre dist [--runs 3] [--pages /pt-br/,/es-ar/]
//   1. Paridade: texto do HTML cru (sem JavaScript) x texto da página montada (desktop e celular).
//   2. Desempenho no celular simulado (390x844, CPU 4x mais lenta, rede 4G lenta), mediana de N execuções.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const BASE = path.resolve(arg('base', 'dist-base'));
const PRE = path.resolve(arg('pre', 'dist'));
const RUNS = Number(arg('runs', 3));
const PAGES = arg('pages', '/pt-br/,/es-ar/,/pt-br/cursos/velas/,/es-ar/carreras/tecnicatura-macrame/,/pt-br/cursos/online/velas-aromaticas/,/pt-br/interesse/,/pt-br/agenda/').split(',');
const chrome = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'text/xml', '.webmanifest': 'application/manifest+json' };
const serve = (dir) => new Promise((resolve) => {
  const s = http.createServer((req, res) => {
    let f = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404).end('nf'); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }).end(fs.readFileSync(f));
  });
  s.listen(0, '127.0.0.1', () => resolve({ s, origin: `http://127.0.0.1:${s.address().port}` }));
});
const [a, b] = [await serve(BASE), await serve(PRE)];
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--disable-gpu'] });

async function open(origin, url, { mobile = false, js = true, observe = false, throttle = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1280, height: 900 });
  await page.setJavaScriptEnabled(js);
  await page.setRequestInterception(true);
  page.on('request', (r) => { const u = new URL(r.url()); if (u.origin === origin) return r.continue(); if (u.hostname === 'webhook.ivana.academy') return; r.abort('blockedbyclient'); });
  if (observe) {
    await page.evaluateOnNewDocument(() => {
      window.__m = { cls: 0, lcp: 0, fcp: 0 };
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    });
  }
  if (throttle) {
    const c = await page.createCDPSession();
    await c.send('Network.enable');
    await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  await page.goto(origin + url, { waitUntil: 'load', timeout: 60000 });
  return { page, ctx };
}

const words = (t) => new Set(t.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2));
const text = (page) => page.evaluate(() => { const r = document.getElementById('root'); r?.querySelectorAll('[role="dialog"][aria-labelledby="consent-title"]').forEach((e) => e.remove()); return r ? r.innerText : ''; });
const jaccard = (x, y) => { let i = 0; for (const w of x) if (y.has(w)) i++; return i / (x.size + y.size - i || 1); };
const cover = (x, y) => { let i = 0; for (const w of x) if (y.has(w)) i++; return i / (x.size || 1); };
const median = (arr) => [...arr].sort((p, q) => p - q)[Math.floor(arr.length / 2)];

console.log('== 1. PARIDADE (HTML cru x página montada) ==');
console.log('página'.padEnd(58), 'cru→desktop', 'desktop→cru', 'cru→celular');
for (const url of PAGES) {
  const raw = await open(b.origin, url, { js: false });
  const A = words(await text(raw.page)); await raw.ctx.close();
  const d = await open(b.origin, url); await new Promise((r) => setTimeout(r, 1500));
  const D = words(await text(d.page)); await d.ctx.close();
  const m = await open(b.origin, url, { mobile: true }); await new Promise((r) => setTimeout(r, 1500));
  const M = words(await text(m.page)); await m.ctx.close();
  console.log(url.padEnd(58), `${(cover(A, D) * 100).toFixed(1)}%`.padStart(11), `${(cover(D, A) * 100).toFixed(1)}%`.padStart(12), `${(cover(A, M) * 100).toFixed(1)}%`.padStart(11), `(Jaccard ${(jaccard(A, D) * 100).toFixed(0)}%, ${A.size} palavras)`);
}

console.log('\n== 1b. HIDRATAÇÃO (erros do React ao assumir o HTML pré-renderizado, em desktop e celular) ==');
const all = fs.readdirSync(PRE, { recursive: true }).filter((f) => String(f).endsWith('index.html')).map((f) => '/' + String(f).replace(/index\.html$/, '')).filter((u) => u !== '//' && !/\/links\/$/.test(u));
let hydrationBad = 0;
for (const url of all) {
  for (const mobile of [false, true]) {
    const h = await open(b.origin, url, { mobile });
    await new Promise((r) => setTimeout(r, 1500));
    const info = await h.page.evaluate(() => ({ errs: window.__hydrationErrors || [], pre: document.getElementById('root')?.hasAttribute('data-prerendered'), h1: document.querySelectorAll('h1').length }));
    await h.ctx.close();
    if (info.errs.length || info.h1 !== 1) { hydrationBad++; console.log(`✗ ${url} (${mobile ? 'celular' : 'desktop'}): ${info.errs.length} erro(s), ${info.h1} h1  ${info.errs[0] || ''}`); }
  }
}
console.log(hydrationBad ? `${hydrationBad} combinação(ões) com problema` : `✓ ${all.length} páginas x 2 telas sem erro de hidratação`);

console.log(`\n== 2. DESEMPENHO no celular simulado (mediana de ${RUNS}; FCP/LCP em ms, CLS sem unidade) ==`);
console.log('página'.padEnd(58), 'variante'.padEnd(10), 'FCP'.padStart(6), 'LCP'.padStart(6), 'CLS'.padStart(7));
for (const url of PAGES) {
  for (const [name, srv] of [['sem', a], ['com', b]]) {
    const r = { fcp: [], lcp: [], cls: [] };
    for (let i = 0; i < RUNS; i++) {
      const { page, ctx } = await open(srv.origin, url, { mobile: true, observe: true, throttle: true });
      await new Promise((res) => setTimeout(res, 4500));
      const m = await page.evaluate(() => window.__m);
      r.fcp.push(m.fcp); r.lcp.push(m.lcp); r.cls.push(m.cls);
      await ctx.close();
    }
    console.log(url.padEnd(58), name.padEnd(10), String(Math.round(median(r.fcp))).padStart(6), String(Math.round(median(r.lcp))).padStart(6), median(r.cls).toFixed(3).padStart(7));
  }
}
await browser.close(); a.s.close(); b.s.close();
