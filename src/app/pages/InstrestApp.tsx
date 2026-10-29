import { useEffect, useState } from "react";
import { usePageLanguage } from "../lib/lang";
import {
  Course,
  CategorySpec,
  Review,
  Language,
  CategoryId,
  FAQItem,
} from "../classes/types";
import { categories_data } from "../data/categories";
import { reviews_list_br } from "../data/reviews";
import { faqs_list_br } from "../data/faqs";
import { courses_list_br } from "../data/courses";
import { home_text as text } from "../lang/homepage";
import { heroContent as hero_content } from "../data/home";
import SiteNavbar from "../components/SiteNavbar";
import AboutSection from "../components/AboutSection";
import WhyUsSection from "../components/WhyUsSection";
import ReviewsCarousel from "../components/ReviewsCarousel";
import Footer from "../components/Footer";
import { Section, SectionHeader } from "../ui";
import LeadForm from "../components/LeadForm";

import { Menu, SquarePen } from "lucide-react";

export default function InstrestApp() {
  const [checkoutCoupon, setCheckoutCoupon] = useState("");
  // Sem página equivalente em espanhol: o PT | ES do menu só troca o idioma desta página.
  const language: Language = usePageLanguage();
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("velas");
  const [selectedCourseForForm, setSelectedCourseForForm] =
    useState<Course | null>(null);

  const CATEGORIES: Record<string, CategorySpec> = categories_data;
  const REVIEWS: Review[] = reviews_list_br;
  const FAQS: FAQItem[] = faqs_list_br;
  const COURSES: Course[] = courses_list_br;

  const activeCategory = CATEGORIES[activeCategoryId];

  // Specific hero definitions to make switching incredible
  const heroContent = hero_content[activeCategoryId];

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForForm(course);
    // Smooth scroll is also handled inside the useEffect in LeadForm
  };

  const courses_text = text[language];

  const handleCouponAwarded = (coupon: string) => {
    setCheckoutCoupon(coupon);
  };

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans selection:bg-velas-accent flex flex-col justify-between">
      {/* Sticky Navigation Bar */}
      <SiteNavbar />

      {/* Main Sections */}
      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        {/* Página de formulário: sem herói */}
        <Section bg="cream" width="narrow" className="pt-28 md:pt-32 pb-0">
          <SectionHeader
            kicker="INTERESSE"
            title="Quer ser avisada das próximas turmas?"
            sub="Deixe seus dados e a Ivana entra em contato com datas, turmas e novidades dos cursos."
          />
        </Section>

        {/* Flexible lead capture form */}
        <LeadForm
          language={language}
          courses={COURSES}
          selectedCourseForForm={selectedCourseForForm}
          formSource="interest"
        />

        {/* Narrative / About Mentora */}
        <AboutSection language={language} />

        {/* Dynamic reviews matching testimonials requirement */}
        <ReviewsCarousel language={language} reviews={REVIEWS} />

        {/* Why Us section illustrating business support */}
        <WhyUsSection language={language} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
