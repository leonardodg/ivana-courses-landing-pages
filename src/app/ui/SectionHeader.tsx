// Cabeçalho de seção: rótulo + título + subtítulo. Único em todo o site.
import type { ReactNode } from 'react';

export default function SectionHeader({ kicker, title, sub }: { kicker?: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {kicker && <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">{kicker}</span>}
      <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{title}</h2>
      {sub && <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{sub}</p>}
    </div>
  );
}
