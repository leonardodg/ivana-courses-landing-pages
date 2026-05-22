import { Language, CategoryId } from '../types';
import { CATEGORIES } from '../data';
import { Languages, PhoneCall, ChevronRight, Menu, X, Flame, Sparkles, Sliders } from 'lucide-react';
import { useState } from 'react';

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

  const t = {
    pt: {
      allCategories: 'Segmentos',
      contact: 'Fale Conosco',
      devHub: 'Engenharia / Cache',
    },
    es: {
      allCategories: 'Segmentos',
      contact: 'Contacto',
      devHub: 'Ingeniería / Caché',
    }
  }[language];

  return (
    <header className="bg-[#fcf9f5]/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-[#e1deda] transition-all">
      <div className="flex justify-between items-center px-4 md:px-12 py-3.5 max-w-[1280px] mx-auto w-full">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img
            alt="Ivana Academy Logo"
            className="h-10 md:h-12 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEq7hSIxNmxkfIHSubsBA9DnhiKGTjQQtxNMhvbshwJhMuv1EZE3QMJML0icL9KynPAOtrkehG7GTZftH3q1VhQRN1shY6MlSG56jIeaPGo10RfWbGhr7-3eg9fUucE7nG-rw5SBMcgKMZIG2YEtF-Z-oCHIgixUP_g9n0ETXDIqA5oFqKZ21QuntZ4wjhtP65scaDq4DVn3eo0JYaYLgs2fSe9siJWDLJiTSd6e1HQ_7ybfV2nWWZZhlgMDvxuLBItTmNaOU0nqVe"
          />
          <div className="hidden lg:block">
            <span className="font-serif font-bold text-gray-850 text-sm tracking-wide block">IVANA ACADEMY</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#805252] font-semibold block">Artisanal Excellence</span>
          </div>
        </div>

        {/* Categories Quick Switcher (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-[#f0ede9] p-1 rounded-full border border-[#e1deda]">
          {Object.values(CATEGORIES).map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#805252] text-white shadow-sm'
                    : 'text-[#514443] hover:bg-[#eae8e4]'
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
          {/* Quick link to Tech Blueprint */}
          <a
            href="#tech-blueprint"
            className="hidden xl:flex items-center gap-1 bg-slate-900 border border-slate-800 text-rose-300 text-xs px-3 py-1.5 rounded-full font-mono hover:bg-slate-850"
          >
            <Sliders className="w-3.5 h-3.5 fill-current" />
            <span>Postgres/Redis Plan</span>
          </a>

          {/* Language Switch with Desaturated/Saturated Country Flags */}
          <div className="flex items-center gap-1.5 bg-[#f0ede9] p-1.5 rounded-full border border-[#e1deda]">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                language === 'pt' ? 'bg-[#805252] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-200/50'
              }`}
              title="Português (Brasil)"
            >
              <BrazilFlag isSelected={language === 'pt'} />
              <span>PT</span>
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                language === 'es' ? 'bg-[#805252] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-200/50'
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
            className="md:hidden text-gray-700 hover:text-[#805252] p-1"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAF6F0] w-full border-t border-[#e1deda] py-4 px-6 shadow-inner animate-fade-in">
          <p className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-500 mb-2">{t.allCategories}</p>
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
                      ? 'bg-[#805252] text-white'
                      : 'text-[#514443] bg-[#f5f1eb] hover:bg-[#eae8e4]'
                  }`}
                >
                  <span className="text-base">{cat.badgeLogo}</span>
                  <span>{cat.name[language]}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#e1deda] mt-4 pt-3 flex flex-col gap-2">
            <a
              href="#tech-blueprint"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-100 font-semibold"
            >
              <span className="font-mono">{t.devHub}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 font-semibold"
            >
              <span>{t.contact}</span>
              <PhoneCall className="w-4 h-4 text-[#805252]" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
