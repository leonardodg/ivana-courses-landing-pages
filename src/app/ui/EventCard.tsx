// Card de evento/turma das páginas de agenda (Brasil e Argentina): data à esquerda, selos, título,
// linhas com ícone (horário, local…), observação e ações. Um só desenho para os dois países.
import type { ReactNode } from 'react';

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
  badges,
  title,
  subtitle,
  lines,
  note,
  actions,
  featured = false,
}: {
  date: string; // YYYY-MM-DD
  locale: string; // "pt-BR" | "es-AR"
  badges?: EventBadge[];
  title: ReactNode;
  subtitle?: ReactNode;
  lines?: ReactNode[]; // cada linha: ícone + texto
  note?: ReactNode;
  actions?: ReactNode;
  featured?: boolean; // próximo evento: borda na cor da marca
}) {
  const d = new Date(`${date}T12:00:00Z`);
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(locale, { ...o, timeZone: 'UTC' });
  const weekday = part({ weekday: 'short' }).replace('.', '');
  const month = part({ month: 'short' }).replace('.', '');

  return (
    <li>
      <article
        className={`bg-white rounded-2xl border shadow-sm p-4 md:p-5 flex gap-4 md:gap-5 ${featured ? 'border-primary' : 'border-muted'}`}
      >
        <time
          dateTime={date}
          className="w-16 md:w-[72px] shrink-0 self-start rounded-xl bg-surface-cream border border-muted py-2.5 flex flex-col items-center text-gray-900"
        >
          <span className="text-micro font-mono font-bold uppercase tracking-wider text-primary">{weekday}</span>
          <span className="font-serif text-3xl leading-none mt-1">{d.getUTCDate()}</span>
          <span className="text-micro font-mono uppercase tracking-wider text-on-surface-variant mt-1">{month}</span>
        </time>

        <div className="min-w-0 grow space-y-2.5">
          {badges && badges.length > 0 && (
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
          )}
          <h3 className="font-serif text-xl md:text-2xl leading-snug text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-on-surface-variant -mt-1">{subtitle}</p>}
          {lines?.map((l, i) => (
            <p key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
              {l}
            </p>
          ))}
          {note && <p className="text-sm text-on-surface-variant">{note}</p>}
          {actions && <div className="flex flex-wrap gap-3 pt-1">{actions}</div>}
        </div>
      </article>
    </li>
  );
}
