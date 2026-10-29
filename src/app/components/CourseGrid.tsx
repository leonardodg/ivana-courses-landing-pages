import { Course, CategorySpec, Language, CategoryId } from '../classes/types';
import { categories_data } from '../data/categories';
import { courses_text as text } from '../lang/courses_grid';
import { candle_images } from '../data/candle_images';
import { category_images } from '../data/category_images';
import { MapPin, Calendar } from 'lucide-react';
import { useAgenda } from '../hooks/useAgenda';
import { CursoCard } from './theme/ThemeSections';
import { Card, CardGrid, Section, SectionHeader, btnPrimary } from '../ui';
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
  const agenda = useAgenda('BR', language === 'pt');
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const futureEvents = agenda.events
    .filter(e => e.date >= today)
    .sort((a, b) => a.start.localeCompare(b.start));

  // Sem filtro: todas as categorias, em ordem. Com filtro: só a escolhida.
  const categoryIds = (activeCategoryId ? [activeCategoryId] : Object.keys(CATEGORIES)) as CategoryId[];

  return (
    <>
      <Section id="cursos" bg="hero" width="wide">
        <SectionHeader
          kicker={activeCategoryId ? CATEGORIES[activeCategoryId].name[language] : undefined}
          title={courses_text.headline}
          sub={courses_text.description}
        />

        {categoryIds.map((categoryId, groupIndex) => {
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
            <CardGrid count={(theme && homeTheme ? theme.courses.length : 0) + categoryCourses.length} toggle={groupIndex === 0}>
              {theme && homeTheme && theme.courses.map(key => (
                <CursoCard
                  key={key}
                  c={presencial_courses[key]}
                  utm={theme.utm}
                  events={themeEvents.filter(e => e.course === key)}
                  feedError={agenda.status === 'error'}
                  loading={agenda.status === 'loading'}
                  details={{ href: `${homeTheme.page}#${key}` }}
                />
              ))}
              {categoryCourses.map((course) => {
                const label = course.modalidade === 'presencial' ? courses_text.badgePresencial : courses_text.badgeOnline;
                const enroll = (cls: string) => (
                  <button type="button" onClick={() => onSelectEnroll(course)} className={cls}>
                    {courses_text.enrollNow}
                  </button>
                );
                return (
                  <Card
                    key={course.id}
                    image={getCourseImage(course)}
                    alt={course.title[language]}
                    tag={label}
                    title={course.title[language]}
                    bullets={course.features[language].slice(0, 3)}
                    meta={
                      <>
                        {course.duracao && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                            {course.duracao[language]}
                          </span>
                        )}
                        {course.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            {course.location[language]}
                          </span>
                        )}
                      </>
                    }
                    // Presencial sem turma marcada mostra o aviso; o online não tem turmas.
                    turmas={course.modalidade === 'presencial' ? { items: [], emptyText: language === 'pt' ? 'Sem turmas marcadas por enquanto.' : 'Sin clases marcadas por ahora.' } : undefined}
                    cta={enroll(`${btnPrimary} w-full`)}
                    grade={course.features[language].length === 0 ? undefined : {
                      label: courses_text.learnMore,
                      closeLabel: courses_text.close,
                      content: {
                        image: getCourseImage(course),
                        tag: label,
                        title: course.title[language],
                        intro: course.description[language],
                        facts: [
                          ...(course.duracao ? [{ label: courses_text.duration.replace(':', ''), value: course.duracao[language] }] : []),
                          { label: courses_text.model.replace(':', ''), value: label },
                        ],
                        sections: [
                          { title: courses_text.syllabusTitle, items: course.features[language] },
                          { title: courses_text.materialsLabel.replace(':', ''), text: course.materials[language] },
                        ],
                        action: enroll(btnPrimary),
                      },
                    }}
                  />
                );
              })}
            </CardGrid>
            </div>
          );
        })}
      </Section>
    </>
  );
}
