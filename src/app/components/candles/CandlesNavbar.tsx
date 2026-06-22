// src/app/components/candles/CandlesNavbar.tsx
//
// Navbar dedicada da página /pt_br/candles. Reaproveita exatamente o
// mesmo estilo visual do Navbar.tsx real (mesma identidade), mas sem os
// controles de troca de idioma e de categoria — esta página é fixa em
// Velas / PT-BR, então exibir esses seletores como inertes confundiria
// o visitante. Mantém o link de contato e o link para a plataforma.

import { useState } from 'react';
import { Menu, X, PhoneCall, Link2, Award, GraduationCap } from 'lucide-react';

export default function CandlesNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface-cream/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-subtle transition-all">
      <div className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <img
            alt="Ivana Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="/images/logo.svg"
          />
        </div>

        {/* Category badge (fixo, somente leitura) */}
        <div className="hidden md:flex items-center gap-2 bg-surface-form px-4 py-2 rounded-full border border-subtle">
          <span className="text-sm">✨</span>
          <span className="px-1 text-xs font-semibold tracking-wide text-primary">
            Curso de Velas Artesanais
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Dispatch event para o CandlesApp abrir o portal
              window.dispatchEvent(new CustomEvent('candles:openPortal'));
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-on-surface-variant hover:text-primary border border-subtle bg-white/80 hover:bg-white px-3.5 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            Portal do Aluno
          </button>

          <a
            href="#contato"
            className="hidden sm:flex items-center gap-2 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider px-4 py-2.5 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Garantir Vaga
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 hover:text-primary p-1"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface-hero w-full border-t border-subtle py-4 px-6 shadow-inner animate-fade-in">
          <div className="flex flex-col gap-2">
            <a
              href="#cursos"
              onClick={() => setMenuOpen(false)}
              className="w-full p-2.5 rounded-lg text-left text-sm font-semibold tracking-wide bg-surface-container-low text-on-surface-variant"
            >
              Cursos
            </a>
            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>Fale Conosco</span>
              <PhoneCall className="w-4 h-4 text-primary" />
            </a>
            <a
              href="https://ivana.academy"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>Plataforma de Ensino</span>
              <Link2 className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
