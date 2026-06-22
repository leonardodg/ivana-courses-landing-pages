// src/app/components/candles/CandlesApp.tsx
//
// Página de vendas dedicada de Velas — PT-BR.
// Rota final: /pt_br/candles (https://courses.ivana.academy/pt_br/candles)
//
// Reaproveita os componentes reais e os dados reais de cursos de velas
// do projeto (Navbar, CourseGrid, AboutSection, WhyUsSection,
// ReviewsCarousel, FAQSection, Footer), filtrando sempre categoryId
// 'velas'. Sem toggle de idioma — a página é fixa em PT, seguindo o
// padrão de URL /pt_br/... (a futura versão argentina ficará em
// /es_ar/candles, reaproveitando os mesmos componentes com language='es').
//
// Camada extra trazida do protótipo de vendas (mantida por decisão do
// time): CandlesLeadForm (captura de lead com cupom de boas-vindas),
// CandlesCheckoutModal (reserva de vaga para cursos presenciais) e
// CandlesStudentPortal (vitrine da área do aluno). O detalhe/programa de
// cada curso já é coberto pelo modal embutido no CourseGrid real.

import { useState, useEffect } from 'react';
import { Course } from '../../classes/types';
import { categories_data } from '../../data/categories';
import { courses_list } from '../../data/courses';
import { reviews_list } from '../../data/reviews';
import { faqs_list } from '../../data/faqs';
import { heroContent as hero_content } from '../../data/home';
import { home_text } from '../../lang/homepage';

import AboutSection from '../AboutSection';
import WhyUsSection from '../WhyUsSection';
import ReviewsCarousel from '../ReviewsCarousel';
import FAQSection from '../FAQSection';

import CandlesNavbar from './CandlesNavbar';
import CandlesWorkshopsSection from './CandlesWorkshopsSection';
import CandlesOnlineSection from './CandlesOnlineSection';
import CandlesLeadForm from './CandlesLeadForm';
import CandlesCheckoutModal from './CandlesCheckoutModal';
import CandlesStudentPortal from './CandlesStudentPortal';

const LANGUAGE = 'pt' as const;
const CATEGORY_ID = 'velas' as const;

export default function CandlesApp() {
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');
  const [portalOpen, setPortalOpen] = useState(false);

  const courses: Course[] = courses_list.filter((c) => c.categoryId === CATEGORY_ID) as Course[];
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

      <main className="grow">

        {/* Hero */}
        <section className={`relative min-h-[90vh] md:min-h-[85vh] flex items-end pt-24 pb-12 overflow-hidden transition-all duration-700 bg-gradient-to-b ${activeCategory.heroBgClass}`}>
          <div className="absolute inset-0 z-0">
            <img
              alt={heroContent.title[LANGUAGE]}
              className="w-full h-full object-cover opacity-85 select-none"
              src={heroContent.imageUrl}
            />
            <div className="absolute inset-0 hero-gradient bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/20" />
          </div>

          <div className="relative z-10 px-6 max-w-[1280px] mx-auto w-full">
            <div className="md:w-3/4 lg:w-1/2 space-y-4 md:space-y-6">

              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <span className="text-sm">{activeCategory.badgeLogo}</span>
                <span className="text-micro uppercase font-mono tracking-widest text-primary">{courses_text.tagBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">
                {heroContent.title[LANGUAGE]}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-sans font-medium">
                {heroContent.desc[LANGUAGE]}
              </p>

              <div className="pt-2 pb-4 flex flex-wrap gap-4 items-center">
                <a
                  href="#cursos"
                  className="bg-primary hover:bg-opacity-95 text-white font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer"
                >
                  {courses_text.btnHero}
                </a>
                <button
                  onClick={() => setPortalOpen(true)}
                  className="text-xs font-mono uppercase tracking-widest text-gray-800 hover:text-primary underline underline-offset-4 cursor-pointer"
                >
                  Já sou aluna — acessar portal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust stats bar */}
        <section className="bg-white border-y border-subtle py-8">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">2.000+</span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {courses_text.statsAlunas}
              </span>
            </div>
            <div className="space-y-1 border-y md:border-y-0 md:border-x border-subtle py-4 md:py-0">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">6+ Anos</span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {courses_text.statsExp}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">BR &amp; AR</span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {courses_text.statsPort}
              </span>
            </div>
          </div>
        </section>

        {/* Workshops presenciais — cards visuais com imagem grande */}
        <CandlesWorkshopsSection
          courses={courses}
          onEnroll={handleSelectEnroll}
        />

        <AboutSection language={LANGUAGE} />

        <WhyUsSection language={LANGUAGE} />

        {/* Cursos online — cards horizontais com link Moodle */}
        <CandlesOnlineSection
          courses={courses}
          onEnroll={handleSelectEnroll}
        />

        <ReviewsCarousel language={LANGUAGE} reviews={reviews_list} />

        {/* Captura de lead com cupom de boas-vindas (diferencial de conversão) */}
        <CandlesLeadForm onCouponAwarded={handleCouponAwarded} />

        <FAQSection language={LANGUAGE} faqs={faqs_list} />

      </main>

      {/* Footer */}
      <footer className="bg-surface-hero border-t border-subtle py-12 md:py-16 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          <div className="md:col-span-6 space-y-4">
            <img
              alt="Ivana Academy"
              className="h-10 w-auto object-contain"
              src="/images/logo-square.svg"
            />
            <p className="max-w-md leading-relaxed">
              {courses_text.footerAbout}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">{courses_text.footerLinks}</span>
            <ul className="space-y-2">
              <li><a href="#cursos" className="hover:text-primary transition-colors">{courses_text.coursesLabel}</a></li>
              <li><a href="#sobre" className="hover:text-primary transition-colors">{courses_text.aboutLabel}</a></li>
              <li><a href="#contato" className="hover:text-primary transition-colors">{courses_text.contactLabel}</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">{courses_text.footerContact}</span>
            <p className="leading-relaxed">
              Florianópolis, SC, Brasil <br />
              Buenos Aires, Argentina <br />
              <span className="font-bold text-primary mt-1 block">
                Plataforma: <a href="https://ivana.academy" target="_blank" rel="noreferrer">ivana.academy</a>
              </span>
            </p>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-6 border-t border-muted mt-12 pt-6 text-center text-gray-500 text-[11px]">
          <span>{courses_text.footerRights}</span>
        </div>
      </footer>

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
