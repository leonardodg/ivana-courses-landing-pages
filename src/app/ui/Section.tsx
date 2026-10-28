// Seção de página: fundo, borda, largura e respiro vertical padronizados.
// Os fundos alternam (cream → white → cream…): nunca duas seções seguidas com o mesmo.
import type { ReactNode } from 'react';

const BG = { cream: 'bg-surface-cream', white: 'bg-white', hero: 'bg-surface-hero' } as const;
const BORDER = { none: '', top: 'border-t border-muted', y: 'border-y border-muted' } as const;
const WIDTH = { prose: 'max-w-[800px]', narrow: 'max-w-3xl', mid: 'max-w-[1100px]', wide: 'max-w-[1280px]' } as const;
const PAD = { lg: 'py-16 md:py-24', md: 'py-16 md:py-20' } as const;

export default function Section({
  id,
  bg = 'cream',
  border = 'none',
  width = 'narrow',
  pad = 'lg',
  className = '',
  children,
}: {
  id?: string;
  bg?: keyof typeof BG;
  border?: keyof typeof BORDER;
  width?: keyof typeof WIDTH;
  pad?: keyof typeof PAD;
  className?: string; // só para efeitos da seção (ex.: relative overflow-hidden); nunca para cor/espaço
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${PAD[pad]} ${BG[bg]} ${BORDER[border]} ${className}`.trim()}>
      <div className={`${WIDTH[width]} mx-auto px-6`}>{children}</div>
    </section>
  );
}
