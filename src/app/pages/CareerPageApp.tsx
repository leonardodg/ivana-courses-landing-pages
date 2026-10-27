// Página de carrera online da Argentina (candles, resin, macrame, textil, interiores, mixmedia).
// Mesmo padrão de ThemePageApp (Brasil). Sem preço: o botão leva à tienda (ou ao WhatsApp AR).

import { useState } from 'react';
import { Medal, GraduationCap, Monitor, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import { ar_pages, ArPageSlug, carreras_ar, whatsappInscripcion } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import { useAgenda } from '../hooks/useAgenda';
import CareerNavbar from '../components/CareerNavbar';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import {
  CohorteSection,
  ComoInscribirmeSection,
  ContinuaSection,
  CursadaSection,
  InscribirmeButton,
  QueAprenderSection,
  SalidaLaboralSection,
  WhatsAppFooterCta,
  btnOutline,
  faqs_carreras_ar,
  nivelLabel,
} from '../components/theme/CareerSections';

// Páginas que têm par no Brasil (seletor de idioma e hreflang).
const PT_PAIR: Partial<Record<ArPageSlug, string>> = {
  candles: '/pt_br/candles/',
  resin: '/pt_br/resin/',
};

export default function CareerPageApp({ slug }: { slug: ArPageSlug }) {
  const [language, setLanguage] = useState<Language>('es');
  const agenda = useAgenda('AR');
  const page = ar_pages[slug];
  const carrera = carreras_ar[page.courses[0]];

  const selos = [
    { icon: Monitor, text: '100% online' },
    { icon: Medal, text: 'Título con validez internacional · Conservatorio Grassi' },
    { icon: GraduationCap, text: 'Profesora Ivana Lerea' },
  ];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CareerNavbar ptHref={PT_PAIR[slug]} />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura */}
        <section className="bg-surface-cream pt-28 pb-14 md:pb-20 px-6 md:px-12">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-5">
            <ul className="flex flex-wrap gap-2">
              {selos.map((s) => (
                <li key={s.text} className="inline-flex items-center gap-1.5 bg-white/95 border border-subtle px-3.5 py-1.5 rounded-full text-micro uppercase font-mono tracking-wider text-primary font-semibold">
                  <s.icon className="w-3.5 h-3.5" /> {s.text}
                </li>
              ))}
            </ul>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">
              {carrera.nombre}
            </h1>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-medium">
              {nivelLabel(carrera)} de {carrera.meses} meses, con un módulo por mes. Estudiás desde tu casa, con acompañamiento de la profesora Ivana Lerea.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <InscribirmeButton carrera={carrera} className="px-8 py-4 rounded-full" />
              <a href={whatsappInscripcion(carrera)} className={`${btnOutline} px-8 py-4 rounded-full bg-white/80`}>
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-primary-container/15 rounded-2xl -rotate-2 pointer-events-none" />
              <img
                src={carrera.image}
                alt={carrera.nombre}
                fetchPriority="high"
                decoding="async"
                style={{ objectPosition: carrera.imagePos }}
                className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover rounded-xl shadow-xl border border-slate-200"
              />
            </div>
          </div>
        </section>

        <QueAprenderSection carrera={carrera} />
        <CursadaSection />
        <ContinuaSection carrera={carrera} />
        <SalidaLaboralSection />
        <CohorteSection carrera={carrera} agenda={agenda} />
        <ComoInscribirmeSection carrera={carrera} />
        <AboutSection language="es" />
        <ReviewsCarousel language="es" reviews={reviews_list} />
        <FAQSection language="es" faqs={faqs_carreras_ar} />
        <WhatsAppFooterCta />
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
