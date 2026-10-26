// Consentimento de cookies e rastreamento (LGPD, art. 7º I e 8º).
//
// Regra: nada além do essencial é carregado antes do aceite. Hoje o único rastreador
// possível é o Google Analytics 4, e só carrega se o visitante aceitar "Estatísticas". Recusar é tão fácil quanto aceitar e pode ser
// mudado a qualquer momento pelo link "Preferências de cookies" do rodapé.

export interface ConsentState {
  v: number;            // versão do texto/categorias; se mudar, pedimos de novo
  analytics: boolean;
  ts: string;           // quando a escolha foi feita (prova do consentimento)
}

export const CONSENT_VERSION = 1;
const KEY = 'ivana-consent';
export const CONSENT_EVENT = 'ivana:consent';
export const OPEN_PREFS_EVENT = 'ivana:open-cookie-prefs';

// ID de medição do GA4 (público, não é segredo). VITE_GA_ID no build sobrescreve o padrão;
// para desligar o rastreamento por completo, defina VITE_GA_ID=off.
const DEFAULT_GA_ID = 'G-1MFXBHFE71';
const envGaId = (import.meta.env.VITE_GA_ID as string | undefined)?.trim();
export const GA_ID: string = envGaId === 'off' ? '' : envGaId || DEFAULT_GA_ID;

/** Só há o que consentir se algum rastreador estiver configurado. */
export const hasTrackers = (): boolean => GA_ID.length > 0;

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as ConsentState;
    // vale por 12 meses; depois pedimos de novo
    const fresh = Date.now() - new Date(c.ts).getTime() < 365 * 24 * 3600 * 1000;
    return c.v === CONSENT_VERSION && fresh ? c : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): ConsentState {
  const state: ConsentState = { v: CONSENT_VERSION, analytics, ts: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // armazenamento bloqueado: vale só nesta visita
  }
  applyConsent(state);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}

export const openCookiePreferences = () => window.dispatchEvent(new Event(OPEN_PREFS_EVENT));

// ─── Google Analytics 4 (Consent Mode v2, começa negado) ────────────────────

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let gaLoaded = false;

function ensureGtag(): GtagFn {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

function loadGA() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;
  const gtag = ensureGtag();
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

function clearGACookies() {
  const host = location.hostname;
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
      for (const domain of [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      }
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

export function applyConsent(state: ConsentState | null) {
  if (!GA_ID) return;
  if (state?.analytics) {
    loadGA();
    ensureGtag()('consent', 'update', { analytics_storage: 'granted' });
  } else if (gaLoaded) {
    ensureGtag()('consent', 'update', { analytics_storage: 'denied' });
    clearGACookies();
  }
}

/** Chamado uma vez ao abrir a página: reaplica a escolha já guardada. */
export function initConsent() {
  applyConsent(readConsent());
}
