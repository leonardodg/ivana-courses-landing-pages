// Card de evento/turma (agendas BR e AR, páginas de curso e de carrera): data à esquerda, selos, título,
// linhas com ícone, observação, ações e rodapé opcional.
// Duas versões: `full` (completa, ocupa mais espaço) e `compact` (uma linha de resumo, com botão para expandir).
// Quem escolhe a versão é a página (ver hooks/useDensity e ui/DensityToggle).
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Density } from './DensityToggle';

export type EventBadgeTone = 'neutral' | 'accent' | 'alert';

export interface EventBadge {
  label: string;
  tone?: EventBadgeTone;
}

const badgeTone: Record<EventBadgeTone, string> = {
  neutral: 'bg-surface-cream text-on-surface-variant border-muted',
  accent: 'bg-primary/10 text-primary border-primary/20',
  alert: 'bg-red-50 text-red-700 border-red-200',
};

export default function EventCard({
  date,
  locale,
  density = 'full',
  badges,
  title,
  subtitle,
  summary,
  lines,
  note,
  actions,
  quickAction,
  footer,
  featured = false,
  tone = 'white',
}: {
  date: string; // YYYY-MM-DD
  locale: string; // "pt-BR" | "es-AR"
  density?: Density;
  badges?: EventBadge[];
  title: ReactNode;
  subtitle?: ReactNode;
  summary?: ReactNode; // linha única da versão compacta (ex.: "19h às 22h · Florianópolis")
  lines?: ReactNode[]; // cada linha: ícone + texto
  note?: ReactNode;
  actions?: ReactNode; // ações da versão completa
  quickAction?: ReactNode; // ação principal sempre visível na versão compacta (some quando o card é expandido)
  footer?: ReactNode; // ex.: cronograma; só na versão completa
  featured?: boolean; // próximo evento: borda na cor da marca
  tone?: 'white' | 'cream'; // cor do cartão: oposta à do fundo da seção
}) {
  const [open, setOpen] = useState(false);
  const compact = density === 'compact' && !open;
  const es = locale.startsWith('es');

  const d = new Date(`${date}T12:00:00Z`);
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(locale, { ...o, timeZone: 'UTC' });
  const weekday = part({ weekday: 'short' }).replace('.', '');
  const month = part({ month: 'short' }).replace('.', '');

  const badgeList = badges && badges.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`text-micro font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeTone[b.tone ?? 'neutral']}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  );

  return (
    <li>
      <article className={`${tone === 'cream' ? 'bg-surface-cream' : 'bg-white'} rounded-2xl border shadow-sm overflow-hidden ${featured ? 'border-primary' : 'border-muted'}`}>
        <div className={`flex gap-4 ${compact ? 'p-3 md:p-4 items-center' : 'p-4 md:p-5 md:gap-5'}`}>
          <time
            dateTime={date}
            className={`shrink-0 rounded-xl ${tone === 'cream' ? 'bg-white' : 'bg-surface-cream'} border border-muted flex flex-col items-center text-gray-900 ${
              compact ? 'w-14 py-1.5' : 'w-16 md:w-[72px] py-2.5 self-start'
            }`}
          >
            <span className="text-micro font-mono font-bold uppercase tracking-wider text-primary">{weekday}</span>
            <span className={`font-serif leading-none mt-1 ${compact ? 'text-2xl' : 'text-3xl'}`}>{d.getUTCDate()}</span>
            <span className="text-micro font-mono uppercase tracking-wider text-on-surface-variant mt-1">{month}</span>
          </time>

          {compact ? (
            <div className="min-w-0 grow flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="min-w-0 grow">
                <h3 className="font-serif text-lg leading-snug text-gray-900">{title}</h3>
                {(summary ?? subtitle) && <p className="text-xs text-on-surface-variant mt-0.5">{summary ?? subtitle}</p>}
              </div>
              {quickAction}
            </div>
          ) : (
            <div className="min-w-0 grow space-y-2.5">
              {badgeList}
              <h3 className="font-serif text-xl md:text-2xl leading-snug text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-on-surface-variant -mt-1">{subtitle}</p>}
              {lines?.map((l, i) => (
                <p key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  {l}
                </p>
              ))}
              {note && <p className="text-sm text-on-surface-variant">{note}</p>}
              {actions && <div className="flex flex-wrap justify-end gap-3 pt-1">{actions}</div>}
            </div>
          )}

          {density === 'compact' && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? (es ? 'Ver menos detalles' : 'Ver menos detalhes') : es ? 'Ver más detalles' : 'Ver mais detalhes'}
              className={`shrink-0 ${compact ? '' : 'self-start'} inline-flex items-center justify-center w-11 h-11 rounded-full border border-subtle text-primary hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer`}
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
          )}
        </div>
        {!compact && footer}
      </article>
    </li>
  );
}
