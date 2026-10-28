import { useState } from 'react';
import { FAQItem, Language } from '../classes/types';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs_text as text } from '../lang/faqs_section';
import { Section, SectionHeader } from '../ui';

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
    <Section bg="white" width="prose">
      <div>
        <SectionHeader title={faqs_text.title} sub={faqs_text.subtitle} />

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
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${f.id}`}
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
                  <div id={`faq-panel-${f.id}`} className="px-5 md:px-6 pb-6 text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-muted pt-4 animate-fade-in bg-white">
                    {f.answer[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </Section>
  );
}
