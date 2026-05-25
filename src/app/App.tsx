import { useState } from 'react';
import { Course, CategorySpec, Review, Language, CategoryId, FAQItem } from './classes/types';
import { categories_data } from './data/categories';
import { courses_list } from './data/courses';
import { reviews_list } from './data/reviews';
import { faqs_list } from './data/faqs';
import { home_text as text } from './lang/homepage';
import { heroContent as hero_content } from './data/home';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import CourseGrid from './components/CourseGrid';
import WhyUsSection from './components/WhyUsSection';
import ReviewsCarousel from './components/ReviewsCarousel';
import FAQSection from './components/FAQSection';
import LeadForm from './components/LeadForm';

export default function App() {
  const [language, setLanguage] = useState<Language>('pt');
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('velas');
  const [selectedCourseForForm, setSelectedCourseForForm] = useState<Course | null>(null);

  const CATEGORIES: Record<string, CategorySpec> = categories_data;
  const REVIEWS: Review[] = reviews_list;
  const FAQS: FAQItem[] = faqs_list;
  const COURSES: Course[] = courses_list;

  const activeCategory = CATEGORIES[activeCategoryId];

  // Specific hero definitions to make switching incredible
  const heroContent = hero_content[activeCategoryId];

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForForm(course);
    // Smooth scroll is also handled inside the useEffect in LeadForm
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
        <section className={`relative min-h-[90vh] md:min-h-[85vh] flex items-end pt-24 pb-12 overflow-hidden transition-all duration-700 bg-gradient-to-b ${activeCategory.heroBgClass}`}>
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

          <div className="relative z-10 px-6 max-w-[1280px] mx-auto w-full">
            <div className="md:w-3/4 lg:w-1/2 space-y-4 md:space-y-6">
              
              {/* Floating micro banner */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <span className="text-sm">{activeCategory.badgeLogo}</span>
                <span className="text-micro uppercase font-mono tracking-widest text-primary">{courses_text.tagBadge}</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">
                {heroContent.title[language]}
              </h1>

              {/* Body summary */}
              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-sans font-medium">
                {heroContent.desc[language]}
              </p>

              {/* Call to action trigger */}
              <div className="pt-2 pb-4 flex flex-wrap gap-4 items-center">
                <a
                  href="#cursos"
                  className="bg-primary hover:bg-opacity-95 text-white font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer"
                >
                  {courses_text.btnHero}
                </a>
              </div>
            </div>

            <div className="md:absolute md:bottom-12 md:right-8 md:left-auto md:w-auto md:transform md:translate-x-0 left-auto w-[90%] mx-auto opacity-90 mb-6 md:mb-0">
              {/* imagem: direita em desktop, centralizada no mobile */}
              <div className="relative group md:w-[560px] w-full">
                <div className="absolute -inset-4 bg-primary-container/10 rounded-2xl -rotate-2 -z-10" />
                  {/* <img
                    alt="Vela artesanal Ivana Academy"
                    className="w-full h-[320px] md:h-[500px] object-cover rounded-xl shadow-xl transform group-hover:scale-[1.01] transition-transform duration-500"
                    data-alt="A macro photograph of a luxury handmade candle in a frosted glass container with a wooden wick subtly smoking. The candle is surrounded by sprigs of dried lavender, eucalyptus leaves, and dried orange slices on a textured linen cloth. The lighting is soft, warm, and natural, creating a serene and artisanal atmosphere that matches the beige and dusty rose color palette of Ivana Academy."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwRD1B5ICYfFTb-4GsJSQhSzgEHoRHca3niIXJTcDNnnjKKsowegd-iDlWgAebU1lMUu9vUxl7ZXFknkc0XV89lFKDj2TLKNTAi6-e7GwJXciCdGxlwsx2okDFr-Uknnn6lrubv6PbxZoP3UVzbKgakR5H2csp8rInrQx6exlOITewIQU3Uu0yHI1IA8ODNxHHQZyLXrw6_bDMdXtuLoV8OfNLxh52d56n--4Dn_SaVnM3Hsk8bwvbdnkz3fPo4n0iP_hW1V6iu2Kf"
                  /> */}


                  <video 
                    className="w-full h-[320px] md:h-[500px] rounded-xl shadow-lg border border-slate-200"
                    controls 
                    poster="https://lh3.googleusercontent.com/aida-public/AB6AXuCwRD1B5ICYfFTb-4GsJSQhSzgEHoRHca3niIXJTcDNnnjKKsowegd-iDlWgAebU1lMUu9vUxl7ZXFknkc0XV89lFKDj2TLKNTAi6-e7GwJXciCdGxlwsx2okDFr-Uknnn6lrubv6PbxZoP3UVzbKgakR5H2csp8rInrQx6exlOITewIQU3Uu0yHI1IA8ODNxHHQZyLXrw6_bDMdXtuLoV8OfNLxh52d56n--4Dn_SaVnM3Hsk8bwvbdnkz3fPo4n0iP_hW1V6iu2Kf"
                  >
                    <source src="videos/home.mov"/>
                  </video>
                  
                {/* <div className="absolute bottom-6 left-2 bg-surface p-6 rounded-xl shadow-lg border border-outline-variant hidden md:block max-w-xs">
                  <p className="font-headline text-lg text-white italic">"La técnica es el puente entre la idea y la maestría."</p>
                </div> */}
              </div>
            </div>
          </div>

        </section>

        {/* Dynamic Trust Stats Bar */}
        <section className="bg-white border-y border-subtle py-8">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
            
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">2.000+</span>
              <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {courses_text.statsAlunas}
              </span>
            </div>

            <div className="space-y-1 border-y md:border-y-0 md:border-x border-subtle py-4 md:py-0">
              <span className="text-3xl md:text-4xl font-serif text-primary font-black block">6+ {language === 'pt' ? 'Anos' : 'Años'}</span>
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
        <LeadForm
          language={language}
          selectedCourseForForm={selectedCourseForForm}
          courses={COURSES}
          activeCategoryId={activeCategoryId}
        />

        {/* Detailed FAQ */}
        <FAQSection language={language} faqs={FAQS} />

      </main>

      {/* Footer */}
      <footer className="bg-surface-hero border-t border-subtle py-12 md:py-16 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Card 1: Description */}
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

          {/* Card 2: Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">{courses_text.footerLinks}</span>
            <ul className="space-y-2">
              <li>
                <a href="#cursos" className="hover:text-primary transition-colors">{courses_text.coursesLabel}</a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-primary transition-colors">{courses_text.aboutLabel}</a>
              </li>
              <li>
                <a href="#contato" className="hover:text-primary transition-colors">{courses_text.contactLabel}</a>
              </li>
            </ul>
          </div>

          {/* Card 3: Contact */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">{courses_text.footerContact}</span>
            <p className="leading-relaxed">
              Florianópolis, SC, Brasil <br />
              Buenos Aires, Argentina <br />
              <span className="font-bold text-primary mt-1 block">Platforma: <a href="https://ivana.academy" target="_blank">ivana.academy</a></span>
            </p>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-6 border-t border-muted mt-12 pt-6 text-center text-gray-500 text-[11px]">
          <span>{courses_text.footerRights}</span>
        </div>
      </footer>

    </div>
  );
}
