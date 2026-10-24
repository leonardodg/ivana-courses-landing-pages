// src/app/components/candles/CandlesWorkshopsSection.tsx
//
// Bloco "Próximos Workshops Presenciais" — exclusivo da página /pt_br/candles.
// Cards visuais inspirados no protótipo AI Studio (imagem grande, tag de
// modalidade, título, descrição, botões VER GRADE + INSCREVER-ME).
// Filtra apenas cursos presenciais de velas.

import { useState } from 'react';
import { Course } from '../classes/types';
import { MapPin, Clock, ArrowRight, GraduationCap, Star, CheckSquare, X, CalendarDays, ChevronDown } from 'lucide-react';
import { useAgenda } from '../hooks/useAgenda';

const AGENDA_URL = 'https://courses.ivana.academy/agenda/';
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

interface DateItem {
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  venue: string;
  address: string;
}

// Reserva caso a agenda ao vivo (n8n) falhe. Só eventos de velas.
const FALLBACK_DATES: DateItem[] = [
  { date: '2026-11-07', time: '9h', title: 'Velas Aromáticas e de Moldes', venue: 'Eventos Elegance, Balneário Camboriú', address: 'Rua 3122, nº 481, Balneário Camboriú' },
  { date: '2026-11-14', time: '9h', title: 'Velas Aromáticas e de Moldes', venue: 'Espaço Moura, Rio de Janeiro', address: 'Rua Correa Dutra 149 - Flamengo, Rio de Janeiro' },
  { date: '2026-11-20', time: '9h30', title: 'Imersão de Velas', venue: 'Ivana Academy, Florianópolis', address: 'Rua João Patrício, 109, Ingleses, Florianópolis' },
  { date: '2026-11-28', time: '9h30', title: 'Velas de Oratório', venue: 'Ivana Academy, Florianópolis', address: 'Rua João Patrício, 109, Ingleses, Florianópolis' },
];

interface CandlesWorkshopsSectionProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
}

const IMAGES: Record<string, string> = {
  'imersao-velas-br':   '/images/courses/imersao-turma.jpg',
  'workshop-velas-br':  '/images/courses/workshop-velas.jpg',
};

const TAGS: Record<string, string> = {
  'imersao-velas-br':  'IMERSÃO HISTÓRICA',
  'workshop-velas-br': 'WORKSHOP PRESENCIAL',
};

// Cada data da agenda é uma turma; o curso correspondente vem pelo título.
function courseIdFor(title: string): string | null {
  if (/imers/i.test(title)) return 'imersao-velas-br';
  if (/orat/i.test(title)) return null; // sem curso cadastrado: detalhes só com os dados da agenda
  return 'workshop-velas-br';
}

export default function CandlesWorkshopsSection({ courses, onEnroll }: CandlesWorkshopsSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const presencial = courses.filter(c => c.modalidade === 'presencial');

  const agenda = useAgenda();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const live: DateItem[] = agenda.events
    .filter(e => /vela/i.test(e.title) && e.date >= today)
    .map(e => ({ date: e.date, time: e.time ?? '', title: e.title, venue: e.place, address: e.address }));
  const dates = (live.length ? live : FALLBACK_DATES).filter(d => d.date >= today);

  return (
    <section id="cursos" className="py-20 md:py-28 bg-surface-cream">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-3">
            EXPERIÊNCIA AO VIVO
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
            Próximos Workshops Presenciais
          </h2>
          <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
            Vagas estritamente limitadas para garantir suporte individualizado e aprendizado prático em detalhes.
          </p>
        </div>

        {/* Turmas: lista compacta; cada linha abre o card completo */}
        <div className="max-w-3xl mx-auto">
          <h3 className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest text-primary mb-4">
            <CalendarDays className="w-4 h-4" /> Próximas datas
          </h3>

          <ul className="space-y-4">
            {dates.map(d => {
              const key = `${d.date}-${d.time}-${d.title}`;
              const open = openKey === key;
              const [, m, day] = d.date.split('-');
              const cid = courseIdFor(d.title);
              const course = presencial.find(c => c.id === cid) ?? null;
              const img = (cid && IMAGES[cid]) || '/images/courses/velas-pavio-madeira.jpg';
              const tag = (cid && TAGS[cid]) || 'WORKSHOP PRESENCIAL';

              return (
                <li key={key} className="bg-white rounded-2xl overflow-hidden border border-muted shadow-sm">
                  {/* Linha compacta */}
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-4 p-4 text-left cursor-pointer hover:bg-surface-cream/60 transition-colors"
                  >
                    <span className="w-12 shrink-0 text-center font-serif text-2xl leading-none text-gray-900">
                      {Number(day)}
                      <small className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">{MESES[Number(m) - 1]}</small>
                    </span>
                    <span className="grow text-sm text-gray-900">
                      <span className="font-semibold">{d.title}</span>
                      <span className="block text-xs text-on-surface-variant">{d.time && `${d.time} · `}{d.venue}</span>
                      {d.address && (
                        <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />{d.address}
                        </span>
                      )}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Card completo */}
                  {open && (
                    <div className="border-t border-muted">
                      <div className="relative aspect-[16/8] overflow-hidden bg-gray-100">
                        <img src={img} alt={d.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                            {tag}
                          </span>
                        </div>
                        {course && (
                          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h4 className="text-xl font-serif text-gray-900 leading-snug mb-2">{course?.title.pt ?? d.title}</h4>
                        {course && (
                          <p className="text-xs text-on-surface-variant leading-relaxed mb-5">{course.description.pt}</p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-6 border-t border-muted pt-4">
                          {course && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                              {course.duracao.pt}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            {d.venue}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          {course && (
                            <button
                              onClick={() => setSelectedCourse(course)}
                              className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                              VER GRADE
                            </button>
                          )}
                          <button
                            onClick={() => (course ? onEnroll(course) : window.open(AGENDA_URL, '_blank', 'noreferrer'))}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            INSCREVER-ME
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <a
            href={AGENDA_URL}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary hover:underline"
          >
            Agenda completa e sempre atualizada <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Grade / Syllabus Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200">

            <div className="relative aspect-[16/7] bg-gray-200">
              <img
                src={IMAGES[selectedCourse.id] ?? '/images/courses/velas-pavio-madeira.jpg'}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
              <div className="absolute bottom-4 left-6 right-12 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold block">
                  {TAGS[selectedCourse.id] ?? 'PRESENCIAL'}
                </span>
                <h3 className="text-lg md:text-xl font-serif font-semibold mt-0.5 leading-tight">
                  {selectedCourse.title.pt}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{selectedCourse.duracao.pt}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" />{selectedCourse.location.pt.replace('*', '')}</span>
              </div>
              <ul className="space-y-2.5">
                {selectedCourse.features.pt.map((f, i) => (
                  <li key={i} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-on-surface-variant border-t border-muted pt-3">
                <span className="font-semibold text-gray-800">Materiais:</span> {selectedCourse.materials.pt}
              </p>
            </div>

            <div className="bg-surface-cream border-t border-muted px-6 py-4 flex justify-between items-center gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-widest cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => { setSelectedCourse(null); onEnroll(selectedCourse); }}
                className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-primary/90 transition cursor-pointer"
              >
                Inscrever-me
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
