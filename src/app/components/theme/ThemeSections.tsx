// Blocos das páginas de tema do Brasil (velas, saboaria, aromas, resina).
// Estrutura da proposta em conteudo/ORGANIZACAO.md. Toda compra termina na loja.
//
// Visual SEMPRE pelos componentes de ../../ui (Section, SectionHeader, Card, DateRow, Steps, FeatureList):
// para mudar o desenho de um bloco, edite o componente em ui/, não esta página.
// Dados: texto, valores e imagens em data/presencial.ts; datas e locais vêm do feed da agenda
// (useAgenda) e mudam sozinhos. Não escreva data à mão aqui.

import { CalendarDays, MapPin, Clock, ArrowRight, CreditCard, Mail, Users } from 'lucide-react';
import { useAgenda, AgendaEvent } from '../../hooks/useAgenda';
import {
  PresencialTheme,
  PresencialCourse,
  presencial_courses,
  lojaLink,
  brl,
  WHATSAPP_URL,
} from '../../data/presencial';
import { FAQItem } from '../../classes/types';
import { Card, CardGrid, DateRow, FeatureList, Section, SectionHeader, Steps, btnOutline, btnPrimary, textLink } from '../../ui';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const todaySP = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

// Turmas futuras do tema, em ordem de data.
export function useThemeEvents(theme: PresencialTheme) {
  const agenda = useAgenda();
  const today = todaySP();
  const events = agenda.events
    .filter(e => theme.courses.includes(e.course) && e.date >= today)
    .sort((a, b) => a.start.localeCompare(b.start));
  return { events, status: agenda.status };
}

