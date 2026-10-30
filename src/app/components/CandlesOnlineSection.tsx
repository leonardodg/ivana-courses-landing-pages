// src/app/components/candles/CandlesOnlineSection.tsx
//
// Bloco "Cursos Online" — home PT-BR e página de velas.
// Cards horizontais com imagem, título, descrição, duração e botões
// "GRADE" (syllabus modal) + "MATRÍCULA" (link Moodle ou checkout).
// Filtra apenas cursos online de velas.

import { useState } from 'react';
import { Course } from '../classes/types';
import { ExternalLink, BookOpen, Clock, CheckSquare, X, Star } from 'lucide-react';
import { Section, SectionHeader } from '../ui';

interface CandlesOnlineSectionProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
}

const IMAGES: Record<string, string> = {
  'profesorado-velas-ar':   '/images/courses/velas-maos.webp',
  'tecnicatura-velas-ar':   '/images/courses/velas-online.webp',
  'curso-velas-virtual-br': '/images/courses/velas-online.webp',
};

const BADGES: Record<string, { label: string; color: string }> = {
  'profesorado-velas-ar':   { label: 'DIPLOMADO INTENSIVO', color: 'bg-amber-100 text-amber-800' },
  'tecnicatura-velas-ar':   { label: 'FORMAÇÃO COMPLETA',   color: 'bg-rose-100 text-rose-800' },
  'curso-velas-virtual-br': { label: 'MAIS VENDIDO',        color: 'bg-emerald-100 text-emerald-800' },
};

export default function CandlesOnlineSection({ courses, onEnroll }: CandlesOnlineSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const online = courses.filter(c => c.modalidade === 'online');
  if (online.length === 0) return null;

  return (
    <Section id="online" bg="cream" width="mid">
      <SectionHeader
        kicker="APRENDA NO SEU RITMO"
        title={<><span className="text-primary">Cursos Online</span> Ivana Academy</>}
        sub="Acesso vitalício e imediato, suporte direto aos alunos e materiais complementares detalhados."
      />
      <div>
        {/* Cards — layout horizontal */}
        <div className="space-y-6">
          {online.map((course) => {
            const img   = IMAGES[course.id] ?? '/images/courses/velas-pavio-madeira.webp';
            const badge = BADGES[course.id];

            return (
              <div
                key={course.id}
                className="bg-white border border-muted rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-56 md:w-64 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden relative">
                  <img loading="lazy" decoding="async"
                    src={img}
                    alt={course.title.pt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col p-6 grow justify-between">
                  <div className="space-y-2">
                    {/* Badges row */}
                    <div className="flex flex-wrap gap-2">
                      {badge && (
                        <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-snug group-hover:text-primary transition-colors">
                      {course.title.pt}
                    </h3>

                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                      {course.description.pt}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {course.duracao.pt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Price + CTA row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-muted mt-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-on-surface-variant tracking-wider block">
                        VALOR ÚNICO
                      </span>
                      <span className="text-xl font-serif font-bold text-primary">
                        Consulte
                      </span>
                    </div>

                    <div className="flex gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 border border-muted hover:border-primary text-on-surface-variant hover:text-primary text-xs font-bold font-mono uppercase tracking-wider px-3 sm:px-4 py-2 min-h-11 rounded-lg transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        GRADE
                      </button>
                      {course.url ? (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-3 sm:px-5 py-2 min-h-11 rounded-lg transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          MATRÍCULA
                        </a>
                      ) : (
                        <button
                          onClick={() => onEnroll(course)}
                          className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-3 sm:px-5 py-2 min-h-11 rounded-lg transition-all cursor-pointer"
                        >
                          MATRÍCULA
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade / Syllabus Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200">

            <div className="relative aspect-[16/7] bg-gray-200">
              <img loading="lazy" decoding="async"
                src={IMAGES[selectedCourse.id] ?? '/images/courses/velas-pavio-madeira.webp'}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-4 left-6 right-12 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold block">
                  Online • Acesso Vitalício
                </span>
                <h3 className="text-lg font-serif font-semibold mt-0.5 leading-tight">
                  {selectedCourse.title.pt}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{selectedCourse.duracao.pt}</span>
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
                className="text-xs font-bold text-gray-600 hover:text-gray-800 uppercase tracking-widest cursor-pointer"
              >
                Fechar
              </button>
              {selectedCourse.url ? (
                <a
                  href={selectedCourse.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Acessar Plataforma
                </a>
              ) : (
                <button
                  onClick={() => { setSelectedCourse(null); onEnroll(selectedCourse); }}
                  className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-primary/90 cursor-pointer"
                >
                  Matricular-me
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
