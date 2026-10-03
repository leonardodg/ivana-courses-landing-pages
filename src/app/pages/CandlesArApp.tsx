import { useState } from 'react';
import { Course, Language } from "../classes/types";
import { courses_list } from '../data/courses';
import { faqs_list } from '../data/faqs';

import { Award, ArrowRight, CheckCircle, Globe, Clock, Medal, Users } from 'lucide-react';

import CandlesArNavbar         from '../components/CandlesArNavbar';
import CandlesArCoursesSection from '../components/CandlesArCoursesSection';
import CandlesArStudentPortal  from '../components/CandlesArStudentPortal';
import FAQSection              from '../components/FAQSection';
import CandlesLeadForm         from '../components/CandlesLeadForm';

import { heroContent as hero_content } from '../data/home';

import Footer from "../components/Footer";

const LANGUAGE = 'es' as const;
const CATEGORY_ID = 'velas' as const;

const heroContent = hero_content[CATEGORY_ID];

const ArgentinaFlag = () => (
  <svg
    viewBox="0 0 3 2"
    className="w-4.5 h-3 opacity-95 rounded-[1px] transition-all duration-300 grayscale-0 scale-105"
  >
    <rect width="3" height="2" fill="#74ACDF" />
    <rect y="0.66" width="3" height="0.66" fill="#FFFFFF" />
    <circle cx="1.5" cy="1" r="0.18" fill="#FFAF36" />
  </svg>
);

