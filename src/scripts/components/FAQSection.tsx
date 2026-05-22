import { useState } from 'react';
import { FAQItem, Language } from '../types';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  language: Language;
  faqs: FAQItem[];
}

export default function FAQSection({ language, faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const t = {
    pt: {
      title: 'Perguntas Frequentes',
      subtitle: 'Tudo o que você precisa saber sobre as aulas, materiais e certificação.',
    },
    es: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Todo lo que necesitas saber antes de iniciar tus clases y talleres.',
    }
  }[language];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <HelpCircle className="w-8 h-8 mx-auto text-[#805252] mb-3" />
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight">
            {t.title}
          </h2>
          <p className="text-xs md:text-sm text-[#514443] mt-2 leading-relaxed max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div
                key={f.id}
                className="bg-[#FAF6F0] rounded-xl overflow-hidden border border-[#eae8e4] transition-all"
              >
                <button
                  onClick={() => toggleFaq(f.id)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-serif font-bold text-gray-950 text-sm md:text-base cursor-pointer hover:bg-[#FAF6F0]/70 transition-colors"
                >
                  <span>{f.question[language]}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#805252] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 text-xs md:text-sm text-[#514443] leading-relaxed border-t border-[#eae8e4]/60 pt-4 animate-fade-in bg-white">
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
