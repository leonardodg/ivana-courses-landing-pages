// Página de tema dos cursos presenciais (saboaria, aromas, resina).
// Estrutura em conteudo/ORGANIZACAO.md; toda compra termina na loja.

import { useState } from 'react';
import { CalendarDays, MessageCircle, SquarePen } from 'lucide-react';
import { tr, usePageLanguage } from '../lib/lang';
import { presencial_themes, PresencialTheme, WHATSAPP_URL } from '../data/presencial';
import SiteNavbar from '../components/SiteNavbar';
import FAQSection from '../components/FAQSection';
import { ContactCta, Hero, HeroBadgeText, WhatsAppFab, whatsappHref } from '../ui';
import { hero_stats_br, hero_stats_br_es } from '../data/hero_stats';
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

type Bi = { pt: string; es: string };
interface ThemeConfig {
  theme: PresencialTheme;
  kicker: Bi;
  title: Bi;
  intro: Bi;
  heroImage: string;
  online: (Omit<OnlineLink, 'title' | 'text' | 'cta'> & { title: Bi; text: Bi; cta: Bi })[];
}

const THEMES: Record<'saboaria' | 'aromas' | 'resina', ThemeConfig> = {
  saboaria: {
    theme: presencial_themes.saboaria,
    kicker: { pt: 'Cursos presenciais de saboaria', es: 'Cursos presenciales de jabonería' },
    title: { pt: 'Saboaria e Extratos Naturais', es: 'Jabonería y Extractos Naturales' },
    intro: { pt: 'Aprenda do zero, pelo método melt and pour, e leve para casa os sabonetes que você produzir.', es: 'Aprendé desde cero, con el método melt and pour, y llevate a casa los jabones que produzcas.' },
    heroImage: '/images/courses/saboaria.webp',
    online: [
      { title: { pt: 'Curso online de Saboaria', es: 'Curso online de Jabonería' }, text: { pt: 'Aulas gravadas para aprender no seu ritmo.', es: 'Clases grabadas para aprender a tu ritmo.' }, href: '/pt-br/cursos/online/saboaria-com-extratos-naturais/', cta: { pt: 'Conhecer o curso', es: 'Conocer el curso' } },
      { title: { pt: 'Apostila de 60 receitas', es: 'Apunte de 60 recetas' }, text: { pt: 'Receitas de saboaria para começar a produzir.', es: 'Recetas de jabonería para empezar a producir.' }, href: '/pt-br/apostilas/60-receitas-de-sabonetes/', cta: { pt: 'Ver a apostila', es: 'Ver el apunte' } },
    ],
  },
  aromas: {
    theme: presencial_themes.aromas,
    kicker: { pt: 'Cursos presenciais de aromas', es: 'Cursos presenciales de aromas' },
    title: { pt: 'Aromatizantes, Perfumes e Incensos', es: 'Aromatizantes, Perfumes e Inciensos' },
    intro: { pt: 'Crie os seus próprios aromas e leve os produtos para casa, em encontros práticos e do zero.', es: 'Creá tus propios aromas y llevate los productos a casa, en encuentros prácticos y desde cero.' },
    heroImage: '/images/courses/aromatizantes-difusor.webp',
    online: [],
  },
  resina: {
    theme: presencial_themes.resina,
    kicker: { pt: 'Cursos presenciais de resina e decoração', es: 'Cursos presenciales de resina y decoración' },
    title: { pt: 'Resina e Decoração', es: 'Resina y Decoración' },
    intro: { pt: 'Resina, pedras, concreto e tricô gigante: peças de decoração feitas por você, no seu ritmo.', es: 'Resina, piedras, cemento y tejido gigante: piezas de decoración hechas por vos, a tu ritmo.' },
    heroImage: '/images/courses/resina-bandeja-flores.webp',
    online: [],
  },
};

export default function ThemePageApp({ themeId }: { themeId: keyof typeof THEMES }) {
  const language = usePageLanguage();
  const cfg = THEMES[themeId];
  const t = (b: Bi) => b[language];
  const online: OnlineLink[] = cfg.online.map((o) => ({ ...o, title: t(o.title), text: t(o.text), cta: t(o.cta) }));

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura */}
        <Hero
          badge={<HeroBadgeText>{t(cfg.kicker)}</HeroBadgeText>}
          title={t(cfg.title)}
          text={t(cfg.intro)}
          primary={{ label: tr(language, 'Ver próximos grupos', 'Ver próximas turmas'), href: '#turmas', icon: CalendarDays }}
          secondary={
            online.length > 0
              ? { label: tr(language, '¿Preferís online?', 'Prefere online?'), href: '#online', icon: SquarePen }
              : { label: tr(language, 'Hablar por WhatsApp', 'Falar no WhatsApp'), href: WHATSAPP_URL, icon: MessageCircle, external: true }
          }
          backdrop={{ src: cfg.heroImage, alt: t(cfg.title) }}
          stats={tr(language, hero_stats_br_es, hero_stats_br)}
        />

        <CursosSection theme={cfg.theme} />
        <TurmasSection theme={cfg.theme} />
        <OnlineThemeBlock items={online} />
        <ComoFuncionaSection />
        <InclusoSection />
        <LocaisSection />
        {/* Prova social: os depoimentos atuais são sobre velas; entram aqui só depoimentos reais e autorizados do tema. */}
        <FAQSection language={language} faqs={faqs_presencial} />

        <ContactCta
          id="contato"
          title={tr(language, '¿Te quedó alguna duda?', 'Ficou com alguma dúvida?')}
          text={tr(language, 'Escribinos por WhatsApp.', 'Fale com a gente pelo WhatsApp.')}
          action={{ label: tr(language, 'Escribir por WhatsApp', 'Chamar no WhatsApp'), href: WHATSAPP_URL }}
          below={<p className="mt-4 text-xs"><a href={tr(language, '/es-ar/agenda/', '/pt-br/agenda/')} className="inline-flex min-h-11 items-center underline text-primary">Agenda completa</a></p>}
        />
      </main>

      <WhatsAppFab href={whatsappHref(WHATSAPP_URL, tr(language, `¡Hola! Vengo de la página de ${t(cfg.title)} y quiero saber más.`, `Oi! Vim pela página de ${t(cfg.title)} e quero saber mais.`))} label={tr(language, 'Hablar por WhatsApp', 'Falar no WhatsApp')} />

      <Footer />
    </div>
  );
}
