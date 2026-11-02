/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string; // site key pública do Cloudflare Turnstile; vazia = sem anti-bot
  readonly VITE_GA_ID?: string;
  readonly VITE_TIENDA_AR_URL?: string; // base da tienda Argentina; vazia = botão leva ao WhatsApp AR
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
