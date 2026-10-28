// src/app/components/CandlesNavbar.tsx
//
// Navbar das páginas de tema (pt_BR e es_ar), montada sobre o NavHeader de ui/ (o mesmo header da home).
//
// Brasil: logo + pílula "Portal do Aluno" + gaveta (Cursos, Fale conosco, Plataforma).
// Argentina (language="es" + `menu`): as mesmas peças, com as opções de menu em pílulas dentro do
// contêiner arredondado da home: Carreras ▾, Agenda, Cómo inscribirme, WhatsApp e o seletor PT | ES.
// Ver docs/GUIA-DE-ESTILO.md.

import { useEffect, useRef, useState } from 'react';
import { Menu, PhoneCall, Link2, GraduationCap, ChevronDown, CalendarDays, MessageCircle, SquarePen } from 'lucide-react';
import { NavHeader, drawerItem, navGroupClass, navPill, navPortalPill } from '../ui';

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
// nas páginas legais aponta para /pt-br/cursos/velas/.
// language: 'es' nas páginas da Argentina (mesmo desenho, só os textos mudam).
const TEXT = {
  pt: { home: 'Ivana Academy - página inicial', portal: 'Portal do Aluno', close: 'Fechar menu', open: 'Abrir menu', courses: 'Cursos', contact: 'Fale Conosco', platform: 'Plataforma de Ensino', coursesId: 'cursos', contactId: 'contato' },
  es: { home: 'Ivana Academy - inicio', portal: 'Portal del Alumno', close: 'Cerrar menú', open: 'Abrir menú', courses: 'Carreras', contact: 'Contacto', platform: 'Campus virtual', coursesId: 'carreras', contactId: 'contacto' },
} as const;

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
  const close = () => setMenuOpen(false);

  useEffect(() => {
    if (!careersOpen) return;
    const onEvent = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'Escape') setCareersOpen(false);
      } else if (!careersRef.current?.contains(e.target as Node)) {
        setCareersOpen(false);
      }
    };
    document.addEventListener('mousedown', onEvent);
    document.addEventListener('keydown', onEvent);
    return () => {
      document.removeEventListener('mousedown', onEvent);
      document.removeEventListener('keydown', onEvent);
    };
  }, [careersOpen]);

  const center = menu && (
    <nav aria-label="Principal" className={`hidden lg:flex ${navGroupClass}`}>
      <div className="relative" ref={careersRef}>
        <button type="button" onClick={() => setCareersOpen(!careersOpen)} aria-expanded={careersOpen} aria-haspopup="true" className={navPill()}>
          {menu.careersLabel}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${careersOpen ? 'rotate-180' : ''}`} />
        </button>
        {careersOpen && (
          <ul className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl border border-muted shadow-lg py-2 z-10">
            {menu.careers.map((c) => (
              <li key={c.href}>
                <a href={c.href} onClick={() => setCareersOpen(false)} className="block px-4 py-2.5 min-h-11 text-sm text-gray-900 hover:bg-surface-cream">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {menu.links.map((l) => (
        <a key={l.href} href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})} className={navPill()}>
          {l.label}
        </a>
      ))}
    </nav>
  );

  const right = (
    <>
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
      <a href="https://ivana.academy" target="_blank" rel="noreferrer" onClick={close} className={navPortalPill}>
        <GraduationCap className="w-3.5 h-3.5" />
        <span>{t.portal}</span>
      </a>
    </>
  );

  const drawer = (
    <div className="flex flex-col gap-2">
      {menu ? (
        <>
          <p className="text-micro uppercase font-mono tracking-wider font-semibold text-gray-500">{menu.careersLabel}</p>
          {menu.careers.map((c) => (
            <a key={c.href} href={c.href} onClick={close} className={drawerItem}>
              <span>{c.label}</span>
              <Menu className="w-4 h-4 text-primary shrink-0" />
            </a>
          ))}
          {menu.links.map((l) => (
            <a key={l.href} href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})} onClick={close} className={drawerItem}>
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
            <a href={menu.ptHref} hrefLang="pt-BR" onClick={close} className={drawerItem}>
              <span>Português (Brasil)</span>
              <Link2 className="w-4 h-4 text-primary shrink-0" />
            </a>
          )}
        </>
      ) : (
        <>
          <a href={`${base}#${t.coursesId}`} onClick={close} className={drawerItem}>
            {t.courses}
            <Menu className="w-4 h-4 text-primary" />
          </a>
          <a href={`${base}#${t.contactId}`} onClick={close} className={drawerItem}>
            <span>{t.contact}</span>
            <PhoneCall className="w-4 h-4 text-primary" />
          </a>
        </>
      )}
      <a href="https://ivana.academy" target="_blank" rel="noreferrer" onClick={close} className={drawerItem}>
        <span>{t.platform}</span>
        <Link2 className="w-4 h-4 text-primary shrink-0" />
      </a>
    </div>
  );

  return (
    <NavHeader
      homeHref={language === 'es' ? '/es-ar/' : '/pt-br/'}
      homeLabel={t.home}
      center={center}
      right={right}
      drawer={drawer}
      menuOpen={menuOpen}
      onToggle={() => setMenuOpen(!menuOpen)}
      menuLabels={{ open: t.open, close: t.close }}
      hideFrom={menu ? 'lg' : 'md'}
    />
  );
}
