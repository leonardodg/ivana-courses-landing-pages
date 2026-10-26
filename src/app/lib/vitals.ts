// Core Web Vitals reais dos visitantes (LCP, INP, CLS, FCP, TTFB), enviados ao GA4 como
// eventos "web_vitals" — só com o consentimento de Estatísticas. Métricas medidas antes do aceite
// (FCP e TTFB saem logo no início) ficam em fila e são enviadas se a pessoa aceitar.
// No GA4 (Explorar) filtre por metric_name e compare metric_rating (good / needs-improvement / poor).

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { pageName, trackEvent } from './analytics';
import { CONSENT_EVENT, GA_ID, readConsent, type ConsentState } from './consent';

const queue: Metric[] = [];

function send(m: Metric) {
  trackEvent('web_vitals', {
    metric_name: m.name,
    // CLS é adimensional; os demais em ms. Inteiro, como o GA4 recomenda.
    value: Math.round(m.name === 'CLS' ? m.value * 1000 : m.value),
    metric_rating: m.rating,
    metric_id: m.id,
    pagina: pageName(),
  });
}

function report(m: Metric) {
  const consent = readConsent();
  if (consent?.analytics) send(m);
  else if (!consent) queue.push(m); // ainda sem escolha: guarda para o caso de aceitar
}

let started = false;

export function initVitals() {
  if (started || !GA_ID) return;
  started = true;
  window.addEventListener(CONSENT_EVENT, (e) => {
    const state = (e as CustomEvent<ConsentState>).detail;
    if (state?.analytics) queue.splice(0).forEach(send);
    else queue.length = 0;
  });
  onLCP(report);
  onINP(report);
  onCLS(report);
  onFCP(report);
  onTTFB(report);
}
