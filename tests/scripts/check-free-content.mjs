// Confere o conteúdo gratuito (data/free_content.ts) e o proxy do Nginx (05-webhook-proxy.sh).
// Uso: npm run check:free  (roda no CI junto de check:urls). Usa o esbuild (já vem com o Vite) para ler o .ts.
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { transform } from 'esbuild';

const root = new URL('../../', import.meta.url).pathname;
const errors = [];
const err = (m) => errors.push(m);

// ── dados ──
const js = (await transform(readFileSync(join(root, 'src/app/data/free_content.ts'), 'utf8'), { loader: 'ts', format: 'esm' })).code;
const { free_items, free_categories, free_types, free_text } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const ids = new Set();
for (const i of free_items) {
  const w = `item "${i.id}"`;
  if (ids.has(i.id)) err(`${w}: id repetido`);
  ids.add(i.id);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.id)) err(`${w}: id deve ser slug minúsculo com hífen (vira #hash)`);
  if (!['BR', 'AR'].includes(i.country)) err(`${w}: country inválido`);
  if (!free_categories[i.category]) err(`${w}: categoria desconhecida "${i.category}"`);
  if (!free_types[i.type]) err(`${w}: tipo desconhecido "${i.type}"`);
  if (!i.title?.trim()) err(`${w}: sem título`);
  if (!existsSync(join(root, 'public', i.image))) err(`${w}: imagem ausente (${i.image})`);
  if (i.type === 'video') {
    if (!/^[A-Za-z0-9_-]{11}$/.test(i.youtubeId ?? '')) err(`${w}: youtubeId inválido`);
  } else if (i.href || i.youtubeId) err(`${w}: apostila/recurso não leva link no código (o n8n envia por e-mail)`);
}
const yt = free_items.filter((i) => i.youtubeId).map((i) => i.youtubeId);
if (new Set(yt).size !== yt.length) err('youtubeId repetido entre itens');
for (const c of ['BR', 'AR']) if (!free_items.some((i) => i.country === c)) err(`país ${c} sem conteúdo`);
for (const l of ['pt', 'es']) for (const k of Object.keys(free_text.pt)) if (!free_text[l][k]) err(`texto "${k}" vazio em ${l}`);

// ── proxy do Nginx: segredo só no arquivo gerado, validações de entrada ──
const script = join(root, '.devcontainer/nginx/docker-entrypoint.d/05-webhook-proxy.sh');
const outDir = mkdtempSync(join(tmpdir(), 'free-proxy-')); // nunca escreve em /tmp/*.conf reais
const run = (env) => {
  const r = spawnSync('sh', [script], { env: { PATH: process.env.PATH, PROXY_OUT_DIR: outDir, ...env }, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const SECRET = 'a'.repeat(32);
const base = { WEBHOOK_SECRET: SECRET };
let r = run({ ...base, FREE_CONTENT_WEBHOOK_SECRET: 'curto' });
if (r.code === 0) err('proxy: aceitou FREE_CONTENT_WEBHOOK_SECRET curto');
r = run({ ...base, FREE_CONTENT_WEBHOOK_SECRET: 'x'.repeat(30) + ';}' });
if (r.code === 0) err('proxy: aceitou caracteres que injetariam diretiva no Nginx');
r = run({ ...base, FREE_CONTENT_WEBHOOK_SECRET: SECRET, N8N_FREE_CONTENT_UPSTREAM: 'ftp://x' });
if (r.code === 0) err('proxy: aceitou upstream que não é http(s)');
r = run({ ...base, FREE_CONTENT_WEBHOOK_SECRET: SECRET });
if (r.code !== 0) err(`proxy: configuração válida falhou: ${r.out}`);
if (r.out.includes(SECRET)) err('proxy: segredo apareceu na saída do script');
const gen = join(outDir, 'free-content-proxy.conf');
if (existsSync(gen)) {
  const c = readFileSync(gen, 'utf8');
  if (!c.includes('X-Webhook-Secret') || !c.includes('proxy_pass $n8n_free_upstream')) err('proxy: arquivo gerado incompleto');
  if (!c.includes('proxy_set_header Cookie           ""')) err('proxy: não removeu o Cookie do cliente');
}
r = run({ ...base });
if (r.code !== 0 || !existsSync(gen) || !readFileSync(gen, 'utf8').includes('return 503')) err('proxy: sem segredo deveria responder 503 (e não derrubar o container)');

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`✓ conteúdo gratuito ok: ${free_items.length} itens (${yt.length} vídeos), proxy do Nginx validado.`);
