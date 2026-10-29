// Peças do menu principal: botão com submenu (NavDropdown) e seletor de idioma (LangSwitch).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { navPill } from './NavHeader';
import { ArgentinaFlag, BrazilFlag } from './Flags';

/** Botão em pílula com painel suspenso. `children` é o conteúdo do painel; fecha com Esc ou clique fora. */
export function NavDropdown({ label, icon, wide = false, children }: { label: string; icon?: ReactNode; wide?: boolean; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEvent = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'Escape') setOpen(false);
      } else if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onEvent);
    document.addEventListener('keydown', onEvent);
    return () => {
      document.removeEventListener('mousedown', onEvent);
      document.removeEventListener('keydown', onEvent);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true" className={navPill(open)}>
        {icon}
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute left-0 top-full mt-2 ${wide ? 'w-[34rem]' : 'w-80'} bg-white rounded-2xl border border-muted shadow-lg p-3 z-10`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

const langBtn = (active: boolean) =>
  `px-3 py-1.5 min-h-11 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer inline-flex items-center gap-2 ${
    active ? 'bg-primary text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200/50'
  }`;

/**
 * PT (bandeira do Brasil) | ES (bandeira da Argentina). Cada idioma é um link (`href`) quando a página atual
 * tem versão equivalente; sem versão, é um botão que só troca o idioma (`onSelect`).
 */
export function LangSwitch({
  language,
  hrefs,
  onSelect,
}: {
  language: 'pt' | 'es';
  hrefs: { pt: string | null; es: string | null };
  onSelect: (l: 'pt' | 'es') => void;
}) {
  const item = (l: 'pt' | 'es', title: string, flag: ReactNode) => {
    const active = language === l;
    const href = hrefs[l];
    const body = (
      <>
        {flag}
        <span>{l.toUpperCase()}</span>
      </>
    );
    if (href && !active) {
      return (
        <a href={href} hrefLang={l === 'pt' ? 'pt-BR' : 'es-AR'} className={langBtn(false)} title={title}>
          {body}
        </a>
      );
    }
    return (
      <button type="button" onClick={() => onSelect(l)} aria-pressed={active} className={langBtn(active)} title={title}>
        {body}
      </button>
    );
  };
  return (
    <div className="flex items-center gap-1 bg-surface-form p-1 rounded-full border border-subtle" role="group" aria-label="Idioma / Idioma">
      {item('pt', 'Português (Brasil)', <BrazilFlag selected={language === 'pt'} />)}
      {item('es', 'Español (Argentina)', <ArgentinaFlag selected={language === 'es'} />)}
    </div>
  );
}
