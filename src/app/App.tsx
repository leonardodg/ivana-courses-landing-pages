import { useState } from "react";
import {
  Course,
  CategorySpec,
  Review,
  Language,
  CategoryId,
  FAQItem,
} from "./classes/types";
import { categories_data } from "./data/categories";
import { courses_list } from "./data/courses";
import { reviews_list } from "./data/reviews";
import { faqs_list } from "./data/faqs";
import { home_text as text } from "./lang/homepage";
import { heroContent as hero_content } from "./data/home";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import CourseGrid from "./components/CourseGrid";
import WhyUsSection from "./components/WhyUsSection";
import ReviewsCarousel from "./components/ReviewsCarousel";
import FAQSection from "./components/FAQSection";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

import { Menu, SquarePen } from "lucide-react";

export default function App() {
  const [language, setLanguage] = useState<Language>("pt");
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("velas");

  const CATEGORIES: Record<string, CategorySpec> = categories_data;
  const REVIEWS: Review[] = reviews_list;
  const FAQS: FAQItem[] = faqs_list;
  const COURSES: Course[] = courses_list;

  const activeCategory = CATEGORIES[activeCategoryId];

  // Specific hero definitions to make switching incredible
  const heroContent = hero_content[activeCategoryId];

  const handleEnrollClick = (course: Course) => {
    const title = course.title[language];
    const message =
      language === "pt"
        ? `Olá! Quero garantir minha vaga no curso "${title}".`
        : `¡Hola! Quiero asegurar mi lugar en el curso "${title}".`;
    window.open(
      `https://wa.me/5548991671659?text=${encodeURIComponent(message)}`,
      "_blank",
      "noreferrer",
    );
  };

  const courses_text = text[language];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans selection:bg-velas-accent flex flex-col justify-between">
      {/* Sticky Navigation Bar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />

      {/* Main Sections */}
      <main className="grow">
        {/* Dynamic Category Hero Section incorporating the unique specifications of each segment */}
        <section
          className={`relative min-h-[90vh] md:min-h-[85vh] overflow-hidden transition-all duration-700 bg-gradient-to-b ${activeCategory.heroBgClass}`}
        >
          {/* Cover photo behind */}
          <div className="absolute inset-0 z-0">
            <img
              alt={heroContent.title[language]}
              className="w-full h-full object-cover opacity-85 select-none"
              src={heroContent.imageUrl}
            />
            {/* Soft gradient fading background picture to clear layout */}
            <div className="absolute inset-0 hero-gradient bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/20" />
          </div>

          {/* Content Grid - Left: Info, Right: Video */}
          <div className="relative z-10 px-6 md:px-12 pt-24 md:pt-28 pb-12 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-4 md:space-y-6">
              {/* Floating micro banner */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <span className="text-sm">{activeCategory.badgeLogo}</span>
                <span className="text-micro uppercase font-mono tracking-widest text-primary">
                  {courses_text.tagBadge}
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">
                {heroContent.title[language]}
              </h1>

              {/* Body summary */}
              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed font-sans font-medium">
                {heroContent.desc[language]}
              </p>

              {/* Call to action trigger */}
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

        {/* Dynamic recolorable Grid of courses */}
        <CourseGrid
          language={language}
          activeCategoryId={activeCategoryId}
          courses={COURSES}
          onSelectEnroll={handleEnrollClick}
        />

        {/* Narrative / About Mentora */}
        <AboutSection language={language} />

        {/* Why Us section illustrating business support */}
        <WhyUsSection language={language} />

        {/* Dynamic reviews matching testimonials requirement */}
        <ReviewsCarousel language={language} reviews={REVIEWS} />

        {/* Flexible lead capture form */}
        <ContactForm language={language} coursePage="homepage" />

        {/* Detailed FAQ */}
        <FAQSection language={language} faqs={FAQS} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
}
