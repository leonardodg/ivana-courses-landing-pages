// Ícones do menu principal (uma chave por opção em data/site_nav.ts). Único lugar para trocar um ícone.
import type { ComponentType } from 'react';
import { CalendarDays, FileText, Flame, Droplets, Gem, LayoutGrid, Palette, PlayCircle, Shirt, Sofa, Waypoints, Wind } from 'lucide-react';
import { ArgentinaFlag, BrazilFlag } from './Flags';

type Icon = ComponentType<{ className?: string }>;

export const nav_icons: Record<string, Icon> = {
  flame: Flame, // velas
  droplets: Droplets, // sabonetes
  wind: Wind, // aromas e incensos
  gem: Gem, // resina
  play: PlayCircle, // curso online (videoaulas)
  file: FileText, // apostila em PDF
  grid: LayoutGrid, // todas as carreras
  knot: Waypoints, // macramé
  shirt: Shirt, // estampas textiles
  sofa: Sofa, // diseño de interiores
  palette: Palette, // arte mix media
  calendar: CalendarDays,
  br: () => <BrazilFlag />,
  ar: () => <ArgentinaFlag />,
};
