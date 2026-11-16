// Cloudflare Turnstile (anti-bot) para os formulários. Só carrega o script da Cloudflare quando o visitante MEXE em um
// formulário (primeiro foco num campo; não em toda visita): a verificação roda enquanto a pessoa preenche e o token fica
// pronto no envio (vale 5 min, uso único). A política de privacidade deve citar o Turnstile. A site key é pública por
// design (VITE_TURNSTILE_SITE_KEY); quem valida o token é o n8n (siteverify, com a secret key, que nunca sai de lá).
// Sem site key (ex.: desenvolvimento local) o envio segue sem token.

interface TurnstileApi {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  execute(id: string): void;
  reset(id: string): void;
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TIMEOUT_MS = 30_000;

let scriptPromise: Promise<void> | null = null;
let widgetId: string | null = null;
let pending: { resolve: (t: string) => void; reject: (e: Error) => void } | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptPromise = null; reject(new Error('turnstile_script')); };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

function ensureWidget(api: TurnstileApi): string {
  if (widgetId !== null) return widgetId;
  // Contêiner fixo no canto: o Turnstile só aparece se o visitante precisar interagir (interaction-only).
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483000';
  document.body.appendChild(el);
  widgetId = api.render(el, {
    sitekey: SITE_KEY,
    execution: 'execute',
    appearance: 'interaction-only',
    callback: (token: string) => pending?.resolve(token),
    'error-callback': () => pending?.reject(new Error('turnstile_error')),
    'timeout-callback': () => pending?.reject(new Error('turnstile_timeout')),
  });
  return widgetId;
}

function fetchToken(): Promise<string> {
  return loadScript().then(() => {
    const api = window.turnstile;
    if (!api) throw new Error('turnstile_script');
    return runWidget(api);
  });
}

// Token pré-aquecido (primeiro foco num formulário). Descartado depois de 4 min (o token expira em 5).
const WARM_MAX_AGE_MS = 240_000;
let warm: { at: number; promise: Promise<string> } | null = null;

/** Começa a verificação em segundo plano; chamada repetida não faz nada enquanto houver token pré-aquecido. */
export function prewarmTurnstile(): void {
  if (!SITE_KEY || (warm && Date.now() - warm.at < WARM_MAX_AGE_MS)) return;
  const entry = { at: Date.now(), promise: fetchToken() };
  warm = entry;
  entry.promise.catch(() => { if (warm === entry) warm = null; }); // falhou: o envio tenta de novo na hora
}

if (SITE_KEY && typeof document !== 'undefined') {
  document.addEventListener('focusin', (e) => {
    if ((e.target as Element | null)?.closest?.('form')) prewarmTurnstile();
  });
}

/** Token novo (uso único, vale por 5 min). `null` = Turnstile desligado neste build. Rejeita se a verificação falhar. */
export async function getTurnstileToken(): Promise<string | null> {
  if (!SITE_KEY) return null;
  if (warm && Date.now() - warm.at < WARM_MAX_AGE_MS) {
    const w = warm;
    warm = null; // uso único
    try { return await w.promise; } catch { /* cai para uma verificação nova */ }
  }
  warm = null;
  return fetchToken();
}

function runWidget(api: TurnstileApi): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('turnstile_timeout')), TIMEOUT_MS);
    pending = {
      resolve: t => { clearTimeout(timer); resolve(t); },
      reject: e => { clearTimeout(timer); reject(e); },
    };
    const reused = widgetId !== null;
    const id = ensureWidget(api);
    if (reused) api.reset(id); // token anterior já foi consumido
    api.execute(id);
  });
}
