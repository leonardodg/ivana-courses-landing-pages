import { Award, GraduationCap, Globe, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface AboutSectionProps {
  language: Language;
}

export default function AboutSection({ language }: AboutSectionProps) {
  const t = {
    pt: {
      tag: 'A Especialista por Trás das Artes',
      title: 'Ivana Lerea',
      subtitle: 'Artesã reconhecida, Empreendedora e Mentora de mais de 2.000 alunas.',
      bio1: 'Há mais de 6 anos, Ivana Lerea vem transformando a vida de mulheres empreendedoras na América Latina através do ensino profissionalizante de artes manuais. Especialista bilingue certificado, ela realiza workshops práticos e imersões presenciais que já passaram por cidades como Florianópolis (sua base principal), Curitiba, Rio de Janeiro e províncias na Argentina.',
      bio2: 'Seu grande diferencial é ir muito além da técnica de produção das ceras, saboarias e resinas: Ivana prepara suas alunas profissionalmente com ferramentas de marketing, curadoria de marca e contato direto de importadores oficiais. Isso garante que a aluna saia do curso pronta para estruturar sua empresa, captar clientes e lucrar de imediato.',
      boxATitle: 'Formação com Certificado',
      boxADesc: 'Iniciações que garantem validação e prestígio internacional.',
      boxBTitle: 'Cursos Bilíngues',
      boxBDesc: 'Metodologia clara ensinada em Português e Espanhol.',
      boxCTitle: 'Mais de 2.000 Alunas',
      boxCDesc: 'Uma vibrante comunidade compartilhando criações diariamente.',
      boxDTitle: 'Pronto para o Negócio',
      boxDDesc: 'Aprenda a precificar, embalar e conquistar clientes locais de imediato.',
    },
    es: {
      tag: 'La Especialista Detrás de las Artes',
      title: 'Ivana Lerea',
      subtitle: 'Artesana calificada, Emprendedora y Mentora de más de 2,000 alumnas.',
      bio1: 'Desde hace más de 6 años, Ivana Lerea transforma la vida de mujeres creativas en América Latina a través del desarrollo y perfeccionamiento técnico de artes manuales premium. Especialista bilingüe con validez internacional, dicta workshops inmersivos continuos en Florianópolis (su sede central), Curitiba, Río de Janeiro y múltiples ciudades en la República Argentina.',
      bio2: 'Su verdadero diferencial diferencial radica en que, además de enseñarte la alquimia detrás de fragancias, jabones o moldes de resina, te prepara profesionalmente para el mercado real. Aprenderás a definir tu marca, conseguir clientes y estructurar tu rentabilidad para comercializar tus colecciones de inmediato de forma rentable.',
      boxATitle: 'Certificación Internacional',
      boxADesc: 'Títulos oficiales avalados que respaldan tus talleres ante clientes.',
      boxBTitle: 'Cursos Bilingües',
      boxBDesc: 'Metodología amigable dictada perfectamente en Español y Portugués.',
      boxCTitle: 'Comunidad +2000 Alumnas',
      boxCDesc: 'Una red activa en constante crecimiento compartiendo éxitos.',
      boxDTitle: 'Foco en Negocios',
      boxDDesc: 'Aprende a calcular costos, diseñar empaques de lujo y ganar dinero rápido.',
    }
  }[language];

  return (
    <section id="sobre" className="py-16 md:py-24 bg-white border-y border-[#e1deda] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Photo Column */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[3/4] max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-lg border border-[#e5e1db] relative z-10 bg-[#FAF6F0]">
            <img
              alt="Ivana Lerea - Mentora"
              className="w-full h-full object-cover select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpcPZQg6dT0JFv_K5x3xi_r78DtbLTYarPxDKlwuOMEmLTzK2gxoJE5Hh8snL8pK5Q3a_6gmi0iqj9s8wMjB5J1hzE-DFiaPCI4hlCI-NZ-7EswoIlB7W-bQANk8DHiszlIxnY6YeuoW6iXAY3qyBWqn_HsxRbTLyqgB5V4ODehOyusTDucCbCuY3yp2z2nPuUdf-XYfIHoSS9GS4EQaXyqdEFGIDyuTw0vxBpb6x8w_TP3hKYDDwVYGNTLDuB4prJ8T9khdfYHqN3"
            />
            {/* Elegant Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#d9a1a0] font-semibold">Ivana Lerea</span>
              <p className="text-xs text-white/90 mt-1 font-serif italic">"A arte é o transbordo da nossa melhor energia moldada à mão."</p>
            </div>
          </div>
          {/* Subtle Backdrops to simulate paper layered effect */}
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#d9a1a0]/15 -z-0 rounded-2xl" />
          <div className="absolute -top-6 -right-6 w-36 h-36 bg-[#E6B980]/15 -z-0 rounded-full" />
        </div>

        {/* Right Side: Narrative */}
        <div className="lg:col-span-7">
          <span className="text-xs font-bold text-[#805252] uppercase tracking-[0.25em] block mb-2">{t.tag}</span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight mb-4">{t.title}</h2>
          <h3 className="text-lg text-gray-700 font-sans font-medium mb-6 leading-relaxed border-l-2 border-[#805252]/40 pl-4">
            {t.subtitle}
          </h3>

          <div className="space-y-4 text-[#514443] leading-relaxed text-sm md:text-base">
            <p>{t.bio1}</p>
            <p>{t.bio2}</p>
          </div>

          {/* Grid of badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-rose-50 rounded-lg flex items-center justify-center text-[#805252]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{t.boxATitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{t.boxADesc}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-amber-50 rounded-lg flex items-center justify-center text-amber-800">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{t.boxBTitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{t.boxBDesc}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-[#D2E7D6] rounded-lg flex items-center justify-center text-[#324536]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{t.boxCTitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{t.boxCDesc}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-[#FFDFD2] rounded-lg flex items-center justify-center text-[#5C2B11]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{t.boxDTitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{t.boxDDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
