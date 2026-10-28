// src/app/components/candles/CandlesNavbar.tsx
//
// Navbar dedicada da página /pt_br/candles. Reaproveita exatamente o
// mesmo estilo visual do Navbar.tsx real (mesma identidade), mas sem os
// controles de troca de idioma e de categoria — esta página é fixa em
// Velas / PT-BR, então exibir esses seletores como inertes confundiria
// o visitante. Mantém o link de contato e o link para a plataforma.

import SkipLink from './SkipLink';
import { useState } from 'react';
import { Menu, X, PhoneCall, Link2, Award, GraduationCap, SquarePen } from 'lucide-react';

// base: caminho da página das âncoras (#cursos, #contato). Vazio na própria página de velas;
// nas páginas legais aponta para /pt_br/candles/.
// language: 'es' nas páginas da Argentina (mesmo desenho, só os textos mudam).
const TEXT = {
  pt: { home: 'Ivana Academy - página inicial', portal: 'Portal do Aluno', close: 'Fechar menu', open: 'Abrir menu', courses: 'Cursos', contact: 'Fale Conosco', platform: 'Plataforma de Ensino', coursesId: 'cursos', contactId: 'contato' },
  es: { home: 'Ivana Academy - inicio', portal: 'Portal del Alumno', close: 'Cerrar menú', open: 'Abrir menú', courses: 'Carreras', contact: 'Contacto', platform: 'Campus virtual', coursesId: 'carreras', contactId: 'contacto' },
} as const;

export default function CandlesNavbar({ base = '', language = 'pt' }: { base?: string; language?: 'pt' | 'es' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = TEXT[language];

  return (
    <header className="bg-surface-cream/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-subtle transition-all">
      <SkipLink />
      <div className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">
        {/* Logo */}
        <a href="/" aria-label={t.home} className="flex items-center gap-3 px-2">
          <img
            alt="Ivana Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="/images/logo.svg"
          />
        </a>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <a
            href="https://ivana.academy"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-on-surface-variant hover:text-primary border border-subtle bg-white/[0.8] hover:bg-white px-3.5 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t.portal}</span>
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t.close : t.open}
            aria-expanded={menuOpen}
            className="md:hidden text-gray-700 hover:text-primary p-1"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface-hero w-full border-t border-subtle py-4 px-6 shadow-inner animate-fade-in">
          <div className="flex flex-col gap-2">
            <a
              href={`${base}#${t.coursesId}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs w-full p-2.5 rounded-lg text-left font-semibold tracking-wide bg-white border-gray-200 text-gray-700 hover:text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              {t.courses}
              <Menu className="w-4 h-4 text-primary" />
            </a>
            <a
              href={`${base}#${t.contactId}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 hover:text-on-surface-variant hover:bg-surface-container-high transition-all bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>{t.contact}</span>
              <PhoneCall className="w-4 h-4 text-primary" />
            </a>
            <a
              href="https://ivana.academy"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 hover:text-on-surface-variant hover:bg-surface-container-high transition-all bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>{t.platform}</span>
              <Link2 className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
