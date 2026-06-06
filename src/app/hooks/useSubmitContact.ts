// src/app/hooks/useSubmitContact.ts

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';

export interface ContactPayload {
  full_name:   string;
  email:       string;
  phone:       string;
  subject:     string;
  message:     string;
  form_source: string;
}

interface SubmitResult {
  status:   SubmitStatus;
  cooldown: number;
}

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET;

// console.log(import.meta.env.VITE_WEBHOOK_URL);

const MAX_RETRIES    = 3;
const BASE_DELAY_MS  = 800; // 800ms → 1.6s → 3.2s

// Rate limit no cliente: 3 submissões por 60s
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
  try {
    const res = await fetch(WEBHOOK_URL, {
      method:  'POST',
      headers: {
        'Content-Type':     'application/json',
        'X-Webhook-Secret': WEBHOOK_SECRET,
      },
      body:   JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
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
    if (res.ok) return { status: 'success', cooldown: 0 };
    return { status: 'error', cooldown: 0 };
  } catch {
    return { status: 'error', cooldown: 0 };
  }
}
