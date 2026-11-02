# Segurança: formulários, segredo do webhook e hardening

Origem: Issue #58 (auditoria). Resumo do que existe e de como operar.

## Envio dos formulários (sem segredo no navegador)

```
Navegador ──POST /api/contact──▶ Nginx do container ──X-Webhook-Secret──▶ n8n (webhook)
 (sem credencial)                 • só aceita POST com Origin do site        rede interna Docker
 + token Turnstile                • rate limit por IP (10/min, rajada 5) → 429   (global-network,
                                  • corpo máx. 16 KB → 413                        http://n8n_main:5678)
                                  • remove Cookie/Authorization do cliente
```

- `WEBHOOK_SECRET` existe só no ambiente do container em execução (`docker compose` → `environment`). O script
  `.devcontainer/nginx/docker-entrypoint.d/05-webhook-proxy.sh` gera a config do proxy em `/tmp` ao subir; recusa segredo
  ausente, curto (< 24) ou com caracteres fora de `A-Za-z0-9._~+=-`.
- Nada de `VITE_*` com segredo: tudo com esse prefixo vai para o JavaScript público. Há uma trava no CI (`deploy-prebuilt.yml`)
  que falha o build se `X-Webhook-Secret`, `webhook/contact` ou o domínio do n8n aparecerem no `dist/`.
- Dev (`npm run dev`): o `vite.config.ts` faz o papel do Nginx (`server.proxy`), com `WEBHOOK_URL`/`WEBHOOK_SECRET` (sem `VITE_`).
- O rate limit do navegador (`useSubmitContact.ts`) é só UX. O que protege é o do Nginx.
- IP real do visitante: o Nginx do container confia em `CF-Connecting-IP` só quando a conexão vem da rede Docker/host. Por isso a
  porta fica em `127.0.0.1` (ninguém de fora fala direto com o container).

## Turnstile (anti-bot)

- Widget carregado só no envio (`src/app/lib/turnstile.ts`); a site key (`VITE_TURNSTILE_SITE_KEY`, variável do ambiente
  `production` no GitHub) é pública. O hostname do widget no Cloudflare deve ser `courses.ivana.academy`.
- Quem valida é o **n8n**, no workflow **`Contact - Receive [ivana] v2 (Turnstile)`** (webhook `/webhook/contact-v2`): Webhook (Header
  Auth) → *Turnstile Verify* (`POST challenges.cloudflare.com/turnstile/v0/siteverify`, secret na credencial `Turnstile Secret`,
  tipo Custom Auth, JSON `{"body":{"secret":"..."}}`) → *Turnstile OK?* → (403 `turnstile_failed` | *Validate & Sanitize* → RabbitMQ).
  Falha fechada: sem token, token inválido ou Cloudflare fora do ar => 403 e nada entra na fila.
- O v2 também aceita as origens `interest_ar`, `carreras_ar`, `lgpd`, `lgpd-ar` e `arrepentimiento-ar` (antes caíam como `unknown`)
  e repassa o campo `consent` (versão da política aceita) na mensagem da fila. O Process ainda não grava o `consent` (não há coluna).
- O proxy do container aponta para o v2 (`N8N_WEBHOOK_UPSTREAM`, padrão em `prod-prebuilt.yml`). O workflow antigo
  (`Contact - Receive [ivana]`, `/webhook/contact`) continua publicado como reserva. **Voltar atrás:** definir
  `N8N_WEBHOOK_UPSTREAM=http://n8n_main:5678/webhook/contact` e recriar o container (ou reverter o PR).
