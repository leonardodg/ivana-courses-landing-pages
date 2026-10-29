// Gera as imagens de prévia de link (1200x630 JPG) de public/images/og/ a partir de scripts/og/pages.mjs.
// Uso: node scripts/og/generate.mjs [filtro]   (Chrome do Mac, ou CHROME_PATH, ou google-chrome no Linux/CI)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { og_pages } from './pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pub = (p) => pathToFileURL(path.join(root, 'public', p)).href;
const nm = (p) => pathToFileURL(path.join(root, 'node_modules', p)).href;
const out = path.join(root, 'public/images/og');
const filter = process.argv[2];

const chrome = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!chrome) throw new Error('Chrome não encontrado: defina CHROME_PATH');

const html = (p) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Caslon";src:url("${nm('@fontsource/libre-caslon-text/files/libre-caslon-text-latin-400-normal.woff2')}");font-style:normal}
@font-face{font-family:"Caslon";src:url("${nm('@fontsource/libre-caslon-text/files/libre-caslon-text-latin-400-italic.woff2')}");font-style:italic}
@font-face{font-family:"Jakarta";src:url("${nm('@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2')}");font-weight:200 800}
@font-face{font-family:"Mono";src:url("${nm('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}");font-weight:100 800}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#FCF9F5;font-family:Jakarta,sans-serif;color:#1C1C1A;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(60% 80% at 0% 0%,#F7EFE4,transparent 70%),radial-gradient(50% 60% at 100% 100%,rgba(217,161,160,.25),transparent 70%)}
.photo{position:absolute;right:0;top:0;width:500px;height:630px;background:url("${pub(p.photo)}") ${p.pos}/cover no-repeat}
.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#FCF9F5 0%,rgba(252,249,245,0) 38%)}
.copy{position:absolute;left:72px;top:64px;bottom:64px;width:660px;display:flex;flex-direction:column}
.logo{height:52px;width:auto;align-self:flex-start;margin-bottom:auto}
.kicker{font-family:Mono;font-size:20px;font-weight:700;letter-spacing:.16em;color:#805252;text-transform:uppercase;margin-bottom:18px}
h1{font-family:Caslon,serif;font-weight:400;font-size:${p.title.replace(/<[^>]+>/g, '').length > 40 ? 54 : p.title.replace(/<[^>]+>/g, '').length > 30 ? 62 : 68}px;line-height:1.06;letter-spacing:-.02em;margin-bottom:22px}
h1 em{color:#805252;font-style:italic}
.sub{font-size:26px;line-height:1.35;color:#514443;font-weight:500;max-width:560px}
.foot{display:flex;align-items:center;gap:18px;margin-top:34px}
.pill{font-family:Mono;font-size:18px;font-weight:600;letter-spacing:.06em;color:#805252;background:#fff;border:1px solid #E1DEDA;border-radius:999px;padding:8px 18px}
.seal{height:56px;width:auto;border-radius:12px;background:#805252;padding:8px 12px}
</style></head><body><div class="bg"></div><div class="photo"></div>
<div class="copy"><img class="logo" src="${pub('/images/logo.svg')}"><div class="kicker">${p.kicker}</div><h1>${p.title}</h1><p class="sub">${p.sub}</p>
<div class="foot"><span class="pill">courses.ivana.academy</span>${p.seal ? `<img class="seal" src="${pub('/images/ar/grassi-logo.png')}">` : ''}</div></div></body></html>`;

fs.mkdirSync(out, { recursive: true });
const tmp = path.join(root, 'scripts/og/.tmp.html');
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files', '--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
let n = 0;
for (const p of og_pages) {
  if (filter && !p.file.includes(filter)) continue;
  fs.writeFileSync(tmp, html(p));
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  let q = 86, buf;
  do { buf = await page.screenshot({ type: 'jpeg', quality: q }); q -= 6; } while (buf.length > 190 * 1024 && q > 50);
  fs.writeFileSync(path.join(out, `${p.file}.jpg`), buf);
  console.log(`${p.file}.jpg  ${Math.round(buf.length / 1024)} KB`);
  n++;
}
fs.rmSync(tmp, { force: true });
await browser.close();
console.log(`${n} imagens em public/images/og/`);
