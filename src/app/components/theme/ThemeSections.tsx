// Blocos compartilhados das páginas de tema (velas, saboaria, aromas, resina).
// Estrutura da proposta em conteudo/ORGANIZACAO.md. Toda compra termina na loja.
//
// Dados: texto, valores e imagens em data/presencial.ts; datas e locais vêm do
// feed da agenda (useAgenda) e mudam sozinhos. Não escreva data à mão aqui.

import { CalendarDays, MapPin, Clock, Check, ArrowRight, Gift, CreditCard, Mail, Users } from 'lucide-react';
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

const sectionHeader = (kicker: string, title: string, sub?: string) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">{kicker}</span>
    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{title}</h2>
    {sub && <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{sub}</p>}
  </div>
);

const btnPrimary =
  'flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer';
const btnOutline =
  'flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer';

/* ── 2. Próximas turmas ─────────────────────────────────────────────── */
function TurmaCard({ e, theme }: { e: AgendaEvent; theme: PresencialTheme }) {
  const course = presencial_courses[e.course];
  const [, m, day] = e.date.split('-');
  const soldOut = e.status === 'esgotado';

  return (
    <li className="bg-white rounded-2xl border border-muted shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="w-14 shrink-0 text-center font-serif text-3xl leading-none text-gray-900">
        {Number(day)}
        <small className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
          {MESES[Number(m) - 1]}
        </small>
      </span>

      <span className="grow text-sm text-gray-900 min-w-0">
        <span className="font-semibold block">{e.title}</span>
        <span className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
          <Clock className="w-3 h-3 text-primary shrink-0" />
          {e.time}{e.end_time && ` às ${e.end_time}`}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <MapPin className="w-3 h-3 text-primary shrink-0" />
          {e.venue ? `${e.venue}, ${e.city}` : e.city}
          {e.maps_url && (
            <a href={e.maps_url} target="_blank" rel="noreferrer" className="underline ml-1">mapa</a>
          )}
        </span>
        {e.status === 'ultimas-vagas' && (
          <span className="inline-block mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">
            Últimas vagas
          </span>
        )}
      </span>

      {soldOut ? (
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={btnOutline}>
          Esgotado · Lista de espera
        </a>
      ) : (
        <a
          href={course ? lojaLink(course, theme.utm, e.id) : '/interest'}
          className={btnPrimary}
        >
          Garantir minha vaga <ArrowRight className="w-3.5 h-3.5" />
        </a>
      )}
    </li>
  );
}

