// Confere, na tienda real, se a URL de cada carrera (url_key do nome oficial) responde 200.
// Uso: npm run check:tienda  (precisa de rede; não roda no CI)
// Mantenha o slug igual ao de `tiendaSlug` em src/app/data/carreras_ar.ts.
import { readFileSync } from 'node:fs';

const BASE = (process.env.VITE_TIENDA_AR_URL || 'https://tienda.ivana.academy').replace(/\/+$/, '');
const src = readFileSync(new URL('../src/app/data/carreras_ar.ts', import.meta.url), 'utf8');
const slug = (n) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const nombres = [...src.matchAll(/^\s+nombre: "([^"]+)"/gm)].map((m) => m[1]);

let fail = 0;
for (const n of nombres) {
  const url = `${BASE}/${slug(n)}.html`;
  const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
  const ok = res.status === 200;
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${res.status} ${url}`);
}
if (nombres.length === 0) { console.error('✗ nenhum nombre encontrado em carreras_ar.ts'); process.exit(1); }
process.exit(fail ? 1 : 0);
