// Atualiza os sitemaps de public/ com <lastmod> e <image:image> de cada página.
//   • lastmod  = data do último commit que mexeu nos arquivos DA PÁGINA (pasta em src/, JSON-LD e componente de página).
//                Só muda quando a página muda de verdade (o Google ignora lastmod que muda sempre).
//   • image    = a mesma imagem de prévia (og:image) do HTML da página.
// Uso: npm run sitemap   (depois confira `git diff public/sitemap-*.xml` e commite)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE = 'https://courses.ivana.academy';
const SRC = 'src';
const files = ['public/sitemap-global.xml', 'public/sitemap-pt-br.xml', 'public/sitemap-es-ar.xml'];

const git = (paths) => {
  const existing = paths.filter((p) => fs.existsSync(p));
  const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...existing], { encoding: 'utf8' }).trim();
  return out || new Date().toISOString().slice(0, 10);
};

// Arquivos que definem uma página: index.html e main.tsx da pasta, JSON-LD e o componente de página importado.
function pageFiles(urlPath) {
  const dir = path.join(SRC, urlPath.replace(/^\/|\/$/g, ''));
  const list = [path.join(dir, 'index.html'), path.join(dir, 'main.tsx')];
  const rel = path.relative(SRC, dir).split(path.sep).join('/');
  if (rel) list.push(path.join(SRC, 'app/seo/jsonld', `${rel}.json`));
  const html = fs.existsSync(list[0]) ? fs.readFileSync(list[0], 'utf8') : '';
  let entry = list[1];
  const script = html.match(/<script type="module" src="([^"]+)"/)?.[1];
  if (script) entry = script.startsWith('/') ? path.join(SRC, script) : path.join(dir, script);
  list.push(entry);
  if (fs.existsSync(entry)) {
    for (const m of fs.readFileSync(entry, 'utf8').matchAll(/from\s+['"]([^'"]*\/pages\/[^'"]+)['"]/g)) {
      const comp = path.resolve(path.dirname(entry), m[1]);
      list.push(path.relative('.', comp), `${path.relative('.', comp)}.tsx`);
    }
  }
  return { list, html };
}

for (const file of files) {
  let xml = fs.readFileSync(file, 'utf8');
  if (!xml.includes('xmlns:image=')) xml = xml.replace('<urlset ', '<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n        ');
  xml = xml.replace(/\s*<lastmod>[^<]*<\/lastmod>/g, '').replace(/\s*<image:image>[\s\S]*?<\/image:image>/g, '');
  xml = xml.replace(/<loc>([^<]+)<\/loc>/g, (all, loc) => {
    const urlPath = loc.replace(SITE, '') || '/';
    const { list, html } = pageFiles(urlPath);
    const img = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1];
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&/g, '&amp;');
    return `${all}\n    <lastmod>${git(list)}</lastmod>` + (img ? `\n    <image:image>\n      <image:loc>${img}</image:loc>${title ? `\n      <image:title>${title}</image:title>` : ''}\n    </image:image>` : '');
  });
  fs.writeFileSync(file, xml);
  console.log(`${file}: ${(xml.match(/<lastmod>/g) || []).length} URLs`);
}
