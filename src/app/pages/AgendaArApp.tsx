// Agenda da Argentina (/es_ar/agenda/): a Cohorte 2027 das carreras online, vinda do feed (pais=AR).
// Mesmo padrão de AgendaApp (Brasil), em espanhol e no fuso America/Argentina/Buenos_Aires.
// Sem preço: o feed traz `price` ("$40.000 por mes") e este arquivo NUNCA o lê.

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import Footer from '../components/Footer';
import SkipLink from '../components/SkipLink';
import { AgendaEvent, useAgenda } from '../hooks/useAgenda';
import { carreras_ar, carreras_principales, CarreraAr, WHATSAPP_AR, whatsappInscripcion } from '../data/carreras_ar';
import { InscribirmeButton, btnOutline, btnPrimary, etapaLabel, fmtFull, fmtRange } from '../components/theme/CareerSections';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary';
const AR = { timeZone: 'America/Argentina/Buenos_Aires' } as const;

const todayIso = () => new Date().toLocaleDateString('en-CA', AR);
const isStart = (e: AgendaEvent) => /^modulo\s+1\//i.test(e.etapa ?? '');

function CarreraAgenda({ carrera, etapas }: { carrera: CarreraAr; etapas: AgendaEvent[] }) {
  const [open, setOpen] = useState(false);
  const inicio = etapas.find(isStart) ?? etapas[0];
  const hoy = todayIso();

  return (
    <li>
      <article className="rounded-2xl border border-surface-container-highest bg-surface-cream p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h3 className="font-serif text-2xl leading-8 text-tertiary">{carrera.nombre}</h3>
        <p className="text-sm text-on-surface-variant mt-1">
          {inicio?.turma ?? 'Cohorte 2027'} · 100% online · {carrera.meses} meses
        </p>

        {inicio ? (
          <p className="mt-4 text-base text-on-surface-variant">
            <span className="font-semibold text-on-surface">Inicio de cursada:</span> {fmtFull(inicio.date)}
            <span className="block text-sm text-primary font-semibold mt-1">Inscripción abierta todo el año</span>
          </p>
        ) : (
          <p className="mt-4 text-base text-on-surface-variant">La fecha de inicio se confirma más adelante.</p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <InscribirmeButton carrera={carrera} />
          {!inicio && (
            <a href={whatsappInscripcion(carrera)} className={btnOutline}>Consultar fecha por WhatsApp</a>
          )}
        </div>

        {etapas.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className={`mt-4 flex min-h-11 w-full items-center justify-between gap-2 border-t border-surface-container-highest pt-3 text-sm font-semibold text-tertiary ${FOCUS}`}
            >
              Cronograma de la cohorte ({etapas.length} etapas)
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {open && (
              <ol className="divide-y divide-surface-container-highest">
                {etapas.map((e) => {
                  const pasada = (e.end_date ?? e.date) < hoy;
                  return (
                    <li key={e.id} className={`flex items-baseline justify-between gap-4 py-2.5 text-sm ${pasada ? 'opacity-60' : ''}`}>
                      <span className="text-on-surface">{etapaLabel(e)}</span>
                      <span className="text-right text-on-surface-variant">{fmtRange(e.date, e.end_date)}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        )}
      </article>
    </li>
  );
}

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
    <div className="flex min-h-screen flex-col justify-between bg-surface-cream font-sans text-on-surface">
      <header className="border-b border-surface-container-highest">
        <SkipLink />
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-16">
          <a href="/es_ar/" aria-label="Ivana Academy - inicio" className={`flex min-h-11 items-center rounded-lg ${FOCUS}`}>
            <img src="/images/logo.svg" alt="Ivana Academy" className="h-10 w-auto" />
          </a>
          <a href="/es_ar/" className={`inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-tertiary underline underline-offset-4 ${FOCUS}`}>
            Ver todas las carreras
          </a>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-8 md:px-16 md:py-20 lg:grid-cols-12 lg:gap-16">
          <aside className="min-w-0 space-y-6 lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-8">
              <p className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.05em] text-tertiary">
                <CalendarDays className="h-4 w-4" aria-hidden /> Carreras online · Cohorte 2027
              </p>
              <h1 className="font-serif text-[28px] leading-9 text-on-surface md:text-5xl md:leading-[56px]">
                Agenda de las carreras
              </h1>
              <p className="max-w-md text-base text-on-surface-variant">
                Fecha de inicio y cronograma de cada carrera. La inscripción está abierta todo el año.
              </p>

              <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer" className={`${btnOutline} inline-flex`}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Hablar por WhatsApp
              </a>

              <div
                className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
                role="group"
                aria-label="Filtrar por carrera"
              >
                {['', ...carreras_principales].map((c) => (
                  <button
                    key={c || 'todas'}
                    type="button"
                    onClick={() => setFiltro(c)}
                    aria-pressed={filtro === c}
                    className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition ${FOCUS} ${
                      filtro === c
                        ? 'border-primary-container bg-primary-container text-on-primary-container'
                        : 'border-surface-container-highest bg-surface-cream text-on-surface-variant hover:border-primary-container'
                    }`}
                  >
                    {c ? carreras_ar[c].nombre : 'Todas las carreras'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 space-y-6 lg:col-span-8" aria-live="polite">
            {agenda.status === 'loading' && (
              <ul className="space-y-4" aria-busy="true" aria-label="Cargando el calendario">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="h-40 rounded-2xl bg-surface-container motion-safe:animate-pulse" />
                ))}
              </ul>
            )}

            {agenda.status === 'error' && (
              <div className="space-y-4 rounded-2xl border border-surface-container-highest p-8 text-center">
                <p className="font-serif text-2xl text-tertiary">No pudimos cargar el calendario ahora.</p>
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

            {agenda.status === 'ready' && agenda.events.length === 0 && (
              <div className="space-y-4 rounded-2xl border border-surface-container-highest p-8 text-center">
                <p className="font-serif text-2xl text-tertiary">Próximamente el calendario de la Cohorte 2027</p>
                <p className="text-base text-on-surface-variant">Mientras tanto, consultanos por WhatsApp.</p>
                <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  <MessageCircle className="h-4 w-4" aria-hidden /> Consultar por WhatsApp
                </a>
              </div>
            )}

            {agenda.status === 'ready' && agenda.events.length > 0 && (
              <ul className="space-y-4">
                {lista.map((c) => (
                  <CarreraAgenda key={c} carrera={carreras_ar[c]} etapas={porCarrera.get(c) ?? []} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
