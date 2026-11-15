// Barra de ferramentas dos cards: filtro por segmento (opcional) + seletor Completo | Lista.
// Toda página com cards de vários segmentos (home do Brasil, home da Argentina) usa esta barra.
import DensityToggle from './DensityToggle';
import SegmentFilter, { type SegmentFilterProps } from './SegmentFilter';
import { useDensity } from '../hooks/useDensity';
import { usePageLanguage } from '../lib/lang';

const toggleLabels = {
  pt: { group: 'Formato dos cards', full: 'Completo', compact: 'Lista' },
  es: { group: 'Formato de las tarjetas', full: 'Completa', compact: 'Lista' },
};

export default function CardToolbar({ filter, density = true }: { filter?: SegmentFilterProps | SegmentFilterProps[]; density?: boolean }) {
  const { density: current, setDensity } = useDensity();
  const language = usePageLanguage();
  const filters = filter ? (Array.isArray(filter) ? filter : [filter]) : [];
  if (filters.length === 0 && !density) return null;
  return (
    <div className="flex flex-col items-stretch gap-3 mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      {filters.map((f) => <SegmentFilter key={f.label} fullWidth="mobile" {...f} />)}
      {density && (
        <div className="flex justify-center sm:block">
          <DensityToggle value={current} onChange={setDensity} labels={toggleLabels[language]} />
        </div>
      )}
    </div>
  );
}
