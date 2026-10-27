// Blocos das páginas de carreras online da Argentina (espanhol rioplatense).
// Mesmo padrão de ThemeSections.tsx (Brasil): CarreraCard ~ CursoCard, CohorteSection ~ TurmasSection.
//
// REGRAS: nenhum preço (nem o campo `price` do feed). O valor só aparece na tienda.
// Datas vêm do feed (useAgenda('AR')); textos e temario, de data/carreras_ar.ts.

import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock, GraduationCap, MessageCircle, Monitor, Medal, Users } from 'lucide-react';
import type { AgendaEvent, AgendaState } from '../../hooks/useAgenda';
import {
  CarreraAr,
  carreras_ar,
  tiendaLink,
  whatsappInscripcion,
  WHATSAPP_AR,
} from '../../data/carreras_ar';
import { trackSelectCareer } from '../../lib/analytics';
import type { FAQItem } from '../../classes/types';

export const btnPrimary =
  'inline-flex min-h-11 items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer';
export const btnOutline =
  'inline-flex min-h-11 items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer';

const sectionHeader = (kicker: string, title: string, sub?: string) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">{kicker}</span>
    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{title}</h2>
    {sub && <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{sub}</p>}
  </div>
);

const fmtDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const fmtRange = (a: string, b?: string | null) => (b && b !== a ? `${fmtDay(a)} al ${fmtDay(b)}` : fmtDay(a));
const fmtFull = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const nivelLabel = (c: CarreraAr) => (c.nivel === 'tecnicatura' ? 'Tecnicatura' : 'Profesorado');

/* ── Botón "Ver valores e inscribirme" ──────────────────────────────── */
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

