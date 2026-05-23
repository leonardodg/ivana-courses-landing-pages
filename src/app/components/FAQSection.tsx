import { useState } from 'react';
import { FAQItem, Language } from '../classes/types';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs_text as text } from '../lang/faqs_section';

interface FAQSectionProps {
  language: Language;
  faqs: FAQItem[];
}

export default function FAQSection({ language, faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs_text = text[language];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <HelpCircle className="w-8 h-8 mx-auto text-primary mb-3" />
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight">
            {faqs_text.title}
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl mx-auto">
            {faqs_text.subtitle}
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div
                key={f.id}
                className="bg-surface-hero rounded-xl overflow-hidden border border-muted transition-all"
              >
                <button
                  onClick={() => toggleFaq(f.id)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-serif font-bold text-gray-950 text-sm md:text-base cursor-pointer hover:bg-surface-hero/70 transition-colors"
                >
                  <span>{f.question[language]}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-muted/60 pt-4 animate-fade-in bg-white">
                    {f.answer[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
