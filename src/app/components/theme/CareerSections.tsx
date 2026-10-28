// Blocos das páginas de carreras online da Argentina (espanhol rioplatense).
// SEGUEM O GUIA DE ESTILO (docs/GUIA-DE-ESTILO.md): mesmos componentes e medidas das páginas pt_BR
// (ThemeSections.tsx): CarreraCard = CursoCard, CohorteSection = TurmasSection (item TurmaCard),
// ComoInscribirmeSection = ComoFuncionaSection, InclusoSection, contato em pílula.
//
// REGRAS: nenhum preço (nem o campo `price` do feed). O valor só aparece na tienda.
// Datas vêm do feed (useAgenda('AR')); textos e temario, de data/carreras_ar.ts.

import { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Gift,
  GraduationCap,
  Mail,
  Monitor,
  Medal,
  Users,
} from 'lucide-react';
import type { AgendaEvent, AgendaState } from '../../hooks/useAgenda';
import { CarreraAr, carreras_ar, carreras_principales, ar_pages, tiendaLink, whatsappInscripcion, WHATSAPP_AR } from '../../data/carreras_ar';
import type { NavMenu } from '../CandlesNavbar';
import { trackSelectCareer } from '../../lib/analytics';
import type { FAQItem } from '../../classes/types';

/* Botões: os mesmos de ThemeSections (botão de card/lista, retangular) e do herói (pílula). */
export const btnPrimary =
  'flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer min-h-11';
export const btnOutline =
  'flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer min-h-11';
export const heroPrimary =
  'bg-primary hover:bg-opacity-95 text-white font-semibold font-mono text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer min-h-11';
export const heroSecondary =
  'inline-flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary border border-subtle bg-white/80 hover:bg-white text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full transition-all min-h-11';

const sectionHeader = (kicker: string, title: string, sub?: string) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">{kicker}</span>
    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{title}</h2>
    {sub && <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{sub}</p>}
  </div>
);

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fmtDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
export const fmtRange = (a: string, b?: string | null) => (b && b !== a ? `${fmtDay(a)} al ${fmtDay(b)}` : fmtDay(a));
export const fmtFull = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const nivelLabel = (c: CarreraAr) => (c.nivel === 'tecnicatura' ? 'Tecnicatura' : 'Profesorado');

/* ── Opções do menu da Argentina (navbar de tema, em pílulas) ────────── */
export function buildArMenu(ptHref?: string): NavMenu {
  return {
    careersLabel: 'Carreras',
    careers: carreras_principales.map((c) => ({ label: carreras_ar[c].nombre, href: ar_pages[carreras_ar[c].page].path })),
    links: [
      { label: 'Agenda', href: '/es_ar/agenda/' },
      { label: 'Cómo inscribirme', href: '#inscripcion' },
      { label: 'WhatsApp', href: WHATSAPP_AR, external: true },
    ],
    ptHref,
  };
}

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

