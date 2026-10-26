import { Course, CategorySpec, Language, CategoryId } from '../classes/types';
import { categories_data } from '../data/categories';
import { courses_text as text } from '../lang/courses_grid';
import { candle_images } from '../data/candle_images';
import { category_images } from '../data/category_images';
import { Star, MapPin, Calendar, CheckSquare, Sparkles, BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgenda } from '../hooks/useAgenda';
import { CursoCard } from './theme/ThemeSections';
import { home_category_themes, presencial_themes, presencial_courses } from '../data/presencial';

interface CourseGridProps {
  language: Language;
  activeCategoryId: CategoryId | null; // null = sem filtro (todos os cards)
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

  // Esc fecha o modal (teclado)
  useEffect(() => {
    if (!selectedCourse) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedCourse(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCourse]);

  // Mapped background images for candles
  const candleImages: Record<string, string> = candle_images;

  // High quality vector backgrounds and templates for other categories to maintain exceptional visual style
  const fallbackGenericCategoryImages: Record<CategoryId, string> = category_images;

  const getCourseImage = (course: Course) => {
    if (candleImages[course.id]) {
      return candleImages[course.id];
    }
    return fallbackGenericCategoryImages[course.categoryId] || fallbackGenericCategoryImages['velas'];
  };

  const CATEGORIES: Record<string, CategorySpec> = categories_data;

  const courses_text = text[language];

  // Presenciais em PT: cards da loja, com as turmas reais da agenda. Os demais seguem como antes.
  const agenda = useAgenda(language === 'pt');
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const futureEvents = agenda.events
    .filter(e => e.date >= today)
    .sort((a, b) => a.start.localeCompare(b.start));

  // Sem filtro: todas as categorias, em ordem. Com filtro: só a escolhida.
  const categoryIds = (activeCategoryId ? [activeCategoryId] : Object.keys(CATEGORIES)) as CategoryId[];

  return (
    <section id="cursos" className="py-16 md:py-24 bg-surface-hero relative">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {activeCategoryId && (
            <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase bg-velas-accent px-3.5 py-1.5 rounded-full inline-block mb-3">
              {CATEGORIES[activeCategoryId].name[language]}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
            {courses_text.headline}
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-3 leading-relaxed">
            {courses_text.description}
          </p>
        </div>

        {categoryIds.map((categoryId) => {
          const homeTheme = language === 'pt' ? home_category_themes[categoryId] : undefined;
          const theme = homeTheme ? presencial_themes[homeTheme.theme] : undefined;
          const themeEvents = theme ? futureEvents.filter(e => theme.courses.includes(e.course)) : [];
          const categoryCourses = courses.filter(
            c => c.categoryId === categoryId && !(theme && c.modalidade === 'presencial'),
          );
          return (
            <div key={categoryId} className={activeCategoryId ? '' : 'mb-16 last:mb-0'}>
              {!activeCategoryId && (
                <h3 className="text-xs font-mono font-bold tracking-widest text-primary uppercase mb-6">
                  {CATEGORIES[categoryId].badgeLogo} {CATEGORIES[categoryId].name[language]}
                </h3>
              )}
        {theme && homeTheme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-8 lg:mb-10">
                {theme.courses.map(key => (
                  <CursoCard
                    key={key}
                    c={presencial_courses[key]}
                    utm={theme.utm}
                    events={themeEvents.filter(e => e.course === key)}
                    feedError={agenda.status === 'error'}
                loading={agenda.status === 'loading'}
                    turmas={{ max: 3, pageHref: `${homeTheme.page}#${key}` }}
                  />
                ))}
              </div>
            )}
    
            {/* Dynamic Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {categoryCourses.map((course) => {
                const courseImage = getCourseImage(course);
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-muted overflow-hidden flex flex-col group h-full"
                  >
                    {/* Product Cover Photo with Category Overlay */}
                    <div className="aspect-[16/10] w-full bg-surface-hero overflow-hidden relative">
                      <img loading="lazy" decoding="async"
                        alt={course.title[language]}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 select-none"
                        src={courseImage}
                      />
                      
                      {/* Category Pill Tag */}
                      <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                        <span className="bg-white/90 backdrop-blur-md text-gray-900 border border-gray-250 text-micro font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <span>{CATEGORIES[categoryId].badgeLogo}</span>
                          <span>{course.modalidade === 'presencial' ? courses_text.badgePresencial : courses_text.badgeOnline}</span>
                        </span>
                      </div>
    
                      {/* Rating Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-amber-400 font-mono text-mini font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
    
                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col grow justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug group-hover:text-primary transition-colors mb-3">
                          {course.title[language]}
                        </h3>
                        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                          {course.description[language]}
                        </p>
    
                        {/* Quick Specs */}
                        <div className="space-y-2 mb-6 text-xs text-on-surface-variant font-sans border-t border-muted pt-4">
                          {course.duracao && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-semibold">{courses_text.duration}</span>
                              <span>{course.duracao[language]}</span>
                            </div>
                          )}
                          {course.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-semibold">{courses_text.location}</span>
                              <span>{course.location[language]}</span>
                            </div>
                          )}
                        </div>
                      </div>
    
                      {/* Action row */}
                      <div className="space-y-3 pt-4 border-t border-muted">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="brand-btn-secondary w-full py-3 text-xs"
                        >
                          {courses_text.learnMore}
                        </button>
    
                        <button
                          onClick={() => onSelectEnroll(course)}
                          className="brand-btn-primary w-full py-3 text-xs"
                        >
                          {courses_text.enrollNow}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          );
        })}
      </div>

      {/* Course Program Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div role="dialog" aria-modal="true" aria-labelledby="course-modal-title" className="bg-white rounded-2xl w-full max-w-[620px] overflow-hidden shadow-2xl border border-gray-200 animate-slide-up">
            
            {/* Cover header */}
            <div className="relative aspect-[16/7] bg-surface-cream">
              <img loading="lazy" decoding="async"
                alt=""
                className="w-full h-full object-cover"
                src={getCourseImage(selectedCourse)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-micro uppercase font-mono tracking-widest text-inverse-primary font-bold">
                  {selectedCourse.modalidade === 'presencial' ? courses_text.badgePresencial : courses_text.badgeOnline}
                </span>
                <h3 id="course-modal-title" className="text-xl md:text-2xl font-serif font-semibold mt-1 leading-tight">
                  {selectedCourse.title[language]}
                </h3>
              </div>
            </div>

            {/* Syllabus Specs */}
            <div className="p-6 md:p-8 space-y-5 max-h-[420px] overflow-y-auto">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gray-600 font-mono">{courses_text.syllabusTitle}</h4>
                <ul className="space-y-3 mt-3">
                  {selectedCourse.features[language].map((f, i) => (
                    <li key={i} className="flex gap-2.5 text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-muted pt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-gray-800 block text-micro uppercase font-mono">{courses_text.materialsLabel}</span>
                  <span className="text-on-surface-variant mt-0.5 block">{selectedCourse.materials[language]}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block text-micro uppercase font-mono">{courses_text.model}</span>
                  <span className="text-on-surface-variant mt-0.5 block capitalize">{selectedCourse.modalidade}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-surface-hero px-6 py-4 border-t border-muted flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-xs font-bold text-gray-600 hover:text-gray-800 uppercase tracking-widest cursor-pointer px-4 py-2"
              >
                {courses_text.close}
              </button>

              {selectedCourse.url ? (
                <a
                  href={selectedCourse.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-1.5"
                >
                  <span>{courses_text.officialSite}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    const c = selectedCourse;
                    setSelectedCourse(null);
                    onSelectEnroll(c);
                  }}
                  className="bg-primary hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg"
                >
                  {courses_text.enrollNow}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
