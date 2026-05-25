# AGENTS.md

## Purpose
This file helps AI coding agents understand the repository quickly and work productively.

## What this repository is
- A static frontend website for Ivana Academy course landing pages.
- Built with React, TypeScript, Vite, and Tailwind CSS v4.
- Designed for local development inside a DevContainer.
- Produces static output in `dist/`, which is intended as generated build output.

## Important commands
Use the commands defined in `package.json`.
- `npm install` — install dependencies
- `npm run dev` — start Vite dev server on `http://localhost:3003`
- `npm run build` — build production output into `dist/`
- `npm run clean` — remove generated artifacts (`dist/`, `server.js`)
- `npm run lint` — run TypeScript type check with `tsc --noEmit`

> Note: `README.md` currently mentions `npm run format`, `npm run format:check`, and `npm run lint:fix`, but those scripts are not present in `package.json`.

## Key files and structure
- `src/index.html` — application HTML entry point
- `src/scripts/main.tsx` — React application bootstrap
- `src/scripts/App.tsx` — top-level app layout and routing logic
- `src/scripts/components/` — reusable UI components
- `src/scripts/data.ts` — static page content and course metadata
- `src/scripts/types.ts` — TypeScript data contracts
- `src/styles/index.css` — Tailwind v4 import and global styles
- `vite.config.ts` — Vite configuration and dev server setup
- `tsconfig.json` — TypeScript configuration
- `public/` — static assets served by the app

## Styling and rendering conventions
- Tailwind CSS is integrated through Vite and imported in `src/styles/index.css`.
- There is no `tailwind.config.js` in this repository.
- The UI is built with React components and data-driven page content from `src/scripts/data.ts`.

## Guidance for AI agents
- Treat this as a frontend-only static website project.
- Do not invent backend APIs or server-side runtime behavior.
- Preserve responsive design and Tailwind utility patterns.
- Avoid editing `dist/` directly; `dist/` is generated build output.
- Validate changes by using `npm run build` and `npm run lint` when possible.

## Notes on repo-specific patterns
- `src/scripts/components/TechDashboard.tsx` contains simulated backend example content and should not be interpreted as actual server implementation.
- The `homepage` field in `package.json` indicates GitHub Pages deployment.
- `.github/dependabot.yml` exists, but there is no GitHub Actions workflow file in this workspace snapshot.

## Reference docs
- `README.md` — high-level project description and architecture
- `CLAUDE.md` — repository overview, environment notes, and project conventions
