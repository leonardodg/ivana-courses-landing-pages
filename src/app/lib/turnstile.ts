// Cloudflare Turnstile (anti-bot) para os formulários. Só carrega o script da Cloudflare quando o visitante ENVIA um
// formulário (não em toda visita): a política de privacidade deve citar o Turnstile. A site key é pública por
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

/** Token novo (uso único, vale por 5 min). `null` = Turnstile desligado neste build. Rejeita se a verificação falhar. */
export async function getTurnstileToken(): Promise<string | null> {
  if (!SITE_KEY) return null;
  await loadScript();
  const api = window.turnstile;
  if (!api) throw new Error('turnstile_script');
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
