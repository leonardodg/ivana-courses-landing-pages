import { useEffect, useState } from 'react';
import type { EventDensity } from '../ui/EventCard';

const QUERY = '(min-width: 768px)';

// Versão do card de evento: automática pelo tamanho da tela (celular = compacta, tela maior = completa).
// Se a pessoa escolher no seletor, a escolha vale até recarregar a página (não é gravada).
export function useEventDensity(): { density: EventDensity; setDensity: (d: EventDensity) => void } {
  const [auto, setAuto] = useState<EventDensity>(() =>
    typeof window !== 'undefined' && window.matchMedia(QUERY).matches ? 'full' : 'compact',
  );
  const [chosen, setChosen] = useState<EventDensity | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setAuto(mq.matches ? 'full' : 'compact');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return { density: chosen ?? auto, setDensity: setChosen };
}
