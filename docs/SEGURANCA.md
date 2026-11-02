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

- Widget carregado só no envio (`src/app/lib/turnstile.ts`); a site key (`VITE_TURNSTILE_SITE_KEY`) é pública.
- Quem valida é o **n8n** com a secret key (nunca no repositório): logo depois do Webhook, um nó HTTP Request
  `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` com `secret`, `response` = `{{$json.body.cf_turnstile_token}}`
  e `remoteip` = header `X-Real-IP`; um IF em `success == true`, senão responder 403 (e não seguir para o RabbitMQ/banco).
- No nó Webhook, ligar **Header Auth** exigindo `X-Webhook-Secret` = valor do `WEBHOOK_SECRET`.
- Teste: chaves de teste da Cloudflare (sempre passam): site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.
- A política de privacidade precisa citar o Cloudflare Turnstile (ele carrega no envio do formulário).

## Ordem para publicar (importante)

1. Gerar um segredo **novo**: `openssl rand -hex 32`.
2. n8n: configurar o Header Auth do Webhook com o valor novo (o antigo deixa de valer para chamadas diretas) e, quando for ligar
   o Turnstile, o nó de validação.
3. GitHub (ambiente `development`): secret `WEBHOOK_SECRET` = valor novo; variável `VITE_TURNSTILE_SITE_KEY`. Apagar
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
- Cabeçalhos em `.devcontainer/nginx/snippets/security-headers.conf`. **Pendente:** Content-Security-Policy (calibrar em
  report-only por causa do GA4 e dos scripts inline antes de aplicar).

## Automação

- `security.yml` (PR, push, segunda-feira 09:17 UTC): `npm audit` (produção bloqueia high/critical), Trivy na imagem (bloqueia
  CRITICAL/HIGH com correção), Trivy de segredos, SBOM SPDX como artefato (90 dias).
- `dependabot.yml`: npm (minor/patch agrupados), docker (digests), github-actions, devcontainers.
- Ligue em Settings > Code security: Dependabot alerts, Dependabot security updates e secret scanning.

## Fora deste repositório (VPS)

- Vários containers publicam em `0.0.0.0` (Redis 6379, Postgres 5434, MinIO, RabbitMQ, pgAdmin, n8n 5680/5682, NocoDB, entre
  outros). O Docker ignora o UFW: usar `127.0.0.1:` no bind e/ou fechar na NSG da Oracle.
- Kernel (CVE-2026-46300): `uname -r` e atualizar/reiniciar. Nginx do host: `dpkg-query -W nginx` (precisa de `1.24.0-2ubuntu7.19`).
