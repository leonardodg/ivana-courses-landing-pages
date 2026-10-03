// src/app/components/candles/CandlesWorkshopsSection.tsx
//
// Bloco "Próximos Workshops Presenciais" — exclusivo da página /pt_br/candles.
// Cards visuais inspirados no protótipo AI Studio (imagem grande, tag de
// modalidade, título, descrição, botões VER GRADE + INSCREVER-ME).
// Filtra apenas cursos presenciais de velas.

import { useState } from 'react';
import { Course } from '../classes/types';
import { MapPin, Clock, ArrowRight, GraduationCap, Star, CheckSquare, X } from 'lucide-react';

interface CandlesWorkshopsSectionProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
}

const IMAGES: Record<string, string> = {
  'imersao-velas-br':   '/images/courses/imersion.jpg',
  'workshop-velas-br':  '/images/courses/candles_workshop.png',
};

const TAGS: Record<string, string> = {
  'imersao-velas-br':  'IMERSÃO HISTÓRICA',
  'workshop-velas-br': 'WORKSHOP PRESENCIAL',
};

export default function CandlesWorkshopsSection({ courses, onEnroll }: CandlesWorkshopsSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const presencial = courses.filter(c => c.modalidade === 'presencial');

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

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {presencial.map((course) => {
            const img   = IMAGES[course.id] ?? '/images/courses/hero_candle.png';
            const tag   = TAGS[course.id]   ?? 'PRESENCIAL';

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden border border-muted shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Cover photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={img}
                    alt={course.title.pt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {tag}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {course.rating.toFixed(1)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-serif text-gray-900 leading-snug mb-2 group-hover:text-primary transition-colors">
                    {course.title.pt}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-5 line-clamp-2">
                    {course.description.pt}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-6 border-t border-muted pt-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      {course.duracao.pt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      Florianópolis, SC
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      VER GRADE
                    </button>
                    <button
                      onClick={() => onEnroll(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      INSCREVER-ME
                    </button>
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
              <img
                src={IMAGES[selectedCourse.id] ?? '/images/courses/hero_candle.png'}
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