/* ── Card de carrera (= CursoCard do Brasil) e grade ─────────────────── */
export function CarreraCard({ carrera, href }: { carrera: CarreraAr; href?: string }) {
  const cont = carrera.continuaCon ? carreras_ar[carrera.continuaCon] : null;
  const beneficios = [
    `${nivelLabel(carrera)} de ${carrera.meses} meses, un módulo por mes`,
    'Título del Conservatorio Grassi, con validez internacional',
    cont ? `Podés continuar con el Profesorado (+${cont.meses} meses)` : 'Evaluación y seguimiento en cada módulo',
  ];
  return (
    <article
      id={carrera.course}
      className="scroll-mt-24 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-muted overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-hero">
        {href && <a href={href} aria-label={carrera.nombre} className="absolute inset-0 z-10" />}
        <img
          src={carrera.image}
          alt={carrera.nombre}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: carrera.imagePos }}
          className="w-full h-full object-cover select-none"
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-micro font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          100% online
        </span>
      </div>

      <div className="p-6 md:p-8 flex flex-col grow">
        <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug mb-4">
          {href ? <a href={href}>{carrera.nombre}</a> : carrera.nombre}
        </h3>

        <ul className="space-y-2 mb-5">
          {beneficios.map((b) => (
            <li key={b} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-5 border-t border-muted pt-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            {carrera.meses} meses
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
            Inscripción abierta todo el año
          </span>
        </div>

        <div className="mt-auto">
          <InscribirmeButton carrera={carrera} className="w-full" />
          {href && (
            <a href={href} className="flex min-h-11 items-center justify-center text-xs text-primary underline mt-1">
              Ver el plan de la carrera
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Mesma grade do Brasil: 2 colunas, gap-8 lg:gap-10; 1 card = max-w-md, 2 cards = max-w-4xl. */
export function CarrerasGrid({ items, linkTo }: { items: CarreraAr[]; linkTo?: (c: CarreraAr) => string | undefined }) {
  const width = items.length === 1 ? 'max-w-md' : items.length === 2 ? 'max-w-4xl' : '';
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mx-auto ${width}`}>
      {items.map((c) => (
        <CarreraCard key={c.course} carrera={c} href={linkTo?.(c)} />
      ))}
    </div>
  );
}

/* ── Cohorte (= TurmasSection do Brasil) ─────────────────────────────── */
export const etapaLabel = (e: AgendaEvent) => {
  const raw = (e.etapa ?? '').toLowerCase();
  const m = raw.match(/^modulo\s+(\d+)\/(\d+)/);
  if (m) return `Módulo ${m[1]} de ${m[2]}`;
  if (raw === 'repaso') return 'Repaso';
  if (raw === 'receso') return 'Receso';
  if (raw === 'cierre') return 'Cierre del ciclo';
  return e.etapa ?? e.title;
};

export function CohorteSection({ carrera, agenda }: { carrera: CarreraAr; agenda: AgendaState }) {
  const [open, setOpen] = useState(false);
  const etapas = agenda.events
    .filter((e) => e.course === carrera.course)
    .sort((a, b) => a.date.localeCompare(b.date));
  const inicio = etapas.find((e) => /^modulo\s+1\//i.test(e.etapa ?? '')) ?? etapas[0];
  const turma = inicio?.turma ?? 'Cohorte 2027';

  const vacio = (msg: string, sub?: string) => (
    <div className="bg-white rounded-2xl border border-muted p-6 text-center">
      <CalendarDays className="w-6 h-6 text-primary mx-auto mb-2" />
      <p className="text-sm text-gray-900 font-semibold">{msg}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-1">{sub}</p>}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <a href={whatsappInscripcion(carrera)} className={btnPrimary}>Consultar por WhatsApp</a>
        <a href="/es_ar/agenda/" className={btnOutline}>Ver agenda completa</a>
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
    const [, m, day] = inicio.date.split('-');
    body = (
      <>
        {/* Mesmo item do TurmaCard (BR): data à esquerda, dados no meio, botão à direita */}
        <ul className="space-y-4">
          <li className="bg-white rounded-2xl border border-muted shadow-sm overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="w-14 shrink-0 text-center font-serif text-3xl leading-none text-gray-900">
                {Number(day)}
                <small className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
                  {MESES[Number(m) - 1]}
                </small>
              </span>

              <span className="grow text-sm text-gray-900 min-w-0">
                <span className="font-semibold block">Inicio de cursada · {turma}</span>
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                  <Clock className="w-3 h-3 text-primary shrink-0" />
                  {etapaLabel(inicio)} · desde el {fmtFull(inicio.date)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <Monitor className="w-3 h-3 text-primary shrink-0" />
                  100% online · inscripción abierta todo el año
                </span>
              </span>

              <InscribirmeButton carrera={carrera} />
            </div>

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
          </li>
        </ul>
        <a
          href="/es_ar/agenda/"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:underline"
        >
          Agenda completa y siempre actualizada <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </>
    );
  }

  return (
    <section id="cohorte" className="py-16 md:py-24 bg-surface-cream">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('COHORTE 2027', 'Cuándo empezás', 'La inscripción está abierta todo el año. Podés sumarte en cualquier momento.')}
        {body}
      </div>
    </section>
  );
}

/* ── Qué vas a aprender ─────────────────────────────────────────────── */
export function QueAprenderSection({ carrera }: { carrera: CarreraAr }) {
  // O temario é rascunho (títulos de apostilas): só aparece em DEV até a Ivana confirmar.
  const borrador = import.meta.env.DEV && carrera.temarioBorrador.length > 0;
  return (
    <section id="plan" className="py-16 md:py-24 bg-surface-cream">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('QUÉ VAS A APRENDER', 'Un módulo por mes', `${carrera.meses} meses de cursada, con evaluación y seguimiento en cada módulo.`)}
        {borrador ? (
          <div className="rounded-2xl border border-dashed border-primary/40 bg-white p-6">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-primary mb-3">Borrador (solo desarrollo): temario sin confirmar</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-900">
              {carrera.temarioBorrador.map((t) => (
                <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-sm text-on-surface-variant leading-relaxed">
            Plan de estudios: un módulo por mes, con evaluación y seguimiento.
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Cómo es la cursada (mesmo desenho dos passos do Brasil) ────────── */
export function CursadaSection() {
  const items = [
    { icon: CalendarDays, title: 'Un módulo por mes', text: 'Avanzás a tu ritmo dentro de cada módulo, con una propuesta clara por mes.' },
    { icon: Monitor, title: 'Campus virtual', text: 'Las clases están en el campus virtual de Ivana Academy, disponibles cuando te quede cómodo.' },
    { icon: Users, title: 'Grupo de la carrera', text: 'Al matricularte te sumamos al grupo, para consultas y acompañamiento.' },
    { icon: Medal, title: 'Evaluación y seguimiento', text: 'Cada módulo tiene evaluación, y los exámenes pueden rendirse online.' },
  ];
  return (
    <section id="cursada" className="py-16 md:py-24 bg-white border-t border-muted">
      <div className="max-w-[1100px] mx-auto px-6">
        {sectionHeader('CÓMO ES LA CURSADA', '100% online, con acompañamiento')}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <li key={it.title} className="bg-surface-cream rounded-2xl p-6 border border-muted">
              <it.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-serif text-lg text-gray-900">{it.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{it.text}</p>
            </li>
          ))}
        </ul>
        <p className="text-center mt-8">
          <a href="https://ivana.academy" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-xs text-primary underline">Campus virtual</a>
        </p>
      </div>
    </section>
  );
}

/* ── Cómo inscribirme (= ComoFuncionaSection do Brasil) ─────────────── */
export function ComoInscribirmeSection() {
  const steps = [
    { icon: GraduationCap, title: 'Elegís la carrera', text: 'Mirá el plan y la fecha de inicio y tocá "Ver valores e inscribirme".' },
    { icon: Mail, title: 'Te registrás en la tienda', text: 'Creás tu cuenta con tus datos, en la tienda de Ivana Academy.' },
    { icon: CreditCard, title: 'Te suscribís con Mercado Pago', text: 'Pagás una cuota mensual con Mercado Pago.' },
    { icon: Monitor, title: 'Recibís el acceso', text: 'Entrás al campus virtual y al grupo de tu carrera.' },
  ];
  return (
    <section id="inscripcion" className="py-16 md:py-24 bg-surface-cream border-t border-muted">
      <div className="max-w-[1100px] mx-auto px-6">
        {sectionHeader('CÓMO INSCRIBIRME', 'Inscribirte es simple')}
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-white rounded-2xl p-6 border border-muted">
              <span className="flex items-center gap-2 text-primary font-mono font-bold text-xs mb-3">
                <s.icon className="w-4 h-4" /> {i + 1}
              </span>
              <h3 className="font-serif text-lg text-gray-900">{s.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs text-on-surface-variant text-center mt-8 max-w-xl mx-auto leading-relaxed">
          El valor lo ves en la tienda, antes de confirmar. ¿Preferís inscribirte por WhatsApp? Escribinos y te ayudamos.{' '}
          <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>.
        </p>
      </div>
    </section>
  );
}

/* ── Incluido en todas (= InclusoSection do Brasil) ─────────────────── */
export function InclusoSection() {
  const items = ['Clases en el campus virtual', 'Grupo de la carrera', 'Evaluación y seguimiento', 'Título del Conservatorio Grassi'];
  return (
    <section id="incluido" className="py-16 md:py-20 bg-white border-t border-muted">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('INCLUIDO EN TODAS', 'Todo lo que necesitás para cursar')}
        <ul className="grid grid-cols-2 gap-4">
          {items.map((i) => (
            <li key={i} className="bg-surface-cream rounded-xl border border-muted p-4 flex items-center gap-3 text-sm text-gray-900">
              <Gift className="w-5 h-5 text-primary shrink-0" />
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Salida laboral ─────────────────────────────────────────────────── */
export function SalidaLaboralSection() {
  return (
    <section id="salida-laboral" className="py-16 md:py-20 bg-surface-cream border-t border-muted">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {sectionHeader('SALIDA LABORAL', 'Armá tu propio taller')}
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Las egresadas pueden armar sus talleres adheridos al Conservatorio Grassi en sus localidades, con el nombre que
          elijan y bajo su dirección. Sus alumnas también pueden obtener el título del Conservatorio.
        </p>
      </div>
    </section>
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

/* ── Contacto (= bloco de contato das páginas de tema do Brasil) ────── */
export const WhatsAppFooterCta = () => (
  <section id="contacto" className="py-16 bg-white border-t border-muted text-center px-6">
    <h2 className="text-2xl md:text-3xl font-serif text-gray-900">¿Te quedó alguna duda?</h2>
    <p className="text-sm text-on-surface-variant mt-2">Escribinos por WhatsApp.</p>
    <a
      href={WHATSAPP_AR}
      target="_blank"
      rel="noreferrer"
      className="mt-6 inline-flex min-h-11 items-center gap-2 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full"
    >
      Hablar por WhatsApp
    </a>
    <p className="mt-4 text-xs"><a href="/es_ar/agenda/" className="inline-flex min-h-11 items-center underline text-primary">Agenda completa</a></p>
  </section>
);
