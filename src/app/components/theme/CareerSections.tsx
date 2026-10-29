// Blocos das páginas de carreras online da Argentina (espanhol rioplatense).
// Visual SEMPRE pelos componentes de ../../ui (os mesmos do Brasil): Section, SectionHeader, Card, EventCard,
// Steps, FeatureList, ContactCta. Para mudar o desenho de um bloco, edite o componente em ui/.
//
// REGRAS: nenhum preço (nem o campo `price` do feed). O valor só aparece na tienda.
// Datas vêm do feed (useAgenda('AR')); textos e temario, de data/carreras_ar.ts.

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  GraduationCap,
  Mail,
  Monitor,
  Medal,
  Users,
} from 'lucide-react';
import type { AgendaEvent, AgendaState } from '../../hooks/useAgenda';
import { CarreraAr, carreras_ar, tiendaLink, whatsappInscripcion, WHATSAPP_AR } from '../../data/carreras_ar';
import { trackSelectCareer } from '../../lib/analytics';
import type { FAQItem } from '../../classes/types';
import { Card, CardGrid, ContactCta, EventCard, FeatureList, Section, SectionHeader, Steps, btnOutline, btnPrimary, textLink } from '../../ui';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fmtDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
export const fmtRange = (a: string, b?: string | null) => (b && b !== a ? `${fmtDay(a)} al ${fmtDay(b)}` : fmtDay(a));
export const fmtFull = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const nivelLabel = (c: CarreraAr) => (c.nivel === 'tecnicatura' ? 'Tecnicatura' : 'Profesorado');

/* ── Botão "Ver valores e inscribirme" (botão de card/lista) ─────────── */
export function InscribirmeButton({
  carrera,
  variant = 'primary',
  className = '',
}: {
  carrera: CarreraAr;
  variant?: 'primary' | 'outline';
  className?: string;
}) {
  return (
    <a
      href={tiendaLink(carrera)}
      onClick={() => trackSelectCareer(carrera.course)}
      className={`${variant === 'primary' ? btnPrimary : btnOutline} ${className}`}
    >
      Ver valores e inscribirme <ArrowRight className="w-3.5 h-3.5" />
    </a>
  );
}

/* ── Card de carrera (o Card único do site) e grade ────────────────── */
/**
 * Temario da carrera: o confirmado (`carrera.temario`) em produção; em DEV, se ainda não houver confirmado,
 * o rascunho (import dinâmico, fora do build de produção). `draft` marca o rascunho.
 */
export function useTemario(carrera: CarreraAr): { items: string[]; draft: boolean } {
  const [borrador, setBorrador] = useState<string[]>([]);
  useEffect(() => {
    if (!import.meta.env.DEV || carrera.temario.length > 0) return;
    let active = true;
    import('../../data/carreras_ar_temario').then((m) => {
      if (active) setBorrador(m.temario_borrador[carrera.course] ?? []);
    });
    return () => {
      active = false;
    };
  }, [carrera.course, carrera.temario.length]);
  return carrera.temario.length > 0 ? { items: carrera.temario, draft: false } : { items: borrador, draft: borrador.length > 0 };
}

const INCLUIDO = ['Clases en el campus virtual', 'Grupo de la carrera', 'Evaluación y seguimiento', 'Título del Conservatorio Grassi'];

