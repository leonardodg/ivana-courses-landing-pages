// Navbar das páginas de carreras online da Argentina (espanhol).
// Menu: Carreras ▾ (as 6) · Agenda · Cómo inscribirme · WhatsApp. A logo leva ao inicio /es_ar/.

import { useState } from 'react';
import { ChevronDown, Menu, X, MessageCircle } from 'lucide-react';
import SkipLink from './SkipLink';
import { ar_pages, carreras_ar, carreras_principales, WHATSAPP_AR } from '../data/carreras_ar';

interface CareerNavbarProps {
  /** Página equivalente no Brasil (hreflang / seletor de idioma), quando existe. */
  ptHref?: string;
  /** Prefixo das âncoras ("" na própria página, "/es_ar/candles/" nas demais). */
  anchorBase?: string;
}

const link = 'text-xs font-bold font-mono uppercase tracking-wider text-on-surface-variant hover:text-primary px-3 py-2 min-h-11 inline-flex items-center rounded-full';

export default function CareerNavbar({ ptHref, anchorBase = '' }: CareerNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);

  const items = carreras_principales.map((c) => ({
    href: ar_pages[carreras_ar[c].page].path,
    label: carreras_ar[c].nombre,
  }));

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-cream/95 backdrop-blur-md border-b border-subtle shadow-xs">
      <SkipLink />
      <nav className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full" aria-label="Principal">
        <a href="/es_ar/" aria-label="Ivana Academy - inicio" className="flex min-h-11 items-center gap-3 px-2">
          <img alt="Ivana Academy" className="h-10 md:h-12 w-auto object-contain" src="/images/logo.svg" />
        </a>

        <div className="hidden md:flex items-center gap-1 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCareersOpen(!careersOpen)}
              aria-expanded={careersOpen}
              className={`${link} gap-1 cursor-pointer`}
            >
              Carreras <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {careersOpen && (
              <ul className="absolute left-0 top-full mt-1 w-80 bg-white border border-subtle rounded-xl shadow-lg py-2">
                {items.map((i) => (
                  <li key={i.href}>
                    <a href={i.href} className="block px-4 py-2.5 min-h-11 text-sm text-gray-900 hover:bg-surface-cream">{i.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <a href="/es_ar/agenda/" className={link}>Agenda</a>
          <a href={`${anchorBase}#inscripcion`} className={link}>Cómo inscribirme</a>
          <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className={`${link} gap-1.5`}>
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
          {ptHref && (
            <a href={ptHref} hrefLang="pt-BR" className={link}>PT</a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          className="md:hidden text-on-surface-variant hover:text-primary p-2 min-h-11 min-w-11 inline-flex items-center justify-center"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-surface-cream border-t border-subtle py-4 px-6 shadow-inner space-y-1 max-h-[80vh] overflow-y-auto">
          <p className="text-micro uppercase font-mono tracking-wider font-semibold text-gray-500 mb-1">Carreras</p>
          {items.map((i) => (
            <a key={i.href} href={i.href} className="block min-h-11 py-2.5 text-sm text-gray-900">{i.label}</a>
          ))}
          <hr className="border-subtle my-2" />
          <a href="/es_ar/agenda/" className="block min-h-11 py-2.5 text-sm font-semibold text-gray-900">Agenda</a>
          <a href={`${anchorBase}#inscripcion`} onClick={() => setMenuOpen(false)} className="block min-h-11 py-2.5 text-sm font-semibold text-gray-900">Cómo inscribirme</a>
          <a href={WHATSAPP_AR} target="_blank" rel="noreferrer" className="block min-h-11 py-2.5 text-sm font-semibold text-gray-900">WhatsApp</a>
          {ptHref && <a href={ptHref} hrefLang="pt-BR" className="block min-h-11 py-2.5 text-sm text-gray-900">Português (Brasil)</a>}
        </div>
      )}
    </header>
  );
}
