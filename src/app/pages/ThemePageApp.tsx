// Página de tema dos cursos presenciais (saboaria, aromas, resina).
// Estrutura em conteudo/ORGANIZACAO.md; toda compra termina na loja.

import { useState } from 'react';
import { CalendarDays, SquarePen } from 'lucide-react';
import { Language } from '../classes/types';
import { presencial_themes, PresencialTheme, WHATSAPP_URL } from '../data/presencial';
import CandlesNavbar from '../components/CandlesNavbar';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import {
  TurmasSection,
  CursosSection,
  OnlineThemeBlock,
  OnlineLink,
  ComoFuncionaSection,
  InclusoSection,
  LocaisSection,
  faqs_presencial,
} from '../components/theme/ThemeSections';

interface ThemeConfig {
  theme: PresencialTheme;
  kicker: string;
  title: string;
  intro: string;
  heroImage: string;
  online: OnlineLink[];
}

const THEMES: Record<'saboaria' | 'aromas' | 'resina', ThemeConfig> = {
  saboaria: {
    theme: presencial_themes.saboaria,
    kicker: 'Cursos presenciais de saboaria',
    title: 'Saboaria e Extratos Naturais',
    intro: 'Aprenda do zero, pelo método melt and pour, e leve para casa os sabonetes que você produzir.',
    heroImage: '/images/courses/saboaria.jpg',
    online: [
      { title: 'Curso online de Saboaria', text: 'Aulas gravadas para aprender no seu ritmo.', href: '/saboaria/', cta: 'Conhecer o curso' },
      { title: 'Apostila de 60 receitas', text: 'Receitas de saboaria para começar a produzir.', href: '/apostila/', cta: 'Ver a apostila' },
    ],
  },
  aromas: {
    theme: presencial_themes.aromas,
    kicker: 'Cursos presenciais de aromas',
    title: 'Aromatizantes, Perfumes e Incensos',
    intro: 'Crie os seus próprios aromas e leve os produtos para casa, em encontros práticos e do zero.',
    heroImage: '/images/courses/aromatizantes-difusor.jpg',
    online: [],
  },
  resina: {
    theme: presencial_themes.resina,
    kicker: 'Cursos presenciais de resina e decoração',
    title: 'Resina e Decoração',
    intro: 'Resina, pedras, concreto e tricô gigante: peças de decoração feitas por você, no seu ritmo.',
    heroImage: '/images/courses/resina-bandeja-flores.jpg',
    online: [],
  },
};

export default function ThemePageApp({ themeId }: { themeId: keyof typeof THEMES }) {
  const [language, setLanguage] = useState<Language>('pt');
  const cfg = THEMES[themeId];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CandlesNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura */}
        <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-hero-bg">
          <img fetchPriority="high" decoding="async" src={cfg.heroImage} alt={cfg.title} className="absolute inset-0 w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/20" />
          <div className="relative z-10 px-6 md:px-12 pt-28 pb-12 max-w-[1280px] mx-auto w-full space-y-5">
            <span className="inline-block bg-white/95 border border-subtle px-3.5 py-1.5 rounded-full text-micro uppercase font-mono tracking-widest text-primary font-semibold">
              {cfg.kicker}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">{cfg.title}</h1>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-medium">{cfg.intro}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="#turmas"
                className="bg-primary text-white font-semibold font-mono text-xs tracking-widest uppercase inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <CalendarDays className="w-3.5 h-3.5" /> Ver próximas turmas
              </a>
              {cfg.online.length > 0 && (
                <a
                  href="#online"
                  className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary border border-subtle bg-white/80 hover:bg-white text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full transition-all"
                >
                  <SquarePen className="w-3.5 h-3.5" /> Prefere online?
                </a>
              )}
            </div>
          </div>
        </section>

        <TurmasSection theme={cfg.theme} />
        <CursosSection theme={cfg.theme} />
        <OnlineThemeBlock items={cfg.online} />
        <ComoFuncionaSection />
        <InclusoSection />
        <LocaisSection />
        {/* Prova social: os depoimentos atuais são sobre velas; entram aqui só depoimentos reais e autorizados do tema. */}
        <FAQSection language="pt" faqs={faqs_presencial} />

        {/* 10. Contato */}
        <section id="contato" className="py-16 bg-white border-t border-muted text-center px-6">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900">Ficou com alguma dúvida?</h2>
          <p className="text-sm text-on-surface-variant mt-2">Fale com a gente pelo WhatsApp.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full"
          >
            Chamar no WhatsApp
          </a>
          <p className="mt-4 text-xs"><a href="/agenda/" className="underline text-primary">Agenda completa</a></p>
        </section>
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
