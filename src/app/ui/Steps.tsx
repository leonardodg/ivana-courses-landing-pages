// Passos / etapas em 4 colunas com ícone e número (como funciona a compra, como é a cursada).
// `tone` é a cor dos cartões: oposta à do fundo da seção, para manter o contraste.
import type { ComponentType } from 'react';

export interface StepItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}

export default function Steps({ items, tone = 'cream', numbered = true }: { items: StepItem[]; tone?: 'cream' | 'white'; numbered?: boolean }) {
  const bg = tone === 'cream' ? 'bg-surface-cream' : 'bg-white';
  const List = numbered ? 'ol' : 'ul';
  return (
    <List className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.title} className={`${bg} rounded-2xl p-6 border border-muted`}>
          {numbered ? (
            <span className="flex items-center gap-2 text-primary font-mono font-bold text-xs mb-3">
              <s.icon className="w-4 h-4" /> {i + 1}
            </span>
          ) : (
            <s.icon className="w-5 h-5 text-primary mb-3" />
          )}
          <h3 className="font-serif text-lg text-gray-900">{s.title}</h3>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.text}</p>
        </li>
      ))}
    </List>
  );
}
