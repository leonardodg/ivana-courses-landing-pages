/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBHOOK_URL: string;
  readonly VITE_WEBHOOK_SECRET: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_TIENDA_AR_URL?: string; // base da tienda Argentina; vazia = botão leva ao WhatsApp AR
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