export function TurmasSection({ theme }: { theme: PresencialTheme }) {
  const { events, status } = useThemeEvents(theme);

  return (
    <section id="turmas" className="py-16 md:py-24 bg-surface-cream">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('PRÓXIMAS TURMAS', 'Escolha a sua data', 'Vagas limitadas por turma, para acompanhar cada aluna de perto.')}

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
          </div>
        )}

        {events.length > 0 && (
          <a
            href="/agenda/"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:underline"
          >
            Agenda completa e sempre atualizada <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
}

/* ── 3. Cursos do tema ──────────────────────────────────────────────── */
export interface CursoCardProps {
  c: PresencialCourse;
  utm: string;
  events: AgendaEvent[]; // turmas futuras deste curso, em ordem de data
  feedError: boolean;
  /** Home: lista as próximas turmas no card e liga ao curso na página do tema. */
  turmas?: { max: number; pageHref: string };
}

export function CursoCard({ c, utm, events, feedError, turmas }: CursoCardProps) {
  const next = events[0];
  // Com turma → loja na próxima turma. Feed fora do ar → página do curso na loja.
  // Sem turma → "Quero ser avisada".
  const cta = next
    ? { href: lojaLink(c, utm, next.id), label: 'Garantir minha vaga' }
    : feedError && c.naLoja
      ? { href: lojaLink(c, utm), label: 'Ver na loja' }
      : { href: '/interest', label: 'Quero ser avisada' };
  const primary = !!next || cta.label === 'Ver na loja';

  return (
    <article id={c.key} className="scroll-mt-24 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-muted overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-hero">
        {turmas && <a href={turmas.pageHref} aria-label={c.name} className="absolute inset-0 z-10" />}
        <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover select-none" />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-micro font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Presencial
        </span>
      </div>

      <div className="p-6 md:p-8 flex flex-col grow">
        <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug mb-4">
          {turmas ? <a href={turmas.pageHref}>{c.name}</a> : c.name}
        </h3>
        <p className="sr-only">{c.subtitle}</p>

        <ul className="space-y-2 mb-5">
          {c.takesHome.map((t, i) => (
            <li key={i} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-5 border-t border-muted pt-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />{c.duration}
          </span>
          {events.length > 0 && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
              {events.length === 1 ? '1 turma' : `${events.length} turmas`}
            </span>
          )}
        </div>

        {turmas && events.length > 0 && (
          <ul className="mb-5 space-y-2">
            {events.slice(0, turmas.max).map(e => {
              const [, m, day] = e.date.split('-');
              return (
                <li key={e.id}>
                  <a
                    href={lojaLink(c, utm, e.id)}
                    className="flex items-center gap-3 rounded-lg border border-muted bg-surface-cream/60 hover:bg-surface-cream px-3 py-2 text-xs text-gray-900"
                  >
                    <span className="font-serif text-lg leading-none w-9 text-center">
                      {Number(day)}
                      <small className="block text-[9px] font-mono uppercase text-on-surface-variant">{MESES[Number(m) - 1]}</small>
                    </span>
                    <span className="grow">{e.time} · {e.city}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  </a>
                </li>
              );
            })}
            {events.length > turmas.max && (
              <li>
                <a href={turmas.pageHref} className="text-xs text-primary underline">
                  + {events.length - turmas.max} {events.length - turmas.max === 1 ? 'turma' : 'turmas'}
                </a>
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto">
          <div className="mb-3 font-serif text-2xl text-gray-900">
            {brl(c.price)}
            <span className="text-xs font-sans text-on-surface-variant ml-2">valor cheio · parcele no cartão</span>
          </div>
          <a href={cta.href} className={`${primary ? btnPrimary : btnOutline} w-full`}>
            {cta.label} <ArrowRight className="w-3.5 h-3.5" />
          </a>
          {turmas && (
            <a href={turmas.pageHref} className="block text-center text-xs text-primary underline mt-3">
              Ver detalhes do curso
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function CursosSection({ theme, id }: { theme: PresencialTheme; id?: string }) {
  const { events, status } = useThemeEvents(theme);

  return (
    <section id={id ?? 'cursos'} className="py-16 md:py-24 bg-white border-y border-muted">
      <div className="max-w-[1280px] mx-auto px-6">
        {sectionHeader('CURSOS PRESENCIAIS', 'Do zero, com a mão na massa', 'Cada curso termina em um encontro e você sai com o que produziu, apostila e certificado.')}

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mx-auto ${theme.courses.length === 1 ? 'max-w-md' : theme.courses.length === 2 ? 'max-w-4xl' : ''}`}>
          {theme.courses.map(key => (
            <CursoCard
              key={key}
              c={presencial_courses[key]}
              utm={theme.utm}
              events={events.filter(e => e.course === key)}
              feedError={status === 'error'}
            />
          ))}
        </div>
      </div>
    </section>
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
    <section id="online" className="py-16 md:py-20 bg-surface-cream">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('PREFERE ONLINE?', 'Aprenda no seu ritmo', 'Aulas gravadas, com acesso imediato.')}
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
      </div>
    </section>
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
    <section id="como-funciona" className="py-16 md:py-24 bg-white border-t border-muted">
      <div className="max-w-[1100px] mx-auto px-6">
        {sectionHeader('COMO FUNCIONA', 'Reservar a sua vaga é simples')}
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-surface-cream rounded-2xl p-6 border border-muted">
              <span className="flex items-center gap-2 text-primary font-mono font-bold text-xs mb-3">
                <s.icon className="w-4 h-4" /> {i + 1}
              </span>
              <h3 className="font-serif text-lg text-gray-900">{s.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs text-on-surface-variant text-center mt-8 max-w-xl mx-auto leading-relaxed">
          A loja cobra o valor cheio do curso. Prefere reservar com sinal por Pix? Isso é feito só pelo atendimento no{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underline text-primary">WhatsApp</a>.
        </p>
      </div>
    </section>
  );
}

/* ── 6. Está incluso em todos ───────────────────────────────────────── */
export function InclusoSection() {
  const items = ['Todos os materiais', 'Apostila e material de apoio', 'Certificado Ivana Academy', 'Café'];
  return (
    <section id="incluso" className="py-16 md:py-20 bg-surface-cream">
      <div className="max-w-3xl mx-auto px-6">
        {sectionHeader('INCLUSO EM TODOS', 'Você só precisa chegar')}
        <ul className="grid grid-cols-2 gap-4">
          {items.map(i => (
            <li key={i} className="bg-white rounded-xl border border-muted p-4 flex items-center gap-3 text-sm text-gray-900">
              <Gift className="w-5 h-5 text-primary shrink-0" />{i}
            </li>
          ))}
        </ul>
      </div>
    </section>
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
    <section id="locais" className="py-16 md:py-24 bg-white border-t border-muted">
      <div className="max-w-[1100px] mx-auto px-6">
        {sectionHeader('ONDE ACONTECEM', 'Em Santa Catarina e no Rio')}
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
      </div>
    </section>
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
