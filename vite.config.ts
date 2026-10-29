// =============================================================================
// vite.config.ts - Courses Landing Pages - Ivana Academy (Multi-Page Application)
// Stack: React 19 + Vite 6 + Tailwind CSS v4 + TypeScript
//
// Estrutura de source → build:
//   src/index.html          → dist/index.html
//   src/candles/index.html  → dist/candles/index.html
//   src/*/index.html        → dist/*/index.html
//   src/styles/main.css     → dist/styles/main.[hash].css
//   src/scripts/main.tsx    → dist/scripts/main.[hash].js
// =============================================================================

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from 'fs';
import * as dotenv from 'dotenv';
import { defineConfig } from "vite";

// ---------------------------------------------------------------------------
// Utilitário: mapeia cada página para uma entrada do build (MPA input map)
//
// Vite MPA funciona declarando cada HTML como um "entry point" com um nome
// único. O Vite processa cada HTML, resolve seus <script> e <link>, e gera
// os arquivos correspondentes em dist/ espelhando a estrutura declarada.
//
// Adicione novos cursos aqui conforme criar as pastas:
//   "soap"   → "src/soap/index.html"
//   "resin"  → "src/resin/index.html"
// ---------------------------------------------------------------------------
// Descobre sozinho todas as páginas: cada pasta de src/ com um index.html vira uma entrada. O caminho da pasta
// É a URL publicada (ver docs/URLS.md): src/pt-br/cursos/velas/index.html → /pt-br/cursos/velas/.
function discoverPages(dir: string, root = dir): Record<string, string> {
  const found: Record<string, string> = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "app" || entry.name === "styles") continue; // código, não páginas
      Object.assign(found, discoverPages(full, root));
    } else if (entry.name === "index.html") {
      const rel = path.relative(root, dir);
      found[rel === "" ? "main" : rel.replace(/[^a-z0-9]+/gi, "_")] = path.relative(__dirname, full);
    }
  }
  return found;
}
const pages: Record<string, string> = discoverPages(path.resolve(__dirname, "src"));

// Dados estruturados (JSON-LD) ficam FORA do HTML: um arquivo por página em src/app/seo/jsonld/<caminho-da-pagina>.json
// (ex.: src/pt-br/cursos/velas/index.html → src/app/seo/jsonld/pt-br/cursos/velas.json). Este plugin os coloca no <head>
// no dev e no build, então o HTML publicado continua com o JSON-LD (bom para SEO) e o código-fonte só tem layout.
const injectJsonLd = () => ({
  name: "inject-json-ld",
  transformIndexHtml: {
    order: "pre" as const,
    handler(html: string, ctx: { filename?: string }) {
      if (!ctx.filename) return html;
      const srcDir = path.resolve(__dirname, "src");
      const dir = path.relative(srcDir, path.dirname(ctx.filename)).split(path.sep).join("/");
      if (!dir) return html;
      const file = path.resolve(srcDir, "app/seo/jsonld", `${dir}.json`);
      if (!fs.existsSync(file)) return html;
      const data = JSON.parse(fs.readFileSync(file, "utf8")); // JSON inválido derruba o build, de propósito
      const tag = `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n  </head>`;
      return html.replace("</head>", tag);
    },
  },
});

