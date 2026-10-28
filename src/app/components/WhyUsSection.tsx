import { Award, CheckCircle, Flame, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';
import { Language } from '../classes/types';
import { Section, SectionHeader } from '../ui';
import { why_section_text as text } from '../lang/why_section';

interface WhyUsSectionProps {
  language: Language;
}

export default function WhyUsSection({ language }: WhyUsSectionProps) {
  const why_section_text = text[language];

  return (
    <Section bg="white" width="wide">
      <SectionHeader title={why_section_text.headline} sub={why_section_text.subtitle} />

        {/* Bento Board of Qualities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-velas-accent text-primary rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{why_section_text.point1Title}</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{why_section_text.point1Desc}</p>
            </div>
          </div>

          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{why_section_text.point2Title}</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{why_section_text.point2Desc}</p>
            </div>
          </div>

          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-saboaria-accent text-saboaria-accent rounded-xl flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{why_section_text.point3Title}</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{why_section_text.point3Desc}</p>
            </div>
          </div>

          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-macrame-accent text-macrame-accent rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{why_section_text.point4Title}</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{why_section_text.point4Desc}</p>
            </div>
          </div>

        </div>

    </Section>
  );
}
