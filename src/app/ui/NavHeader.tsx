// Casca da navbar (home, páginas de tema BR e AR): header fixo, logo à esquerda, `center` (pílulas),
// `right` e gaveta no celular. Único header do site: o desenho muda aqui, uma vez.
import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import SkipLink from '../components/SkipLink';

/** Contêiner arredondado de pílulas (seletor de categorias, opções do menu, seletor de idioma). */
export const navGroupClass = 'items-center gap-2 bg-surface-form p-1 rounded-full border border-subtle';
/** Pílula de item de menu. `active` = item selecionado. */
export const navPill = (active = false) =>
  `px-3.5 py-1.5 min-h-9 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 transition-all cursor-pointer ${
    active ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
  }`;
/** Caixa branca da gaveta (celular). */
export const drawerItem =
  'flex items-center justify-between text-xs text-gray-700 hover:text-on-surface-variant hover:bg-surface-container-high transition-all bg-white p-2.5 min-h-11 rounded-lg border border-gray-200 font-semibold';

export default function NavHeader({
  homeHref,
  homeLabel,
  center,
  right,
  drawer,
  menuOpen,
  onToggle,
  menuLabels,
  hideFrom = 'md',
  rightGap = 'gap-3',
}: {
  homeHref: string;
  homeLabel: string;
  center?: ReactNode;
  right?: ReactNode;
  drawer: ReactNode;
  menuOpen: boolean;
  onToggle: () => void;
  menuLabels: { open: string; close: string };
  hideFrom?: 'md' | 'lg' | 'xl'; // a partir deste ponto a gaveta some (as pílulas aparecem)
  rightGap?: string;
}) {
  const hide = hideFrom === 'xl' ? 'xl:hidden' : hideFrom === 'lg' ? 'lg:hidden' : 'md:hidden';
  return (
    <header className="bg-surface-cream/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-subtle transition-all">
      <SkipLink />
      <div className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">
        <a href={homeHref} aria-label={homeLabel} className="flex min-h-11 items-center gap-3 px-2">
          <img alt="Ivana Academy Logo" className="h-10 md:h-12 w-auto object-contain" src="/images/logo.svg" />
        </a>

        {center}

        <div className={`flex items-center ${rightGap}`}>
          {right}
          <button
            onClick={onToggle}
            aria-label={menuOpen ? menuLabels.close : menuLabels.open}
            aria-expanded={menuOpen}
            className={`${hide} text-gray-700 hover:text-primary min-h-11 min-w-11 inline-flex items-center justify-center`}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={`${hide} bg-surface-hero w-full border-t border-subtle py-4 px-6 shadow-inner animate-fade-in max-h-[80vh] overflow-y-auto`}>
          {drawer}
        </div>
      )}
    </header>
  );
}
