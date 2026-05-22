import { useState } from 'react';
import { Course, Language, CategoryId } from './types';
import { CATEGORIES, COURSES, REVIEWS, FAQS } from './data';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import CourseGrid from './components/CourseGrid';
import WhyUsSection from './components/WhyUsSection';
import ReviewsCarousel from './components/ReviewsCarousel';
import FAQSection from './components/FAQSection';
import LeadForm from './components/LeadForm';
import TechDashboard from './components/TechDashboard';
import { Flame, Sparkles, Sliders, ChevronDown, Award, Globe, Heart } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('pt');
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('velas');
  const [selectedCourseForForm, setSelectedCourseForForm] = useState<Course | null>(null);

  const activeCategory = CATEGORIES[activeCategoryId];

  // Specific hero definitions to make switching incredible
  const heroContent = {
    velas: {
      title: {
        pt: 'Transforme sua Paixão por Velas em um Negócio Lucrativo',
        es: 'Transforma tu Pasión por las Velas en un Negocio Lucrativo'
      },
      desc: {
        pt: 'Aprenda do zero com a especialista bilingue Ivana Lerea. Cursos presenciais e online (Moodle) com certificação oficial internacional e foco total em vendas e marca.',
        es: 'Descubre el arte de las velas de cera de autor de la mano de Ivana Lerea. Clases prácticas presenciales y módulos virtuales con certificación oficial y bases comerciales sólidas.'
      },
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXD6quv9NV3ROSL92x-Ihw0kK1uuXJkKjINniM1HCQVBSm5m5UpkiS4_kniACldLhNS3LFBoEEt4HSqsvetlxXeVe6qTO8mQeSQbnhbzHHByL1RPGvS__c7VI8ucysmvHuLQKEaAKLGyyAs2awYipwryj2A8gw0W72aQjMsFamGcyHtta27yg1SrwuOTITGXDNBhI2fVXQ1KlicKvJekV1ZOt5q4ftbsJQBW0M9Bz-vwDwE6smtwrR-lVUKkFIMabtAD-bOKkbgEJs'
    },
    saboaria: {
      title: {
        pt: 'A Arte da Saboaria Natural & Fitoterápica Saudável',
        es: 'Aprende Jabonería Natural con Métodos Seguros'
      },
      desc: {
        pt: 'Descubra a formulação inteligente de sabonetes com glicerinas vegetais puras, enriquecidos com argilas, extratos herbais e tinturas curativas para encantar suas clientes.',
        es: 'Elabora cosmética sólida limpia y terapéutica. Domina el vaciado tradicional glicerinado "Melt & Pour" y fórmulas equilibradas con aceites fito-botánicos locales.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1607006342445-470fc7db6e8a?auto=format&fit=crop&q=80&w=1200'
    },
    resinas: {
      title: {
        pt: 'Criações Lindas e Eternizadas com Resina Epóxi',
        es: 'Diseños de Lujo y Encapsulados de Resina Epoxi'
      },
      desc: {
        pt: 'Aprenda a verter resinas de alta proteção UV com segurança profissionalizante. Ideal para chaveiros exclusivos, canetas decorativas decoradas e bandejas rústicas de flores de cura.',
        es: 'Eterniza flores naturales y crea productos con acabados vidriados perfectos. Domina proporciones precisas, desgasificación térmica de burbujas y técnicas de encargo.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'
    },
    macrame: {
      title: {
        pt: 'Macramê Expressivo: Do Primeiro Ponto ao Design de Parede',
        es: 'Macramé de Autor: Da tus Primeros Nudos de Diseño Táctil'
      },
      desc: {
        pt: 'Tire do papel aquele lindo projeto de cabeceira, vaso ou painel de parede. Mentoria prática próxima da professora em turmas carinhosas e aconchegantes.',
        es: 'Teje tapices orgánicos, soportes de macramé y complementos textiles. Trae tu modelo favorito y yo te guiaré nudo a nudo hasta dar forma a tu pieza exclusiva.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1200'
    },
    aromas_incensos: {
      title: {
        pt: 'Defumação e Spray de Ambientes: Crie Notas Marcantes',
        es: 'Inciensos Botánicos Secos y Marketing Olfativo en Casa'
      },
      desc: {
        pt: 'Domine a pirâmide aromática e o processo de maceração de essências duradouras. Fabrique home spray, sachês aromáticos perfumados e incensos de alta pureza.',
        es: 'Crea sensaciones inolvidables para locales comerciales y hogares. Brinda fórmulas exactas de home spray persistentes, difusores rústicos de varitas e inciensos conos.'
      },
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    }
  }[activeCategoryId];

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForForm(course);
    // Smooth scroll is also handled inside the useEffect in LeadForm
  };

  const t = {
    pt: {
      statsAlunas: 'Alunas Certificadas',
      statsExp: 'Anos de Ensino',
      statsPort: 'Validação Internacional',
      tagBadge: 'Formação Reconhecida',
      btnHero: 'Explorar Catálogo de Turmas',
      footerAbout: 'Ivana Academy é focada na profissionalização feminina através do artesanato de alto padrão, capacitando milhares de mulheres a mudarem suas realidades financeiras.',
      footerLinks: 'Links do Portal',
      footerContact: 'Inscrições & WhatsApp',
      footerRights: '© 2026 Ivana Academy. Todos os direitos reservados. Projetado bilingue Brasil & Argentina.',
      coursesLabel: 'Cursos',
      aboutLabel: 'Sobre Mim',
      contactLabel: 'Contato',
    },
    es: {
      statsAlunas: 'Alumnas Certificadas',
      statsExp: 'Años de Docencia',
      statsPort: 'Validez Internacional',
      tagBadge: 'Formación Homologada',
      btnHero: 'Ver Clases Disponibles',
      footerAbout: 'Ivana Academy está enfocada en el empoderamiento e independencia financiera de las mujeres mediante manualidades de alta gama y diseño contemporáneo.',
      footerLinks: 'Enlaces Clave',
      footerContact: 'Inscripciones & Soporte',
      footerRights: '© 2026 Ivana Academy. Reservados todos los derechos. Mapeo internacional de clases en Argentina y Brasil.',
      coursesLabel: 'Cursos',
      aboutLabel: 'Sobre Mí',
      contactLabel: 'Contacto',
    }
  }[language];

  return (
    <div className="min-h-screen bg-[#fcf9f5] text-gray-900 font-sans selection:bg-[#ffdad9] flex flex-col justify-between">
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
            <div className="absolute inset-0 hero-gradient bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/70 to-[#FAF6F0]/20" />
          </div>

          <div className="relative z-10 px-6 max-w-[1280px] mx-auto w-full">
            <div className="md:w-3/4 lg:w-1/2 space-y-4 md:space-y-6">
              
              {/* Floating micro banner */}
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#e1deda] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <span className="text-sm">{activeCategory.badgeLogo}</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#805252]">{t.tagBadge}</span>
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
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#cursos"
                  className="bg-[#805252] hover:bg-opacity-95 text-white font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer"
                >
                  {t.btnHero}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Trust Stats Bar */}
        <section className="bg-white border-y border-[#e1deda] py-8">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
            
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-[#805252] font-black block">2.000+</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {t.statsAlunas}
              </span>
            </div>

            <div className="space-y-1 border-y md:border-y-0 md:border-x border-[#e1deda] py-4 md:py-0">
              <span className="text-3xl md:text-4xl font-serif text-[#805252] font-black block">6+ {language === 'pt' ? 'Anos' : 'Años'}</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {t.statsExp}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-serif text-[#805252] font-black block">BR &amp; AR</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-500 block">
                {t.statsPort}
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

        {/* PostgreSQL & Redis interactive Blueprint. Solves user query of structuring DB & routing caching system. */}
        <section className="py-16 bg-[#0f172a] text-[#f8fafc]">
          <div className="max-w-[1280px] mx-auto px-6">
            <TechDashboard language={language} activeCategoryId={activeCategoryId} />
          </div>
        </section>

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
      <footer className="bg-[#FAF6F0] border-t border-[#e1deda] py-12 md:py-16 text-xs text-[#514443]">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Card 1: Description */}
          <div className="md:col-span-6 space-y-4">
            <img
              alt="Ivana Academy"
              className="h-10 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEq7hSIxNmxkfIHSubsBA9DnhiKGTjQQtxNMhvbshwJhMuv1EZE3QMJML0icL9KynPAOtrkehG7GTZftH3q1VhQRN1shY6MlSG56jIeaPGo10RfWbGhr7-3eg9fUucE7nG-rw5SBMcgKMZIG2YEtF-Z-oCHIgixUP_g9n0ETXDIqA5oFqKZ21QuntZ4wjhtP65scaDq4DVn3eo0JYaYLgs2fSe9siJWDLJiTSd6e1HQ_7ybfV2nWWZZhlgMDvxuLBItTmNaOU0nqVe"
            />
            <p className="max-w-md leading-relaxed">
              {t.footerAbout}
            </p>
          </div>

          {/* Card 2: Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">{t.footerLinks}</span>
            <ul className="space-y-2">
              <li>
                <a href="#cursos" className="hover:text-[#805252] transition-colors">{t.coursesLabel}</a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-[#805252] transition-colors">{t.aboutLabel}</a>
              </li>
              <li>
                <a href="#contato" className="hover:text-[#805252] transition-colors">{t.contactLabel}</a>
              </li>
              <li>
                <a href="#tech-blueprint" className="hover:text-[#805252] transition-colors">Developer Blueprint</a>
              </li>
            </ul>
          </div>

          {/* Card 3: Contact */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">{t.footerContact}</span>
            <p className="leading-relaxed">
              Florianópolis, SC, Brasil <br />
              Buenos Aires, Argentina <br />
              <span className="font-bold text-[#805252] mt-1 block">Moodle Platform: ivana.academy</span>
            </p>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-6 border-t border-[#eae8e4] mt-12 pt-6 text-center text-gray-500 text-[11px]">
          <span>{t.footerRights}</span>
        </div>
      </footer>

    </div>
  );
}
