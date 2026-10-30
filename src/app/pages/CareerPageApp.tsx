// Página de carrera online da Argentina (candles, resin, macrame, textil, interiores, mixmedia).
// Segue docs/GUIA-DE-ESTILO.md: navbar de tema, herói dividido com 2 botões em pílula, cards em 2 colunas,
// passos em 4 colunas. Sem preço: o botão leva à tienda (ou ao WhatsApp AR).

import { CalendarDays, MessageCircle } from 'lucide-react';
import { tr, usePageLanguage } from '../lib/lang';
import { ar_hero, ar_pages, ArPageSlug, carreras_ar, WHATSAPP_AR } from '../data/carreras_ar';
import { reviews_list } from '../data/reviews';
import { useAgenda } from '../hooks/useAgenda';
import SiteNavbar from '../components/SiteNavbar';
import AboutSection from '../components/AboutSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { hero_stats_ar, hero_stats_ar_pt } from '../data/hero_stats';
import { GRASSI_SEAL } from '../data/hero_seals';
import { ArgentinaFlag, Hero, HeroBadgeText, Section, SectionHeader, WhatsAppFab, whatsappHref } from '../ui';
import {
  CarrerasGrid,
  CohorteSection,
  ComoInscribirmeSection,
  InclusoSection,
  QueAprenderSection,
  SalidaLaboralSection,
  WhatsAppFooterCta,
  faqs_carreras_ar,
  nivelLabel,
} from '../components/theme/CareerSections';

// Páginas que têm par no Brasil (seletor PT | ES e hreflang).


export default function CareerPageApp({ slug }: { slug: ArPageSlug }) {
  const language = usePageLanguage();
  const agenda = useAgenda('AR');
  const page = ar_pages[slug];
  const carrera = carreras_ar[page.courses[0]];
  // Profesorados com nome oficial ainda sem confirmação não são publicados (nombreConfirmado: false).
  const cards = page.courses.map((c) => carreras_ar[c]).filter((c) => c.nombreConfirmado);

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* 1. Abertura */}
        <Hero
          badge={
            <>
              <ArgentinaFlag />
              <HeroBadgeText>{tr(language, '100% online · Conservatorio Grassi', '100% online · Conservatório Grassi')}</HeroBadgeText>
            </>
          }
          title={carrera.nombre}
          text={tr(
            language,
            `${nivelLabel(carrera)} de ${carrera.meses} meses, con un módulo por mes. Estudiás desde tu casa, con acompañamiento de la profesora Ivana Lerea.`,
            `${nivelLabel(carrera)} de ${carrera.meses} meses, com um módulo por mês. Você estuda de casa, com o acompanhamento da professora Ivana Lerea.`,
          )}
          primary={{ label: tr(language, 'Ver cohorte 2027', 'Ver turma 2027'), href: '#cohorte', icon: CalendarDays }}
          secondary={{ label: tr(language, 'Hablar por WhatsApp', 'Falar pelo WhatsApp'), href: WHATSAPP_AR, icon: MessageCircle, external: true }}
          photo={{ src: carrera.image, alt: carrera.nombre, position: carrera.imagePos }}
          backdrop={{ src: ar_hero[carrera.page], alt: carrera.nombre, position: '78% center' }}
          seal={GRASSI_SEAL}
          stats={tr(language, hero_stats_ar, hero_stats_ar_pt)}
        />

        <CohorteSection carrera={carrera} agenda={agenda} />

        <Section id="carreras" bg="cream" border="y" width="wide">
          <SectionHeader
            kicker={tr(language, 'LA CARRERA', 'A CARREIRA')}
            title={tr(language, 'Elegí cómo seguir', 'Escolha como seguir')}
            sub={tr(language, '100% online, con el título del Conservatorio Grassi.', '100% online, com o título do Conservatório Grassi.')}
          />
          <CarrerasGrid items={cards} agenda={agenda} />
        </Section>

        <QueAprenderSection carrera={carrera} />
        <ComoInscribirmeSection bg="cream" />
        <InclusoSection bg="white" />
        <SalidaLaboralSection />
        <AboutSection language={language} />
        <ReviewsCarousel language={language} reviews={reviews_list} />
        <FAQSection language={language} faqs={faqs_carreras_ar} />
        <ContactForm language={language} coursePage="carreras_ar" />
        <WhatsAppFooterCta />
      </main>

      <WhatsAppFab href={whatsappHref(WHATSAPP_AR, tr(language, `¡Hola! Quiero saber más sobre ${carrera.nombre}.`, `Olá! Quero saber mais sobre ${carrera.nombre}.`))} label={tr(language, 'Hablar por WhatsApp', 'Falar pelo WhatsApp')} />

      <Footer />
    </div>
  );
}
