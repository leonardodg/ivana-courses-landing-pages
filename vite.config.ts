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
const pages: Record<string, string> = {
  // name of input  :  path the HTML relation à root project
  main: "src/index.html",
  interest: "src/interest.html",
  pt_br_candles: "src/pt_br/candles/index.html",
  es_ar_candles: "src/es_ar/candles/index.html",
  // soap:           "src/soap/index.html",    ← example the new course page
  // resin:          "src/resin/index.html",
};

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
    plugins: [react(), tailwindcss()],
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
