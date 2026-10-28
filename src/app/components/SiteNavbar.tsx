// Navbar única do site (todas as páginas, Brasil e Argentina). Conteúdo e pares de idioma em data/site_nav.ts;
// peças visuais em ui/ (NavHeader, NavDropdown, LangSwitch). Ver docs/GUIA-DE-ESTILO.md.
//
// Menu: Brasil ▾ (cursos presenciais e online, por segmento) · Argentina ▾ (carreras) · Agenda ▾ · Contato ·
// Interesse (só no Brasil). À direita: PT | ES e Portal do Aluno.
// PT | ES: com versão equivalente da página no outro idioma, navega para ela; sem versão, só troca o
// idioma do menu e do rodapé (lib/lang.ts).
import { useState } from 'react';
import { CalendarDays, GraduationCap, Heart, MessageCircle } from 'lucide-react';
import type { CategoryId } from '../classes/types';
import { ArgentinaFlag, BrazilFlag, NavHeader, NavDropdown, LangSwitch, drawerItem, nav_icons, navGroupClass, navPill, navPortalPill } from '../ui';
import { nav_agenda, nav_argentina, nav_brasil, nav_contato, nav_interesse, nav_portal, label, pairFor, type NavItem } from '../data/site_nav';
import { setPageLanguage, usePageLanguage } from '../lib/lang';

const T = {
  pt: { home: 'Ivana Academy - página inicial', open: 'Abrir menu', close: 'Fechar menu', brasil: 'Brasil', argentina: 'Argentina', agenda: 'Agenda', all: 'Todos os cursos' },
  es: { home: 'Ivana Academy - inicio', open: 'Abrir menú', close: 'Cerrar menú', brasil: 'Brasil', argentina: 'Argentina', agenda: 'Agenda', all: 'Todos los cursos' },
} as const;

