# Deploy: build e pré-renderização no GitHub Actions

Decisão (2026-10-29): **nada é instalado na VPS** para construir o site. O GitHub Actions faz `npm ci`, `vite build` e a pré-renderização (Chrome do próprio runner), confere o resultado e envia só o `dist/` pronto. A VPS monta uma imagem de Nginx com o `dist/` (sem Node, npm ou Chromium).

## Dois fluxos

| | Fluxo atual (`deploy.yml`) | Fluxo novo (`deploy-prebuilt.yml`) |
|---|---|---|
| Gatilho | push em `main` | manual (`workflow_dispatch`), por enquanto |
| Quem constrói | a VPS, dentro do Docker (`nginx.Dockerfile`, estágio Node) | o GitHub Actions |
| Pré-renderização | não | sim, em modo estrito |
| Imagem | `.devcontainer/build/nginx.Dockerfile` | `.devcontainer/build/nginx.prebuilt.Dockerfile` |
| Compose | `prod.yml` | `prod-prebuilt.yml` |
| Volta atrás | refazer o build do commit anterior | automática em production se a verificação falhar; manual com as releases guardadas |

## O que o fluxo novo faz

1. **guard:** para `production`, exige `confirm_production = sim`.
2. **build** (ubuntu-latest, ambiente `development` do GitHub, de onde vêm os segredos):
   `npm run lint` → `npm run build` (com `VITE_WEBHOOK_*`, `VITE_GA_ID`, `VITE_TIENDA_AR_URL`) → `scripts/prerender.mjs` com `PRERENDER_STRICT=1` → `npm run check:urls` → `scripts/verify-dist.mjs` → grava `dist/version.txt` (SHA e hora) → artefato `release.tgz` (14 dias).
3. **deploy:** envia o pacote por SCP para `/tmp` da VPS e roda um script por SSH:
   `git reset --hard origin/main` (só para trazer compose e configs do Nginx) → desempacota em `releases/<sha>-<data>/` → coloca `dist/` na raiz do repositório (guarda o anterior em `dist.prev.<destino>`) → `docker compose build / down / up` → **verifica**: home com `data-prerendered`, 404 real, `Permissions-Policy` presente e `version.txt` com o SHA → mantém as 3 últimas releases.

## Destinos

- **staging:** container `courses-nginx-staging`, projeto `courses-staging`, porta `127.0.0.1:8089` (não fica exposta na internet), logs em `logs_nginx_staging`. **Não toca na produção.** Para olhar: `ssh -L 8089:127.0.0.1:8089 <usuario>@<vps>` e abrir `http://localhost:8089/pt-br/`.
- **production:** container `courses-nginx`, projeto `compose` (o mesmo do `prod.yml`), porta `8088`. Se a verificação falhar, volta sozinho para o `dist` anterior.

## Segredos e variáveis (já existem, ambiente `development`)

`VPS_HOST`, `VPS_USER`, `SSH_PRIVATE_KEY`, `VPS_SSH_PORT` (opcional), `VITE_WEBHOOK_URL`, `VITE_WEBHOOK_SECRET`; variáveis `VITE_GA_ID`, `VITE_TIENDA_AR_URL`, `REPO_PATH`. Os `VITE_*` agora são usados no job de build do GitHub, e não mais pelo `docker compose` da VPS.

## Como testar (fase 3a) e trocar (fase 3b)

1. Actions > "Deploy (build e pré-render no CI) → Oracle VPS" > Run workflow > `staging`.
2. Abrir o staging pelo túnel SSH e conferir: páginas, formulário de interesse, carrossel, agenda, imagens de prévia, `view-source` com o corpo da página.
3. Rodar `production` com `confirm_production = sim` uma vez, fora de horário de pico, e conferir `https://courses.ivana.academy`.
4. **3b (troca):** em `deploy.yml`, trocar o gatilho para `workflow_run` do novo fluxo (ou copiar os jobs do novo para o `push` de `main`) e aposentar o build na VPS (`nginx.Dockerfile` estágio `node-builder`, `prod.yml`). Só depois do passo 3 dar certo.

## Voltar atrás manualmente

Na VPS, em `REPO_DIR`: `ls releases/` mostra as 3 últimas. Para voltar: `rm -rf dist && cp -R releases/<release-anterior>/dist dist`, depois
`docker compose -p compose -f .devcontainer/compose/prod-prebuilt.yml up -d --build`.

## Testar localmente (sem GitHub)

```
npm run build:ssg && node scripts/verify-dist.mjs
printf 'TESTE\n' > dist/version.txt
CONTAINER_NAME=courses-nginx-local HOST_PORT=18089 BIND_ADDR=127.0.0.1: IMAGE_TAG=local LOGS_DIR=/tmp/logs \
  docker compose -p courses-local -f .devcontainer/compose/prod-prebuilt.yml up -d --build
```
