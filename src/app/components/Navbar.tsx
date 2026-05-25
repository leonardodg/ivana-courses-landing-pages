import { CategorySpec, Language, CategoryId } from '../classes/types';
import { categories_data } from '../data/categories';
import { Languages, PhoneCall, ChevronRight, Menu, X, Flame, Sparkles, Sliders, Link2 } from 'lucide-react';
import { useState } from 'react';
import { navbar_text as text } from '../lang/navbar';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeCategoryId: CategoryId;
  setActiveCategoryId: (cat: CategoryId) => void;
}

const BrazilFlag = ({ isSelected }: { isSelected: boolean }) => (
  <svg
    viewBox="0 0 720 500"
    className={`w-4.5 h-3 opacity-95 rounded-[1px] transition-all duration-300 ${
      isSelected ? 'grayscale-0 scale-105' : 'grayscale opacity-40 hover:opacity-75'
    }`}
  >
    <rect width="720" height="500" fill="#009c3b" />
    <polygon points="360,60 60,250 360,440 660,250" fill="#ffdf00" />
    <circle cx="360" cy="250" r="120" fill="#002776" />
  </svg>
);

const ArgentinaFlag = ({ isSelected }: { isSelected: boolean }) => (
  <svg
    viewBox="0 0 3 2"
    className={`w-4.5 h-3 opacity-95 rounded-[1px] transition-all duration-300 ${
      isSelected ? 'grayscale-0 scale-105' : 'grayscale opacity-40 hover:opacity-75'
    }`}
  >
    <rect width="3" height="2" fill="#74ACDF" />
    <rect y="0.66" width="3" height="0.66" fill="#FFFFFF" />
    <circle cx="1.5" cy="1" r="0.18" fill="#FFAF36" />
  </svg>
);

export default function Navbar({
  language,
  setLanguage,
  activeCategoryId,
  setActiveCategoryId,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const CATEGORIES: Record<string, CategorySpec> = categories_data;

  const navbar_text = text[language];

  return (
    <header className="bg-surface-cream/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-subtle transition-all">
      <div className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 px-2">
          <img
            alt="Ivana Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="/images/logo.svg"
          />
        </div>

        {/* Categories Quick Switcher (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-surface-form p-1 rounded-full border border-subtle">
          {Object.values(CATEGORIES).map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span>{cat.badgeLogo}</span>
                <span>{cat.name[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Global Controls & Social */}
        <div className="flex items-center gap-4">

          {/* Language Switch with Desaturated/Saturated Country Flags */}
          <div className="flex items-center gap-1.5 bg-surface-form p-1.5 rounded-full border border-subtle">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                language === 'pt' ? 'bg-primary text-white shadow-xs' : 'text-gray-500 hover:bg-gray-200/50'
              }`}
              title="Português (Brasil)"
            >
              <BrazilFlag isSelected={language === 'pt'} />
              <span>PT</span>
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                language === 'es' ? 'bg-primary text-white shadow-xs' : 'text-gray-500 hover:bg-gray-200/50'
              }`}
              title="Español (Argentina)"
            >
              <ArgentinaFlag isSelected={language === 'es'} />
              <span>ES</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 hover:text-primary p-1"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface-hero w-full border-t border-subtle py-4 px-6 shadow-inner animate-fade-in">
          <p className="text-micro uppercase font-mono tracking-wider font-semibold text-gray-500 mb-2">{navbar_text.allCategories}</p>
          <div className="flex flex-col gap-2">
            {Object.values(CATEGORIES).map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-sm font-semibold tracking-wide flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-base">{cat.badgeLogo}</span>
                  <span>{cat.name[language]}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-subtle mt-4 pt-3 flex flex-col gap-2">
            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>{navbar_text.contact}</span>
              <PhoneCall className="w-4 h-4 text-primary" />
            </a>

            <a
              href="https://ivana.academy" target="_blank"
               onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>{navbar_text.platform}</span>
              <Link2 className="w-4 h-4 text-primary" />
            </a>

          </div>
        </div>
      )}
    </header>
  );
}
