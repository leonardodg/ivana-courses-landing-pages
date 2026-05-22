import { Course, Language, CategoryId } from '../types';
import { CATEGORIES } from '../data';
import { Star, MapPin, Calendar, CheckSquare, Sparkles, BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import { useState } from 'react';

interface CourseGridProps {
  language: Language;
  activeCategoryId: CategoryId;
  courses: Course[];
  onSelectEnroll: (course: Course) => void;
}

export default function CourseGrid({
  language,
  activeCategoryId,
  courses,
  onSelectEnroll,
}: CourseGridProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Mapped background images for candles
  const candleImages: Record<string, string> = {
    'imersao-velas-br': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdsIxqiTpMBp3tGlRFCyIZNEPSlfDVXYqH9JrtQtVWKOV4NzS6FzNi2pLOwgebj7HgY_3FjjfJIXcVs9xhTR_mJ6AAoTn6nwjImMCPP9pZlWRr4nsOphwJRH54t3sU666qEoRKezKbosZLRtd4HmjKHLgK-cuE7_2t-ZQhq-XzKB0_Qz7AKt8HJHvyOIBLy-R7PRpSBkn8zZH1qRRqIzwhjJKiT_qqEVMJqggkKkVgoMi5D5dSgA3xqoHvD4y2KF8YJqO-dQS5SyFD',
    'workshop-velas-br': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHpg6RnIoY-_zu-dkiC7Dl_539r3FO_RixqHd3GnzubguFnD0dgPVD-GU-hyvmpHEGiGzAH5IrsxO--UWfD5HkY2CBdKYzW1qnxEgLfLET_1sdox70PZjb1BIA4vSx2iwEEmMZcbeLXJnZL_8eBSUvPlvkgowJOyflYduDYuE5cm8QFUnrJOoHcRda7Vg5pLhFv6c47jattEMKbhiNQw7RHvKyRoo9jDnHzULNGQjK9164r4ttKz4YHwoHRCBXwtwvOlGoFr8sNm2E',
    'profesorado-velas-ar': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqjpyGcOxqOmpw3dTy-_rbKcZXXGfPAO0_LGrFV_YKxs9AbwLP8YP2l7cDjSqkeMT1UagY_L_7Ui2AQ2Kp_T9rTk3oj-o6cmFvKAgI8Vi7JrRv9uMlDAhf66c-v1o1zadFoPFI6Z8pw649B9xrTDAjUzsthF29_KXjerAGh9rcJJ7GriViie2nT9yTotBbIZoUL49GPpdbtdDM3XrMmMse2WBNoEeuml37dqEVr02SNnCaga6hPNa-byiJgNikbOAKIh_vzgQLM6L2',
    'tecnicatura-velas-ar': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqjpyGcOxqOmpw3dTy-_rbKcZXXGfPAO0_LGrFV_YKxs9AbwLP8YP2l7cDjSqkeMT1UagY_L_7Ui2AQ2Kp_T9rTk3oj-o6cmFvKAgI8Vi7JrRv9uMlDAhf66c-v1o1zadFoPFI6Z8pw649B9xrTDAjUzsthF29_KXjerAGh9rcJJ7GriViie2nT9yTotBbIZoUL49GPpdbtdDM3XrMmMse2WBNoEeuml37dqEVr02SNnCaga6hPNa-byiJgNikbOAKIh_vzgQLM6L2', // same clean certificate artwork
    'curso-velas-virtual-br': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_NpGjt-Y2IugFbc502at29kLO1w0E_XQOBxNnqN1NDBtEZFjw19QpjQ7SvOpbIEZdBJuMZkRxnRbjx6Pv9YyQLbcXevCkJxljk6igDm5_SwJ5qJnRWVGQBPBZXYJj-dQnbd0YaUtuyXBonOU-toGzNdsTWTabcZSOSt2vxHPnSJFGWjOer-3yM1y8cXTpbkAicqHIFpRRBSdLuWmKCjJpfCwcDLwQ6Ui2JNtKu92bv6C0SFkp7kB2iSN783Y7jLoY1RetKE-CwuEG',
  };

  // High quality vector backgrounds and templates for other categories to maintain exceptional visual style
  const fallbackGenericCategoryImages: Record<CategoryId, string> = {
    velas: 'https://images.unsplash.com/photo-1603006905531-28562ff455ff?auto=format&fit=crop&q=80&w=600',
    saboaria: 'https://images.unsplash.com/photo-1607006342445-470fc7db6e8a?auto=format&fit=crop&q=80&w=600',
    resinas: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    macrame: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600',
    aromas_incensos: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
  };

  const getCourseImage = (course: Course) => {
    if (course.categoryId === 'velas' && candleImages[course.id]) {
      return candleImages[course.id];
    }
    return fallbackGenericCategoryImages[course.categoryId] || fallbackGenericCategoryImages['velas'];
  };

  const activeCategorySpec = CATEGORIES[activeCategoryId];

  const t = {
    pt: {
      headline: 'Formações & Workshops',
      description: 'Estrutura premium em turmas reduzidas ou suporte individual garantido. Escolha sua modalidade:',
      badgePresencial: 'Presencial Físico',
      badgeOnline: 'Plataforma Moodle',
      duration: 'Duração:',
      location: 'Localidade:',
      materials: 'Materiais:',
      learnMore: 'Ver Conteúdo Programático',
      enrollNow: 'Garantir Minha Vaga',
      officialSite: 'Visitar Plataforma do Curso',
      syllabusTitle: 'Programa de Estudo Detalhado',
      materialsLabel: 'Insumos / Apoio:',
      model: 'Modalidade:',
      close: 'Fechar',
      applyPre: 'Se inscrever no',
    },
    es: {
      headline: 'Formaciones & Talleres',
      description: 'Estructura académica de primer nivel con mentorías personalizadas. Elige tu modalidad:',
      badgePresencial: 'Presencial Físico',
      badgeOnline: 'Plataforma Moodle',
      duration: 'Duración:',
      location: 'Ubicación:',
      materials: 'Materiales:',
      learnMore: 'Ver Programa de Estudios',
      enrollNow: 'Inscribirme / Reservar Vacante',
      officialSite: 'Ir al Aula Virtual (Moodle)',
      syllabusTitle: 'Programa de Estudio Detallado',
      materialsLabel: 'Insumos / Soporte:',
      model: 'Modalidad:',
      close: 'Cerrar',
      applyPre: 'Inscribirme en el',
    }
  }[language];

  const categoryCourses = courses.filter(c => c.categoryId === activeCategoryId);

  return (
    <section id="cursos" className="py-16 md:py-24 bg-[#FAF6F0] relative">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#805252] uppercase bg-[#ffdad9] px-3.5 py-1.5 rounded-full inline-block mb-3">
            {activeCategorySpec.name[language]}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
            {t.headline}
          </h2>
          <p className="text-sm md:text-base text-[#514443] mt-3 leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Dynamic Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {categoryCourses.map((course) => {
            const courseImage = getCourseImage(course);
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#eae8e4] overflow-hidden flex flex-col group h-full"
              >
                {/* Product Cover Photo with Category Overlay */}
                <div className="aspect-[16/10] w-full bg-[#FAF6F0] overflow-hidden relative">
                  <img
                    alt={course.title[language]}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 select-none"
                    src={courseImage}
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 border border-gray-250 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span>{activeCategorySpec.badgeLogo}</span>
                      <span>{course.modalidade === 'presencial' ? t.badgePresencial : t.badgeOnline}</span>
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-amber-400 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col grow justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug group-hover:text-[#805252] transition-colors mb-3">
                      {course.title[language]}
                    </h3>
                    <p className="text-xs md:text-sm text-[#514443] leading-relaxed mb-6 line-clamp-3">
                      {course.description[language]}
                    </p>

                    {/* Quick Specs */}
                    <div className="space-y-2 mb-6 text-xs text-[#514443] font-sans border-t border-[#eae8e4] pt-4">
                      {course.duracao && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#805252] shrink-0" />
                          <span className="font-semibold">{t.duration}</span>
                          <span>{course.duracao[language]}</span>
                        </div>
                      )}
                      {course.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#805252] shrink-0" />
                          <span className="font-semibold">{t.location}</span>
                          <span>{course.location[language]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="space-y-3 pt-4 border-t border-[#eae8e4]/80">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="brand-btn-secondary w-full py-3 text-xs"
                    >
                      {t.learnMore}
                    </button>

                    <button
                      onClick={() => onSelectEnroll(course)}
                      className="brand-btn-primary w-full py-3 text-xs"
                    >
                      {t.enrollNow}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Program Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[620px] overflow-hidden shadow-2xl border border-gray-200 animate-slide-up">
            
            {/* Cover header */}
            <div className="relative aspect-[16/7] bg-[#fcf9f5]">
              <img
                alt="Modal Header"
                className="w-full h-full object-cover"
                src={getCourseImage(selectedCourse)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#f3b8b7] font-bold">
                  {selectedCourse.modalidade === 'presencial' ? t.badgePresencial : t.badgeOnline}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-semibold mt-1 leading-tight">
                  {selectedCourse.title[language]}
                </h3>
              </div>
            </div>

            {/* Syllabus Specs */}
            <div className="p-6 md:p-8 space-y-5 max-h-[420px] overflow-y-auto">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-mono">{t.syllabusTitle}</h4>
                <ul className="space-y-3 mt-3">
                  {selectedCourse.features[language].map((f, i) => (
                    <li key={i} className="flex gap-2.5 text-xs md:text-sm text-[#514443] leading-relaxed">
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#eae8e4] pt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-gray-800 block text-[10px] uppercase font-mono">{t.materialsLabel}</span>
                  <span className="text-[#514443] mt-0.5 block">{selectedCourse.materials[language]}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block text-[10px] uppercase font-mono">{t.model}</span>
                  <span className="text-[#514443] mt-0.5 block capitalize">{selectedCourse.modalidade}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-[#FAF6F0] px-6 py-4 border-t border-[#eae8e4] flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-widest cursor-pointer px-4 py-2"
              >
                {t.close}
              </button>

              {selectedCourse.url ? (
                <a
                  href={selectedCourse.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#805252] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-1.5"
                >
                  <span>{t.officialSite}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    const c = selectedCourse;
                    setSelectedCourse(null);
                    onSelectEnroll(c);
                  }}
                  className="bg-[#805252] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg"
                >
                  {t.enrollNow}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
