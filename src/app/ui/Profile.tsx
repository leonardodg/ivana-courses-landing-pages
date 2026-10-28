// "Sua professora": foto à esquerda e texto à direita.
import type { ReactNode } from 'react';

export default function Profile({ img, kicker, title, text }: { img: { src: string; alt: string }; kicker: string; title: ReactNode; text: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      <div className="md:col-span-5 relative">
        <div className="absolute -inset-3 bg-primary-container/15 rounded-3xl rotate-1 pointer-events-none" />
        <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="relative w-full max-w-sm mx-auto aspect-[3/4] object-cover rounded-2xl shadow-md border border-muted" />
      </div>
      <div className="md:col-span-7 space-y-4">
        <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block">{kicker}</span>
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{title}</h2>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
