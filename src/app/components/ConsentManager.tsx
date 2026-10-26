// Banner e painel de preferências de cookies. Montado em todas as páginas.
// Só aparece se houver algo a consentir (hasTrackers) e a escolha ainda não foi feita,
// ou quando o visitante abre "Preferências de cookies" no rodapé.

import { useEffect, useRef, useState } from 'react';
import {
  hasTrackers,
  initConsent,
  readConsent,
  saveConsent,
  OPEN_PREFS_EVENT,
} from '../lib/consent';
import { initTracking } from '../lib/analytics';
import { initVitals } from '../lib/vitals';
import { usePageLanguage } from '../lib/lang';

const TEXT = {
  pt: {
    title: 'Sua privacidade',
    intro: 'Usamos o armazenamento essencial para o site funcionar. Com a sua permissão, também usamos o Google Analytics para entender, sem identificar você, quais páginas ajudam mais. Você pode mudar de ideia quando quiser em “Preferências de cookies”, no rodapé. Saiba mais na',
    policy: 'Política de Privacidade',
    legend: 'Categorias de cookies',
    essentialTitle: 'Essenciais',
    essentialDesc: '(sempre ativos): lembram a sua escolha de cookies e guardam a agenda para o site carregar mais rápido.',
    statsTitle: 'Estatísticas',
    statsDesc: ': Google Analytics 4, com dados agregados de visitas. Não usamos cookies de publicidade.',
    acceptAll: 'Aceitar todos',
    refuse: 'Recusar não essenciais',
    save: 'Salvar preferências',
    customize: 'Personalizar',
  },
  es: {
    title: 'Tu privacidad',
    intro: 'Usamos el almacenamiento esencial para que el sitio funcione. Con tu permiso, también usamos Google Analytics para entender, sin identificarte, qué páginas ayudan más. Podés cambiar de opinión cuando quieras en “Preferencias de cookies”, al pie de la página. Más información en la',
    policy: 'Política de Privacidad',
    legend: 'Categorías de cookies',
    essentialTitle: 'Esenciales',
    essentialDesc: '(siempre activas): recuerdan tu elección de cookies y guardan la agenda para que el sitio cargue más rápido.',
    statsTitle: 'Estadísticas',
    statsDesc: ': Google Analytics 4, con datos agregados de visitas. No usamos cookies de publicidad.',
    acceptAll: 'Aceptar todas',
    refuse: 'Rechazar no esenciales',
    save: 'Guardar preferencias',
    customize: 'Personalizar',
  },
} as const;

const btnPrimary =
  'bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer';
const btnOutline =
  'border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer';

export default function ConsentManager() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lang = usePageLanguage();
  const t = TEXT[lang];

  useEffect(() => {
    initConsent();
    initTracking();
    initVitals();
    const saved = readConsent();
    setAnalytics(saved?.analytics ?? false);
    if (hasTrackers() && !saved) setOpen(true);

    const onOpen = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_PREFS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, onOpen);
  }, []);

  // Foco no painel ao abrir; Esc fecha só se já houver escolha guardada.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && readConsent()) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, details]);

  if (!open) return null;

  const choose = (value: boolean) => {
    saveConsent(value);
    setAnalytics(value);
    setOpen(false);
    setDetails(false);
  };

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-5 focus:outline-none"
    >
      <div className="max-w-3xl mx-auto bg-white border border-subtle rounded-2xl shadow-2xl p-5 sm:p-6">
        <h2 id="consent-title" className="font-serif text-lg text-gray-900">{t.title}</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
          {t.intro}{' '}
          <a href={lang === 'es' ? '/es_ar/privacidad/#cookies' : '/pt_br/privacidade/#cookies'} className="underline text-primary">{t.policy}</a>.
        </p>

        {details && (
          <fieldset className="mt-4 space-y-3 border-t border-muted pt-4">
            <legend className="sr-only">{t.legend}</legend>
            <label className="flex items-start gap-3 text-xs text-gray-900">
              <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4 accent-[#805252]" />
              <span>
                <strong>{t.essentialTitle}</strong> {t.essentialDesc}
              </span>
            </label>
            <label className="flex items-start gap-3 text-xs text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#805252]"
              />
              <span>
                <strong>{t.statsTitle}</strong>{t.statsDesc}
              </span>
            </label>
          </fieldset>
        )}

        <div className="flex flex-wrap gap-3 mt-5">
          <button type="button" onClick={() => choose(true)} className={btnPrimary}>{t.acceptAll}</button>
          <button type="button" onClick={() => choose(false)} className={btnOutline}>{t.refuse}</button>
          {details ? (
            <button type="button" onClick={() => choose(analytics)} className={btnOutline}>{t.save}</button>
          ) : (
            <button type="button" onClick={() => setDetails(true)} className="text-xs underline text-primary px-2 cursor-pointer">
              {t.customize}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
