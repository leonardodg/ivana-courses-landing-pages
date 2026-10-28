// Navbar da home: seletor de categorias (filtro dos cards) e idioma PT | ES, sobre o NavHeader de ui/
// (o mesmo header das páginas de tema).
import { CategorySpec, Language, CategoryId } from '../classes/types';
import { categories_data } from '../data/categories';
import { PhoneCall, Menu, Link2 } from 'lucide-react';
import { useState } from 'react';
import { navbar_text as text } from '../lang/navbar';
import { ArgentinaFlag, BrazilFlag, NavHeader, drawerItem, navGroupClass, navPill } from '../ui';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeCategoryId: CategoryId | null;
  setActiveCategoryId: (cat: CategoryId | null) => void;
}

const langBtn = (active: boolean) =>
  `px-3 py-1.5 min-h-9 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
    active ? 'bg-primary text-white shadow-xs' : 'text-gray-600 hover:bg-gray-200/50'
  }`;

export default function Navbar({ language, setLanguage, activeCategoryId, setActiveCategoryId }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const CATEGORIES: Record<string, CategorySpec> = categories_data;
  const navbar_text = text[language];
  const es = language === 'es';

  const center = (
    <div className={`hidden md:flex ${navGroupClass}`}>
      {Object.values(CATEGORIES).map((cat) => {
        const isActive = activeCategoryId === cat.id;
        return (
          <button key={cat.id} onClick={() => setActiveCategoryId(isActive ? null : cat.id)} className={navPill(isActive)}>
            <span>{cat.badgeLogo}</span>
            <span>{cat.name[language]}</span>
          </button>
        );
      })}
    </div>
  );

  const right = (
    <div className="flex items-center gap-1.5 bg-surface-form p-1.5 rounded-full border border-subtle">
      <button onClick={() => setLanguage('pt')} className={langBtn(language === 'pt')} title="Português (Brasil)">
        <BrazilFlag selected={language === 'pt'} />
        <span>PT</span>
      </button>
      <button onClick={() => setLanguage('es')} className={langBtn(language === 'es')} title="Español (Argentina)">
        <ArgentinaFlag selected={language === 'es'} />
        <span>ES</span>
      </button>
    </div>
  );

  const drawer = (
    <>
      <p className="text-micro uppercase font-mono tracking-wider font-semibold text-gray-600 mb-2">{navbar_text.allCategories}</p>
      <div className="flex flex-col gap-2">
        {Object.values(CATEGORIES).map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(isActive ? null : cat.id);
                setMenuOpen(false);
              }}
              className={`w-full p-2.5 min-h-11 rounded-lg text-left text-sm font-semibold tracking-wide flex items-center gap-2.5 transition-all ${
                isActive ? 'bg-primary text-white' : 'text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              <span className="text-base">{cat.badgeLogo}</span>
              <span>{cat.name[language]}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-subtle mt-4 pt-3 flex flex-col gap-2">
        <a href="#cursos" onClick={() => setMenuOpen(false)} className={drawerItem}>
          <span>{navbar_text.courses}</span>
          <Menu className="w-4 h-4 text-primary" />
        </a>
        <a href="#contato" onClick={() => setMenuOpen(false)} className={drawerItem}>
          <span>{navbar_text.contact}</span>
          <PhoneCall className="w-4 h-4 text-primary" />
        </a>
        <a href="https://ivana.academy" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className={drawerItem}>
          <span>{navbar_text.platform}</span>
          <Link2 className="w-4 h-4 text-primary" />
        </a>
      </div>
    </>
  );

  return (
    <NavHeader
      homeHref="/"
      homeLabel={es ? 'Ivana Academy - página de inicio' : 'Ivana Academy - página inicial'}
      center={center}
      right={right}
      drawer={drawer}
      menuOpen={menuOpen}
      onToggle={() => setMenuOpen(!menuOpen)}
      menuLabels={es ? { open: 'Abrir menú', close: 'Cerrar menú' } : { open: 'Abrir menu', close: 'Fechar menu' }}
      rightGap="gap-4"
    />
  );
}
