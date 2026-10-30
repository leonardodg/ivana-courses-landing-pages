// Inicio da Argentina (/es-ar/): vitrine das 6 carreras online. Sem preço.
// Segue docs/GUIA-DE-ESTILO.md (mesma navbar, herói, grade de cards e passos das páginas pt_BR).

import { useState } from 'react';
import { ArrowRight, GraduationCap, MessageCircle } from 'lucide-react';
import type { Language } from '../classes/types';
import { ar_hero, ar_hero_general, ar_pages, carreras_ar, carreras_principales, WHATSAPP_AR } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import SiteNavbar from '../components/SiteNavbar';
import { useAgenda } from '../hooks/useAgenda';
import { useSegmentFilter } from '../hooks/useSegmentFilter';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { ArgentinaFlag, Hero, HeroBadgeText, Section, SectionHeader, WhatsAppFab, whatsappHref, type HeroSlide } from '../ui';
import { hero_stats_ar } from '../data/hero_stats';
import { GRASSI_SEAL } from '../data/hero_seals';
import {
  CarrerasGrid,
  ComoInscribirmeSection,
  CursadaSection,
  InclusoSection,
  WhatsAppFooterCta,
  faqs_carreras_ar,
} from '../components/theme/CareerSections';


const heroLabels = { prev: 'Slide anterior', next: 'Siguiente slide', carousel: 'Carreras destacadas', slide: 'Ir al slide' };

// Primeiro slide: apresentação geral; depois, um slide por carrera, com link para a página dela.
const heroSlides: HeroSlide[] = [
  {
    id: 'inicio',
    badge: (
      <>
        <ArgentinaFlag />
        <HeroBadgeText>100% online · Conservatorio Grassi</HeroBadgeText>
      </>
    ),
    title: 'Carreras online con título del Conservatorio Grassi',
    text: 'Estudiás desde tu casa, con un módulo por mes y el acompañamiento de la profesora Ivana Lerea. La inscripción está abierta todo el año.',
    primary: { label: 'Ver carreras', href: '#carreras', icon: GraduationCap },
    secondary: { label: 'Hablar por WhatsApp', href: WHATSAPP_AR, icon: MessageCircle, external: true },
    backdrop: { src: ar_hero_general, alt: 'Carreras online de Ivana Academy', position: '78% center' },
    seal: GRASSI_SEAL,
  },
  ...carreras_principales.map((c): HeroSlide => {
    const carrera = carreras_ar[c];
    return {
      id: c,
      badge: (
        <>
          <ArgentinaFlag />
          <HeroBadgeText>{carrera.nivel === 'tecnicatura' ? 'Tecnicatura' : 'Profesorado'} · {carrera.meses} meses · 100% online</HeroBadgeText>
        </>
      ),
      title: carrera.nombre,
      text: `Un módulo por mes, con evaluación y el acompañamiento de la profesora Ivana Lerea. Título del Conservatorio Grassi.`,
      primary: { label: 'Ver la carrera', href: ar_pages[carrera.page].path, icon: ArrowRight },
      secondary: { label: 'Hablar por WhatsApp', href: WHATSAPP_AR, icon: MessageCircle, external: true },
      backdrop: { src: ar_hero[carrera.page], alt: carrera.nombre, position: '78% center' },
      seal: GRASSI_SEAL,
    };
  }),
];

// Segmento do filtro = carrera sin el prefijo "ar-" (velas, resinas, macrame, estampas, interiores, mixmedia).
const segmentOf = (course: string) => course.replace(/^ar-/, '');

export default function CareerHomeApp() {
  const language: Language = 'es';
  const agenda = useAgenda('AR');

  // Filtro por carrera sincronizado con el #hash: /es-ar/#velas filtra y baja a las carreras; /es-ar/#ar-macrame va a esa tarjeta.
  const [segmento, setSegmento] = useSegmentFilter({
    keys: carreras_principales.map(segmentOf),
    aliases: { textil: 'estampas' },
    cardSegment: (id) => (carreras_principales.some((c) => c === id) ? segmentOf(id) : undefined),
    sectionId: 'carreras',
  });
  const carreras = carreras_principales.filter((c) => !segmento || segmentOf(c) === segmento).map((c) => carreras_ar[c]);

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Hero slides={heroSlides} stats={hero_stats_ar} labels={heroLabels} />

        <Section id="carreras" bg="white" border="y" width="wide">
          <SectionHeader kicker="LAS CARRERAS" title="Elegí tu carrera" sub="Todas son 100% online y terminan con el título del Conservatorio Grassi." />
          <CarrerasGrid
            agenda={agenda}
            items={carreras}
            linkTo={(c) => ar_pages[c.page].path}
            filter={{
              value: segmento,
              onChange: setSegmento,
              options: carreras_principales.map((c) => ({ value: segmentOf(c), label: ar_pages[carreras_ar[c].page].title })),
              label: 'Filtrar por carrera',
              allLabel: 'Todas las carreras',
            }}
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

      <WhatsAppFab href={whatsappHref(WHATSAPP_AR, '¡Hola! Vengo del sitio y quiero saber más sobre las carreras online.')} label="Hablar por WhatsApp" />

      <Footer />
    </div>
  );
}
