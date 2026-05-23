import { useState } from 'react';
import { Review, Language } from '../classes/types';
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { reviews_header as text } from '../lang/reviews';

interface ReviewsCarouselProps {
  language: Language;
  reviews: Review[];
}

export default function ReviewsCarousel({ language, reviews }: ReviewsCarouselProps) {
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
    <section className="py-16 md:py-24 bg-surface-hero border-t border-review relative overflow-hidden">
      {/* Decorative quotes background graphic */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200/40 select-none pointer-events-none pr-8">
        <MessageSquareQuote className="w-64 h-64 opacity-5 stroke-[0.3]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase bg-velas-accent px-3.5 py-1.5 rounded-full inline-block mb-3">
            Social Proof
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-on-surface leading-tight">
            {reviews_text.title}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            {reviews_text.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-[750px] mx-auto bg-white rounded-2xl shadow-sm border border-muted p-8 md:p-12 relative">
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            
            {/* Student Photo */}
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 bg-surface-hero">
              <img
                alt={r.name}
                className="w-full h-full object-cover select-none"
                src={r.photoUrl}
              />
            </div>

            {/* Quote details */}
            <div className="grow space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Student Quote text */}
              <blockquote className="text-sm md:text-base font-serif italic text-gray-800 leading-relaxed">
                &ldquo;{r.text[language]}&rdquo;
              </blockquote>

              {/* Meta */}
              <div className="pt-2 border-t border-gray-100 mt-4">
                <span className="font-bold text-gray-900 text-xs md:text-sm tracking-wide block">{r.name}</span>
                <span className="text-xs text-gray-500 block">{r.location}</span>
                <span className="text-micro font-mono tracking-wider font-bold text-primary uppercase bg-velas-accent/40 px-2 py-0.5 rounded inline-block mt-1">
                  {r.courseName[language]}
                </span>
              </div>
            </div>
          </div>

          {/* Nav arrows overlay */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
            <div className="flex gap-1.5 text-xs text-gray-400 font-mono">
              <span className="font-bold text-primary">{index + 1}</span>
              <span>/</span>
              <span>{reviews.length}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 border border-gray-200 hover:border-gray-400 hover:text-gray-950 text-gray-500 flex items-center justify-center rounded-xl transition-all cursor-pointer bg-white"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 border border-gray-200 hover:border-gray-400 hover:text-gray-950 text-gray-500 flex items-center justify-center rounded-xl transition-all cursor-pointer bg-white"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
