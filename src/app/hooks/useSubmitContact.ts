// src/app/hooks/useSubmitContact.ts

import { trackEvent } from '../lib/analytics';
import { getTurnstileToken } from '../lib/turnstile';

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';

export interface ContactPayload {
  full_name:   string;
  email:       string;
  phone:       string;
  subject:     string;
  message:     string;
  form_source: string;
  consent?:    string; // versão da política aceita (prova do consentimento)
  // Interesse estruturado (alimenta as planilhas por curso no n8n):
  country?:    'BR' | 'AR';
  interests?:  string; // áreas de interesse separadas por vírgula (chaves de data/interest_options.ts: velas, saboaria, ...)
  course?:     string; // curso/carrera específico, em texto legível (ex.: "Técnico em Velas"); vazio = só a área
}

interface SubmitResult {
  status:   SubmitStatus;
  cooldown: number;
}

// Os formulários enviam para /api/contact (mesma origem). O Nginx do container acrescenta o segredo do webhook e
// encaminha ao n8n: nenhuma credencial é entregue ao navegador (ver .devcontainer/nginx/conf.d/default.conf).
// Em desenvolvimento o vite.config.ts faz o mesmo papel (server.proxy).
const CONTACT_ENDPOINT = '/api/contact';

const MAX_RETRIES    = 3;
const BASE_DELAY_MS  = 800; // 800ms → 1.6s → 3.2s

// Rate limit no cliente: 3 submissões por 60s. É só UX (o limite que protege de verdade é o do Nginx, por IP).
// Array fora do hook para persistir entre re-renders sem useRef
const submitHistory: number[] = [];

function checkRateLimit(): { allowed: boolean; cooldown: number } {
  const now    = Date.now();
  const window = 60_000;
  while (submitHistory.length && now - submitHistory[0] > window) {
    submitHistory.shift();
  }
  if (submitHistory.length >= 3) {
    const cooldown = Math.ceil((window - (now - submitHistory[0])) / 1000);
    return { allowed: false, cooldown };
  }
  submitHistory.push(now);
  return { allowed: true, cooldown: 0 };
}

async function postWithRetry(
  payload: ContactPayload,
  attempt = 1,
): Promise<Response> {
  // Token do Turnstile é de uso único: um novo a cada tentativa (inclusive nos retries). Falha aqui (script bloqueado,
  // Cloudflare inalcançável, desafio não concluído) NÃO é erro de rede: sem token o n8n recusaria de qualquer jeito, então
  // não repetimos (antes eram 3 tentativas de até 30 s cada, com o botão preso em "Enviando...").
  let token: string | null;
  try {
    token = await getTurnstileToken();
  } catch {
    throw new Error('turnstile_error');
  }

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify({
        ...payload,
        ...(token ? { cf_turnstile_token: token } : {}),
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    // 4xx = erro do cliente, não faz retry
    if (res.status >= 400 && res.status < 500) return res;

    // 5xx ou não-ok = retry com backoff exponencial
    if (!res.ok && attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, BASE_DELAY_MS * 2 ** (attempt - 1)));
      return postWithRetry(payload, attempt + 1);
    }

    return res;
  } catch {
    if (attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, BASE_DELAY_MS * 2 ** (attempt - 1)));
      return postWithRetry(payload, attempt + 1);
    }
    throw new Error('network_error');
  }
}

export async function submitContact(payload: ContactPayload): Promise<SubmitResult> {
  const rate = checkRateLimit();
  if (!rate.allowed) {
    return { status: 'rate_limited', cooldown: rate.cooldown };
  }

  try {
    const res = await postWithRetry(payload);
    // 429 = limite do servidor (Nginx, por IP)
    if (res.status === 429) return { status: 'rate_limited', cooldown: 60 };
    if (res.ok) {
      // Pedido de direitos LGPD não é lead de marketing.
      if (!/^(lgpd|arrepentimiento)/.test(payload.form_source)) trackEvent('generate_lead', { form_source: payload.form_source });
      return { status: 'success', cooldown: 0 };
    }
    return { status: 'error', cooldown: 0 };
  } catch {
    return { status: 'error', cooldown: 0 };
  }
}
