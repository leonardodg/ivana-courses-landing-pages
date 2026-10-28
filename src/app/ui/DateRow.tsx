// Item de lista com data (turma no Brasil, início de cohorte na Argentina): data à esquerda,
// dados no meio, ação à direita; rodapé opcional dentro do mesmo cartão (ex.: cronograma).
import type { ReactNode } from 'react';

export default function DateRow({
  day,
  month,
  title,
  lines,
  action,
  footer,
  tone = 'white',
}: {
  day: number | string;
  month: string; // "nov", "feb"
  title: ReactNode;
  lines?: ReactNode[]; // linhas com ícone (horário, local…)
  action: ReactNode;
  footer?: ReactNode;
  tone?: 'white' | 'cream'; // cor do cartão: oposta à do fundo da seção
}) {
  return (
    <li className={`${tone === 'cream' ? 'bg-surface-cream' : 'bg-white'} rounded-2xl border border-muted shadow-sm overflow-hidden`}>
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="w-14 shrink-0 text-center font-serif text-3xl leading-none text-gray-900">
          {day}
          <small className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">{month}</small>
        </span>
        <span className="grow text-sm text-gray-900 min-w-0">
          <span className="font-semibold block">{title}</span>
          {lines?.map((l, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              {l}
            </span>
          ))}
        </span>
        {action}
      </div>
      {footer}
    </li>
  );
}
