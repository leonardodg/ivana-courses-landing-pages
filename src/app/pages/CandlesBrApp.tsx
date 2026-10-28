import { useState, useEffect } from 'react';
import { Course, Language } from '../classes/types';

import { categories_data } from '../data/categories';
import { courses_list_br } from '../data/courses';
import { reviews_list_br } from '../data/reviews';
import { faqs_list_br } from '../data/faqs';
import { heroContent as hero_content } from '../data/home';
import { home_text } from '../lang/homepage';

import AboutSection from '../components/AboutSection';
import WhyUsSection from '../components/WhyUsSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';

import CandlesNavbar from '../components/CandlesNavbar';
import { TurmasSection, CursosSection, ComoFuncionaSection, InclusoSection, LocaisSection } from '../components/theme/ThemeSections';
import { presencial_themes } from '../data/presencial';
import CandlesOnlineSection from '../components/CandlesOnlineSection';
import CandlesLeadForm from '../components/CandlesLeadForm';
import CandlesCheckoutModal from '../components/CandlesCheckoutModal';
import CandlesStudentPortal from '../components/CandlesStudentPortal';

import Footer from "../components/Footer";
import { BrazilFlag, Hero, HeroBadgeText } from '../ui';

import { Menu, SquarePen } from "lucide-react";

const LANGUAGE = 'pt' as const;
const CATEGORY_ID = 'velas' as const;

export default function CandlesBrApp() {
  const [language, setLanguage] = useState<Language>("pt");
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');
  const [portalOpen, setPortalOpen] = useState(false);

  const courses: Course[] = courses_list_br.filter((c) => c.categoryId === CATEGORY_ID) as Course[];
  const heroContent = hero_content[CATEGORY_ID];
  const activeCategory = categories_data[CATEGORY_ID];
  const courses_text = home_text[LANGUAGE];

  const handleSelectEnroll = (course: Course) => {
    // Cursos com link externo (Moodle) abrem direto na plataforma oficial;
    // cursos presenciais sem link abrem o checkout de reserva de vaga.
    if (course.url) {
      window.open(course.url, '_blank', 'noreferrer');
      return;
    }
    setCheckoutCourse(course);
  };

  const handleCouponAwarded = (coupon: string) => {
    setCheckoutCoupon(coupon);
  };


  useEffect(() => {
    const handler = () => setPortalOpen(true);
    window.addEventListener('candles:openPortal', handler);
    return () => window.removeEventListener('candles:openPortal', handler);
  }, []);

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans selection:bg-velas-accent flex flex-col justify-between">
      {/* Navbar fixa — sem seletor de idioma, sem troca de categoria
          (a página é dedicada exclusivamente a velas PT-BR) */}
      <CandlesNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* Hero */}
        <Hero
          badge={
            <>
              <BrazilFlag />
              <HeroBadgeText>Cursos Velas Artesanais do Brasil</HeroBadgeText>
            </>
          }
          title={heroContent.title[LANGUAGE]}
          text={heroContent.desc[LANGUAGE]}
          primary={{ label: courses_text.btnCourses, href: '#cursos', icon: Menu }}
          secondary={{ label: courses_text.btnContact, href: '#contato', icon: SquarePen }}
          photo={{ src: '/images/ivana-com-velas.jpg', alt: 'Ivana Lerea segurando velas artesanais feitas na aula', position: 'top' }}
          backdrop={{ src: heroContent.imageUrl, alt: heroContent.title[LANGUAGE], gradientClass: activeCategory.heroBgClass }}
        />

        {/* Trust stats bar */}
        <section className="bg-white border-y border-subtle py-8">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">
                2.000+
              </span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-600 block">
                {courses_text.statsAlunas}
              </span>
            </div>
            <div className="space-y-1 border-y md:border-y-0 md:border-x border-subtle py-4 md:py-0">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">
                6+ Anos
              </span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-600 block">
                {courses_text.statsExp}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">
                BR &amp; AR
              </span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-600 block">
                {courses_text.statsPort}
              </span>
            </div>
          </div>
        </section>

        {/* Presenciais: turmas da agenda e cursos, com compra na loja */}
        <TurmasSection theme={presencial_themes.velas} />
        <CursosSection theme={presencial_themes.velas} />

        {/* Cursos online — cards horizontais com link Moodle */}
        <CandlesOnlineSection courses={courses} onEnroll={handleSelectEnroll} />

        <ComoFuncionaSection />
        <InclusoSection />
        <LocaisSection />

        <AboutSection language={LANGUAGE} />

        <WhyUsSection language={LANGUAGE} />

        <ReviewsCarousel language={LANGUAGE} reviews={reviews_list_br} />

        {/* Captura de lead com cupom de boas-vindas (diferencial de conversão) */}
        <CandlesLeadForm onCouponAwarded={handleCouponAwarded} />

        <FAQSection language={LANGUAGE} faqs={faqs_list_br} />
      </main>

      {/* Footer */}
      <Footer language={LANGUAGE} setLanguage={setLanguage} />

      {/* Modais */}
      {checkoutCourse && (
        <CandlesCheckoutModal
          course={checkoutCourse}
          initialCoupon={checkoutCoupon}
          onClose={() => setCheckoutCourse(null)}
        />
      )}

      {portalOpen && (
        <CandlesStudentPortal onClose={() => setPortalOpen(false)} />
      )}
    </div>
  );
}
