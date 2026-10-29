// Seletor da versão do card de evento: completa ou compacta.
import { Rows3, StretchHorizontal } from 'lucide-react';
export type Density = 'full' | 'compact';

export default function DensityToggle({
  value,
  onChange,
  labels,
}: {
  value: Density;
  onChange: (d: Density) => void;
  labels: { group: string; full: string; compact: string };
}) {
  const btn = (d: Density, label: string, Icon: typeof Rows3) => (
    <button
      type="button"
      onClick={() => onChange(d)}
      aria-pressed={value === d}
      className={`inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
        value === d ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary'
      }`}
    >
      <Icon className="w-4 h-4" aria-hidden />
      <span>{label}</span>
    </button>
  );
  return (
    <div role="group" aria-label={labels.group} className="inline-flex rounded-full border border-subtle bg-white p-0.5">
      {btn('full', labels.full, StretchHorizontal)}
      {btn('compact', labels.compact, Rows3)}
    </div>
  );
}
