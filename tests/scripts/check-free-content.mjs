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
for (const i of free_items) if (i.moodleCourseId && i.type !== 'video') err(`item "${i.id}": só vídeo pode ter moodleCourseId`);
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
let r;
for (const [route, secretVar, upVar, file, nginxVar] of [
  ['free-content', 'FREE_CONTENT_WEBHOOK_SECRET', 'N8N_FREE_CONTENT_UPSTREAM', 'free-content-proxy.conf', '$n8n_free_upstream'],
  ['free-enroll', 'FREE_ENROLL_WEBHOOK_SECRET', 'N8N_FREE_ENROLL_UPSTREAM', 'free-enroll-proxy.conf', '$n8n_enroll_upstream'],
]) {
  r = run({ ...base, [secretVar]: 'curto' });
  if (r.code === 0) err(`proxy ${route}: aceitou segredo curto`);
  r = run({ ...base, [secretVar]: 'x'.repeat(30) + ';}' });
  if (r.code === 0) err(`proxy ${route}: aceitou caracteres que injetariam diretiva no Nginx`);
  r = run({ ...base, [secretVar]: SECRET, [upVar]: 'ftp://x' });
  if (r.code === 0) err(`proxy ${route}: aceitou upstream que não é http(s)`);
  r = run({ ...base, [secretVar]: SECRET });
  if (r.code !== 0) err(`proxy ${route}: configuração válida falhou: ${r.out}`);
  if (r.out.includes(SECRET)) err(`proxy ${route}: segredo apareceu na saída do script`);
  const gen = join(outDir, file);
  if (!existsSync(gen)) err(`proxy ${route}: arquivo não gerado`);
  else {
    const c = readFileSync(gen, 'utf8');
    if (!c.includes('X-Webhook-Secret') || !c.includes(`proxy_pass ${nginxVar}`)) err(`proxy ${route}: arquivo gerado incompleto`);
    if (!c.includes('proxy_set_header Cookie           ""')) err(`proxy ${route}: não removeu o Cookie do cliente`);
  }
  r = run({ ...base });
  if (r.code !== 0 || !readFileSync(join(outDir, file), 'utf8').includes('return 503')) err(`proxy ${route}: sem segredo deveria responder 503`);
}
// as duas rotas têm segredos diferentes (um vazamento não vale para o outro)
r = run({ ...base, FREE_CONTENT_WEBHOOK_SECRET: 'c'.repeat(32), FREE_ENROLL_WEBHOOK_SECRET: 'e'.repeat(32) });
if (readFileSync(join(outDir, 'free-content-proxy.conf'), 'utf8').includes('e'.repeat(32))) err('proxy: segredo da matrícula vazou para a rota de conteúdo');

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`✓ conteúdo gratuito ok: ${free_items.length} itens (${yt.length} vídeos), proxies do Nginx validados.`);