- Trocar a chave: editar o JSON da credencial `Turnstile Secret` no n8n. Chaves de teste da Cloudflare (sempre passam):
  site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`; só servem com widget/segredo de teste.
- Efeito colateral aceito: abas abertas antes do deploy rodam o JavaScript antigo (sem token) e levam 403 ao enviar até recarregar.
- A política de privacidade precisa citar o Cloudflare Turnstile (ele carrega no envio do formulário).

## Ordem para publicar (importante)

1. Gerar um segredo **novo**: `openssl rand -hex 32`.
2. n8n: **colar o valor novo na credencial Header Auth do Webhook** (Credentials, nome do header `X-Webhook-Secret`), como texto
   fixo. Uma variável de ambiente do container (ex.: `N8N_WEBHOOK_SECRET`) NÃO basta: o n8n 2.x bloqueia `$env` em credenciais
   e nós por padrão (`N8N_BLOCK_ENV_ACCESS_IN_NODE`), e liberar isso deixaria qualquer workflow ler todas as variáveis do
   container (senha do banco, chave de criptografia). Quando for ligar o Turnstile, adicionar o nó de validação.
3. GitHub (ambiente `production`): secret `WEBHOOK_SECRET` = valor novo; variável `VITE_TURNSTILE_SITE_KEY`. Apagar
   `VITE_WEBHOOK_URL` e `VITE_WEBHOOK_SECRET`.
4. Rodar o deploy em **staging** primeiro (Actions > Run workflow > staging) e testar o envio de ponta a ponta.
5. Deploy em produção. Conferir que o bundle antigo não está mais no ar.
6. O valor antigo do segredo já esteve em bundles públicos: considere-o comprometido e deixe de aceitá-lo no n8n (passo 2).

Se o n8n passar a exigir o segredo **antes** do deploy novo, o site antigo (que ainda envia o valor velho) para de gravar leads até o
deploy: faça 2 e 5 na mesma janela.

## Container e imagem

- `nginxinc/nginx-unprivileged:1.30-alpine` e `node:22.23.4-alpine`, ambos por digest; `apk upgrade` no build aplica correções
  do Alpine posteriores ao digest (ex.: brotli CVE-2026-111497, curl).
- Compose: `read_only`, `tmpfs /tmp`, `cap_drop: ALL`, `no-new-privileges`, 128 MB, 0,5 CPU, 100 PIDs, porta `127.0.0.1:8088:8080`.
- Cabeçalhos em `.devcontainer/nginx/snippets/security-headers.conf`, incluindo **Content-Security-Policy** (política em
  `conf.d/default.conf`, variável `$csp_policy`): scripts só do site, do GA4 (depois do consentimento) e do Turnstile; sem
  iframes além do Turnstile; `object-src 'none'`, `frame-ancestors 'self'`. `style-src` tem `'unsafe-inline'` (React/Motion usam
  `style=`). Só `/pt-br/links/` (editada à mão, com script inline da agenda) recebe `'unsafe-inline'` em scripts.
  Ao adicionar um domínio externo novo (script, fonte, API, imagem), inclua-o na política: o navegador bloqueia o que não estiver
  lá. Para conferir antes de publicar: `npm run build:ssg`, subir a imagem e abrir as páginas no Chrome vendo violações
  (`securitypolicyviolation`); a calibração inicial achou `data:` em fontes e `webhook.ivana.academy` (agenda).

## Automação

- `security.yml` (PR, push, segunda-feira 09:17 UTC): `npm audit` (produção bloqueia high/critical), Trivy na imagem (bloqueia
  CRITICAL/HIGH com correção), Trivy de segredos, SBOM SPDX como artefato (90 dias).
- `dependabot.yml`: npm (minor/patch agrupados), docker (digests), github-actions, devcontainers.
- Ligue em Settings > Code security: Dependabot alerts, Dependabot security updates e secret scanning.

## Fora deste repositório (VPS)

- Vários containers publicam em `0.0.0.0` (Redis 6379, Postgres 5434, MinIO, RabbitMQ, pgAdmin, n8n 5680/5682, NocoDB, entre
  outros). O Docker ignora o UFW: usar `127.0.0.1:` no bind e/ou fechar na NSG da Oracle.
- Kernel (CVE-2026-46300): `uname -r` e atualizar/reiniciar. Nginx do host: `dpkg-query -W nginx` (precisa de `1.24.0-2ubuntu7.19`).