/* ── Card de carrera ────────────────────────────────────────────────── */
export function CarreraCard({ carrera, href }: { carrera: CarreraAr; href?: string }) {
  const cont = carrera.continuaCon ? carreras_ar[carrera.continuaCon] : null;
  return (
    <article id={carrera.course} className="scroll-mt-24 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-muted overflow-hidden flex flex-col h-full">
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
        <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug mb-3">
          {href ? <a href={href}>{carrera.nombre}</a> : carrera.nombre}
        </h3>
        <ul className="space-y-2 mb-5 text-xs text-on-surface-variant leading-relaxed">
          <li className="flex gap-2"><Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />{nivelLabel(carrera)} de {carrera.meses} meses · un módulo por mes</li>
          <li className="flex gap-2"><Medal className="w-4 h-4 text-primary shrink-0 mt-0.5" />Título del Conservatorio Grassi, con validez internacional</li>
          {cont && (
            <li className="flex gap-2"><GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />Continuás con el Profesorado (+{cont.meses} meses)</li>
          )}
        </ul>
        <div className="mt-auto space-y-3">
          <InscribirmeButton carrera={carrera} className="w-full" />
          {href && (
            <a href={href} className="flex min-h-11 items-center justify-center text-xs text-primary underline">Ver el plan de la carrera</a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Cohorte (cronograma desde el feed) ─────────────────────────────── */
const etapaLabel = (e: AgendaEvent) => {
  const raw = (e.etapa ?? '').toLowerCase();
  const m = raw.match(/^modulo\s+(\d+)\/(\d+)/);
  if (m) return `Módulo ${m[1]} de ${m[2]}`;
  if (raw === 'repaso') return 'Repaso';
  if (raw === 'receso') return 'Receso';
  if (raw === 'cierre') return 'Cierre del ciclo';
  return e.etapa ?? e.title;
};

export function CohorteSection({
  carrera,
  agenda,
}: {
  carrera: CarreraAr;
  agenda: AgendaState;
}) {
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
      <div className="mt-4 flex justify-center">
        <a href={whatsappInscripcion(carrera)} className={btnOutline}>Consultar por WhatsApp</a>
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
      <div className="bg-white rounded-2xl border border-muted shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="w-16 shrink-0 text-center font-serif text-3xl leading-none text-gray-900">
            {Number((inicio.date).split('-')[2])}
            <small className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
              {fmtDay(inicio.date).replace(/^\d+ de /, '')}
            </small>
          </span>
          <span className="grow text-sm text-gray-900">
            <span className="font-semibold block">Inicio de cursada · {turma}</span>
            <span className="text-xs text-on-surface-variant">{etapaLabel(inicio)} · desde el {fmtFull(inicio.date)}</span>
            <span className="block text-xs text-primary font-semibold mt-1">Inscripción abierta todo el año</span>
          </span>
          <InscribirmeButton carrera={carrera} />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full min-h-11 flex items-center justify-between gap-2 px-6 py-3 border-t border-muted text-xs font-mono font-bold uppercase tracking-wider text-primary hover:bg-surface-cream/60 cursor-pointer"
        >
          Cronograma de la cohorte ({etapas.length} etapas)
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <ol className="border-t border-muted divide-y divide-muted">
            {etapas.map((e) => (
              <li key={e.id} className="px-6 py-3 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-gray-900">{etapaLabel(e)}</span>
                <span className="text-xs text-on-surface-variant text-right">{fmtRange(e.date, e.end_date)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
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
    <section id="plan" className="py-16 md:py-24 bg-white border-y border-muted">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('QUÉ VAS A APRENDER', 'Un módulo por mes', `${carrera.meses} meses de cursada, con evaluación y seguimiento en cada módulo.`)}
        {borrador ? (
          <div className="rounded-2xl border border-dashed border-primary/40 p-6">
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

/* ── Cómo es la cursada ─────────────────────────────────────────────── */
export function CursadaSection() {
  const items = [
    { icon: CalendarDays, title: 'Un módulo por mes', text: 'Avanzás a tu ritmo dentro de cada módulo, con una propuesta clara por mes.' },
    { icon: Monitor, title: 'Campus virtual', text: 'Las clases están en el campus virtual de Ivana Academy, disponibles cuando te quede cómodo.' },
    { icon: Users, title: 'Grupo de la carrera', text: 'Al matricularte te sumamos al grupo, para consultas y acompañamiento.' },
    { icon: Medal, title: 'Evaluación y seguimiento', text: 'Cada módulo tiene evaluación, y los exámenes pueden rendirse online.' },
  ];
  return (
    <section id="cursada" className="py-16 md:py-24 bg-surface-cream">
      <div className="max-w-[1100px] mx-auto px-6">
        {sectionHeader('CÓMO ES LA CURSADA', '100% online, con acompañamiento')}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <li key={it.title} className="bg-white rounded-2xl p-6 border border-muted">
              <it.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-serif text-lg text-gray-900">{it.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{it.text}</p>
            </li>
          ))}
        </ul>
        <p className="text-center mt-8">
          <a href="https://ivana.academy" target="_blank" rel="noreferrer" className="text-xs text-primary underline">Campus virtual</a>
        </p>
      </div>
    </section>
  );
}

/* ── Continuá tu formación ──────────────────────────────────────────── */
export function ContinuaSection({ carrera }: { carrera: CarreraAr }) {
  const prof = carrera.continuaCon ? carreras_ar[carrera.continuaCon] : null;
  if (!prof) return null;
  return (
    <section id="continua" className="py-16 md:py-20 bg-white border-t border-muted">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('CONTINUÁ TU FORMACIÓN', `Después, el Profesorado (+${prof.meses} meses)`, `Al terminar la Tecnicatura podés seguir con el ${prof.nombre}. En total, ${carrera.meses + prof.meses} meses de formación.`)}
        <div className="flex justify-center">
          <InscribirmeButton carrera={prof} variant="outline" />
        </div>
      </div>
    </section>
  );
}

/* ── Salida laboral ─────────────────────────────────────────────────── */
export function SalidaLaboralSection() {
  return (
    <section id="salida-laboral" className="py-16 md:py-20 bg-surface-cream">
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

/* ── Cómo inscribirme ───────────────────────────────────────────────── */
export function ComoInscribirmeSection({ carrera }: { carrera?: CarreraAr }) {
  const steps = [
    'Elegís la carrera.',
    'Te registrás en la tienda.',
    'Te suscribís con Mercado Pago (cuota mensual).',
    'Recibís el acceso.',
  ];
  return (
    <section id="inscripcion" className="py-16 md:py-24 bg-white border-y border-muted">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('CÓMO INSCRIBIRME', 'Te inscribís en cuatro pasos', 'El valor lo ves en la tienda, antes de confirmar.')}
        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s} className="bg-surface-cream rounded-2xl border border-muted p-5 flex gap-4 items-start">
              <span className="font-serif text-2xl text-primary leading-none">{i + 1}</span>
              <span className="text-sm text-gray-900">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {carrera ? (
            <>
              <InscribirmeButton carrera={carrera} />
              <a href={whatsappInscripcion(carrera)} className={btnOutline}>
                <MessageCircle className="w-3.5 h-3.5" /> Hablar por WhatsApp
              </a>
            </>
          ) : (
            <>
              <a href="#carreras" className={btnPrimary}>Elegir mi carrera <ArrowRight className="w-3.5 h-3.5" /></a>
              <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className={btnOutline}>
                <MessageCircle className="w-3.5 h-3.5" /> Hablar por WhatsApp
              </a>
            </>
          )}
        </div>
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

export const WhatsAppFooterCta = () => (
  <section id="contacto" className="py-16 bg-white border-t border-muted text-center px-6">
    <h2 className="text-2xl md:text-3xl font-serif text-gray-900">¿Te quedó alguna duda?</h2>
    <p className="text-sm text-on-surface-variant mt-2">Escribinos por WhatsApp.</p>
    <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className={`${btnPrimary} mt-6 px-8 py-4`}>
      Hablar por WhatsApp
    </a>
  </section>
);
