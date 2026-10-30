// Blocos das páginas de carreras online da Argentina (espanhol rioplatense).
// Visual SEMPRE pelos componentes de ../../ui (os mesmos do Brasil): Section, SectionHeader, Card, EventCard,
// InfoBlocks, ContactCta. Para mudar o desenho de um bloco, edite o componente em ui/.
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
  Gift,
  GraduationCap,
  Mail,
  Monitor,
  Medal,
  Users,
} from 'lucide-react';
import type { AgendaEvent, AgendaState } from '../../hooks/useAgenda';
import { CarreraAr, carreras_ar, tiendaLink, whatsappInscripcion, WHATSAPP_AR } from '../../data/carreras_ar';
import { trackSelectCareer } from '../../lib/analytics';
import type { FAQItem, Language } from '../../classes/types';
import { tr, usePageLanguage } from '../../lib/lang';
import { Card, CardGrid, ContactCta, EventCard, InfoBlocks, Section, SectionHeader, btnOutline, btnPrimary, type SegmentFilterProps } from '../../ui';

const MESES = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
};
// O feed manda o nome da turma em espanhol ("Cohorte 2027").
const turmaNome = (t: string, l: Language) => (l === 'es' ? t : t.replace(/^Cohorte/i, 'Turma'));
const locale = (l: Language) => (l === 'es' ? 'es-AR' : 'pt-BR');
export const fmtDay = (iso: string, l: Language = 'es') =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale(l), { day: 'numeric', month: 'long', timeZone: 'UTC' });
export const fmtRange = (a: string, b?: string | null, l: Language = 'es') =>
  b && b !== a ? `${fmtDay(a, l)} ${tr(l, 'al', 'a')} ${fmtDay(b, l)}` : fmtDay(a, l);
export const fmtFull = (iso: string, l: Language = 'es') =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale(l), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Nomes oficiais (Tecnicatura, Profesorado) ficam em espanhol nos dois idiomas.
export const nivelLabel = (c: CarreraAr, _l: Language = 'es') => (c.nivel === 'tecnicatura' ? 'Tecnicatura' : 'Profesorado');

