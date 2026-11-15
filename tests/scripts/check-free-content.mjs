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
const { free_courses, free_materials, free_categories, free_text } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ids = new Set();
const yts = new Set();
const moodle = new Set();
const unique = (id, what) => {
  if (ids.has(id)) err(`${what}: id repetido "${id}" (vira #hash e chave no n8n)`);
  ids.add(id);
  if (!slug.test(id)) err(`${what} "${id}": id deve ser slug minúsculo com hífen`);
};
for (const c of free_courses) {
  const w = `curso "${c.id}"`;
  unique(c.id, w);
  if (!['BR', 'AR'].includes(c.country)) err(`${w}: country inválido`);
  if (!free_categories[c.category]) err(`${w}: categoria desconhecida "${c.category}"`);
  if (!c.title?.trim()) err(`${w}: sem título`);
  if (!existsSync(join(root, 'public', c.image))) err(`${w}: imagem ausente (${c.image})`);
  if (!Number.isInteger(c.moodleCourseId) || c.moodleCourseId <= 0) err(`${w}: moodleCourseId inválido`);
  if (moodle.has(c.moodleCourseId)) err(`${w}: moodleCourseId ${c.moodleCourseId} repetido`);
  moodle.add(c.moodleCourseId);
  if (!c.lessons?.length) err(`${w}: sem aulas (a primeira é a aula de amostra)`);
  for (const l of c.lessons ?? []) {
    const lw = `${w}, aula "${l.id}"`;
    unique(l.id, lw);
    if (!l.title?.trim()) err(`${lw}: sem título`);
    if (!/^[A-Za-z0-9_-]{11}$/.test(l.youtubeId ?? '')) err(`${lw}: youtubeId inválido`);
    if (yts.has(l.youtubeId)) err(`${lw}: youtubeId repetido`);
    yts.add(l.youtubeId);
  }
}
for (const m of free_materials) {
  const w = `material "${m.id}"`;
  unique(m.id, w);
  if (!['BR', 'AR'].includes(m.country)) err(`${w}: country inválido`);
  if (!free_categories[m.category]) err(`${w}: categoria desconhecida`);
  if (!['apostila', 'recurso'].includes(m.kind)) err(`${w}: kind inválido`);
  if (!existsSync(join(root, 'public', m.image))) err(`${w}: imagem ausente (${m.image})`);
  if (m.href || m.link || m.youtubeId) err(`${w}: material não leva link no código (o n8n envia por e-mail)`);
}
for (const c of ['BR', 'AR']) if (!free_courses.some((x) => x.country === c)) err(`país ${c} sem curso`);
for (const k of Object.keys(free_text.pt)) {
  if (!(k in free_text.es)) err(`texto "${k}" falta em es`);
  else if (Array.isArray(free_text.pt[k]) && free_text.pt[k].length !== free_text.es[k].length) err(`texto "${k}": tamanhos diferentes em pt e es`);
}
const lessons = free_courses.reduce((n, c) => n + c.lessons.length, 0);

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
console.log(`✓ conteúdo gratuito ok: ${free_courses.length} cursos, ${lessons} aulas, ${free_materials.length} materiais, proxies do Nginx validados.`);
