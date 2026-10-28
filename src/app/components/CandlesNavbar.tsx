// src/app/components/candles/CandlesNavbar.tsx
//
// Navbar das páginas de tema (pt_BR e es_ar). Mesmo desenho do Navbar.tsx da home: logo à esquerda,
// pílulas à direita, gaveta no celular.
//
// Brasil: logo + pílula "Portal do Aluno" + gaveta (Cursos, Fale conosco, Plataforma).
// Argentina (language="es" + `menu`): as mesmas peças, com as opções de menu em pílulas dentro do
// contêiner arredondado da home (`bg-surface-form p-1 rounded-full border`): Carreras ▾, Agenda,
// Cómo inscribirme, WhatsApp e o seletor PT | ES. Ver docs/GUIA-DE-ESTILO.md.

import SkipLink from './SkipLink';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, PhoneCall, Link2, GraduationCap, ChevronDown, CalendarDays, MessageCircle, SquarePen } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavMenu {
  careersLabel: string; // "Carreras"
  careers: NavLink[]; // submenu do "Carreras ▾"
  links: NavLink[]; // Agenda, Cómo inscribirme, WhatsApp
  ptHref?: string; // página equivalente no Brasil (seletor PT | ES)
}

// base: caminho da página das âncoras (#cursos, #contato). Vazio na própria página de velas;
// nas páginas legais aponta para /pt_br/candles/.
// language: 'es' nas páginas da Argentina (mesmo desenho, só os textos mudam).
const TEXT = {
  pt: { home: 'Ivana Academy - página inicial', portal: 'Portal do Aluno', close: 'Fechar menu', open: 'Abrir menu', courses: 'Cursos', contact: 'Fale Conosco', platform: 'Plataforma de Ensino', coursesId: 'cursos', contactId: 'contato' },
  es: { home: 'Ivana Academy - inicio', portal: 'Portal del Alumno', close: 'Cerrar menú', open: 'Abrir menú', courses: 'Carreras', contact: 'Contacto', platform: 'Campus virtual', coursesId: 'carreras', contactId: 'contacto' },
} as const;

const pill =
  'px-3.5 py-1.5 min-h-9 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 transition-all cursor-pointer text-on-surface-variant hover:bg-surface-container-high';
const drawerItem =
  'flex items-center justify-between text-xs text-gray-700 hover:text-on-surface-variant hover:bg-surface-container-high transition-all bg-white p-2.5 min-h-11 rounded-lg border border-gray-200 font-semibold';

export default function CandlesNavbar({
  base = '',
  language = 'pt',
  menu,
}: {
  base?: string;
  language?: 'pt' | 'es';
  menu?: NavMenu;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const careersRef = useRef<HTMLDivElement>(null);
  const t = TEXT[language];
  const homeHref = language === 'es' ? '/es_ar/' : '/';
  // Com o menu da Argentina a barra de pílulas aparece a partir de lg; sem ele, o desenho do Brasil.
  const drawerHide = menu ? 'lg:hidden' : 'md:hidden';

  useEffect(() => {
    if (!careersOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'Escape') setCareersOpen(false);
      } else if (!careersRef.current?.contains(e.target as Node)) {
        setCareersOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [careersOpen]);

  return (
    <header className="bg-surface-cream/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-subtle transition-all">
      <SkipLink />
      <div className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">
        {/* Logo */}
        <a href={homeHref} aria-label={t.home} className="flex min-h-11 items-center gap-3 px-2">
          <img
            alt="Ivana Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="/images/logo.svg"
          />
        </a>

        {/* Opções do menu (Argentina): contêiner de pílulas, igual ao seletor de categorias da home */}
        {menu && (
          <nav
            aria-label="Principal"
            className="hidden lg:flex items-center gap-2 bg-surface-form p-1 rounded-full border border-subtle"
          >
            <div className="relative" ref={careersRef}>
              <button
                type="button"
                onClick={() => setCareersOpen(!careersOpen)}
                aria-expanded={careersOpen}
                aria-haspopup="true"
                className={pill}
              >
                {menu.careersLabel}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${careersOpen ? 'rotate-180' : ''}`} />
              </button>
              {careersOpen && (
                <ul className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl border border-muted shadow-lg py-2 z-10">
                  {menu.careers.map((c) => (
                    <li key={c.href}>
                      <a
                        href={c.href}
                        onClick={() => setCareersOpen(false)}
                        className="block px-4 py-2.5 min-h-11 text-sm text-gray-900 hover:bg-surface-cream"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {menu.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={pill}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {menu?.ptHref && (
            <div className="hidden lg:flex items-center gap-1 bg-surface-form p-1 rounded-full border border-subtle" aria-label="Idioma">
              <a href={menu.ptHref} hrefLang="pt-BR" className="px-3 py-1.5 min-h-9 rounded-full text-xs font-mono font-bold inline-flex items-center text-gray-500 hover:bg-gray-200/50">
                PT
              </a>
              <span aria-current="true" className="px-3 py-1.5 min-h-9 rounded-full text-xs font-mono font-bold inline-flex items-center bg-primary text-white">
                ES
              </span>
            </div>
          )}

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
            className={`${drawerHide} text-gray-700 hover:text-primary p-1`}
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
        <div className={`${drawerHide} bg-surface-hero w-full border-t border-subtle py-4 px-6 shadow-inner animate-fade-in max-h-[80vh] overflow-y-auto`}>
          <div className="flex flex-col gap-2">
            {menu ? (
              <>
                <p className="text-micro uppercase font-mono tracking-wider font-semibold text-gray-500">{menu.careersLabel}</p>
                {menu.careers.map((c) => (
                  <a key={c.href} href={c.href} onClick={() => setMenuOpen(false)} className={drawerItem}>
                    <span>{c.label}</span>
                    <Menu className="w-4 h-4 text-primary shrink-0" />
                  </a>
                ))}
                {menu.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    onClick={() => setMenuOpen(false)}
                    className={drawerItem}
                  >
                    <span>{l.label}</span>
                    {l.href.includes('wa.me') ? (
                      <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                    ) : l.href.includes('agenda') ? (
                      <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <SquarePen className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </a>
                ))}
                {menu.ptHref && (
                  <a href={menu.ptHref} hrefLang="pt-BR" onClick={() => setMenuOpen(false)} className={drawerItem}>
                    <span>Português (Brasil)</span>
                    <Link2 className="w-4 h-4 text-primary shrink-0" />
                  </a>
                )}
                <a href="https://ivana.academy" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className={drawerItem}>
                  <span>{t.platform}</span>
                  <Link2 className="w-4 h-4 text-primary shrink-0" />
                </a>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
