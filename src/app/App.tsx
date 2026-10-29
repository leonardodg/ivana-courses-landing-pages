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
import { courses_list_br } from "./data/courses";
import { reviews_list_br } from "./data/reviews";
import { faqs_list_br } from "./data/faqs";
import { home_text as text } from "./lang/homepage";
import { heroContent as hero_content } from "./data/home";
import SiteNavbar from "./components/SiteNavbar";
import AboutSection from "./components/AboutSection";
import CourseGrid from "./components/CourseGrid";
import WhyUsSection from "./components/WhyUsSection";
import ReviewsCarousel from "./components/ReviewsCarousel";
import FAQSection from "./components/FAQSection";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import { Hero, HeroBadgeText, WhatsAppFab, whatsappHref, type HeroSlide } from "./ui";
import { company } from "./legal/company";
import { hero_stats_br } from "./data/hero_stats";
import { home_category_themes } from "./data/presencial";
import { trackOutbound } from "./lib/analytics";

import { Menu, SquarePen } from "lucide-react";

export default function App() {
  // A home do Brasil é em português; o ES do menu leva à home da Argentina (/es-ar/).
  const language: Language = "pt";
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId | null>(null); // null = todos os cards, sem filtro (primeiro acesso)

  const CATEGORIES: Record<string, CategorySpec> = categories_data;
  const REVIEWS: Review[] = reviews_list_br;
  const FAQS: FAQItem[] = faqs_list_br;
  const COURSES: Course[] = courses_list_br;

  // Herói: slide mostrado (começa em velas). Escolher um segmento no menu leva o herói para ele.
  const [heroId, setHeroId] = useState<CategoryId>("velas");
  const selectCategory = (id: CategoryId | null) => {
    setActiveCategoryId(id);
    if (id) setHeroId(id);
  };

  const handleEnrollClick = (course: Course) => {
    const title = course.title[language];
    const message =
      language === "pt"
        ? `Olá! Quero garantir minha vaga no curso "${title}".`
        : `¡Hola! Quiero asegurar mi lugar en el curso "${title}".`;
    trackOutbound(`https://wa.me/5548991671659`);
    window.open(
      `https://wa.me/5548991671659?text=${encodeURIComponent(message)}`,
      "_blank",
      "noreferrer",
    );
  };

  const courses_text = text[language];

  const heroSlides: HeroSlide[] = (Object.keys(CATEGORIES) as CategoryId[]).map((id) => {
    const cat = CATEGORIES[id];
    const content = hero_content[id];
    const page = home_category_themes[id]?.page;
    return {
      id,
      badge: (
        <>
          <span className="text-sm">{cat.badgeLogo}</span>
          <HeroBadgeText>{courses_text.tagBadge}</HeroBadgeText>
        </>
      ),
      title: content.title[language],
      text: content.desc[language],
      primary: page
        ? { label: `Ver cursos de ${cat.name[language]}`, href: page, icon: Menu }
        : { label: courses_text.btnCourses, href: "#cursos", icon: Menu },
      secondary: { label: courses_text.btnContact, href: "#contato", icon: SquarePen },
      backdrop: { src: content.imageUrl, alt: content.title[language], gradientClass: cat.heroBgClass },
      photo:
        id === "velas"
          ? { src: "/images/ivana-com-velas.jpg", alt: "Ivana Lerea segurando velas artesanais feitas na aula", position: "top" }
          : undefined,
    };
  });

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans selection:bg-velas-accent flex flex-col justify-between">
      {/* Sticky Navigation Bar */}
      <SiteNavbar onSelectCategory={selectCategory} />

      {/* Main Sections */}
      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* Herói em carrossel: um slide por categoria, cada um leva à página do curso; faixa de números logo abaixo */}
        <Hero
          slides={heroSlides}
          slideId={heroId}
          onSlideChange={(id) => setHeroId(id as CategoryId)}
          stats={hero_stats_br}
        />

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

        {/* Detailed FAQ */}
        <FAQSection language={language} faqs={FAQS} />

        {/* Contato: última seção antes do rodapé */}
        <ContactForm language={language} coursePage="homepage" />
      </main>

      <WhatsAppFab href={whatsappHref(company.whatsappUrl, 'Oi! Vim pelo site da Ivana Academy e quero saber mais sobre os cursos.')} label="Falar no WhatsApp" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
