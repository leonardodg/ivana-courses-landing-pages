# Deploy: build e pré-renderização no GitHub Actions

Decisão (2026-10-29): **nada é instalado na VPS** para construir o site. O GitHub Actions faz `npm ci`, `vite build` e a pré-renderização (Chrome do próprio runner), confere o resultado e envia só o `dist/` pronto. A VPS monta uma imagem de Nginx com o `dist/` (sem Node, npm ou Chromium).

## Fluxos

| | Deploy normal (`deploy-prebuilt.yml`) | Reserva (`deploy.yml`) |
|---|---|---|
| Gatilho | **push em `main`** (docs, `.md` e `conteudo/` não disparam) e manual | só manual |
| Quem constrói | o GitHub Actions | a VPS, dentro do Docker (`nginx.Dockerfile`, estágio Node) |
| Pré-renderização | sim, em modo estrito | não |
| Imagem | `.devcontainer/build/nginx.prebuilt.Dockerfile` | `.devcontainer/build/nginx.Dockerfile` |
| Compose | `prod-prebuilt.yml` | `prod.yml` |
| Volta atrás | automática em production se a verificação falhar; manual com as releases guardadas | refazer o build do commit anterior |

Use o `deploy.yml` só se o novo estiver fora do ar (`gh workflow run deploy.yml`, ou Actions > "Deploy MAIN → Oracle VPS" > Run workflow, branch `main`): ele constrói na VPS como antes. Os dois usam o mesmo container (`courses-nginx`) e o mesmo projeto do compose, então um assume o lugar do outro.

## O que o fluxo novo faz

1. **guard:** no disparo manual com `production`, exige `confirm_production = sim` (o push em `main` já é a confirmação).
2. **build** (ubuntu-latest, ambiente `development` do GitHub, de onde vêm os segredos):
   `npm audit` (produção) → `npm run lint` → `npm run build` → guarda que falha se algum segredo/URL do webhook aparecer no `dist/` → (com `VITE_TURNSTILE_SITE_KEY`, `VITE_GA_ID`, `VITE_TIENDA_AR_URL`; todos públicos) → `scripts/prerender.mjs` com `PRERENDER_STRICT=1` → `npm run check:urls` → `scripts/verify-dist.mjs` → grava `dist/version.txt` (SHA e hora) → artefato `release.tgz` (14 dias).
3. **deploy:** envia o pacote por SCP para `/tmp` da VPS e roda um script por SSH:
   `git reset --hard origin/main` (só para trazer compose e configs do Nginx) → desempacota em `releases/<sha>-<data>/` → coloca `dist/` na raiz do repositório (guarda o anterior em `dist.prev.<destino>`) e **copia para dentro dele os arquivos com hash (`app/` e `styles/`) das 2 releases anteriores**, para abas abertas antes do deploy não perderem JS/CSS → `docker compose build / down / up` → **verifica**: home com `data-prerendered`, 404 real, `Permissions-Policy` presente, `version.txt` com o SHA e um arquivo com hash da release anterior ainda respondendo 200 → mantém as 3 últimas releases.

## Destinos

- **staging:** container `courses-nginx-staging`, projeto `courses-staging`, porta `127.0.0.1:8089` (não fica exposta na internet), logs em `logs_nginx_staging`. **Não toca na produção.** Para olhar: `ssh -L 8089:127.0.0.1:8089 <usuario>@<vps>` e abrir `http://localhost:8089/pt-br/`.
- **production:** container `courses-nginx`, projeto `compose` (o mesmo do `prod.yml`), porta `127.0.0.1:8088` (só o Nginx do host alcança). O container roda sem root, com filesystem somente leitura; logs em `docker logs courses-nginx`. Se a verificação falhar, volta sozinho para o `dist` anterior.

## Segredos e variáveis (já existem, ambiente `development`)

`VPS_HOST`, `VPS_USER`, `SSH_PRIVATE_KEY`, `VPS_SSH_PORT` (opcional) e **`WEBHOOK_SECRET`** (segredo do webhook do n8n); variáveis `VITE_TURNSTILE_SITE_KEY`, `VITE_GA_ID`, `VITE_TIENDA_AR_URL`, `REPO_PATH`.

`WEBHOOK_SECRET` **não entra no build**: é enviado por SSH só para o `docker compose` e vive no ambiente do container em execução; o Nginx o acrescenta ao encaminhar `POST /api/contact` ao n8n. Valores `VITE_*` são públicos (vão para o JavaScript). Detalhes, rotação e checklist em [SEGURANCA.md](SEGURANCA.md).

## Como testar antes de publicar

- **staging** (manual): Actions > "Deploy (build e pré-render no CI)…" > Run workflow > `staging`. Abra pelo túnel SSH e confira. Não toca na produção.
- Push em `main` publica em produção sozinho. Para publicar sem disparar o deploy (ex.: ajuste só de workflow), ponha `[skip ci]` na mensagem do commit.

## Voltar atrás manualmente

Na VPS, em `REPO_DIR`: `ls releases/` mostra as 3 últimas. Para voltar: `rm -rf dist && cp -R releases/<release-anterior>/dist dist`, depois
`WEBHOOK_SECRET=... docker compose -p compose -f .devcontainer/compose/prod-prebuilt.yml up -d --build`.

## Testar localmente (sem GitHub)

```
npm run build:ssg && node scripts/verify-dist.mjs
printf 'TESTE\n' > dist/version.txt
ALLOW_NO_WEBHOOK=1 WEBHOOK_SECRET=local-teste-0123456789abcdef CONTAINER_NAME=courses-nginx-local HOST_PORT=18089 IMAGE_TAG=local \
  docker compose -p courses-local -f .devcontainer/compose/prod-prebuilt.yml up -d --build
```

## Comandos úteis (GitHub CLI)

```
# Deploy de RESERVA (a VPS constrói o site sozinha; sem pré-render). Só se o fluxo novo estiver fora do ar:
gh workflow run deploy.yml --ref main
gh run watch                       # acompanhar (escolha a execução na lista)

# Deploy normal manual (o push em main já faz isso sozinho):
gh workflow run deploy-prebuilt.yml --ref main -f target=production -f confirm_production=sim

# Ver as últimas execuções e o resultado:
gh run list --limit 5
gh run view <id> --log-failed      # só os logs que falharam
```

## Sitemaps (lastmod automático)
O workflow roda `npm run sitemap` antes do build (checkout com histórico completo, `fetch-depth: 0`): o `<lastmod>` de cada URL é a data do último commit que mexeu nos arquivos DA PÁGINA (pasta em `src/`, JSON-LD e componente de página). Só muda quando a página muda; o Google ignora lastmod que muda sempre. O arquivo gerado vai no `dist/` do deploy; o `public/sitemap-*.xml` do repositório pode ser atualizado com o mesmo comando (`npm run sitemap`) e commitado, mas não é obrigatório.
