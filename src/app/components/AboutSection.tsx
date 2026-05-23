import { Award, GraduationCap, Globe, ShieldCheck } from 'lucide-react';
import { Language } from '../classes/types';
import { about_text as text } from '../lang/about_section';

interface AboutSectionProps {
  language: Language;
}

export default function AboutSection({ language }: AboutSectionProps) {
  const about_text = text[language];

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
          <span className="text-xs font-bold text-[#805252] uppercase tracking-[0.25em] block mb-2">{about_text.tag}</span>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight mb-4">{about_text.title}</h2>
          <h3 className="text-lg text-gray-700 font-sans font-medium mb-6 leading-relaxed border-l-2 border-[#805252]/40 pl-4">
            {about_text.subtitle}
          </h3>

          <div className="space-y-4 text-[#514443] leading-relaxed text-sm md:text-base">
            <p>{about_text.bio1}</p>
            <p>{about_text.bio2}</p>
          </div>

          {/* Grid of badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-rose-50 rounded-lg flex items-center justify-center text-[#805252]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{about_text.boxATitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{about_text.boxADesc}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-amber-50 rounded-lg flex items-center justify-center text-amber-800">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{about_text.boxBTitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{about_text.boxBDesc}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-[#D2E7D6] rounded-lg flex items-center justify-center text-[#324536]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{about_text.boxCTitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{about_text.boxCDesc}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#eae8e4]">
              <div className="w-10 h-10 shrink-0 bg-[#FFDFD2] rounded-lg flex items-center justify-center text-[#5C2B11]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{about_text.boxDTitle}</h4>
                <p className="text-[11px] text-[#514443] mt-0.5">{about_text.boxDDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