export function CarreraCard({ carrera, agenda, href }: { carrera: CarreraAr; agenda: AgendaState; href?: string }) {
  const cont = carrera.continuaCon ? carreras_ar[carrera.continuaCon] : null;
  const temario = useTemario(carrera);
  const etapas = agenda.events
    .filter((e) => e.course === carrera.course)
    .sort((a, b) => a.date.localeCompare(b.date));
  const inicio = carrera.enCalendario2027
    ? etapas.find((e) => /^modulo\s+1\//i.test(e.etapa ?? '')) ?? etapas[0]
    : undefined;

  // Início da cohorte no lugar das "turmas" (as carreras são online e a inscripción está abierta todo el año).
  const turma = inicio
    ? [{
        key: 'inicio',
        day: Number(inicio.date.split('-')[2]),
        month: MESES[Number(inicio.date.split('-')[1]) - 1],
        label: `Inicio de cursada · ${inicio.turma ?? 'Cohorte 2027'}`,
        href: tiendaLink(carrera),
      }]
    : [];
  const emptyText =
    agenda.status === 'loading'
      ? 'Cargando el calendario…'
      : agenda.status === 'error'
        ? 'No pudimos cargar el calendario ahora.'
        : !carrera.enCalendario2027
          ? 'La fecha de inicio se confirma más adelante.'
          : 'Próximamente el calendario de la Cohorte 2027.';

  const bullets = [
    `${nivelLabel(carrera)} de ${carrera.meses} meses, un módulo por mes`,
    'Título del Conservatorio Grassi, con validez internacional',
    cont ? `Podés continuar con el Profesorado (+${cont.meses} meses)` : 'Evaluación y seguimiento en cada módulo',
  ];

  return (
    <Card
      id={carrera.course}
      image={carrera.image}
      alt={carrera.nombre}
      imagePos={carrera.imagePos}
      tag="100% online"
      titleHref={href}
      title={carrera.nombre}
      bullets={bullets}
      meta={
        <>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            {carrera.meses} meses
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
            Inscripción abierta todo el año
          </span>
        </>
      }
      turmas={{ items: turma, emptyText }}
      cta={<InscribirmeButton carrera={carrera} className="w-full" />}
      // "Ver plan de estudios" só existe quando há temario (confirmado; em DEV, o rascunho).
      grade={temario.items.length === 0 ? undefined : {
        label: 'Ver plan de estudios',
        closeLabel: 'Cerrar',
        content: {
          image: carrera.image,
          imagePos: carrera.imagePos,
          tag: '100% online',
          title: carrera.nombre,
          intro: `${nivelLabel(carrera)} de ${carrera.meses} meses, con un módulo por mes y el acompañamiento de la profesora Ivana Lerea.`,
          facts: [
            { label: 'Duración', value: `${carrera.meses} meses` },
            { label: 'Modalidad', value: '100% online' },
          ],
          sections: [
            {
              title: temario.draft ? 'Temario (borrador, solo desarrollo)' : 'Plan de estudios: un módulo por mes',
              items: temario.items,
            },
            ...(inicio && etapas.length > 0
              ? [{ title: 'Cronograma de la cohorte', items: etapas.map((e) => `${etapaLabel(e)} · ${fmtRange(e.date, e.end_date)}`) }]
              : []),
            { title: 'Incluido', items: INCLUIDO },
          ],
          action: <InscribirmeButton carrera={carrera} />,
        },
      }}
      details={href ? { label: 'Ver el plan de la carrera', href } : undefined}
    />
  );
}

export function CarrerasGrid({
  items,
  agenda,
  linkTo,
}: {
  items: CarreraAr[];
  agenda: AgendaState;
  linkTo?: (c: CarreraAr) => string | undefined;
}) {
  return (
    <CardGrid count={items.length}>
      {items.map((c) => (
        <CarreraCard key={c.course} carrera={c} agenda={agenda} href={linkTo?.(c)} />
      ))}
    </CardGrid>
  );
}

/* ── Cohorte (= TurmasSection do Brasil, com o mesmo EventCard) ─────────── */
export const etapaLabel = (e: AgendaEvent) => {
  const raw = (e.etapa ?? '').toLowerCase();
  const m = raw.match(/^modulo\s+(\d+)\/(\d+)/);
  if (m) return `Módulo ${m[1]} de ${m[2]}`;
  if (raw === 'repaso') return 'Repaso';
  if (raw === 'receso') return 'Receso';
  if (raw === 'cierre') return 'Cierre del ciclo';
  return e.etapa ?? e.title;
};

/** Item da cohorte: data de início + botão + cronograma expansível. Usado na página da carreira e na agenda. */
export function CohorteRow({ carrera, etapas, tone = 'cream' }: { carrera: CarreraAr; etapas: AgendaEvent[]; tone?: 'white' | 'cream' }) {
  const [open, setOpen] = useState(false);
  const inicio = etapas.find((e) => /^modulo\s+1\//i.test(e.etapa ?? '')) ?? etapas[0];
  const turma = inicio?.turma ?? 'Cohorte 2027';
  return (
    <EventCard
            date={inicio.date}
            locale="es-AR"
            density="compact"
            title={`Inicio de cursada · ${turma}`}
            summary={`${etapaLabel(inicio)} · desde el ${fmtFull(inicio.date)}`}
            lines={[
              <>
                <Clock className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                {etapaLabel(inicio)} · desde el {fmtFull(inicio.date)}
              </>,
              <>
                <Monitor className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                100% online · inscripción abierta todo el año
              </>,
            ]}
            tone={tone}
            quickAction={<InscribirmeButton carrera={carrera} />}
            actions={<InscribirmeButton carrera={carrera} />}
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  className="w-full min-h-11 flex items-center justify-between gap-2 px-4 py-3 border-t border-muted text-xs font-mono font-bold uppercase tracking-wider text-primary hover:bg-surface-cream/60 cursor-pointer"
                >
                  Cronograma de la cohorte ({etapas.length} etapas)
                  <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <ol className="border-t border-muted divide-y divide-muted">
                    {etapas.map((e) => (
                      <li key={e.id} className="px-4 py-3 flex items-baseline justify-between gap-4 text-sm">
                        <span className="text-gray-900">{etapaLabel(e)}</span>
                        <span className="text-xs text-on-surface-variant text-right">{fmtRange(e.date, e.end_date)}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </>
            }
    />
  );
}

export function CohorteSection({ carrera, agenda }: { carrera: CarreraAr; agenda: AgendaState }) {
  const etapas = agenda.events
    .filter((e) => e.course === carrera.course)
    .sort((a, b) => a.date.localeCompare(b.date));

  const vacio = (msg: string, sub?: string) => (
    <div className="bg-surface-cream rounded-2xl border border-muted p-6 text-center">
      <CalendarDays className="w-6 h-6 text-primary mx-auto mb-2" />
      <p className="text-sm text-gray-900 font-semibold">{msg}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-1">{sub}</p>}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <a href={whatsappInscripcion(carrera)} className={btnPrimary}>Consultar por WhatsApp</a>
        <a href="/es-ar/agenda/" className={btnOutline}>Ver agenda completa</a>
      </div>
    </div>
  );

  let body;
  if (agenda.status === 'loading') {
    body = <p className="text-center text-sm text-on-surface-variant">Cargando el calendario…</p>;
  } else if (agenda.status === 'error') {
    body = vacio('No pudimos cargar el calendario ahora.', 'Escribinos y te pasamos las fechas.');
  } else if (!carrera.enCalendario2027) {
    body = vacio('La fecha de inicio se confirma más adelante.', 'Consultanos por WhatsApp y te avisamos.');
  } else if (etapas.length === 0) {
    body = vacio('Próximamente el calendario de la Cohorte 2027', 'Mientras tanto, consultanos por WhatsApp.');
  } else {
    body = (
      <>
        <ul className="space-y-4">
          <CohorteRow carrera={carrera} etapas={etapas} tone="cream" />
        </ul>
        <a
          href="/es-ar/agenda/"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:underline"
        >
          Agenda completa y siempre actualizada <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </>
    );
  }

  return (
    <Section id="cohorte" bg="white" width="narrow">
      <SectionHeader kicker="COHORTE 2027" title="Cuándo empezás" sub="La inscripción está abierta todo el año. Podés sumarte en cualquier momento." />
      {body}
    </Section>
  );
}

/* ── Qué vas a aprender ─────────────────────────────────────────────── */
export function QueAprenderSection({ carrera }: { carrera: CarreraAr }) {
  const temario = useTemario(carrera);
  return (
    <Section id="plan" bg="white" width="narrow">
      <SectionHeader kicker="QUÉ VAS A APRENDER" title="Un módulo por mes" sub={`${carrera.meses} meses de cursada, con evaluación y seguimiento en cada módulo.`} />
      {temario.items.length > 0 ? (
        <div className={`rounded-2xl bg-surface-cream p-6 ${temario.draft ? 'border border-dashed border-primary/40' : 'border border-muted'}`}>
          {temario.draft && (
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-primary mb-3">Borrador (solo desarrollo): temario sin confirmar</p>
          )}
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-900">
            {temario.items.map((t) => (
              <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-sm text-on-surface-variant leading-relaxed">
          Plan de estudios: un módulo por mes, con evaluación y seguimiento.
        </p>
      )}
    </Section>
  );
}

/* ── Cómo es la cursada (Steps sin número) ──────────────────────────── */
export function CursadaSection({ bg = 'cream' }: { bg?: 'cream' | 'white' }) {
  return (
    <Section id="cursada" bg={bg} border="top" width="mid">
      <SectionHeader kicker="CÓMO ES LA CURSADA" title="100% online, con acompañamiento" />
      <Steps
        numbered={false}
        tone={bg === 'cream' ? 'white' : 'cream'}
        items={[
          { icon: CalendarDays, title: 'Un módulo por mes', text: 'Avanzás a tu ritmo dentro de cada módulo, con una propuesta clara por mes.' },
          { icon: Monitor, title: 'Campus virtual', text: 'Las clases están en el campus virtual de Ivana Academy, disponibles cuando te quede cómodo.' },
          { icon: Users, title: 'Grupo de la carrera', text: 'Al matricularte te sumamos al grupo, para consultas y acompañamiento.' },
          { icon: Medal, title: 'Evaluación y seguimiento', text: 'Cada módulo tiene evaluación, y los exámenes pueden rendirse online.' },
        ]}
      />
      <p className="text-center mt-8">
        <a href="https://ivana.academy" target="_blank" rel="noreferrer" className={textLink}>Campus virtual</a>
      </p>
    </Section>
  );
}

/* ── Cómo inscribirme (= ComoFuncionaSection do Brasil) ─────────────── */
export function ComoInscribirmeSection({ bg = 'cream' }: { bg?: 'cream' | 'white' }) {
  return (
    <Section id="inscripcion" bg={bg} border="top" width="mid">
      <SectionHeader kicker="CÓMO INSCRIBIRME" title="Inscribirte es simple" />
      <Steps
        tone={bg === 'cream' ? 'white' : 'cream'}
        items={[
          { icon: GraduationCap, title: 'Elegís la carrera', text: 'Mirá el plan y la fecha de inicio y tocá "Ver valores e inscribirme".' },
          { icon: Mail, title: 'Te registrás en la tienda', text: 'Creás tu cuenta con tus datos, en la tienda de Ivana Academy.' },
          { icon: CreditCard, title: 'Te suscribís con Mercado Pago', text: 'Pagás una cuota mensual con Mercado Pago.' },
          { icon: Monitor, title: 'Recibís el acceso', text: 'Entrás al campus virtual y al grupo de tu carrera.' },
        ]}
      />
      <p className="text-xs text-on-surface-variant text-center mt-8 max-w-xl mx-auto leading-relaxed">
        El valor lo ves en la tienda, antes de confirmar. ¿Preferís inscribirte por WhatsApp? Escribinos y te ayudamos.{' '}
        <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>.
      </p>
    </Section>
  );
}

/* ── Incluido en todas (= InclusoSection do Brasil) ─────────────────── */
export function InclusoSection({ bg = 'white' }: { bg?: 'cream' | 'white' }) {
  return (
    <Section id="incluido" bg={bg} border="top" pad="md">
      <SectionHeader kicker="INCLUIDO EN TODAS" title="Todo lo que necesitás para cursar" />
      <FeatureList
        tone={bg === 'cream' ? 'white' : 'cream'}
        items={['Clases en el campus virtual', 'Grupo de la carrera', 'Evaluación y seguimiento', 'Título del Conservatorio Grassi']}
      />
    </Section>
  );
}

/* ── Salida laboral ─────────────────────────────────────────────────── */
export function SalidaLaboralSection() {
  return (
    <Section id="salida-laboral" bg="cream" border="top" pad="md">
      <SectionHeader kicker="SALIDA LABORAL" title="Armá tu propio taller" />
      <p className="text-center text-sm text-on-surface-variant leading-relaxed">
        Las egresadas pueden armar sus talleres adheridos al Conservatorio Grassi en sus localidades, con el nombre que
        elijan y bajo su dirección. Sus alumnas también pueden obtener el título del Conservatorio.
      </p>
    </Section>
  );
}

/* ── Preguntas frecuentes (sin precio) ──────────────────────────────── */
const faq = (id: string, q: string, a: string): FAQItem => ({ id, question: { pt: q, es: q }, answer: { pt: a, es: a } });

export const faqs_carreras_ar: FAQItem[] = [
  faq('ar1', '¿Cuánto dura la carrera?', 'Las tecnicaturas duran 9 meses, con un módulo por mes. El Profesorado en arte mix media dura 18 meses. En las carreras con continuación, el Profesorado suma 9 meses más.'),
  faq('ar2', '¿Qué título recibo?', 'El título es del Conservatorio Grassi, con validez internacional.'),
  faq('ar3', '¿Cómo accedo a las clases?', 'Las clases son 100% online y están en el campus virtual de Ivana Academy (ivana.academy). Al matricularte recibís el acceso y el link del grupo.'),
  faq('ar4', '¿Cuándo empiezo?', 'La inscripción está abierta todo el año. La fecha de inicio de la cohorte la ves en el calendario de cada carrera.'),
  faq('ar5', '¿Cómo me doy de baja?', 'Podés darte de baja cuando quieras desde "Mis carreras" en la tienda. Mientras la tienda no esté disponible, escribinos por WhatsApp. También podés consultar el derecho de arrepentimiento y la política de reembolso.'),
  faq('ar6', '¿Necesito cuenta de Mercado Pago?', 'La cuota mensual se gestiona con Mercado Pago. Si tenés dudas sobre cómo pagar, escribinos por WhatsApp y te ayudamos antes de inscribirte.'),
  faq('ar7', '¿Dónde veo el valor?', 'El valor se muestra en la tienda, cuando elegís la carrera e iniciás tu inscripción.'),
];

/* ── Contacto (ContactCta, o mesmo bloco do Brasil) ─────────────────── */
export const WhatsAppFooterCta = () => (
  <ContactCta
    id="contacto"
    title="¿Te quedó alguna duda?"
    text="Escribinos por WhatsApp."
    tone="cream"
    action={{ label: 'Hablar por WhatsApp', href: WHATSAPP_AR }}
    below={<p className="mt-4 text-xs"><a href="/es-ar/agenda/" className="inline-flex min-h-11 items-center underline text-primary">Agenda completa</a></p>}
  />
);
