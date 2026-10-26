# CLAUDE.md

Frontend for Ivana Academy's course landing pages (React 19 + Vite 6 + Tailwind v4), built as a Multi-Page Application and deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Adding a New Course Page
1. Create the page under `src/` (e.g. `src/pt_br/soap/index.html`; existing pages live in `src/pt_br/` and `src/es_ar/`).
2. Register it in the `pages` object in `vite.config.ts`.
3. Run `npm run build` to confirm it lands in `dist/`.

## Notes
- Dev server runs on port 3003 (Nginx preview on 8088) inside the DevContainer.
- Env vars come from `.devcontainer/env/*.env`, not from the repo.
- Conformidade (LGPD): páginas legais em `/pt_br/privacidade/`, `/pt_br/termos/`, `/pt_br/reembolso/` e `/pt_br/lgpd/` (Brasil) e `/es_ar/privacidad/`, `/terminos/`, `/reembolso/`, `/derechos/` e `/arrepentimiento/` (Argentina). Páginas do Brasil ficam sempre sob `/pt_br/`, as da Argentina sob `/es_ar/` (textos em `src/app/legal/`, dados da empresa em `legal/company.ts`). Todo formulário que coleta dados usa `PrivacyConsent`.
- Rastreamento: só o GA4, carregado depois do aceite em `lib/consent.ts` (ID padrão no arquivo; `VITE_GA_ID` sobrescreve, `off` desliga). Eventos em `lib/analytics.ts`. Não adicione scripts de terceiros direto no HTML.
- Fontes são hospedadas no site (`@fontsource`), sem Google Fonts.
