// Página de carrera online da Argentina (candles, resin, macrame, textil, interiores, mixmedia).
// Segue docs/GUIA-DE-ESTILO.md: navbar de tema, herói dividido com 2 botões em pílula, cards em 2 colunas,
// passos em 4 colunas. Sem preço: o botão leva à tienda (ou ao WhatsApp AR).

import { useState } from 'react';
import { CalendarDays, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import { ar_pages, ArPageSlug, carreras_ar, WHATSAPP_AR } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import { useAgenda } from '../hooks/useAgenda';
import CandlesNavbar from '../components/CandlesNavbar';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import {
  CarrerasGrid,
  CohorteSection,
  ComoInscribirmeSection,
  CursadaSection,
  InclusoSection,
  QueAprenderSection,
  SalidaLaboralSection,
  WhatsAppFooterCta,
  faqs_carreras_ar,
  heroPrimary,
  heroSecondary,
  nivelLabel,
} from '../components/theme/CareerSections';

const ArgentinaFlag = () => (
  <svg viewBox="0 0 3 2" className="w-4.5 h-3 opacity-95 rounded-[1px] scale-105" aria-hidden="true">
    <rect width="3" height="2" fill="#74ACDF" />
    <rect y="0.66" width="3" height="0.66" fill="#FFFFFF" />
    <circle cx="1.5" cy="1" r="0.18" fill="#FFAF36" />
  </svg>
);

export default function CareerPageApp({ slug }: { slug: ArPageSlug }) {
  const [language, setLanguage] = useState<Language>('es');
  const agenda = useAgenda('AR');
  const page = ar_pages[slug];
  const carrera = carreras_ar[page.courses[0]];
  const cards = page.courses.map((c) => carreras_ar[c]);

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CandlesNavbar language="es" />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura (herói dividido, igual ao da página de velas do Brasil) */}
        <section className="relative overflow-hidden bg-surface-cream pt-28 md:pt-32 pb-14 md:pb-20 px-6 md:px-12">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <ArgentinaFlag />
                <span className="text-micro uppercase font-mono tracking-widest text-primary">
                  100% online · Conservatorio Grassi
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">
                {carrera.nombre}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-sans font-medium">
                {nivelLabel(carrera)} de {carrera.meses} meses, con un módulo por mes. Estudiás desde tu casa, con acompañamiento de la profesora Ivana Lerea.
              </p>

              <div className="pt-2 pb-4 flex flex-wrap gap-4 items-center">
                <a href="#cohorte" className={heroPrimary}>
                  <CalendarDays className="w-3.5 h-3.5" /> Ver cohorte 2027
                </a>
                <a href={WHATSAPP_AR} className={heroSecondary}>
                  <MessageCircle className="w-3.5 h-3.5" /> Hablar por WhatsApp
                </a>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
              <img
                src={carrera.image}
                alt={carrera.nombre}
                fetchPriority="high"
                decoding="async"
                style={{ objectPosition: carrera.imagePos }}
                className="relative z-10 w-full h-[320px] sm:h-[420px] md:h-[540px] rounded-xl shadow-xl border border-slate-200 object-cover"
              />
            </div>
          </div>
        </section>

        <CohorteSection carrera={carrera} agenda={agenda} />

        <section id="carreras" className="py-16 md:py-24 bg-white border-y border-muted">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">LA CARRERA</span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">Elegí cómo seguir</h2>
              <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                100% online, con el título del Conservatorio Grassi.
              </p>
            </div>
            <CarrerasGrid items={cards} />
          </div>
        </section>

        <QueAprenderSection carrera={carrera} />
        <CursadaSection />
        <ComoInscribirmeSection />
        <InclusoSection />
        <SalidaLaboralSection />
        <AboutSection language="es" />
        <ReviewsCarousel language="es" reviews={reviews_list} />
        <FAQSection language="es" faqs={faqs_carreras_ar} />
        <WhatsAppFooterCta />
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