/* ── 2. Próximas turmas ─────────────────────────────────────────────── */
function TurmaCard({ e, theme }: { e: AgendaEvent; theme: PresencialTheme }) {
  const course = presencial_courses[e.course];
  const [, m, day] = e.date.split('-');
  const soldOut = e.status === 'esgotado';

  return (
    <DateRow
      day={Number(day)}
      month={MESES[Number(m) - 1]}
      title={e.title}
      lines={[
        <>
          <Clock className="w-3 h-3 text-primary shrink-0" />
          {e.time}{e.end_time && ` às ${e.end_time}`}
        </>,
        <>
          <MapPin className="w-3 h-3 text-primary shrink-0" />
          {e.venue ? `${e.venue}, ${e.city}` : e.city}
          {e.maps_url && (
            <a href={e.maps_url} target="_blank" rel="noreferrer" className="underline ml-1">mapa</a>
          )}
        </>,
        ...(e.status === 'ultimas-vagas'
          ? [<span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">Últimas vagas</span>]
          : []),
      ]}
      action={
        soldOut ? (
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={btnOutline}>
            Esgotado · Lista de espera
          </a>
        ) : (
          <a href={course ? lojaLink(course, theme.utm, e.id) : '/interest'} className={btnPrimary}>
            Garantir minha vaga <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )
      }
    />
  );
}

export function TurmasSection({ theme }: { theme: PresencialTheme }) {
  const { events, status } = useThemeEvents(theme);

  return (
    <Section id="turmas" bg="cream" width="narrow">
      <SectionHeader kicker="PRÓXIMAS TURMAS" title="Escolha a sua data" sub="Vagas limitadas por turma, para acompanhar cada aluna de perto." />

      {status === 'loading' && (
        <p className="text-center text-sm text-on-surface-variant">Carregando as próximas turmas…</p>
      )}

      {status !== 'loading' && events.length > 0 && (
        <ul className="space-y-4">
          {events.map(e => <TurmaCard key={e.id} e={e} theme={theme} />)}
        </ul>
      )}

      {status !== 'loading' && events.length === 0 && (
        <div className="bg-white rounded-2xl border border-muted p-6 text-center">
          <CalendarDays className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-900 font-semibold">
            {status === 'error' ? 'Não conseguimos carregar as turmas agora.' : 'Ainda não há turmas marcadas neste tema.'}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">Veja a agenda completa ou peça para ser avisada.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <a href="/agenda/" className={btnPrimary}>Ver agenda completa</a>
            <a href="/interest" className={btnOutline}>Quero ser avisada</a>
          </div>
          {status === 'error' && (
            <div className="mt-5 pt-4 border-t border-muted text-xs text-on-surface-variant">
              Escolha a turma direto na loja:
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                {theme.courses.map(k => presencial_courses[k]).filter(c => c.naLoja).map(c => (
                  <a key={c.key} href={lojaLink(c, theme.utm)} className="underline text-primary">{c.name}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <a
          href="/agenda/"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:underline"
        >
          Agenda completa e sempre atualizada <ArrowRight className="w-3.5 h-3.5" />
        </a>
      )}
    </Section>
  );
}

/* ── 3. Cursos do tema ──────────────────────────────────────────────── */
export interface CursoCardProps {
  c: PresencialCourse;
  utm: string;
  events: AgendaEvent[]; // turmas futuras deste curso, em ordem de data
  feedError: boolean;
  loading?: boolean; // agenda ainda carregando: não decide o CTA antes da hora
  /** Home: lista as próximas turmas no card e liga ao curso na página do tema. */
  turmas?: { max: number; pageHref: string };
}

export function CursoCard({ c, utm, events, feedError, loading, turmas }: CursoCardProps) {
  // Compra só em turma com vagas; esgotada vai para a lista de espera.
  const open = events.filter(e => e.status !== 'esgotado');
  const next = open[0];
  // Com turma → loja na próxima turma. Feed fora do ar → página do curso na loja.
  // Sem turma → "Quero ser avisada".
  const cta = next
    ? { href: lojaLink(c, utm, next.id), label: 'Garantir minha vaga' }
    : events.length > 0
      ? { href: WHATSAPP_URL, label: 'Esgotado · Lista de espera' }
      : feedError && c.naLoja
        ? { href: lojaLink(c, utm), label: 'Ver na loja' }
        : { href: '/interest', label: 'Quero ser avisada' };
  const primary = !!next || cta.label === 'Ver na loja';

  return (
    <Card
      id={c.key}
      image={c.image}
      alt={c.name}
      tag="Presencial"
      href={turmas?.pageHref}
      title={c.name}
      srText={c.subtitle}
      bullets={c.takesHome}
      meta={
        <>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />{c.duration}
          </span>
          {events.length > 0 && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
              {events.length === 1 ? '1 turma' : `${events.length} turmas`}
            </span>
          )}
        </>
      }
      extra={
        turmas && events.length > 0 ? (
          <ul className="mb-5 space-y-2">
            {events.slice(0, turmas.max).map(e => {
              const [, m, day] = e.date.split('-');
              return (
                <li key={e.id}>
                  <a
                    href={e.status === 'esgotado' ? WHATSAPP_URL : lojaLink(c, utm, e.id)}
                    className="flex items-center gap-3 rounded-lg border border-muted bg-surface-cream/60 hover:bg-surface-cream px-3 py-2 min-h-11 text-xs text-gray-900"
                  >
                    <span className="font-serif text-lg leading-none w-9 text-center">
                      {Number(day)}
                      <small className="block text-[9px] font-mono uppercase text-on-surface-variant">{MESES[Number(m) - 1]}</small>
                    </span>
                    <span className="grow">{e.time} · {e.city}{e.status === 'esgotado' && ' · esgotada (lista de espera)'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  </a>
                </li>
              );
            })}
            {events.length > turmas.max && (
              <li>
                <a href={turmas.pageHref} className={textLink}>
                  + {events.length - turmas.max} {events.length - turmas.max === 1 ? 'turma' : 'turmas'}
                </a>
              </li>
            )}
          </ul>
        ) : undefined
      }
      footer={
        <>
          <div className="mb-3 font-serif text-2xl text-gray-900">
            {brl(c.price)}
            <span className="text-xs font-sans text-on-surface-variant ml-2">valor cheio · parcele no cartão</span>
          </div>
          {loading ? (
            <span className={`${btnOutline} w-full opacity-60 cursor-default`} aria-busy="true">
              Carregando turmas…
            </span>
          ) : (
            <a href={cta.href} className={`${primary ? btnPrimary : btnOutline} w-full`}>
              {cta.label} <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
          {turmas && (
            <a href={turmas.pageHref} className="flex min-h-11 items-center justify-center text-xs text-primary underline mt-1">
              Ver detalhes do curso
            </a>
          )}
        </>
      }
    />
  );
}

export function CursosSection({ theme, id }: { theme: PresencialTheme; id?: string }) {
  const { events, status } = useThemeEvents(theme);

  return (
    <Section id={id ?? 'cursos'} bg="white" border="y" width="wide">
      <SectionHeader kicker="CURSOS PRESENCIAIS" title="Do zero, com a mão na massa" sub="Cada curso termina em um encontro e você sai com o que produziu, apostila e certificado." />
      <CardGrid count={theme.courses.length}>
        {theme.courses.map(key => (
          <CursoCard
            key={key}
            c={presencial_courses[key]}
            utm={theme.utm}
            events={events.filter(e => e.course === key)}
            feedError={status === 'error'}
            loading={status === 'loading'}
          />
        ))}
      </CardGrid>
    </Section>
  );
}

/* ── 4. Online do tema ──────────────────────────────────────────────── */
export interface OnlineLink {
  title: string;
  text: string;
  href: string;
  cta: string;
}

export function OnlineThemeBlock({ items }: { items: OnlineLink[] }) {
  if (!items.length) return null;
  return (
    <Section id="online" bg="cream" pad="md">
      <SectionHeader kicker="PREFERE ONLINE?" title="Aprenda no seu ritmo" sub="Aulas gravadas, com acesso imediato." />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(o => (
          <a key={o.href} href={o.href} className="bg-white rounded-2xl border border-muted p-6 shadow-sm hover:shadow-lg transition-all block">
            <h3 className="font-serif text-xl text-gray-900">{o.title}</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-4 leading-relaxed">{o.text}</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary">
              {o.cta} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}

/* ── 5. Como funciona a compra ──────────────────────────────────────── */
export function ComoFuncionaSection() {
  const steps = [
    { icon: CalendarDays, title: 'Escolha a turma', text: 'Veja datas e cidades e clique em "Garantir minha vaga".' },
    { icon: CreditCard, title: 'Pague na loja', text: 'Pix ou cartão, com parcelamento, na loja da Ivana Academy.' },
    { icon: Mail, title: 'Receba a confirmação', text: 'A confirmação chega no seu e-mail logo após o pagamento.' },
    { icon: Users, title: 'Entre no grupo', text: 'Alguns dias antes, você entra no grupo da turma no WhatsApp.' },
  ];
  return (
    <Section id="como-funciona" bg="white" border="top" width="mid">
      <SectionHeader kicker="COMO FUNCIONA" title="Reservar a sua vaga é simples" />
      <Steps items={steps} tone="cream" />
      <p className="text-xs text-on-surface-variant text-center mt-8 max-w-xl mx-auto leading-relaxed">
        A loja cobra o valor cheio do curso. Prefere reservar com sinal por Pix? Isso é feito só pelo atendimento no{' '}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>.
      </p>
    </Section>
  );
}

/* ── 6. Está incluso em todos ───────────────────────────────────────── */
export function InclusoSection() {
  return (
    <Section id="incluso" bg="cream" pad="md">
      <SectionHeader kicker="INCLUSO EM TODOS" title="Você só precisa chegar" />
      <FeatureList items={['Todos os materiais', 'Apostila e material de apoio', 'Certificado Ivana Academy', 'Café']} tone="white" />
    </Section>
  );
}

/* ── 7. Onde acontecem ──────────────────────────────────────────────── */
const LOCAIS = [
  { city: 'Florianópolis', place: 'Ivana Academy · Ingleses', address: 'Rua João Patrício, 109, Ingleses, Florianópolis' },
  { city: 'Balneário Camboriú', place: 'Eventos Elegance', address: 'Rua 3122, nº 481, Balneário Camboriú' },
  { city: 'Rio de Janeiro', place: 'Espaço Moura · Flamengo', address: 'Rua Correa Dutra 149 - Flamengo, Rio de Janeiro' },
];

export function LocaisSection() {
  return (
    <Section id="locais" bg="white" border="top" width="mid">
      <SectionHeader kicker="ONDE ACONTECEM" title="Em Santa Catarina e no Rio" />
      <div className="grid gap-6 md:grid-cols-3">
        {LOCAIS.map(l => (
          <a
            key={l.city}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.place}, ${l.address}`)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-surface-cream rounded-2xl border border-muted p-6 hover:shadow-lg transition-all block"
          >
            <MapPin className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-serif text-lg text-gray-900">{l.city}</h3>
            <p className="text-xs text-gray-900 font-semibold mt-1">{l.place}</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{l.address}</p>
            <span className="inline-block mt-3 text-[10px] font-mono font-bold uppercase tracking-wider text-primary underline">Abrir no mapa</span>
          </a>
        ))}
      </div>
    </Section>
  );
}

/* ── 9. Perguntas frequentes (presenciais) ──────────────────────────── */
const faq = (id: string, q: string, a: string): FAQItem => ({
  id,
  question: { pt: q, es: q },
  answer: { pt: a, es: a },
});

export const faqs_presencial: FAQItem[] = [
  faq('p1', 'Preciso ter experiência?', 'Não. Todos os cursos presenciais começam do zero, passo a passo, e todos os materiais estão inclusos.'),
  faq('p2', 'Como pago e qual é o valor?', 'A compra é feita na loja da Ivana Academy, por Pix ou cartão, com parcelamento no cartão. A loja cobra o valor cheio do curso. A reserva com sinal por Pix é feita só pelo atendimento no WhatsApp.'),
  faq('p3', 'Posso remarcar a minha vaga?', 'Sim. Sem problema: você passa para a próxima turma. Fale com a gente pelo WhatsApp. Cancelamento e devolução são combinados caso a caso.'),
  faq('p4', 'O que eu recebo no curso?', 'Todos os materiais, apostila com material de apoio, certificado Ivana Academy e café. Você leva para casa o que produziu.'),
  faq('p5', 'O que acontece depois que eu pago?', 'Você recebe a confirmação por e-mail e, alguns dias antes da turma, entra no grupo do WhatsApp com todas as orientações.'),
];