/* ── Botão "Ver valores e inscribirme" (botão de card/lista) ─────────── */
export function InscribirmeButton({
  carrera,
  variant = 'primary',
  className = '',
  label,
}: {
  carrera: CarreraAr;
  label?: string;
  variant?: 'primary' | 'outline';
  className?: string;
}) {
  const l = usePageLanguage();
  return (
    <a
      href={tiendaLink(carrera)}
      onClick={() => trackSelectCareer(carrera.course)}
      className={`${variant === 'primary' ? btnPrimary : btnOutline} ${className}`}
    >
      {label ?? tr(l, 'Ver valores e inscribirme', 'Ver valores e me inscrever')} <ArrowRight className="w-3.5 h-3.5" />
      <span className="sr-only">: {carrera.nombre}</span>
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

const incluido = (l: Language) => [
  tr(l, 'Clases en el campus virtual', 'Aulas no campus virtual'),
  tr(l, 'Grupo de la carrera', 'Grupo da carreira'),
  tr(l, 'Evaluación y seguimiento', 'Avaliação e acompanhamento'),
  tr(l, 'Título del Conservatorio Grassi', 'Título do Conservatório Grassi'),
];

export function CarreraCard({ carrera, agenda, href }: { carrera: CarreraAr; agenda: AgendaState; href?: string }) {
  const l = usePageLanguage();
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
        month: MESES[l][Number(inicio.date.split('-')[1]) - 1],
        label: `${tr(l, 'Inicio de cursada', 'Início das aulas')} · ${turmaNome(inicio.turma ?? 'Cohorte 2027', l)}`,
        href: tiendaLink(carrera),
      }]
    : [];
  const emptyText =
    agenda.status === 'loading'
      ? tr(l, 'Cargando el calendario…', 'Carregando o calendário…')
      : agenda.status === 'error'
        ? tr(l, 'No pudimos cargar el calendario ahora.', 'Não conseguimos carregar o calendário agora.')
        : !carrera.enCalendario2027
          ? tr(l, 'La fecha de inicio se confirma más adelante.', 'A data de início será confirmada mais adiante.')
          : tr(l, 'Próximamente el calendario de la Cohorte 2027.', 'Em breve o calendário da Turma 2027.');

  const bullets = [
    tr(l, `${nivelLabel(carrera)} de ${carrera.meses} meses, un módulo por mes`, `${nivelLabel(carrera)} de ${carrera.meses} meses, um módulo por mês`),
    tr(l, 'Título del Conservatorio Grassi, con validez internacional', 'Título do Conservatório Grassi, com validade internacional'),
    cont
      ? tr(l, `Podés continuar con el Profesorado (+${cont.meses} meses)`, `Você pode continuar com o Profesorado (+${cont.meses} meses)`)
      : tr(l, 'Evaluación y seguimiento en cada módulo', 'Avaliação e acompanhamento em cada módulo'),
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
            {tr(l, 'Inscripción abierta todo el año', 'Inscrições abertas o ano todo')}
          </span>
        </>
      }
      turmas={{ items: turma, emptyText }}
      cta={<InscribirmeButton carrera={carrera} className="w-full" />}
      // "Ver plan de estudios" só existe quando há temario (confirmado; em DEV, o rascunho).
      grade={temario.items.length === 0 ? undefined : {
        label: tr(l, 'Ver plan de estudios', 'Ver plano de estudos'),
        closeLabel: tr(l, 'Cerrar', 'Fechar'),
        content: {
          image: carrera.image,
          imagePos: carrera.imagePos,
          tag: '100% online',
          title: carrera.nombre,
          intro: tr(l, `${nivelLabel(carrera)} de ${carrera.meses} meses, con un módulo por mes y el acompañamiento de la profesora Ivana Lerea.`, `${nivelLabel(carrera)} de ${carrera.meses} meses, com um módulo por mês e o acompanhamento da professora Ivana Lerea.`),
          facts: [
            { label: tr(l, 'Duración', 'Duração'), value: `${carrera.meses} meses` },
            { label: tr(l, 'Modalidad', 'Modalidade'), value: '100% online' },
          ],
          sections: [
            {
              title: temario.draft ? 'Temario (borrador, solo desarrollo)' : tr(l, 'Plan de estudios: un módulo por mes', 'Plano de estudos: um módulo por mês'),
              items: temario.items,
            },
            ...(inicio && etapas.length > 0
              ? [{ title: tr(l, 'Cronograma de la cohorte', 'Cronograma da turma'), items: etapas.map((e) => `${etapaLabel(e, l)} · ${fmtRange(e.date, e.end_date, l)}`) }]
              : []),
            { title: tr(l, 'Incluido', 'Incluído'), items: incluido(l) },
          ],
          action: <InscribirmeButton carrera={carrera} />,
        },
      }}
      details={href ? { label: tr(l, 'Ver el plan de la carrera', 'Ver o plano da carreira'), href } : undefined}
    />
  );
}

export function CarrerasGrid({
  items,
  agenda,
  linkTo,
  filter,
}: {
  items: CarreraAr[];
  agenda: AgendaState;
  linkTo?: (c: CarreraAr) => string | undefined;
  filter?: SegmentFilterProps; // home: filtro por carrera ao lado de Completa | Lista
}) {
  return (
    <CardGrid count={items.length} filter={filter}>
      {items.map((c) => (
        <CarreraCard key={c.course} carrera={c} agenda={agenda} href={linkTo?.(c)} />
      ))}
    </CardGrid>
  );
}

/* ── Cohorte (= TurmasSection do Brasil, com o mesmo EventCard) ─────────── */
export const etapaLabel = (e: AgendaEvent, l: Language = 'es') => {
  const raw = (e.etapa ?? '').toLowerCase();
  const m = raw.match(/^modulo\s+(\d+)\/(\d+)/);
  if (m) return `Módulo ${m[1]} de ${m[2]}`;
  if (raw === 'repaso') return tr(l, 'Repaso', 'Revisão');
  if (raw === 'receso') return tr(l, 'Receso', 'Recesso');
  if (raw === 'cierre') return tr(l, 'Cierre del ciclo', 'Encerramento do ciclo');
  return e.etapa ?? e.title;
};

