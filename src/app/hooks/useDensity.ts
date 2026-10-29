import { useSyncExternalStore } from 'react';
import type { Density } from '../ui/DensityToggle';

const QUERY = '(min-width: 768px)';

// Versão dos cards (agenda e cursos): automática pelo tamanho da tela (celular = compacta/lista, tela maior = completa).
// Se a pessoa escolher no seletor, a escolha vale em TODOS os seletores da página até recarregar (não é gravada).
let chosen: Density | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener('change', cb);
  };
};

const snapshot = (): Density => chosen ?? (window.matchMedia(QUERY).matches ? 'full' : 'compact');

export function useDensity(): { density: Density; setDensity: (d: Density) => void } {
  const density = useSyncExternalStore(subscribe, snapshot, () => 'full' as Density);
  return {
    density,
    setDensity: (d) => {
      chosen = d;
      emit();
    },
  };
}
