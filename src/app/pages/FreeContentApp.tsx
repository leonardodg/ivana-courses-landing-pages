// Conteúdo gratuito: UM arquivo para as duas versões (/pt-br/conteudo-gratuito/ e /es-ar/contenido-gratuito/).
// Um CARD POR CURSO GRATUITO da plataforma (o mesmo Card das páginas de curso) e cards de MATERIAL (apostila, modelo editável),
// com os filtros por categoria e tipo (mesma barra da home). Conteúdo em data/free_content.ts.
//  • Curso: "Matricular-me grátis" (nome + e-mail → usuário e matrícula no Moodle, via n8n) e "Ver aula de amostra" (a 1ª aula,
//    só com o e-mail, no player da página). "Ver aulas" abre a lista de aulas e o que a plataforma entrega.
//  • Material: sempre pede o e-mail; o link vai por e-mail (o n8n envia).
import { useMemo, useState } from 'react';
import { GraduationCap, Mail, Play } from 'lucide-react';
import SiteNavbar from '../components/SiteNavbar';
import Footer from '../components/Footer';
import { Card, CardGrid, EmailGateModal, Section, SectionHeader, VideoModal, btnOutline, btnPrimary, type GradeContent } from '../ui';
import {
  free_categories, free_courses, free_kinds, free_materials, free_text,
  type FreeCategory, type FreeCountry, type FreeCourse, type FreeKind, type FreeMaterial,
} from '../data/free_content';
import { requestFreeAccess, requestMoodleEnroll, resetFreeAccess, useFreeAccess } from '../lib/freeAccess';
import { useSegmentFilter } from '../hooks/useSegmentFilter';
import { trackEvent } from '../lib/analytics';

const MATERIAL_TAG = {
  apostila: { pt: 'Apostila PDF', es: 'Apostilla PDF' },
  recurso: { pt: 'Modelo editável', es: 'Modelo editable' },
};

type Gate = { mode: 'preview' | 'enroll'; course: FreeCourse } | { mode: 'material'; material: FreeMaterial };

