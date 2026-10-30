# CLAUDE.md

Frontend for Ivana Academy's course landing pages (React 19 + Vite 6 + Tailwind v4), built as a Multi-Page Application and deployed by GitHub Actions to the Oracle VPS (Docker + Nginx) on every push to `main`: the build and the prerender (`scripts/prerender.mjs`) run in the Actions runner and only the finished `dist/` is sent to the VPS (see `docs/DEPLOY.md`; `deploy.yml` is a manual fallback).

## Adding a New Course Page
1. Create the page under `src/` as `index.html`: **the folder path is the public URL** (e.g. `src/pt-br/cursos/sabonetes/index.html` → `/pt-br/cursos/sabonetes/`; Brazil lives in `src/pt-br/`, Argentina in `src/es-ar/`). Follow `docs/URLS.md`.
2. `vite.config.ts` registers every folder with an `index.html` (add the page to the sitemap and run `npm run check:urls`).
3. Structured data (JSON-LD) does NOT go in the HTML: create `src/app/seo/jsonld/<page-path>.json` (e.g. `pt-br/cursos/velas.json`); the `inject-json-ld` plugin in `vite.config.ts` adds it to `<head>` in dev and build.
4. Run `npm run build` to confirm it lands in `dist/`.

## Notes
- Dev server runs on port 3003 (Nginx preview on 8088) inside the DevContainer.
- Env vars come from `.devcontainer/env/*.env`, not from the repo.
- Conformidade (LGPD): páginas legais em `/pt-br/privacidade/`, `/pt-br/termos/`, `/pt-br/reembolso/` e `/pt-br/lgpd/` (Brasil) e `/es-ar/privacidad/`, `/terminos/`, `/reembolso/`, `/derechos/` e `/arrepentimiento/` (Argentina). Páginas do Brasil ficam sempre sob `/pt-br/`, as da Argentina sob `/es-ar/` (textos em `src/app/legal/`, dados da empresa em `legal/company.ts`). Todo formulário que coleta dados usa `PrivacyConsent`.
- Rastreamento: só o GA4, carregado depois do aceite em `lib/consent.ts` (ID padrão no arquivo; `VITE_GA_ID` sobrescreve, `off` desliga). Eventos em `lib/analytics.ts`. Não adicione scripts de terceiros direto no HTML.
- Fontes são hospedadas no site (`@fontsource`), sem Google Fonts.

- Componentes das páginas: **sempre** os de `src/app/ui/` (ver `docs/GUIA-DE-ESTILO.md`). Não recrie botão, card, passo, herói ou cabeçalho de seção dentro de uma página; para mudar o visual, edite o componente em `ui/` (um só lugar, vale para Brasil e Argentina).
