// src/app/components/candles-ar/CandlesArNavbar.tsx
// Navbar dedicada da página /es_ar/candles — fixo em ES-AR.
// Visual inspirado no protótipo (links de seção desktop, botão portal).

import { useState } from 'react';
import { School, Menu, X, GraduationCap } from 'lucide-react';

interface CandlesArNavbarProps {
  onOpenPortal: () => void;
}

export default function CandlesArNavbar({ onOpenPortal }: CandlesArNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-cream/95 backdrop-blur-md border-b border-subtle shadow-xs transition-all">
      <nav className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">

        {/* Logo and Brand */}
        <div className="flex items-center gap-3 px-2">
          <img
            alt="Ivana Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="/images/logo.svg"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPortal}
            className="hidden sm:flex items-center gap-1.5 border border-subtle bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary text-xs font-bold font-mono uppercase tracking-wider px-3.5 py-2 rounded-full transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Portal del Alumno
          </button>
          <a
            href="#formaciones"
            className="hidden sm:flex items-center gap-1.5 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider px-4 py-2.5 rounded-full hover:bg-primary/90 transition-all"
          >
            Ver Formaciones
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-on-surface-variant hover:text-primary p-1"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface-cream border-t border-subtle py-4 px-6 shadow-inner space-y-2">
          <button
            onClick={() => { setMenuOpen(false); onOpenPortal(); }}
            className="w-full text-left p-2.5 rounded-lg text-sm font-semibold text-primary border border-primary/30"
          >
            Portal del Alumno
          </button>
        </div>
      )}
    </header>
  );
}
