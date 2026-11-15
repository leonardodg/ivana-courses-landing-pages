// Acesso ao conteúdo gratuito: o e-mail é enviado UMA vez ao servidor (/api/free-content → n8n → Postgres e planilha)
// e o navegador guarda só um marcador "liberado" (sem o e-mail). Limpou os dados do navegador? É só informar o e-mail
// de novo: o servidor faz upsert por e-mail, então repetir não cria duplicata. É um portão suave de captação de leads:
// o ID do vídeo e o link da apostila continuam no código público.
import { useSyncExternalStore } from 'react';
import { CONSENT_TEXT_VERSION } from '../components/PrivacyConsent';
import { trackEvent } from './analytics';
import { getTurnstileToken } from './turnstile';

const KEY = 'ivana:free-access';
const EVENT = 'ivana:free-access';
const ENDPOINT = '/api/free-content';

const read = (): boolean => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
const emit = () => window.dispatchEvent(new Event(EVENT));
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
};

export const useFreeAccess = (): boolean => useSyncExternalStore(subscribe, read, () => false);

export function resetFreeAccess() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* navegador sem armazenamento: nada a limpar */
  }
  emit();
}

export type AccessResult = 'ok' | 'rate_limited' | 'error';

export async function requestFreeAccess(email: string, country: 'BR' | 'AR', itemId: string): Promise<AccessResult> {
  let token: string | null;
  try {
    token = await getTurnstileToken();
  } catch {
    return 'error';
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        country,
        item_id: itemId,
        form_source: `free_content_${country.toLowerCase()}`,
        consent: CONSENT_TEXT_VERSION,
        ...(token ? { cf_turnstile_token: token } : {}),
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 429) return 'rate_limited';
    if (!res.ok) return 'error';
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* sem armazenamento: libera só nesta visita (o estado do modal segue aberto no item) */
    }
    emit();
    trackEvent('generate_lead', { form_source: `free_content_${country.toLowerCase()}` });
    return 'ok';
  } catch {
    return 'error';
  }
}
