// Blocos das páginas de tema do Brasil (velas, saboaria, aromas, resina).
// Estrutura da proposta em conteudo/ORGANIZACAO.md. Toda compra termina na loja.
//
// Visual SEMPRE pelos componentes de ../../ui (Section, SectionHeader, Card, EventCard, InfoBlocks):
// para mudar o desenho de um bloco, edite o componente em ui/, não esta página.
// Dados: texto, valores e imagens em data/presencial.ts; datas e locais vêm do feed da agenda
// (useAgenda) e mudam sozinhos. Não escreva data à mão aqui.

import { CalendarDays, MapPin, Clock, ArrowRight, CreditCard, Gift, Mail, Users } from 'lucide-react';
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
import { Card, CardGrid, EventCard, InfoBlocks, Section, SectionHeader, btnOutline, btnPrimary, textLink } from '../../ui';

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
  const soldOut = e.status === 'esgotado';
  const place = e.venue ? `${e.venue}, ${e.city}` : e.city;
  const reserve = soldOut ? (
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={btnOutline}>
      Esgotado · Lista de espera
    </a>
  ) : (
    <a href={course?.naLoja ? lojaLink(course, theme.utm, e.id) : WHATSAPP_URL} className={btnPrimary}>
      Garantir minha vaga <ArrowRight className="w-3.5 h-3.5" />
      <span className="sr-only">: {e.title}, {e.date.split('-').reverse().slice(0, 2).join('/')}</span>
    </a>
  );

  return (
    <EventCard
      date={e.date}
      locale="pt-BR"
      density="compact"
      badges={e.status === 'ultimas-vagas' ? [{ label: 'Últimas vagas', tone: 'accent' }] : undefined}
      title={e.title}
      ariaTitle={e.title}
      summary={[e.time && `${e.time}${e.end_time ? ` às ${e.end_time}` : ''}`, place].filter(Boolean).join(' · ')}
      lines={[
        <>
          <Clock className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
          {e.time}{e.end_time && ` às ${e.end_time}`}
        </>,
        <>
          <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
          <span>
            {place}
            {e.maps_url && (
              <a href={e.maps_url} target="_blank" rel="noreferrer" className="underline ml-1 text-primary">Ver no mapa</a>
            )}
          </span>
        </>,
      ]}
      note={e.note}
      quickAction={reserve}
      actions={reserve}
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
            <a href="/pt-br/agenda/" className={btnPrimary}>Ver agenda completa</a>
            <a href="/pt-br/interesse/" className={btnOutline}>Quero ser avisada</a>
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
          href="/pt-br/agenda/"
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
  /** Home: liga o card à página do curso ("Ver detalhes do curso"). */
  details?: { href: string };
}

export function CursoCard({ c, utm, events, feedError, loading, details }: CursoCardProps) {
  // Compra só em turma com vagas; esgotada vai para a lista de espera.
  const open = events.filter(e => e.status !== 'esgotado');
  const next = c.naLoja ? open[0] : undefined; // fora da loja: sem link de compra (a página da loja ainda não existe)
  // Com turma → loja na próxima turma. Feed fora do ar → página do curso na loja.
  // Sem turma → "Quero ser avisada".
  const cta = next
    ? { href: lojaLink(c, utm, next.id), label: 'Garantir minha vaga' }
    : events.length > 0 && c.naLoja
      ? { href: WHATSAPP_URL, label: 'Esgotado · Lista de espera' }
      : feedError && c.naLoja
        ? { href: lojaLink(c, utm), label: 'Ver na loja' }
        : { href: '/pt-br/interesse/', label: 'Quero ser avisada' };
  const primary = !!next || cta.label === 'Ver na loja';
  const btn = primary ? btnPrimary : btnOutline;

  return (
    <Card
      id={c.key}
      image={c.image}
      alt={c.name}
      tag="Presencial"
      titleHref={details?.href}
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
      turmas={{
        items: events.map(e => {
          const [, m, day] = e.date.split('-');
          const esgotada = e.status === 'esgotado';
          return {
            key: e.id,
            day: Number(day),
            month: MESES[Number(m) - 1],
            label: `${e.time} · ${e.city}${esgotada ? ' · esgotada (lista de espera)' : ''}`,
            href: esgotada || !c.naLoja ? WHATSAPP_URL : lojaLink(c, utm, e.id),
          };
        }),
        moreHref: details?.href ?? '#turmas',
        emptyText: loading ? undefined : 'Sem turmas marcadas por enquanto.',
      }}
      price={{ main: brl(c.price), sub: 'valor cheio · parcele no cartão' }}
      cta={
        loading ? (
          <span className={`${btnOutline} w-full opacity-60 cursor-default`} aria-busy="true">
            Carregando turmas…
          </span>
        ) : (
          <a href={cta.href} className={`${btn} w-full`}>
            {cta.label} <ArrowRight className="w-3.5 h-3.5" />
            <span className="sr-only">: {c.name}</span>
          </a>
        )
      }
      grade={c.takesHome.length + c.includes.length === 0 ? undefined : {
        label: 'Ver grade',
        closeLabel: 'Fechar',
        content: {
          image: c.image,
          tag: 'Presencial',
          title: c.name,
          intro: c.subtitle,
          facts: [
            { label: 'Duração', value: c.duration },
            { label: 'Valor', value: `${brl(c.price)} (valor cheio)` },
          ],
          sections: [
            { title: 'O que você leva', items: c.takesHome },
            { title: 'Incluso', items: c.includes },
          ],
          action: loading ? undefined : (
            <a href={cta.href} className={btn}>
              {cta.label}
            </a>
          ),
        },
      }}
      details={details && { label: 'Ver detalhes do curso', href: details.href }}
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
      <InfoBlocks layout="stack" numbered items={steps} tone="stone" />
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
      <InfoBlocks layout="compact" tone="white" items={['Todos os materiais', 'Apostila e material de apoio', 'Certificado Ivana Academy', 'Café'].map((title) => ({ icon: Gift, title }))} />
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
