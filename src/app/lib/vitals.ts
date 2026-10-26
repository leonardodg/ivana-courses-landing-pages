// Core Web Vitals reais dos visitantes (LCP, INP, CLS, FCP, TTFB), enviados ao GA4 como
// eventos "web_vitals" — só depois do consentimento de Estatísticas (trackEvent é no-op sem ele).
// No GA4 (Explorar) filtre por metric_name e compare metric_rating (good / needs-improvement / poor).

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { trackEvent } from './analytics';
import { GA_ID } from './consent';

function report(m: Metric) {
  trackEvent('web_vitals', {
    metric_name: m.name,
    // CLS é adimensional; os demais em ms. Inteiro, como o GA4 recomenda.
    value: Math.round(m.name === 'CLS' ? m.value * 1000 : m.value),
    metric_rating: m.rating,
    metric_id: m.id,
    pagina: location.pathname.replace(/^\/|\/$/g, '') || 'home',
  });
}

let started = false;

export function initVitals() {
  if (started || !GA_ID) return;
  started = true;
  onLCP(report);
  onINP(report);
  onCLS(report);
  onFCP(report);
  onTTFB(report);
}
