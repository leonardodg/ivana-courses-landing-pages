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
const ENROLL_ENDPOINT = '/api/free-enroll';

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

async function post(endpoint: string, body: Record<string, string>): Promise<AccessResult> {
  let token: string | null;
  try {
    token = await getTurnstileToken();
  } catch {
    return 'error';
  }
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, ...(token ? { cf_turnstile_token: token } : {}), timestamp: new Date().toISOString() }),
      signal: AbortSignal.timeout(endpoint === ENROLL_ENDPOINT ? 45_000 : 10_000), // a matrícula cria o usuário no Moodle (~12 s medidos)
    });
    if (res.status === 429) return 'rate_limited';
    return res.ok ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}

export async function requestFreeAccess(email: string, country: 'BR' | 'AR', itemId: string): Promise<AccessResult> {
  const source = `free_content_${country.toLowerCase()}`;
  const result = await post(ENDPOINT, { email, country, item_id: itemId, form_source: source, consent: CONSENT_TEXT_VERSION });
  if (result !== 'ok') return result;
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* sem armazenamento: libera só nesta visita */
  }
  emit();
  trackEvent('generate_lead', { form_source: source });
  return 'ok';
}

/** Cria o usuário na plataforma e matricula no curso `course` (slug; o n8n resolve o id do Moodle). Não libera as aulas de amostra. */
export async function requestMoodleEnroll(p: { email: string; firstName: string; lastName: string; country: 'BR' | 'AR'; course: string }): Promise<AccessResult> {
  const source = `free_enroll_${p.country.toLowerCase()}`;
  const result = await post(ENROLL_ENDPOINT, {
    email: p.email,
    first_name: p.firstName,
    last_name: p.lastName,
    country: p.country,
    course: p.course,
    form_source: source,
    consent: CONSENT_TEXT_VERSION,
  });
  if (result === 'ok') trackEvent('generate_lead', { form_source: source });
  return result;
}