// Dev: páginas estáticas que ficam em public/ (ex.: /pt-br/links/, a "bio" do Instagram) não são páginas do Vite.
// Sem isto o servidor de desenvolvimento não acha o index.html da pasta e cai na home (seletor de país).
// Em produção (dist/) a pasta já tem o index.html e funciona sem este plugin.
const servePublicIndex = () => ({
  name: "serve-public-index",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      const url = (req.url ?? "").split("?")[0];
      if (req.method !== "GET" || !url.endsWith("/") && /\.[a-z0-9]+$/i.test(url)) return next();
      const rel = decodeURIComponent(url).replace(/^\/+|\/+$/g, "");
      if (!rel || fs.existsSync(path.resolve(__dirname, "src", rel, "index.html"))) return next();
      const file = path.resolve(__dirname, "public", rel, "index.html");
      if (!file.startsWith(path.resolve(__dirname, "public")) || !fs.existsSync(file)) return next();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(fs.readFileSync(file));
    });
  },
});

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "src");
  const envFiles = [
    ".env",
    ".env.local",
    `.env.${mode}`,
    `.env.${mode}.local`,
  ];

  const loadedFileEnv = Object.fromEntries(
    envFiles.flatMap((filename) => {
      const filePath = path.resolve(envDir, filename);
      if (!fs.existsSync(filePath)) return [];
      return Object.entries(dotenv.parse(fs.readFileSync(filePath, "utf8")));
    }),
  );

  const clientEnv = {
    VITE_WEBHOOK_URL: loadedFileEnv.VITE_WEBHOOK_URL ?? "",
    VITE_WEBHOOK_SECRET: loadedFileEnv.VITE_WEBHOOK_SECRET ?? "",
    // Google Analytics 4: vazio usa o ID padrão de lib/consent.ts; 'off' desliga.
    VITE_GA_ID: loadedFileEnv.VITE_GA_ID ?? "",
    // Base da tienda Argentina (ex.: https://tienda.ivana.academy). Vazio = botão leva ao WhatsApp AR.
    VITE_TIENDA_AR_URL: loadedFileEnv.VITE_TIENDA_AR_URL ?? "",
  };

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("VITE_")) continue;
    if (typeof value === "string" && value.length > 0) {
      clientEnv[key as keyof typeof clientEnv] = value;
    }
  }

  if (mode === "development") {
    // eslint-disable-next-line no-console
    console.log("Vite envDir:", envDir);
    // eslint-disable-next-line no-console
    console.log("Vite loaded env files:", loadedFileEnv);
    // eslint-disable-next-line no-console
    console.log("Vite clientEnv:", {
      VITE_WEBHOOK_URL: clientEnv.VITE_WEBHOOK_URL,
      VITE_WEBHOOK_SECRET: clientEnv.VITE_WEBHOOK_SECRET ? "[redacted]" : "",
    });
  }

  return {
    plugins: [react(), tailwindcss(), injectJsonLd(), servePublicIndex()],
    envDir,
    root: "src",
    define: Object.fromEntries(
      Object.entries(clientEnv).map(([key, value]) => [
        `import.meta.env.${key}`,
        JSON.stringify(value),
      ]),
    ),

  // ---------------------------------------------------------------------------
  // Public dir:
  // Ex: favicons, robots.txt, imagens estáticas, fontes locais
  // ---------------------------------------------------------------------------
  publicDir: path.resolve(__dirname, "public"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------
  build: {
    // Destino: pasta dist/ na raiz do projeto (fora de src/)
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,

    // Sourcemaps apenas em dev (não expõe código-fonte em produção)
    sourcemap: mode === "development",

    minify: "esbuild",

    rollupOptions: {
      // MPA: cada HTML é um entry point independente
      input: Object.fromEntries(
        Object.entries(pages).map(([name, htmlPath]) => [
          name,
          path.resolve(__dirname, htmlPath),
        ]),
      ),

      output: {
        // Hash no nome → cache de 1 ano no Nginx é seguro porque o hash
        // muda automaticamente a cada build quando o conteúdo muda.
        entryFileNames: "app/[name].[hash].js",
        chunkFileNames: "app/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          // CSS → styles/
          if (assetInfo.name?.endsWith(".css")) {
            return "styles/[name].[hash][extname]";
          }
          // Imagens → images/
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name ?? "")) {
            return "images/[name].[hash][extname]";
          }
          // Fontes → fonts/
          if (/\.(woff2?|ttf|eot|otf)$/.test(assetInfo.name ?? "")) {
            return "fonts/[name].[hash][extname]";
          }
          // Demais assets
          return "assets/[name].[hash][extname]";
        },

        // Chunks compartilhados entre páginas (React, motion, icons)
        // Evita duplicar as mesmas libs em cada página
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["motion"],
          icons: ["lucide-react"],
        },
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Dev server  (`npm run dev`)
  //
  // O Vite serve a partir de `root` ("src/"), então:
  //   http://localhost:3003/           → src/index.html
  //   http://localhost:3003/candles/   → src/candles/index.html
  //
  // HMR (Hot Module Replacement) está ativo por padrão:
  //   ao salvar qualquer arquivo, o browser atualiza instantaneamente
  //   sem recarregar a página (estado React é preservado).
  // ---------------------------------------------------------------------------
  server: {
    port: 3003,
    host: "0.0.0.0", // acessível fora do container Docker
    open: false, // não abre o browser automaticamente
    hmr: process.env.DISABLE_HMR !== "true",
    watch: process.env.DISABLE_HMR === "true" ? null : {},
  },

  // REMOVE Preview AND USE NGINX 8088 INSTEAD
  // ---------------------------------------------------------------------------
  // Preview  (`npm run preview`)
  //
  // Serve o conteúdo do dist/ localmente simulando produção.
  // Útil para validar o build antes de subir para a VPS.
  //   http://localhost:4173/           → dist/index.html
  //   http://localhost:4173/candles/   → dist/candles/index.html
  // ---------------------------------------------------------------------------
  // preview: {
  //   port: 4173,
  //   host: "0.0.0.0",
  // },
    };
  });
