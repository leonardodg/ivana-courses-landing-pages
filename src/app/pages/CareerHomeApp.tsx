// Inicio da Argentina (/es_ar/): vitrine das 6 carreras online. Sem preço.
// Segue docs/GUIA-DE-ESTILO.md (mesma navbar, herói, grade de cards e passos das páginas pt_BR).

import { useState } from 'react';
import { GraduationCap, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import { ar_pages, carreras_ar, carreras_principales, WHATSAPP_AR } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import CandlesNavbar from '../components/CandlesNavbar';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import {
  CarrerasGrid,
  ComoInscribirmeSection,
  CursadaSection,
  InclusoSection,
  WhatsAppFooterCta,
  faqs_carreras_ar,
  heroPrimary,
  heroSecondary,
} from '../components/theme/CareerSections';

const ArgentinaFlag = () => (
  <svg viewBox="0 0 3 2" className="w-4.5 h-3 opacity-95 rounded-[1px] scale-105" aria-hidden="true">
    <rect width="3" height="2" fill="#74ACDF" />
    <rect y="0.66" width="3" height="0.66" fill="#FFFFFF" />
    <circle cx="1.5" cy="1" r="0.18" fill="#FFAF36" />
  </svg>
);

export default function CareerHomeApp() {
  const [language, setLanguage] = useState<Language>('es');

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
                Carreras online con título del Conservatorio Grassi
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-sans font-medium">
                Estudiás desde tu casa, con un módulo por mes y el acompañamiento de la profesora Ivana Lerea. La inscripción está abierta todo el año.
              </p>

              <div className="pt-2 pb-4 flex flex-wrap gap-4 items-center">
                <a href="#carreras" className={heroPrimary}>
                  <GraduationCap className="w-3.5 h-3.5" /> Ver carreras
                </a>
                <a href={WHATSAPP_AR} className={heroSecondary}>
                  <MessageCircle className="w-3.5 h-3.5" /> Hablar por WhatsApp
                </a>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
              <img
                src={"/images/ar/velas.jpg"}
                alt={"Ivana Lerea, profesora de las carreras online"}
                fetchPriority="high"
                decoding="async"
                style={{ objectPosition: 'center 30%' }}
                className="relative z-10 w-full h-[320px] sm:h-[420px] md:h-[540px] rounded-xl shadow-xl border border-slate-200 object-cover"
              />
            </div>
          </div>
        </section>

        <section id="carreras" className="py-16 md:py-24 bg-white border-y border-muted">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">LAS CARRERAS</span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">Elegí tu carrera</h2>
              <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                Todas son 100% online y terminan con el título del Conservatorio Grassi.
              </p>
            </div>
            <CarrerasGrid
              items={carreras_principales.map((c) => carreras_ar[c])}
              linkTo={(c) => ar_pages[c.page].path}
            />
          </div>
        </section>

        <CursadaSection />
        <ComoInscribirmeSection />
        <InclusoSection />
        <AboutSection language="es" />
        <ReviewsCarousel language="es" reviews={reviews_list} />
        <FAQSection language="es" faqs={faqs_carreras_ar} />
        <WhatsAppFooterCta />
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
