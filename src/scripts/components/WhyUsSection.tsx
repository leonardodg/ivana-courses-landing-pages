import { Award, CheckCircle, Flame, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface WhyUsSectionProps {
  language: Language;
}

export default function WhyUsSection({ language }: WhyUsSectionProps) {
  const t = {
    pt: {
      headline: 'A Diferença Ivana Academy',
      subtitle: 'Por que milhares de alunas escolhem nossa formação para dar o salto profissional?',
      point1Title: '6+ Anos de Especialização',
      point1Desc: 'Não somos meros reprodutores de fórmulas. Estudamos a química das ceras vegetais, pavios, saponificação fria e fixação de aromas de alto padrão.',
      point2Title: 'Diploma Internacional Homologado',
      point2Desc: 'Garanta autoridade técnica no seu ateliê. Oferecemos duplo certificado de validade internacional em parcerias oficiais como o Conservatório Grassi na Argentina.',
      point3Title: 'Formação em Negócios Inclusa',
      point3Desc: 'Mais do que ensinar receitas, te capacitamos a extrair custos corretos, definir embalagens desejáveis, lidar com revendedores e criar canais e estratégias de venda rápidas.',
      point4Title: 'Mentoria Vitalícia por WhatsApp',
      point4Desc: 'Não se sinta desamparada após o término. Ivana responde pessoalmente suas dúvidas de produção, cristalização ou problemas com fornadas direto no WhatsApp.',
    },
    es: {
      headline: 'La Diferencia de Ivana Academy',
      subtitle: '¿Por qué miles de alumnas eligen nuestra formación para dar el gran salto profesional?',
      point1Title: '6+ Años de Especialización',
      point1Desc: 'No copiamos recetas de internet. Estudiamos las bases químicas de ceras vegetales, pabilos, saponificación botánica y fijadores aromáticos de nivel boutique.',
      point2Title: 'Título Oficial de Prestigio',
      point2Desc: 'Construye credibilidad real. Ofrecemos certificación con reconocimiento internacional directo de convenios académicos como el ilustre Conservatorio Grassi.',
      point3Title: 'Formación para Negocios',
      point3Desc: 'Entendemos el mercado. Aprenderás finanzas, diseño de empaques atractivos, estrategias para revendedores y marketing digital enfocado en ventas rápidas.',
      point4Title: 'Mentoria VIP por WhatsApp',
      point4Desc: 'Nunca estarás sola. Resuelve cualquier duda de mezclado, cristalización de ceras o control olfativo mediante notas de audio directas con la profesora.',
    }
  }[language];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
            {t.headline}
          </h2>
          <p className="text-sm md:text-base text-[#514443] mt-3 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Bento Board of Qualities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-[#ffdad9] text-[#805252] rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{t.point1Title}</h3>
              <p className="text-xs md:text-sm text-[#514443] leading-relaxed">{t.point1Desc}</p>
            </div>
          </div>

          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{t.point2Title}</h3>
              <p className="text-xs md:text-sm text-[#514443] leading-relaxed">{t.point2Desc}</p>
            </div>
          </div>

          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-[#D2E7D6] text-[#324536] rounded-xl flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{t.point3Title}</h3>
              <p className="text-xs md:text-sm text-[#514443] leading-relaxed">{t.point3Desc}</p>
            </div>
          </div>

          <div className="brand-bento md:p-8">
            <div className="w-12 h-12 bg-[#FFDFD2] text-[#5C2B11] rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-950 mb-2">{t.point4Title}</h3>
              <p className="text-xs md:text-sm text-[#514443] leading-relaxed">{t.point4Desc}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
