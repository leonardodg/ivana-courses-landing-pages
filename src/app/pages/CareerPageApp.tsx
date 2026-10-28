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
import { ArgentinaFlag, Hero, HeroBadgeText, Section, SectionHeader } from '../ui';
import {
  buildArMenu,
  CarrerasGrid,
  CohorteSection,
  ComoInscribirmeSection,
  CursadaSection,
  InclusoSection,
  QueAprenderSection,
  SalidaLaboralSection,
  WhatsAppFooterCta,
  faqs_carreras_ar,
  nivelLabel,
} from '../components/theme/CareerSections';

// Páginas que têm par no Brasil (seletor PT | ES e hreflang).
const PT_PAIR: Partial<Record<ArPageSlug, string>> = { candles: '/pt_br/candles/', resin: '/pt_br/resin/' };


export default function CareerPageApp({ slug }: { slug: ArPageSlug }) {
  const [language, setLanguage] = useState<Language>('es');
  const agenda = useAgenda('AR');
  const page = ar_pages[slug];
  const carrera = carreras_ar[page.courses[0]];
  const cards = page.courses.map((c) => carreras_ar[c]);

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CandlesNavbar language="es" menu={buildArMenu(PT_PAIR[slug])} />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura */}
        <Hero
          badge={
            <>
              <ArgentinaFlag />
              <HeroBadgeText>100% online · Conservatorio Grassi</HeroBadgeText>
            </>
          }
          title={carrera.nombre}
          text={`${nivelLabel(carrera)} de ${carrera.meses} meses, con un módulo por mes. Estudiás desde tu casa, con acompañamiento de la profesora Ivana Lerea.`}
          primary={{ label: 'Ver cohorte 2027', href: '#cohorte', icon: CalendarDays }}
          secondary={{ label: 'Hablar por WhatsApp', href: WHATSAPP_AR, icon: MessageCircle, external: true }}
          photo={{ src: carrera.image, alt: carrera.nombre, position: carrera.imagePos }}
        />

        <CohorteSection carrera={carrera} agenda={agenda} />

        <Section id="carreras" bg="white" border="y" width="wide">
          <SectionHeader kicker="LA CARRERA" title="Elegí cómo seguir" sub="100% online, con el título del Conservatorio Grassi." />
          <CarrerasGrid items={cards} />
        </Section>

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
