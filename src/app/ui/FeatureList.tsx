// Lista "Incluso em todos": grade de 2 colunas com ícone.
import { Gift } from 'lucide-react';

export default function FeatureList({ items, tone = 'cream' }: { items: string[]; tone?: 'cream' | 'white' }) {
  const bg = tone === 'cream' ? 'bg-surface-cream' : 'bg-white';
  return (
    <ul className="grid grid-cols-2 gap-4">
      {items.map((i) => (
        <li key={i} className={`${bg} rounded-xl border border-muted p-4 flex items-center gap-3 text-sm text-gray-900`}>
          <Gift className="w-5 h-5 text-primary shrink-0" />
          {i}
        </li>
      ))}
    </ul>
  );
}
