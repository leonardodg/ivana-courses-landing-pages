// Eventos do Google Analytics 4. Tudo aqui é no-op sem consentimento de "Estatísticas"
// (o gtag.js nem foi carregado), então chamar trackEvent é sempre seguro.
//
// Eventos enviados (sem dados pessoais nos parâmetros):
//   click_loja       clique em link para loja.ivana.academy (curso, turma, página de origem)
//   click_whatsapp   clique em link do WhatsApp
//   generate_lead    formulário enviado com sucesso (form_source)

import { GA_ID, readConsent } from './consent';

type Params = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: Params = {}) {
  if (!GA_ID || !window.gtag || !readConsent()?.analytics) return;
  window.gtag('event', name, params);
}

/** Origem do clique, por caminho da página (ex.: /pt_br/soap/ → "pt_br/soap"). */
const pageName = () => location.pathname.replace(/^\/|\/$/g, '') || 'home';

function onClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a[href]');
  if (!a) return;
  let url: URL;
  try {
    url = new URL((a as HTMLAnchorElement).href, location.href);
  } catch {
    return;
  }

  if (url.hostname === 'loja.ivana.academy') {
    trackEvent('click_loja', {
      curso: url.pathname.replace(/^\/curso-|\.html$/g, ''),
      turma: url.searchParams.get('turma') ?? undefined,
      pagina: pageName(),
    });
  } else if (url.hostname === 'wa.me') {
    trackEvent('click_whatsapp', { pagina: pageName() });
  }
}

let started = false;

/** Um único ouvinte de cliques na página (delegação), iniciado uma vez. */
export function initTracking() {
  if (started || !GA_ID) return;
  started = true;
  document.addEventListener('click', onClick, { capture: true });
}
