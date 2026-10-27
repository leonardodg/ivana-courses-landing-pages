// Inicio da Argentina (/es_ar/): vitrine das 6 carreras online. Sem preço.

import { useState } from 'react';
import { CalendarDays, GraduationCap, Medal, Monitor } from 'lucide-react';
import type { Language } from '../classes/types';
import { ar_pages, carreras_ar, carreras_principales } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import CareerNavbar from '../components/CareerNavbar';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import {
  CarreraCard,
  ComoInscribirmeSection,
  CursadaSection,
  WhatsAppFooterCta,
  btnOutline,
  btnPrimary,
  faqs_carreras_ar,
} from '../components/theme/CareerSections';

export default function CareerHomeApp() {
  const [language, setLanguage] = useState<Language>('es');

  const selos = [
    { icon: Monitor, text: '100% online' },
    { icon: Medal, text: 'Título con validez internacional · Conservatorio Grassi' },
    { icon: GraduationCap, text: 'Profesora Ivana Lerea' },
  ];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CareerNavbar anchorBase="/es_ar/" />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
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
              Carreras online con título del Conservatorio Grassi
            </h1>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-medium">
              Estudiás desde tu casa, con un módulo por mes y el acompañamiento de la profesora Ivana Lerea. La inscripción está abierta todo el año.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="#carreras" className={`${btnPrimary} px-8 py-4 rounded-full`}>Elegir mi carrera</a>
              <a href="/es_ar/agenda/" className={`${btnOutline} px-8 py-4 rounded-full bg-white/80`}>
                <CalendarDays className="w-3.5 h-3.5" /> Cohorte 2027
              </a>
            </div>
          </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-primary-container/15 rounded-2xl -rotate-2 pointer-events-none" />
              <img
                src="/images/ar/velas.jpg"
                alt="Ivana Lerea, profesora de las carreras online"
                fetchPriority="high"
                decoding="async"
                style={{ objectPosition: 'center 30%' }}
                className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover rounded-xl shadow-xl border border-slate-200"
              />
            </div>
          </div>
        </section>

        <section id="carreras" className="py-16 md:py-24 bg-white border-y border-muted">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">LAS CARRERAS</span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">Elegí tu carrera</h2>
              <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">Todas son 100% online y terminan con el título del Conservatorio Grassi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {carreras_principales.map((c) => (
                <CarreraCard key={c} carrera={carreras_ar[c]} href={ar_pages[carreras_ar[c].page].path} />
              ))}
            </div>
          </div>
        </section>

        <CursadaSection />
        <ComoInscribirmeSection />
        <AboutSection language="es" />
        <ReviewsCarousel language="es" reviews={reviews_list} />
        <FAQSection language="es" faqs={faqs_carreras_ar} />
        <WhatsAppFooterCta />
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