export default function CandlesArApp() {
  const [portalOpen, setPortalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("es");

  const courses: Course[] = courses_list.filter(
    c => c.categoryId === CATEGORY_ID && c.modalidade === 'online'
  ) as Course[];

  const aboutBullets = [
    'Trayectoria Bilingüe e Internacional',
    'Especialista en Materias Primas Sostenibles',
    'Mentora de Negocios para Artesanas',
  ];

  const features = [
    { icon: Globe,  title: 'Presencia Global',      sub: 'Alumnas de más de 15 países confían en nosotros.' },
    { icon: Clock,  title: '6+ Años de Maestría',   sub: 'Perfeccionamiento constante en técnica y diseño.' },
    { icon: Medal,  title: 'Certificado Formal',     sub: 'Aval con diploma profesional del Conservatorio Grassi.' },
    { icon: Users,  title: 'Comunidad Activa',       sub: 'Acceso a grupos de apoyo y tutoría continua.' },
  ];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans selection:bg-velas-accent flex flex-col">

      <CandlesArNavbar onOpenPortal={() => setPortalOpen(true)} />

      <main className="grow">

        {/* ── HERO ── */}
        <section
          id="inicio"
          className="relative overflow-hidden px-6 md:px-12 pt-28 md:pt-24 pb-20 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left content */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20">
               <ArgentinaFlag />
              <span className="text-[10px] font-bold uppercase tracking-wider">Certificación Internacional</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl leading-tight text-gray-900">
              Convierte tu Pasión por las Velas en una{' '}
              <span className="italic text-primary font-bold underline decoration-primary/30">
                Carrera Profesional
              </span>
            </h1>

            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-xl">
              Formación de élite en artes manuales. Aprende el dominio técnico y el arte del diseño de velas con estándares internacionales desde Argentina para el mundo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <a
                href="#formaciones"
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-center hover:shadow-lg hover:bg-primary/95 transition-all text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2"
              >
                Ver Formaciones
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#interes"
                className="border-2 border-muted text-on-surface hover:bg-surface-container-low px-8 py-4 rounded-xl font-bold text-center transition-all text-xs tracking-widest uppercase"
              >
                Lista de Espera
              </a>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 pt-6 border-t border-muted max-w-lg">
              <div>
                <span className="text-3xl font-serif text-primary font-bold block">2.000+</span>
                <span className="text-xs font-semibold text-on-surface-variant">alumnas</span>
              </div>
              <div className="h-10 w-px bg-muted" />
              <div>
                <span className="text-3xl font-serif text-primary font-bold block">6+ años</span>
                <span className="text-xs font-semibold text-on-surface-variant">de excelencia</span>
              </div>
              <div className="h-10 w-px bg-muted" />
              <div>
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Aval Exclusivo</span>
              </div>
            </div>
          </div>

          {/* Right — image frame */}
          <div className="relative group lg:ml-6">
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl -rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-500" />
            <img
              alt="Velas artesanales Ivana Academy Argentina"
              className="w-full h-[400px] md:h-[520px] object-cover rounded-xl shadow-xl group-hover:scale-[1.01] transition-transform duration-500"
              src="/images/courses/candle_professorship.png"
            />
            {/* Quote bubble */}
            <div className="absolute bottom-6 -left-6 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-muted hidden md:block max-w-xs">
              <p className="text-base text-primary italic font-semibold leading-relaxed font-serif">
                "La técnica es el puente entre la idea y la maestría."
              </p>
            </div>
          </div>
        </section>

        {/* ── SOBRE IVANA ── */}
        <section id="sobre-ivana" className="bg-surface-container-low py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Portrait */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-3 bg-primary/10 rounded-3xl rotate-1 group-hover:rotate-0 transition-all duration-300" />
              <img
                alt="Ivana Lerea, Fundadora"
                className="w-full aspect-[4/5] object-cover rounded-2xl shadow-md object-top"
                src="/images/courses/imersion.jpg"
              />
            </div>

            {/* Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                MAESTRA FUNDADORA
              </div>

              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-gray-900">
                Sobre Ivana &amp; Su Legado
              </h2>

              <div className="space-y-4 text-sm md:text-base text-on-surface-variant leading-relaxed">
                <p>
                  Con una carrera internacional que abarca más de media década, Ivana ha transformado la forma en que se enseña el arte de las velas en Argentina. Su enfoque combina la delicadeza del artesano con la rigurosidad de la ingeniería química aplicada.
                </p>
                <p>
                  Ha formado a miles de emprendedoras en el dominio de ceras vegetales, aceites esenciales y diseño de producto, logrando que sus alumnas no solo creen velas, sino marcas de lujo con proyección internacional.
                </p>
              </div>

              <ul className="space-y-3.5 pt-4 border-t border-muted">
                {aboutBullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-xs md:text-sm text-on-surface">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── COURSES ── */}
        <CandlesArCoursesSection courses={courses} />

        {/* ── FEATURES ROW ── */}
        <section className="py-20 px-4 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, sub }, i) => (
              <div key={i} className="text-center space-y-2.5 p-6 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">{title}</h4>
                <p className="text-xs text-on-surface-variant italic leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPTURA DE LEAD ── */}
        <CandlesLeadForm country="AR" />

        {/* ── FAQ ── */}
        <FAQSection language={LANGUAGE} faqs={faqs_list} />

        {/* ── CTA FINAL ── */}
        <section className="py-16 px-6 max-w-[1280px] mx-auto text-center">
          <div className="bg-secondary-container rounded-3xl p-10 md:p-20 space-y-6 relative overflow-hidden border border-muted">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/4 translate-y-1/4" />

            <h2 className="font-serif text-3xl md:text-4xl text-on-secondary-container font-bold relative z-10">
              Tu futuro profesional comienza hoy
            </h2>
            <p className="text-sm md:text-base text-on-secondary-container/85 max-w-xl mx-auto leading-relaxed relative z-10">
              No postergues más tu sueño. Inscribite ahora y unite a la academia líder en formación de artesanas en Argentina.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 pt-3">
              <a
                href="#formaciones"
                className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-sm tracking-wider uppercase hover:shadow-lg transition-all shadow-md"
              >
                Matricularme Ahora
              </a>
              <a
                href="mailto:contacto@ivana.academy"
                className="bg-white text-on-surface hover:bg-surface-container-low px-10 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all border border-muted text-center block"
              >
                Hablar con Asesora
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer
        language={language}
        setLanguage={setLanguage}
      />

      {/* ── PORTAL DEL ALUMNO ── */}
      {portalOpen && (
        <CandlesArStudentPortal onClose={() => setPortalOpen(false)} />
      )}

    </div>
  );
}