export default function FreeContentApp({ country }: { country: FreeCountry }) {
  const language = country === 'BR' ? 'pt' : 'es';
  const t = free_text[language];
  const unlocked = useFreeAccess();

  const courses = useMemo(() => free_courses.filter((c) => c.country === country), [country]);
  const materials = useMemo(() => free_materials.filter((m) => m.country === country), [country]);
  const categories = useMemo(() => [...new Set([...courses, ...materials].map((i) => i.category))] as FreeCategory[], [courses, materials]);
  const kinds = useMemo(() => [...(courses.length ? ['curso'] : []), ...(materials.length ? ['material'] : [])] as FreeKind[], [courses, materials]);

  // #macrame, #resinas… filtram por categoria; #macrame-ar (id de um card) mostra a categoria dele e rola até o card.
  const [category, setCategory] = useSegmentFilter({
    keys: categories,
    cardSegment: (id) => [...courses, ...materials].find((i) => i.id === id)?.category,
    sectionId: 'conteudo-gratuito',
  });
  const [kind, setKind] = useState<FreeKind | ''>('');

  const showCourse = (c: FreeCourse) => (!category || c.category === category) && (!kind || kind === 'curso');
  const showMaterial = (m: FreeMaterial) => (!category || m.category === category) && (!kind || kind === 'material');
  const shownCourses = courses.filter(showCourse);
  const shownMaterials = materials.filter(showMaterial);
  const count = shownCourses.length + shownMaterials.length;

  const [gate, setGate] = useState<Gate | null>(null);
  const [playing, setPlaying] = useState<{ youtubeId: string; title: string } | null>(null);
  const [sent, setSent] = useState(false);
  const closeGate = () => {
    setGate(null);
    setSent(false);
  };

  const playPreview = (course: FreeCourse) => {
    const lesson = course.lessons[0];
    trackEvent('free_content_open', { item: lesson.id, type: 'preview', country });
    setPlaying({ youtubeId: lesson.youtubeId, title: `${course.title}: ${lesson.title}` });
  };
  // Aula de amostra: depois do primeiro e-mail o navegador lembra e abre direto.
  const onPreview = (course: FreeCourse) => (unlocked ? playPreview(course) : setGate({ mode: 'preview', course }));

  const submit = async ({ email, firstName, lastName }: { email: string; firstName: string; lastName: string }): Promise<string | null> => {
    if (!gate) return null;
    let result: Awaited<ReturnType<typeof requestFreeAccess>>;
    let itemId: string;
    if ('material' in gate) {
      itemId = gate.material.id;
      result = await requestFreeAccess(email, country, itemId);
    } else if (gate.mode === 'enroll') {
      itemId = gate.course.id;
      result = await requestMoodleEnroll({ email, firstName, lastName, country, course: itemId });
    } else {
      itemId = gate.course.lessons[0].id;
      result = await requestFreeAccess(email, country, itemId);
    }
    if (result === 'rate_limited') return t.limited;
    if (result === 'error') return t.failed;
    if (!('material' in gate) && gate.mode === 'preview') {
      const course = gate.course;
      closeGate();
      playPreview(course);
    } else {
      trackEvent('free_content_open', { item: itemId, type: gate.mode, country });
      setSent(true);
    }
    return null;
  };

  const lessonsLabel = (n: number) => `${n} ${n === 1 ? t.lesson : t.lessons}`;

  const gradeFor = (c: FreeCourse): GradeContent => ({
    image: c.image,
    tag: free_kinds.curso[language],
    title: c.title,
    intro: t.courseIntro,
    facts: [
      { label: t.factLessons, value: String(c.lessons.length) },
      { label: t.factCert, value: t.factCertValue },
      { label: t.factPrice, value: t.factPriceValue },
    ],
    sections: [
      { title: t.lessonsTitle, items: c.lessons.map((l, i) => (i === 0 ? `${l.title} (${t.freeHere})` : l.title)) },
      { title: t.includedTitle, items: t.included },
    ],
  });

  const enrolling = gate?.mode === 'enroll';
  const modalTitle = !gate ? '' : gate.mode === 'enroll' ? t.enrollTitle : gate.mode === 'preview' ? t.gateTitle : t.mailTitle;
  const modalText = !gate ? '' : gate.mode === 'enroll' ? t.enrollText : gate.mode === 'preview' ? t.gateText : t.mailText;
  const sentText = enrolling ? { title: t.enrollSent, text: t.enrollSentText } : { title: t.sentTitle, text: t.sentText };

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />
      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Section id="conteudo-gratuito" width="wide" pad="md">
          <SectionHeader as="h1" title={t.title} sub={t.subtitle} />
          {unlocked && (
            <p className="text-xs text-on-surface-variant text-center -mt-6 mb-8">
              {t.unlocked} ·{' '}
              <button type="button" onClick={resetFreeAccess} className="underline text-primary cursor-pointer min-h-11">
                {t.change}
              </button>
            </p>
          )}
          <CardGrid
            count={count}
            filter={[
              { value: category, onChange: (v) => setCategory(v), options: categories.map((c) => ({ value: c, label: free_categories[c][language] })), label: t.filterCategory, allLabel: t.allCategories },
              { value: kind, onChange: (v) => setKind(v as FreeKind | ''), options: kinds.map((k) => ({ value: k, label: free_kinds[k][language] })), label: t.filterKind, allLabel: t.allKinds },
            ]}
          >
            {shownCourses.map((c) => (
              <Card
                key={c.id}
                id={c.id}
                image={c.image}
                alt=""
                tag={free_kinds.curso[language]}
                title={c.title}
                bullets={t.included.slice(0, 3)}
                meta={
                  <>
                    <span>{free_categories[c.category][language]}</span>
                    <span>{lessonsLabel(c.lessons.length)}</span>
                  </>
                }
                grade={{ label: t.viewLessons, closeLabel: t.closeLessons, content: gradeFor(c) }}
                cta={
                  <div className="space-y-3">
                    <button type="button" onClick={() => setGate({ mode: 'enroll', course: c })} className={`${btnPrimary} w-full`}>
                      <GraduationCap className="w-4 h-4" aria-hidden />
                      {t.enroll}
                    </button>
                    <button type="button" onClick={() => onPreview(c)} className={`${btnOutline} w-full`}>
                      <Play className="w-4 h-4" aria-hidden />
                      {t.preview}
                    </button>
                  </div>
                }
              />
            ))}
            {shownMaterials.map((m) => (
              <Card
                key={m.id}
                id={m.id}
                image={m.image}
                alt=""
                tag={MATERIAL_TAG[m.kind][language]}
                title={m.title}
                bullets={[m.summary]}
                meta={<span>{free_categories[m.category][language]}</span>}
                cta={
                  <button type="button" onClick={() => setGate({ mode: 'material', material: m })} className={`${btnPrimary} w-full`}>
                    <Mail className="w-4 h-4" aria-hidden />
                    {t.getMaterial}
                  </button>
                }
              />
            ))}
          </CardGrid>
          {count === 0 && <p className="text-center text-sm text-on-surface-variant mt-8">{t.empty}</p>}
        </Section>
      </main>
      <Footer />

      {gate && (
        <EmailGateModal
          askName={enrolling}
          sent={sent ? sentText : null}
          text={{
            title: modalTitle, text: modalText, email: t.email, submit: enrolling ? t.enroll : t.submit, sending: t.sending, close: t.close,
            invalid: t.invalid, firstName: t.firstName, lastName: t.lastName, invalidName: t.invalidName,
          }}
          language={language}
          onClose={closeGate}
          onSubmit={submit}
        />
      )}
      {playing && <VideoModal youtubeId={playing.youtubeId} title={playing.title} closeLabel={t.close} onClose={() => setPlaying(null)} />}
    </div>
  );
}
