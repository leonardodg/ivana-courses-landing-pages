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

export default function CardToolbar({ filter, density = true }: { filter?: SegmentFilterProps; density?: boolean }) {
  const { density: current, setDensity } = useDensity();
  const language = usePageLanguage();
  if (!filter && !density) return null;
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
      {filter && <SegmentFilter {...filter} />}
      {density && <DensityToggle value={current} onChange={setDensity} labels={toggleLabels[language]} />}
    </div>
  );
}