/** Item da cohorte: data de início + botão + cronograma expansível. Usado na página da carreira e na agenda. */
export function CohorteRow({ carrera, etapas, tone = 'cream' }: { carrera: CarreraAr; etapas: AgendaEvent[]; tone?: 'white' | 'cream' }) {
  const l = usePageLanguage();
  const [open, setOpen] = useState(false);
  const inicio = etapas.find((e) => /^modulo\s+1\//i.test(e.etapa ?? '')) ?? etapas[0];
  const turma = turmaNome(inicio?.turma ?? 'Cohorte 2027', l);
  return (
    <EventCard
            date={inicio.date}
            locale={locale(l)}
            density="compact"
            title={`${tr(l, 'Inicio de cursada', 'Início das aulas')} · ${turma}`}
            ariaTitle={`${carrera.nombre}, ${tr(l, 'inicio de cursada', 'início das aulas')}`}
            summary={`${etapaLabel(inicio, l)} · ${tr(l, 'desde el', 'a partir de')} ${fmtFull(inicio.date, l)}`}
            lines={[
              <>
                <Clock className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                {etapaLabel(inicio, l)} · {tr(l, 'desde el', 'a partir de')} {fmtFull(inicio.date, l)}
              </>,
              <>
                <Monitor className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                {tr(l, '100% online · inscripción abierta todo el año', '100% online · inscrições abertas o ano todo')}
              </>,
            ]}
            tone={tone}
            quickAction={<InscribirmeButton carrera={carrera} label={tr(l, 'Inscribirme', 'Quero me inscrever')} />}
            actions={<InscribirmeButton carrera={carrera} label={tr(l, 'Inscribirme', 'Quero me inscrever')} />}
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  className="w-full min-h-11 flex items-center justify-between gap-2 px-4 py-3 border-t border-muted text-xs font-mono font-bold uppercase tracking-wider text-primary hover:bg-surface-cream/60 cursor-pointer"
                >
                  {tr(l, 'Cronograma de la cohorte', 'Cronograma da turma')} ({etapas.length} etapas)
                  <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <ol className="border-t border-muted divide-y divide-muted">
                    {etapas.map((e) => (
                      <li key={e.id} className="px-4 py-3 flex items-baseline justify-between gap-4 text-sm">
                        <span className="text-gray-900">{etapaLabel(e, l)}</span>
                        <span className="text-xs text-on-surface-variant text-right">{fmtRange(e.date, e.end_date, l)}</span>
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
  const l = usePageLanguage();
  const agendaHref = tr(l, '/es-ar/agenda/', '/pt-br/agenda/');
  const etapas = agenda.events
    .filter((e) => e.course === carrera.course)
    .sort((a, b) => a.date.localeCompare(b.date));

  const vacio = (msg: string, sub?: string) => (
    <div className="bg-surface-cream rounded-2xl border border-muted p-6 text-center">
      <CalendarDays className="w-6 h-6 text-primary mx-auto mb-2" />
      <p className="text-sm text-gray-900 font-semibold">{msg}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-1">{sub}</p>}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <a href={whatsappInscripcion(carrera)} className={btnPrimary}>{tr(l, 'Consultar por WhatsApp', 'Consultar pelo WhatsApp')}</a>
        <a href={agendaHref} className={btnOutline}>Ver agenda completa</a>
      </div>
    </div>
  );

  let body;
  if (agenda.status === 'loading') {
    body = <p className="text-center text-sm text-on-surface-variant">{tr(l, 'Cargando el calendario…', 'Carregando o calendário…')}</p>;
  } else if (agenda.status === 'error') {
    body = vacio(tr(l, 'No pudimos cargar el calendario ahora.', 'Não conseguimos carregar o calendário agora.'), tr(l, 'Escribinos y te pasamos las fechas.', 'Escreva para nós e passamos as datas.'));
  } else if (!carrera.enCalendario2027) {
    body = vacio(tr(l, 'La fecha de inicio se confirma más adelante.', 'A data de início será confirmada mais adiante.'), tr(l, 'Consultanos por WhatsApp y te avisamos.', 'Fale conosco pelo WhatsApp e avisamos você.'));
  } else if (etapas.length === 0) {
    body = vacio(tr(l, 'Próximamente el calendario de la Cohorte 2027', 'Em breve o calendário da Turma 2027'), tr(l, 'Mientras tanto, consultanos por WhatsApp.', 'Enquanto isso, fale conosco pelo WhatsApp.'));
  } else {
    body = (
      <>
        <ul className="space-y-4">
          <CohorteRow carrera={carrera} etapas={etapas} tone="cream" />
        </ul>
        <a
          href={agendaHref}
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:underline"
        >
          {tr(l, 'Agenda completa y siempre actualizada', 'Agenda completa e sempre atualizada')} <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </>
    );
  }

  return (
    <Section id="cohorte" bg="white" width="narrow">
      <SectionHeader
        kicker={tr(l, 'COHORTE 2027', 'TURMA 2027')}
        title={tr(l, 'Cuándo empezás', 'Quando você começa')}
        sub={tr(l, 'La inscripción está abierta todo el año. Podés sumarte en cualquier momento.', 'As inscrições estão abertas o ano todo. Você pode entrar a qualquer momento.')}
      />
      {body}
    </Section>
  );
}

/* ── Qué vas a aprender ─────────────────────────────────────────────── */
export function QueAprenderSection({ carrera }: { carrera: CarreraAr }) {
  const l = usePageLanguage();
  const temario = useTemario(carrera);
  return (
    <Section id="plan" bg="white" width="narrow">
      <SectionHeader
        kicker={tr(l, 'QUÉ VAS A APRENDER', 'O QUE VOCÊ VAI APRENDER')}
        title={tr(l, 'Un módulo por mes', 'Um módulo por mês')}
        sub={tr(l, `${carrera.meses} meses de cursada, con evaluación y seguimiento en cada módulo.`, `${carrera.meses} meses de aulas, com avaliação e acompanhamento em cada módulo.`)}
      />
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
          {tr(l, 'Plan de estudios: un módulo por mes, con evaluación y seguimiento.', 'Plano de estudos: um módulo por mês, com avaliação e acompanhamento.')}
        </p>
      )}
    </Section>
  );
}

/* ── Cómo es la cursada (InfoBlocks sin número) ──────────────────────────── */
export function CursadaSection({ bg = 'cream' }: { bg?: 'cream' | 'white' }) {
  const l = usePageLanguage();
  return (
    <Section id="cursada" bg={bg} border="top" width="wide">
      <SectionHeader kicker={tr(l, 'CÓMO ES LA CURSADA', 'COMO SÃO AS AULAS')} title={tr(l, '100% online, con acompañamiento', '100% online, com acompanhamento')} />
      <InfoBlocks
        tone={bg === 'cream' ? 'white' : 'stone'}
        items={[
          { icon: CalendarDays, title: tr(l, 'Un módulo por mes', 'Um módulo por mês'), text: tr(l, 'Avanzás a tu ritmo dentro de cada módulo, con una propuesta clara por mes.', 'Você avança no seu ritmo dentro de cada módulo, com uma proposta clara por mês.') },
          { icon: Monitor, title: 'Campus virtual', text: tr(l, 'Las clases están en el campus virtual de Ivana Academy, disponibles cuando te quede cómodo.', 'As aulas ficam no campus virtual da Ivana Academy, disponíveis quando for melhor para você.') },
          { icon: Users, title: tr(l, 'Grupo de la carrera', 'Grupo da carreira'), text: tr(l, 'Al matricularte te sumamos al grupo, para consultas y acompañamiento.', 'Ao se matricular, você entra no grupo, para dúvidas e acompanhamento.') },
          { icon: Medal, title: tr(l, 'Evaluación y seguimiento', 'Avaliação e acompanhamento'), text: tr(l, 'Cada módulo tiene evaluación, y los exámenes pueden rendirse online.', 'Cada módulo tem avaliação, e as provas podem ser feitas online.') },
        ]}
      />
    </Section>
  );
}

/* ── Cómo inscribirme (= ComoFuncionaSection do Brasil) ─────────────── */
export function ComoInscribirmeSection({ bg = 'cream' }: { bg?: 'cream' | 'white' }) {
  const l = usePageLanguage();
  return (
    <Section id="inscripcion" bg={bg} border="top" width="wide">
      <SectionHeader kicker={tr(l, 'CÓMO INSCRIBIRME', 'COMO ME INSCREVER')} title={tr(l, 'Inscribirte es simple', 'Se inscrever é simples')} />
      <InfoBlocks
        tone={bg === 'cream' ? 'white' : 'stone'}
        items={[
          { icon: GraduationCap, kicker: tr(l, 'PASO 1', 'PASSO 1'), title: tr(l, 'Elegís la carrera', 'Escolha a carreira'), text: tr(l, 'Mirá el plan y la fecha de inicio y tocá "Ver valores e inscribirme".', 'Veja o plano e a data de início e toque em "Ver valores e me inscrever".') },
          { icon: Mail, kicker: tr(l, 'PASO 2', 'PASSO 2'), title: tr(l, 'Te registrás en la tienda', 'Cadastre-se na loja'), text: tr(l, 'Creás tu cuenta con tus datos, en la tienda de Ivana Academy.', 'Crie sua conta com seus dados, na loja da Ivana Academy.') },
          { icon: CreditCard, kicker: tr(l, 'PASO 3', 'PASSO 3'), title: tr(l, 'Te suscribís con Mercado Pago', 'Assine com Mercado Pago'), text: tr(l, 'Pagás una cuota mensual con Mercado Pago.', 'Você paga uma mensalidade com Mercado Pago.') },
          { icon: Monitor, kicker: tr(l, 'PASO 4', 'PASSO 4'), title: tr(l, 'Recibís el acceso', 'Receba o acesso'), text: tr(l, 'Entrás al campus virtual y al grupo de tu carrera.', 'Você entra no campus virtual e no grupo da sua carreira.') },
        ]}
      />
      <p className="text-xs text-on-surface-variant text-center mt-8 max-w-xl mx-auto leading-relaxed">
        {tr(l, 'El valor lo ves en la tienda, antes de confirmar. ¿Preferís inscribirte por WhatsApp? Escribinos y te ayudamos.', 'O valor aparece na loja, antes de confirmar. Prefere se inscrever pelo WhatsApp? Escreva para nós e ajudamos você.')}{' '}
        <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>.
      </p>
    </Section>
  );
}

/* ── Incluido en todas (= InclusoSection do Brasil) ─────────────────── */
export function InclusoSection({ bg = 'white' }: { bg?: 'cream' | 'white' }) {
  const l = usePageLanguage();
  return (
    <Section id="incluido" bg={bg} border="top" pad="md">
      <SectionHeader kicker={tr(l, 'INCLUIDO EN TODAS', 'INCLUÍDO EM TODAS')} title={tr(l, 'Todo lo que necesitás para cursar', 'Tudo o que você precisa para estudar')} />
      <InfoBlocks
        layout="compact"
        tone={bg === 'cream' ? 'white' : 'stone'}
        items={incluido(l).map((title) => ({ icon: Gift, title }))}
      />
    </Section>
  );
}

/* ── Salida laboral ─────────────────────────────────────────────────── */
export function SalidaLaboralSection() {
  const l = usePageLanguage();
  return (
    <Section id="salida-laboral" bg="cream" border="top" pad="md">
      <SectionHeader kicker={tr(l, 'SALIDA LABORAL', 'SAÍDA PROFISSIONAL')} title={tr(l, 'Armá tu propio taller', 'Monte o seu próprio ateliê')} />
      <p className="text-center text-sm text-on-surface-variant leading-relaxed">
        {tr(
          l,
          'Las egresadas pueden armar sus talleres adheridos al Conservatorio Grassi en sus localidades, con el nombre que elijan y bajo su dirección. Sus alumnas también pueden obtener el título del Conservatorio.',
          'As formadas podem montar seus ateliês filiados ao Conservatório Grassi em suas cidades, com o nome que escolherem e sob sua direção. Suas alunas também podem obter o título do Conservatório.',
        )}
      </p>
    </Section>
  );
}

/* ── Preguntas frecuentes (sin precio) ──────────────────────────────── */
const faq = (id: string, es: [string, string], pt: [string, string]): FAQItem => ({
  id,
  question: { pt: pt[0], es: es[0] },
  answer: { pt: pt[1], es: es[1] },
});

export const faqs_carreras_ar: FAQItem[] = [
  faq('ar1',
    ['¿Cuánto dura la carrera?', 'Las tecnicaturas duran 9 meses, con un módulo por mes. El Profesorado en arte mix media dura 18 meses. En las carreras con continuación, el Profesorado suma 9 meses más.'],
    ['Quanto dura a carreira?', 'As tecnicaturas duram 9 meses, com um módulo por mês. O Profesorado em arte mix media dura 18 meses. Nas carreiras com continuação, o Profesorado soma mais 9 meses.']),
  faq('ar2',
    ['¿Qué título recibo?', 'El título es del Conservatorio Grassi, con validez internacional.'],
    ['Que título eu recebo?', 'O título é do Conservatório Grassi, com validade internacional.']),
  faq('ar3',
    ['¿Cómo accedo a las clases?', 'Las clases son 100% online y están en el campus virtual de Ivana Academy (ivana.academy). Al matricularte recibís el acceso y el link del grupo.'],
    ['Como acesso as aulas?', 'As aulas são 100% online e ficam no campus virtual da Ivana Academy (ivana.academy). Ao se matricular, você recebe o acesso e o link do grupo.']),
  faq('ar4',
    ['¿Cuándo empiezo?', 'La inscripción está abierta todo el año. La fecha de inicio de la cohorte la ves en el calendario de cada carrera.'],
    ['Quando eu começo?', 'As inscrições estão abertas o ano todo. A data de início da turma aparece no calendário de cada carreira.']),
  faq('ar5',
    ['¿Cómo me doy de baja?', 'Podés darte de baja cuando quieras desde "Mis carreras" en la tienda. Mientras la tienda no esté disponible, escribinos por WhatsApp. También podés consultar el derecho de arrepentimiento y la política de reembolso.'],
    ['Como cancelo?', 'Você pode cancelar quando quiser em "Mis carreras", na loja. Enquanto a loja não estiver disponível, escreva para nós pelo WhatsApp. Você também pode consultar o direito de arrependimento e a política de reembolso.']),
  faq('ar6',
    ['¿Necesito cuenta de Mercado Pago?', 'La cuota mensual se gestiona con Mercado Pago. Si tenés dudas sobre cómo pagar, escribinos por WhatsApp y te ayudamos antes de inscribirte.'],
    ['Preciso de conta no Mercado Pago?', 'A mensalidade é gerenciada pelo Mercado Pago. Se tiver dúvidas sobre como pagar, escreva para nós pelo WhatsApp e ajudamos você antes de se inscrever.']),
  faq('ar7',
    ['¿Dónde veo el valor?', 'El valor se muestra en la tienda, cuando elegís la carrera e iniciás tu inscripción.'],
    ['Onde vejo o valor?', 'O valor aparece na loja, quando você escolhe a carreira e inicia a inscrição.']),
];

/* ── Contacto (ContactCta, o mesmo bloco do Brasil) ─────────────────── */
export const WhatsAppFooterCta = () => {
  const l = usePageLanguage();
  return (
    <ContactCta
      id="contacto"
      title={tr(l, '¿Te quedó alguna duda?', 'Ficou com alguma dúvida?')}
      text={tr(l, 'Escribinos por WhatsApp.', 'Escreva para nós pelo WhatsApp.')}
      tone="cream"
      action={{ label: tr(l, 'Hablar por WhatsApp', 'Falar pelo WhatsApp'), href: WHATSAPP_AR }}
      below={<p className="mt-4 text-xs"><a href={tr(l, '/es-ar/agenda/', '/pt-br/agenda/')} className="inline-flex min-h-11 items-center underline text-primary">Agenda completa</a></p>}
    />
  );
};
