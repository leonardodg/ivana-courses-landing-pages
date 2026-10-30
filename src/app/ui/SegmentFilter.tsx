// Filtro por segmento dos cards (select): fica ao lado do seletor Completo | Lista, na barra de ferramentas dos cards
// (ui/CardToolbar). O valor também vive na URL (#velas): ver hooks/useSegmentFilter.
import { ChevronDown } from 'lucide-react';

export interface SegmentFilterProps {
  value: string; // '' = todos
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string; // nome do filtro, para leitor de tela: "Filtrar por segmento"
  allLabel: string; // "Todos os segmentos"
}

export default function SegmentFilter({ value, onChange, options, label, allLabel }: SegmentFilterProps) {
  return (
    <span className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none min-h-11 rounded-full border border-subtle bg-white pl-5 pr-11 text-xs font-bold font-mono uppercase tracking-wider text-gray-900 hover:border-primary focus-visible:border-primary transition-colors cursor-pointer max-w-full"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-primary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
    </span>
  );
}
