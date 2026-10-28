// Agenda da Argentina (/es-ar/agenda/): a Cohorte 2027 das carreras online, vinda do feed (pais=AR).
// Mesmo padrão das páginas AR: navbar, Section, SectionHeader e CohorteRow (o mesmo item da página da carreira).
// Sem preço: o feed traz `price` ("$40.000 por mes") e este arquivo NUNCA o lê.

import { useMemo, useState } from 'react';
import { CalendarDays, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import Footer from '../components/Footer';
import CandlesNavbar from '../components/CandlesNavbar';
import { AgendaEvent, useAgenda } from '../hooks/useAgenda';
import { carreras_ar, carreras_principales, WHATSAPP_AR, whatsappInscripcion } from '../data/carreras_ar';
import { CohorteRow, buildArMenu } from '../components/theme/CareerSections';
import { Section, SectionHeader, btnOutline, btnPrimary, navGroupClass, navPill } from '../ui';

export default function AgendaArApp() {
  const [language, setLanguage] = useState<Language>('es');
  const [filtro, setFiltro] = useState<string>('');
  const agenda = useAgenda('AR');

  const porCarrera = useMemo(() => {
    const m = new Map<string, AgendaEvent[]>();
    for (const e of agenda.events) m.set(e.course, [...(m.get(e.course) ?? []), e].sort((a, b) => a.date.localeCompare(b.date)));
    return m;
  }, [agenda.events]);

  const lista = carreras_principales.filter((c) => !filtro || c === filtro);

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CandlesNavbar language="es" menu={buildArMenu(undefined, '/es-ar/')} />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Section bg="cream" width="wide" className="pt-28 md:pt-32">
          <SectionHeader
            kicker="CARRERAS ONLINE · COHORTE 2027"
            title="Agenda de las carreras"
            sub="Fecha de inicio y cronograma de cada carrera. La inscripción está abierta todo el año."
          />

          <div className="flex justify-center mb-10">
            <div className={`flex flex-wrap justify-center ${navGroupClass} rounded-3xl`} role="group" aria-label="Filtrar por carrera">
              {['', ...carreras_principales].map((c) => (
                <button key={c || 'todas'} type="button" onClick={() => setFiltro(c)} aria-pressed={filtro === c} className={navPill(filtro === c)}>
                  {c ? carreras_ar[c].nombre : 'Todas las carreras'}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6" aria-live="polite">
            {agenda.status === 'loading' && <p className="text-center text-sm text-on-surface-variant">Cargando el calendario…</p>}

            {agenda.status === 'error' && (
              <div className="bg-white rounded-2xl border border-muted p-6 text-center space-y-3">
                <p className="font-serif text-xl text-gray-900">No pudimos cargar el calendario ahora.</p>
                <p className="text-sm text-on-surface-variant">Revisá tu conexión y probá de nuevo, o escribinos por WhatsApp.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => window.location.reload()} className={btnPrimary}>Probar de nuevo</button>
                  <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer" className={btnOutline}>Escribir por WhatsApp</a>
                </div>
              </div>
            )}

            {agenda.status === 'ready' && agenda.stale && (
              <p className="rounded-lg bg-secondary-container px-4 py-3 text-sm text-on-secondary-container">
                Mostramos el último calendario guardado en este dispositivo. Confirmá las fechas por WhatsApp.
              </p>
            )}

            {agenda.status === 'ready' && agenda.events.length === 0 && (
              <div className="bg-white rounded-2xl border border-muted p-6 text-center space-y-3">
                <CalendarDays className="w-6 h-6 text-primary mx-auto" />
                <p className="font-serif text-xl text-gray-900">Próximamente el calendario de la Cohorte 2027</p>
                <p className="text-sm text-on-surface-variant">Mientras tanto, consultanos por WhatsApp.</p>
                <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} inline-flex`}>
                  <MessageCircle className="w-4 h-4" aria-hidden /> Consultar por WhatsApp
                </a>
              </div>
            )}

            {agenda.status === 'ready' && agenda.events.length > 0 &&
              lista.map((c) => {
                const carrera = carreras_ar[c];
                // Mesma regra da página da carreira: só mostra fecha se a carrera está no calendario 2027.
                const etapas = carrera.enCalendario2027 ? porCarrera.get(c) ?? [] : [];
                return (
                  <article key={c} className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug">{carrera.nombre}</h3>
                    {etapas.length > 0 ? (
                      <ul className="space-y-4">
                        <CohorteRow carrera={carrera} etapas={etapas} tone="white" />
                      </ul>
                    ) : (
                      <div className="bg-white rounded-2xl border border-muted p-5 text-center">
                        <p className="text-sm text-gray-900 font-semibold">La fecha de inicio se confirma más adelante.</p>
                        <a href={whatsappInscripcion(carrera)} className={`${btnOutline} mt-3 inline-flex`}>Consultar fecha por WhatsApp</a>
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        </Section>
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
