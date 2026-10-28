// Herói das páginas de tema (pt_BR e es_ar): selo, título, texto e DOIS botões em pílula.
// Três composições, todas a partir deste componente:
//   • photo           → dividido: texto + foto emoldurada (páginas da Argentina)
//   • photo+backdrop  → dividido sobre imagem de fundo (página de velas do Brasil)
//   • backdrop        → imagem de fundo em tela cheia, só texto (soap, aromas, resin do Brasil)
import type { ComponentType, ReactNode } from 'react';
import { heroBadge, heroBadgeText, heroPrimary, heroSecondary } from './styles';

export interface HeroAction {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  external?: boolean;
}

export const HeroBadgeText = ({ children }: { children: ReactNode }) => <span className={heroBadgeText}>{children}</span>;

export default function Hero({
  badge,
  title,
  text,
  primary,
  secondary,
  photo,
  backdrop,
  stats,
}: {
  badge: ReactNode; // conteúdo do selo (bandeira/ícone + HeroBadgeText)
  title: ReactNode;
  text: ReactNode;
  primary: HeroAction;
  secondary?: HeroAction;
  photo?: { src: string; alt: string; position?: string };
  backdrop?: { src: string; alt: string; gradientClass?: string; position?: string };
  stats?: ReactNode;
}) {
  const ext = (a: HeroAction) => (a.external ? { target: '_blank', rel: 'noreferrer' } : {});

  const copy = (
    <div className={photo ? 'space-y-4 md:space-y-6' : 'space-y-5'}>
      <div className={heroBadge}>{badge}</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-sans font-medium">{text}</p>
      <div className="pt-2 pb-4 flex flex-wrap gap-4 items-center">
        <a href={primary.href} {...ext(primary)} className={heroPrimary}>
          {primary.icon && <primary.icon className="w-3.5 h-3.5" />} {primary.label}
        </a>
        {secondary && (
          <a href={secondary.href} {...ext(secondary)} className={heroSecondary}>
            {secondary.icon && <secondary.icon className="w-3.5 h-3.5" />} {secondary.label}
          </a>
        )}
      </div>
      {stats}
    </div>
  );

  const frame = photo && (
    <div className="relative group">
      <div className="absolute -inset-4 bg-primary-container/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
      <img
        src={photo.src}
        alt={photo.alt}
        fetchPriority="high"
        decoding="async"
        style={{ objectPosition: photo.position ?? 'center' }}
        className="relative z-10 w-full h-[320px] sm:h-[420px] md:h-[540px] rounded-xl shadow-xl border border-slate-200 object-cover"
      />
    </div>
  );

  // Sem imagem de fundo: herói claro dividido
  if (!backdrop) {
    return (
      <section className="relative overflow-hidden bg-surface-cream pt-28 md:pt-32 pb-14 md:pb-20 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {copy}
          {frame}
        </div>
      </section>
    );
  }

  const full = !photo;
  return (
    <section
      className={`relative ${full ? 'min-h-[70vh] bg-hero-bg' : `min-h-[90vh] md:min-h-[85vh] bg-gradient-to-b ${backdrop.gradientClass ?? ''}`} flex items-end overflow-hidden`}
    >
      <div className="absolute inset-0 z-0">
        <img
          alt={backdrop.alt}
          className="w-full h-full object-cover opacity-85 select-none"
          src={backdrop.src}
          style={backdrop.position ? { objectPosition: backdrop.position } : undefined}
        />
        <div className="absolute inset-0 hero-gradient bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/20" />
      </div>
      <div
        className={
          full
            ? 'relative z-10 px-6 md:px-12 pt-28 pb-12 max-w-[1280px] mx-auto w-full'
            : 'relative z-10 px-6 md:px-12 pt-24 md:pt-28 pb-12 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'
        }
      >
        {copy}
        {frame}
      </div>
    </section>
  );
}
