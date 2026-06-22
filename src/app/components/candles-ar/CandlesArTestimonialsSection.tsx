// src/app/components/candles-ar/CandlesArTestimonialsSection.tsx
// Testemunhos em bento grid 3 colunas — estilo do protótipo AR.

import { Star } from 'lucide-react';

const testimonials = [
  {
    initials: 'MS',
    name:     'María Sol',
    role:     'Emprendedora, Mendoza',
    text:     'Cambió mi forma de ver el negocio. Antes hacía velas, hoy tengo una marca que se vende en boutiques de lujo de Buenos Aires.',
  },
  {
    initials: 'LR',
    name:     'Luciana R.',
    role:     'Alumna del Profesorado',
    text:     'La precisión técnica que Ivana exige no la encontré en ningún otro curso. Vale cada centavo de la inversión. Ya dicto mis propios talleres.',
  },
  {
    initials: 'AF',
    name:     'Andrea F.',
    role:     'Profesora Certificada',
    text:     'Gracias a Ivana pude certificar mis conocimientos y ahora doy clases en mi propio taller local en Córdoba.',
  },
];

export default function CandlesArTestimonialsSection() {
  return (
    <section className="bg-surface-container-low py-20 px-4">
      <div className="max-w-[1280px] mx-auto">

        <div className="text-center space-y-2 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-primary block">
            TESTIMONIOS REALES
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
            Lo que dicen nuestras alumnas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 md:p-8 rounded-2xl border border-muted space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-xs md:text-sm text-on-surface italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-muted">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
                  {t.initials}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-on-surface">{t.name}</h5>
                  <p className="text-[10px] text-on-surface-variant font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
