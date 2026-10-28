// Lista de itens em grade de 2 colunas com ícone ("incluso em todos", "o que você aprende", "para quem é").
import { Gift } from 'lucide-react';
import type { ComponentType } from 'react';

export default function FeatureList({
  items,
  tone = 'cream',
  icon: Icon = Gift,
}: {
  items: string[];
  tone?: 'cream' | 'white';
  icon?: ComponentType<{ className?: string }>;
}) {
  const bg = tone === 'cream' ? 'bg-surface-cream' : 'bg-white';
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((i) => (
        <li key={i} className={`${bg} rounded-xl border border-muted p-4 flex items-center gap-3 text-sm text-gray-900`}>
          <Icon className="w-5 h-5 text-primary shrink-0" />
          {i}
        </li>
      ))}
    </ul>
  );
}
