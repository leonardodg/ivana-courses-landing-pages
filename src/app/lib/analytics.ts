// Eventos do Google Analytics 4. Tudo aqui é no-op sem consentimento de "Estatísticas"
// (o gtag.js nem foi carregado), então chamar trackEvent é sempre seguro.
//
// Eventos enviados (sem dados pessoais nos parâmetros):
//   click_loja       clique em link para loja.ivana.academy (curso, turma, página de origem)
//   click_whatsapp   clique em link do WhatsApp
//   click_tienda     clique em link para a tienda Argentina (carrera, origen)
//   select_career    clique em "Ver valores e inscribirme" (carrera, origen), com ou sem tienda
//   click_checkout   clique em compra na Hotmart (produto, página de origem)
//   generate_lead    formulário enviado com sucesso (form_source)

import { GA_ID, readConsent } from './consent';
import { TIENDA_AR_URL } from './tienda';

type Params = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: Params = {}) {
  if (!GA_ID || !window.gtag || !readConsent()?.analytics) return;
  window.gtag('event', name, params);
}

/** Origem do clique, por caminho da página (ex.: /pt_br/soap/ → "pt_br/soap"). */
export const pageName = () => location.pathname.replace(/^\/|\/$/g, '') || 'home';

/** Interesse numa carreira (botão "Ver valores e inscribirme"). Sem preço nem dados pessoais. */
export const trackSelectCareer = (carrera: string) => trackEvent('select_career', { carrera, origen: pageName() });

const tiendaHost = (() => {
  try {
    return TIENDA_AR_URL ? new URL(TIENDA_AR_URL).hostname : '';
  } catch {
    return '';
  }
})();

/** Classifica um destino externo (loja ou WhatsApp) e registra o evento correspondente. */
export function trackOutbound(href: string) {
  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return;
  }
  if (url.hostname === 'loja.ivana.academy') {
    trackEvent('click_loja', {
      curso: url.pathname.replace(/^\/curso-|\.html$/g, ''),
      turma: url.searchParams.get('turma') ?? undefined,
      pagina: pageName(),
    });
  } else if (url.hostname === 'pay.hotmart.com') {
    trackEvent('click_checkout', { produto: url.pathname.replace(/^\//, ''), pagina: pageName() });
  } else if (tiendaHost && url.hostname === tiendaHost) {
    trackEvent('click_tienda', {
      carrera: url.searchParams.get('utm_campaign') ?? url.pathname.replace(/^\/|\.html$/g, ''),
      origen: pageName(),
    });
  } else if (url.hostname === 'wa.me') {
    trackEvent('click_whatsapp', { pagina: pageName() });
  }
}

function onClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a[href]');
  if (a) trackOutbound((a as HTMLAnchorElement).href);
}

let started = false;

/** Um único ouvinte de cliques na página (delegação), iniciado uma vez. */
export function initTracking() {
  if (started || !GA_ID) return;
  started = true;
  document.addEventListener('click', onClick, { capture: true });
}
