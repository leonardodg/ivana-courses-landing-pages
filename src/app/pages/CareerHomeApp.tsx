// Inicio da Argentina (/es-ar/): vitrine das 6 carreras online. Sem preço.
// Segue docs/GUIA-DE-ESTILO.md (mesma navbar, herói, grade de cards e passos das páginas pt_BR).

import { useState } from 'react';
import { GraduationCap, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import { ar_pages, carreras_ar, carreras_principales, WHATSAPP_AR } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import SiteNavbar from '../components/SiteNavbar';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { ArgentinaFlag, Hero, HeroBadgeText, Section, SectionHeader } from '../ui';
import {
  CarrerasGrid,
  ComoInscribirmeSection,
  CursadaSection,
  InclusoSection,
  WhatsAppFooterCta,
  faqs_carreras_ar,
} from '../components/theme/CareerSections';


export default function CareerHomeApp() {
  const language: Language = 'es';

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Hero
          badge={
            <>
              <ArgentinaFlag />
              <HeroBadgeText>100% online · Conservatorio Grassi</HeroBadgeText>
            </>
          }
          title="Carreras online con título del Conservatorio Grassi"
          text="Estudiás desde tu casa, con un módulo por mes y el acompañamiento de la profesora Ivana Lerea. La inscripción está abierta todo el año."
          primary={{ label: 'Ver carreras', href: '#carreras', icon: GraduationCap }}
          secondary={{ label: 'Hablar por WhatsApp', href: WHATSAPP_AR, icon: MessageCircle, external: true }}
          photo={{ src: '/images/ar/velas.jpg', alt: 'Ivana Lerea, profesora de las carreras online', position: 'center 30%' }}
        />

        <Section id="carreras" bg="white" border="y" width="wide">
          <SectionHeader kicker="LAS CARRERAS" title="Elegí tu carrera" sub="Todas son 100% online y terminan con el título del Conservatorio Grassi." />
          <CarrerasGrid
            items={carreras_principales.map((c) => carreras_ar[c])}
            linkTo={(c) => ar_pages[c.page].path}
          />
        </Section>

        <CursadaSection bg="cream" />
        <ComoInscribirmeSection bg="white" />
        <InclusoSection bg="cream" />
        <AboutSection language="es" />
        <ReviewsCarousel language="es" reviews={reviews_list} />
        <FAQSection language="es" faqs={faqs_carreras_ar} />
        <ContactForm language="es" coursePage="carreras_ar" />
        <WhatsAppFooterCta />
      </main>

      <Footer />
    </div>
  );
}
