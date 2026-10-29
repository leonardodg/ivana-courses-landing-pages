import { Award, CheckCircle, HeartHandshake, Sparkles } from 'lucide-react';
import { Language } from '../classes/types';
import { InfoBlocks, Section, SectionHeader } from '../ui';
import { why_section_text as text } from '../lang/why_section';

interface WhyUsSectionProps {
  language: Language;
}

export default function WhyUsSection({ language }: WhyUsSectionProps) {
  const why_section_text = text[language];

  return (
    <Section bg="white" width="wide">
      <SectionHeader title={why_section_text.headline} sub={why_section_text.subtitle} />

      <InfoBlocks
        tone="stone"
        items={[
          { icon: Award, tint: 'rose', title: why_section_text.point1Title, text: why_section_text.point1Desc },
          { icon: Sparkles, tint: 'gold', title: why_section_text.point2Title, text: why_section_text.point2Desc },
          { icon: HeartHandshake, tint: 'rose', title: why_section_text.point3Title, text: why_section_text.point3Desc },
          { icon: CheckCircle, tint: 'rose', title: why_section_text.point4Title, text: why_section_text.point4Desc },
        ]}
      />
    </Section>
  );
}
