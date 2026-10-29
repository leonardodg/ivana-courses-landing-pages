// Agenda da Argentina (/es-ar/agenda/): a Cohorte 2027 das carreras online, vinda do feed (pais=AR).
// Mesmo layout e mesmo EventCard da agenda do Brasil (ui/AgendaLayout, ui/EventCard, ui/MonthNav, ui/FilterChips):
// cada etapa do cronograma (módulos, repaso, receso, cierre) é um card, separada por mês.
// Sem preço: o feed traz `price` ("$40.000 por mes") e este arquivo NUNCA o lê.

import { useMemo, useState } from 'react';
import { CalendarDays, Clock, MessageCircle, Monitor } from 'lucide-react';
import Footer from '../components/Footer';
import SiteNavbar from '../components/SiteNavbar';
import { AgendaEvent, useAgenda } from '../hooks/useAgenda';
import { monthTitle, useMonthPager } from '../hooks/useMonthPager';
import { carreras_ar, carreras_principales, WHATSAPP_AR } from '../data/carreras_ar';
import { InscribirmeButton, etapaLabel, fmtRange, nivelLabel } from '../components/theme/CareerSections';
import { AgendaLayout, EventBadge, EventCard, FilterChips, MonthNav, btnOutline, btnPrimary } from '../ui';

const isInicio = (e: AgendaEvent) => /^modulo\s+1\//i.test(e.etapa ?? '');

export default function AgendaArApp() {
  const [filtro, setFiltro] = useState<string>('');
  const agenda = useAgenda('AR');
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

  // Só as carreras que estão no calendário 2027 (mesma regra da página de cada carrera).
  const visibles = useMemo(
    () =>
      agenda.events
        .filter((e) => carreras_ar[e.course]?.enCalendario2027 && (!filtro || e.course === filtro))
        .sort((a, b) => a.date.localeCompare(b.date) || a.course.localeCompare(b.course)),
    [agenda.events, filtro],
  );
  const pager = useMonthPager(visibles, today);
  const sinEventos = agenda.status === 'ready' && agenda.events.length === 0;
  const emptyBox = 'space-y-4 rounded-2xl border border-muted bg-white p-8 text-center shadow-sm';

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <AgendaLayout
          kicker={<><CalendarDays className="h-4 w-4" aria-hidden /> Carreras online · Cohorte 2027</>}
          title="Agenda de las carreras"
          sub="Fecha de inicio y cronograma de cada carrera. La inscripción está abierta todo el año."
          aside={
            <>
              <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer" className={`${btnOutline} inline-flex`}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Hablar con Ivana
              </a>
              <FilterChips
                options={carreras_principales.map((c) => ({ value: c, label: carreras_ar[c].nombre }))}
                value={filtro}
                onChange={setFiltro}
                allLabel="Todas las carreras"
                ariaLabel="Filtrar por carrera"
              />
            </>
          }
        >
          {agenda.status === 'loading' && (
            <ul className="space-y-4" aria-busy="true" aria-label="Cargando el calendario">
              {[0, 1, 2].map((i) => (
                <li key={i} className="h-40 rounded-2xl bg-white border border-muted motion-safe:animate-pulse" />
              ))}
            </ul>
          )}

          {agenda.status === 'error' && (
            <div className={emptyBox}>
              <p className="font-serif text-2xl text-gray-900">No pudimos cargar el calendario ahora.</p>
              <p className="text-base text-on-surface-variant">Revisá tu conexión y probá de nuevo, o escribinos por WhatsApp.</p>
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

          {(sinEventos || (agenda.status === 'ready' && visibles.length === 0)) && (
            <div className={emptyBox}>
              <CalendarDays className="w-6 h-6 text-primary mx-auto" aria-hidden />
              <p className="font-serif text-2xl text-gray-900">
                {filtro && !carreras_ar[filtro].enCalendario2027
                  ? 'La fecha de inicio se confirma más adelante.'
                  : 'Próximamente el calendario de la Cohorte 2027'}
              </p>
              <p className="text-base text-on-surface-variant">Mientras tanto, consultanos por WhatsApp.</p>
              <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} inline-flex`}>
                <MessageCircle className="w-4 h-4" aria-hidden /> Consultar por WhatsApp
              </a>
            </div>
          )}

          {pager.month && (
            <>
              <MonthNav
                label={monthTitle(pager.month, 'es-AR')}
                count={`${pager.items.length} ${pager.items.length === 1 ? 'etapa' : 'etapas'}`}
                onPrev={pager.prev}
                onNext={pager.next}
                prevLabel="Mes anterior"
                nextLabel="Mes siguiente"
              />
              <ul className="space-y-4">
                {pager.items.map((e) => {
                  const carrera = carreras_ar[e.course];
                  const inicio = isInicio(e);
                  const badges: EventBadge[] = [
                    ...(inicio ? [{ label: 'Inicio de cursada', tone: 'accent' as const }] : []),
                    { label: nivelLabel(carrera) },
                    { label: e.turma ?? 'Cohorte 2027' },
                  ];
                  return (
                    <EventCard
                      key={e.id}
                      date={e.date}
                      locale="es-AR"
                      featured={inicio}
                      badges={badges}
                      title={etapaLabel(e)}
                      subtitle={carrera.nombre}
                      lines={[
                        <>
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                          {fmtRange(e.date, e.end_date)}
                        </>,
                        <>
                          <Monitor className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                          100% online · inscripción abierta todo el año
                        </>,
                      ]}
                      actions={inicio ? <InscribirmeButton carrera={carrera} /> : undefined}
                    />
                  );
                })}
              </ul>
            </>
          )}
        </AgendaLayout>
      </main>

      <Footer />
    </div>
  );
}
