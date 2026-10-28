import { useState } from 'react';
import { Review, Language } from '../classes/types';
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { reviews_header as text } from '../lang/reviews';
import { Section, SectionHeader } from '../ui';

interface ReviewsCarouselProps {
  language: Language;
  reviews: Review[];
  note?: string; // aviso curto abaixo do carrossel (ex.: origem dos depoimentos)
}

export default function ReviewsCarousel({ language, reviews, note }: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const r = reviews[index];

  const reviews_text = text[language];

  return (
    <Section bg="hero" border="top" width="wide" className="relative overflow-hidden">
      {/* Decorative quotes background graphic */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200/40 select-none pointer-events-none pr-8">
        <MessageSquareQuote className="w-64 h-64 opacity-5 stroke-[0.3]" />
      </div>

      <div className="relative z-10">
        <SectionHeader kicker={reviews_text.badge} title={reviews_text.title} sub={reviews_text.subtitle} />

        {/* Carousel Container */}
        <div className="max-w-[750px] mx-auto bg-white rounded-2xl shadow-sm border border-muted p-8 md:p-12 relative">
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            
            {/* Student Photo */}
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 bg-surface-hero">
              <img loading="lazy" decoding="async"
                alt=""
                className="w-full h-full object-cover select-none"
                src={r.photoUrl}
              />
            </div>

            {/* Quote details */}
            <div className="grow space-y-2">
              {r.stars > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              )}

              {/* Student Quote text */}
              <blockquote className="text-sm md:text-base font-serif italic text-gray-800 leading-relaxed">
                &ldquo;{r.text[language]}&rdquo;
              </blockquote>

              {/* Meta */}
              <div className="pt-2 border-t border-gray-100 mt-4">
                <span className="font-bold text-gray-900 text-xs md:text-sm tracking-wide block">{r.name}</span>
                {r.location && <span className="text-xs text-gray-600 block">{r.location}</span>}
                {r.courseName[language] && (
                  <span className="text-micro font-mono tracking-wider font-bold text-primary uppercase bg-velas-accent/40 px-2 py-0.5 rounded inline-block mt-1">
                    {r.courseName[language]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Nav arrows overlay */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
            <div className="flex gap-1.5 text-xs text-gray-600 font-mono">
              <span className="font-bold text-primary">{index + 1}</span>
              <span>/</span>
              <span>{reviews.length}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-11 h-11 border border-gray-200 hover:border-gray-400 hover:text-gray-950 text-gray-600 flex items-center justify-center rounded-xl transition-all cursor-pointer bg-white"
                aria-label={language === "pt" ? "Depoimento anterior" : "Testimonio anterior"}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 border border-gray-200 hover:border-gray-400 hover:text-gray-950 text-gray-600 flex items-center justify-center rounded-xl transition-all cursor-pointer bg-white"
                aria-label={language === "pt" ? "Próximo depoimento" : "Siguiente testimonio"}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
      {note && <p className="relative z-10 text-center text-xs text-on-surface-variant mt-6">{note}</p>}
    </Section>
  );
}
