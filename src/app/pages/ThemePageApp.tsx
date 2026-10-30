// Página de tema dos cursos presenciais (saboaria, aromas, resina).
// Estrutura em conteudo/ORGANIZACAO.md; toda compra termina na loja.

import { useState } from 'react';
import { CalendarDays, MessageCircle, SquarePen } from 'lucide-react';
import { Language } from '../classes/types';
import { presencial_themes, PresencialTheme, WHATSAPP_URL } from '../data/presencial';
import SiteNavbar from '../components/SiteNavbar';
import FAQSection from '../components/FAQSection';
import { ContactCta, Hero, HeroBadgeText, WhatsAppFab, whatsappHref } from '../ui';
import { hero_stats_br } from '../data/hero_stats';
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
    heroImage: '/images/courses/saboaria.webp',
    online: [
      { title: 'Curso online de Saboaria', text: 'Aulas gravadas para aprender no seu ritmo.', href: '/pt-br/cursos/online/saboaria-com-extratos-naturais/', cta: 'Conhecer o curso' },
      { title: 'Apostila de 60 receitas', text: 'Receitas de saboaria para começar a produzir.', href: '/pt-br/apostilas/60-receitas-de-sabonetes/', cta: 'Ver a apostila' },
    ],
  },
  aromas: {
    theme: presencial_themes.aromas,
    kicker: 'Cursos presenciais de aromas',
    title: 'Aromatizantes, Perfumes e Incensos',
    intro: 'Crie os seus próprios aromas e leve os produtos para casa, em encontros práticos e do zero.',
    heroImage: '/images/courses/aromatizantes-difusor.webp',
    online: [],
  },
  resina: {
    theme: presencial_themes.resina,
    kicker: 'Cursos presenciais de resina e decoração',
    title: 'Resina e Decoração',
    intro: 'Resina, pedras, concreto e tricô gigante: peças de decoração feitas por você, no seu ritmo.',
    heroImage: '/images/courses/resina-bandeja-flores.webp',
    online: [],
  },
};

export default function ThemePageApp({ themeId }: { themeId: keyof typeof THEMES }) {
  const language: Language = 'pt';
  const cfg = THEMES[themeId];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura */}
        <Hero
          badge={<HeroBadgeText>{cfg.kicker}</HeroBadgeText>}
          title={cfg.title}
          text={cfg.intro}
          primary={{ label: 'Ver próximas turmas', href: '#turmas', icon: CalendarDays }}
          secondary={
            cfg.online.length > 0
              ? { label: 'Prefere online?', href: '#online', icon: SquarePen }
              : { label: 'Falar no WhatsApp', href: WHATSAPP_URL, icon: MessageCircle, external: true }
          }
          backdrop={{ src: cfg.heroImage, alt: cfg.title }}
          stats={hero_stats_br}
        />

        <CursosSection theme={cfg.theme} />
        <TurmasSection theme={cfg.theme} />
        <OnlineThemeBlock items={cfg.online} />
        <ComoFuncionaSection />
        <InclusoSection />
        <LocaisSection />
        {/* Prova social: os depoimentos atuais são sobre velas; entram aqui só depoimentos reais e autorizados do tema. */}
        <FAQSection language="pt" faqs={faqs_presencial} />

        <ContactCta
          id="contato"
          title="Ficou com alguma dúvida?"
          text="Fale com a gente pelo WhatsApp."
          action={{ label: 'Chamar no WhatsApp', href: WHATSAPP_URL }}
          below={<p className="mt-4 text-xs"><a href="/pt-br/agenda/" className="inline-flex min-h-11 items-center underline text-primary">Agenda completa</a></p>}
        />
      </main>

      <WhatsAppFab href={whatsappHref(WHATSAPP_URL, `Oi! Vim pela página de ${cfg.title} e quero saber mais.`)} label="Falar no WhatsApp" />

      <Footer />
    </div>
  );
}
