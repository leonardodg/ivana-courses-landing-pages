// src/app/components/candles-ar/CandlesArCoursesSection.tsx
// Grade de formações online da Argentina — Profesorado e Tecnicatura.
// Cards grandes com imagem, badge, descrição, módulos e CTA para Moodle.

import { useState } from 'react';
import { Course } from '../../classes/types';
import { ExternalLink, CheckSquare, Clock, X, BookOpen, Star } from 'lucide-react';

interface CandlesArCoursesSectionProps {
  courses: Course[];
}

const IMAGES: Record<string, string> = {
  'profesorado-velas-ar':  '/images/courses/candle_professorship.png',
  'tecnicatura-velas-ar':  '/images/courses/candles_tec.png',
};

const BADGES: Record<string, { label: string; extra?: string }> = {
  'profesorado-velas-ar': { label: 'Inscripciones Abiertas', extra: 'Diplomado Intensivo' },
  'tecnicatura-velas-ar': { label: 'Inscripciones Abiertas', extra: 'Formación Completa'  },
};

export default function CandlesArCoursesSection({ courses }: CandlesArCoursesSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const online = courses.filter(c => c.modalidade === 'online');

  return (
    <section id="formaciones" className="py-20 md:py-28 px-4 max-w-[1280px] mx-auto">

      {/* Header */}
      <div className="text-center space-y-3 mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-primary block">
          CONOCIMIENTOS DE ÉLITE
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight">
          Formaciones Profesionales
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Nuestros programas están diseñados para llevarte de principiante a experta con certificación internacional del Conservatorio Grassi.
        </p>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {online.map((course) => {
          const img   = IMAGES[course.id] ?? '/images/courses/hero_candle.png';
          const badge = BADGES[course.id];

          return (
            <div
              key={course.id}
              className="group bg-surface-container-low/50 border border-muted rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* Cover image */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src={img}
                  alt={course.title.es}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Inscripciones badge */}
                <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {badge?.label}
                </span>
                {/* Category pill */}
                <div className="absolute bottom-4 left-4 bg-white/85 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] tracking-widest uppercase font-bold text-primary">
                  {badge?.extra ?? 'Online'}
                </div>
                {/* Rating */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {course.rating.toFixed(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-serif text-xl md:text-2xl text-primary leading-snug">
                    {course.title.es}
                  </h3>
                  <p className="text-xs md:text-sm text-on-surface-variant font-medium leading-relaxed">
                    {course.description.es}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant py-3 border-t border-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {course.duracao.es}
                  </span>
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-muted flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-on-surface-variant tracking-wider block">
                      Modalidad
                    </span>
                    <span className="font-semibold text-xs text-on-surface">
                      {course.duracao.es}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex items-center gap-1.5 border border-muted hover:border-primary text-on-surface-variant hover:text-primary text-xs font-bold font-mono uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Programa
                    </button>
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Inscribirme
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200">

            <div className="relative aspect-[16/7] bg-gray-200">
              <img
                src={IMAGES[selectedCourse.id] ?? '/images/courses/hero_candle.png'}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
              <div className="absolute bottom-4 left-6 right-12 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold block">
                  Online · Certificación Internacional
                </span>
                <h3 className="text-lg font-serif font-semibold mt-0.5 leading-tight">
                  {selectedCourse.title.es}
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
              <ul className="space-y-2.5">
                {selectedCourse.features.es.map((f, i) => (
                  <li key={i} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-on-surface-variant border-t border-muted pt-3">
                <span className="font-semibold text-gray-800">Materiales:</span> {selectedCourse.materials.es}
              </p>
            </div>

            <div className="bg-surface-cream border-t border-muted px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-widest cursor-pointer"
              >
                Cerrar
              </button>
              {selectedCourse.url && (
                <a
                  href={selectedCourse.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-primary/90 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Acceder a la Plataforma
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
