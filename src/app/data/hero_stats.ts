// Faixa de números em destaque que todo herói mostra (ui/Hero). Um só lugar: muda aqui, muda em todas as páginas.
import type { Stat } from '../ui';
import { home_text } from '../lang/homepage';

export const hero_stats_br: Stat[] = [
  { value: '+3.000', label: home_text.pt.statsAlunas },
  { value: '6+ Anos', label: home_text.pt.statsExp },
  { value: 'BR & AR', label: home_text.pt.statsPort },
];

export const hero_stats_ar: Stat[] = [
  { value: '+3.000', label: home_text.es.statsAlunas },
  { value: '6+ Años', label: home_text.es.statsExp },
  { value: 'Título Grassi', label: home_text.es.statsPort },
];