export default function SiteNavbar({
  onSelectCategory,
}: {
  /** Home do Brasil: os segmentos do menu filtram os cards da própria página. */
  onSelectCategory?: (id: CategoryId | null) => void;
}) {
  const language = usePageLanguage();
  const t = T[language];
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const homeHref = language === 'es' ? '/es-ar/' : '/pt-br/';
  const close = () => setMenuOpen(false);

  const pick = (it: NavItem, done: () => void) => (e: React.MouseEvent) => {
    done();
    if (it.category && onSelectCategory) {
      e.preventDefault();
      onSelectCategory(it.category);
      document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const iconOf = (it: NavItem) => {
    const Icon = it.icon ? nav_icons[it.icon] : null;
    return Icon ? <span className="text-primary shrink-0 inline-flex w-4 h-4 items-center justify-center"><Icon className="w-4 h-4" /></span> : null;
  };

  const link = (it: NavItem, done: () => void, cls: string) => (
    <a key={it.href} href={it.href} onClick={pick(it, done)} {...(it.external ? { target: '_blank', rel: 'noreferrer' } : {})} className={cls}>
      {iconOf(it)}
      <span>{label(it.label, language)}</span>
    </a>
  );

  const panelLink = 'flex items-center gap-3 px-3 py-2.5 min-h-11 rounded-lg text-sm text-gray-900 hover:bg-surface-cream';
  const contatoHref = nav_contato.href[language];

  const center = (
    <nav aria-label="Principal" className={`hidden xl:flex ${navGroupClass}`}>
      <NavDropdown label={t.brasil} icon={<BrazilFlag />} wide>
        {(done) => (
          <div className="grid grid-cols-2 gap-4">
            {nav_brasil.map((g) => (
              <div key={g.title.pt}>
                <p className="px-3 pb-1 text-micro uppercase font-mono tracking-wider font-semibold text-gray-500">{g.title[language]}</p>
                {g.items.map((it) => link(it, done, panelLink))}
              </div>
            ))}
            {onSelectCategory && (
              <button
                type="button"
                onClick={() => { done(); onSelectCategory(null); document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`${panelLink} text-left col-span-2 border-t border-muted rounded-none`}
              >
                {t.all}
              </button>
            )}
          </div>
        )}
      </NavDropdown>
      <NavDropdown label={t.argentina} icon={<ArgentinaFlag />}>{(done) => nav_argentina.map((it) => link(it, done, panelLink))}</NavDropdown>
      <NavDropdown label={t.agenda} icon={<CalendarDays className="w-3.5 h-3.5 text-primary" />}>{(done) => nav_agenda.map((it) => link(it, done, panelLink))}</NavDropdown>
      <a href={contatoHref} target="_blank" rel="noreferrer" className={navPill()}>
        <MessageCircle className="w-3.5 h-3.5 text-primary" />
        {label(nav_contato.label, language)}
      </a>
      {language === 'pt' && (
        <a href={nav_interesse.href} className={navPill()}>
          <Heart className="w-3.5 h-3.5 text-primary" />
          {label(nav_interesse.label, language)}
        </a>
      )}
    </nav>
  );

  const right = (
    <>
      <div className="hidden sm:block">
        <LangSwitch
          language={language}
          hrefs={{ pt: pairFor(pathname, 'pt'), es: pairFor(pathname, 'es') }}
          onSelect={setPageLanguage}
        />
      </div>
      <a href={nav_portal.href} target="_blank" rel="noreferrer" onClick={close} className={navPortalPill}>
        <GraduationCap className="w-3.5 h-3.5" />
        <span>{label(nav_portal.label, language)}</span>
      </a>
    </>
  );

  const heading = (icon: React.ReactNode, text: string) => (
    <p className="flex items-center gap-2 text-micro uppercase font-mono tracking-wider font-semibold text-gray-500 mt-3">
      {icon} {text}
    </p>
  );
  const drawerLink = (it: NavItem) => (
    <a key={it.href} href={it.href} onClick={pick(it, close)} className={`${drawerItem} justify-start gap-3`}>
      {iconOf(it)}
      <span>{label(it.label, language)}</span>
    </a>
  );
  const drawer = (
    <div className="flex flex-col gap-2">
      <div className="sm:hidden mb-1">
        <LangSwitch language={language} hrefs={{ pt: pairFor(pathname, 'pt'), es: pairFor(pathname, 'es') }} onSelect={setPageLanguage} />
      </div>

      {heading(<BrazilFlag />, t.brasil)}
      {nav_brasil.map((g) => (
        <div key={g.title.pt} className="flex flex-col gap-2">
          <p className="text-micro font-semibold text-gray-600">{g.title[language]}</p>
          {g.items.map(drawerLink)}
        </div>
      ))}

      {heading(<ArgentinaFlag />, t.argentina)}
      {nav_argentina.map(drawerLink)}

      {heading(<CalendarDays className="w-3.5 h-3.5 text-primary" />, t.agenda)}
      {nav_agenda.map(drawerLink)}

      <a href={contatoHref} target="_blank" rel="noreferrer" onClick={close} className={`${drawerItem} justify-start gap-3 mt-3`}>
        <MessageCircle className="w-4 h-4 text-primary shrink-0" />
        <span>{label(nav_contato.label, language)}</span>
      </a>
      {language === 'pt' && (
        <a href={nav_interesse.href} onClick={close} className={`${drawerItem} justify-start gap-3`}>
          <Heart className="w-4 h-4 text-primary shrink-0" />
          <span>{label(nav_interesse.label, language)}</span>
        </a>
      )}
      <a href={nav_portal.href} target="_blank" rel="noreferrer" onClick={close} className={`${drawerItem} justify-start gap-3`}>
        <GraduationCap className="w-4 h-4 text-primary shrink-0" />
        <span>{label(nav_portal.label, language)}</span>
      </a>
    </div>
  );

  return (
    <NavHeader
      homeHref={homeHref}
      homeLabel={t.home}
      center={center}
      right={right}
      drawer={drawer}
      menuOpen={menuOpen}
      onToggle={() => setMenuOpen(!menuOpen)}
      menuLabels={{ open: t.open, close: t.close }}
      hideFrom="xl"
    />
  );
}
