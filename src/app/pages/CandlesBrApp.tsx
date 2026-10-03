import { useState, useEffect } from 'react';
import { Course, Language } from '../classes/types';

import { categories_data } from '../data/categories';
import { courses_list } from '../data/courses';
import { reviews_list } from '../data/reviews';
import { faqs_list } from '../data/faqs';
import { heroContent as hero_content } from '../data/home';
import { home_text } from '../lang/homepage';

import AboutSection from '../components/AboutSection';
import WhyUsSection from '../components/WhyUsSection';
import ReviewsCarousel from '../components/ReviewsCarousel';
import FAQSection from '../components/FAQSection';

import CandlesNavbar from '../components/CandlesNavbar';
import CandlesWorkshopsSection from '../components/CandlesWorkshopsSection';
import CandlesOnlineSection from '../components/CandlesOnlineSection';
import CandlesLeadForm from '../components/CandlesLeadForm';
import CandlesCheckoutModal from '../components/CandlesCheckoutModal';
import CandlesStudentPortal from '../components/CandlesStudentPortal';

import Footer from "../components/Footer";

import { Menu, SquarePen } from "lucide-react";

const LANGUAGE = 'pt' as const;
const CATEGORY_ID = 'velas' as const;

export default function CandlesBrApp() {
  const [language, setLanguage] = useState<Language>("pt");
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

  const BrazilFlag = () => (
    <svg
      viewBox="0 0 720 500"
      className="w-4.5 h-3 opacity-95 rounded-[1px] transition-all duration-300 grayscale-0 scale-105"
    >
      <rect width="720" height="500" fill="#009c3b" />
      <polygon points="360,60 60,250 360,440 660,250" fill="#ffdf00" />
      <circle cx="360" cy="250" r="120" fill="#002776" />
    </svg>
  );

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
        <section
          className={`relative min-h-[90vh] md:min-h-[85vh] flex items-end overflow-hidden transition-all duration-700 bg-gradient-to-b ${activeCategory.heroBgClass}`}
        >
          <div className="absolute inset-0 z-0">
            <img
              alt={heroContent.title[LANGUAGE]}
              className="w-full h-full object-cover opacity-85 select-none"
              src={heroContent.imageUrl}
            />
            <div className="absolute inset-0 hero-gradient bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/20" />
          </div>

          {/* Content Grid - Left: Info, Right: Video */}
          <div className="relative z-10 px-6 md:px-12 pt-24 md:pt-28 pb-12 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <span className="text-sm">
                  <BrazilFlag />
                </span>
                <span className="text-micro uppercase font-mono tracking-widest text-primary">
                  Cursos Velas Artesanais do Brasil
                </span>
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
                  className="bg-primary hover:bg-opacity-95 text-white font-semibold font-mono text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer hover:bg-primary-container hover:text-on-primary-container"
                >
                  <Menu className="w-3.5 h-3.5" /> {courses_text.btnCourses}
                </a>

                <a
                  href="#contato"
                  className="sm:flex items-center gap-2 inline-flex  text-on-surface-variant hover:text-primary border border-subtle bg-white/80 hover:bg-white  text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full transition-all"
                >
                  <SquarePen className="w-3.5 h-3.5" />{" "}
                  {courses_text.btnContact}
                </a>
              </div>
            </div>

            {/* Right: Video Frame */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
              <video
                className="relative z-10 w-full h-[320px] md:h-[500px] rounded-xl shadow-xl border border-slate-200 object-cover"
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                poster="https://lh3.googleusercontent.com/aida-public/AB6AXuCwRD1B5ICYfFTb-4GsJSQhSzgEHoRHca3niIXJTcDNnnjKKsowegd-iDlWgAebU1lMUu9vUxl7ZXFknkc0XV89lFKDj2TLKNTAi6-e7GwJXciCdGxlwsx2okDFr-Uknnn6lrubv6PbxZoP3UVzbKgakR5H2csp8rInrQx6exlOITewIQU3Uu0yHI1IA8ODNxHHQZyLXrw6_bDMdXtuLoV8OfNLxh52d56n--4Dn_SaVnM3Hsk8bwvbdnkz3fPo4n0iP_hW1V6iu2Kf"
              >
                <source src="/videos/home.webm" type="video/webm" />
                <source src="/videos/home.mp4" type="video/mp4" />
                Seu navegador não suporta este formato de vídeo.
              </video>
            </div>
          </div>
        </section>

        {/* Trust stats bar */}
        <section className="bg-white border-y border-subtle py-8">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">
                2.000+
              </span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {courses_text.statsAlunas}
              </span>
            </div>
            <div className="space-y-1 border-y md:border-y-0 md:border-x border-subtle py-4 md:py-0">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">
                6+ Anos
              </span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {courses_text.statsExp}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">
                BR &amp; AR
              </span>
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

        {/* Cursos online — cards horizontais com link Moodle */}
        <CandlesOnlineSection courses={courses} onEnroll={handleSelectEnroll} />

        <AboutSection language={LANGUAGE} />

        <WhyUsSection language={LANGUAGE} />

        <ReviewsCarousel language={LANGUAGE} reviews={reviews_list} />

        {/* Captura de lead com cupom de boas-vindas (diferencial de conversão) */}
        <CandlesLeadForm onCouponAwarded={handleCouponAwarded} />

        <FAQSection language={LANGUAGE} faqs={faqs_list} />
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
