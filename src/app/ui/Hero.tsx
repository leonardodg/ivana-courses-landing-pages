// Herói das páginas. Toda página com herói usa ESTE componente, sempre com:
//   • imagem de fundo translúcida que representa o conteúdo da página (`backdrop`, obrigatória);
//   • faixa de números em destaque logo abaixo (`stats`, ex.: alunas, anos, validação);
//   • opcionalmente, a foto emoldurada à direita (`photo`) e o selo de aval (`seal`, ex.: Conservatorio Grassi).
// Dois modos:
//   • FIXO     → uma única abertura (páginas de curso e de carrera): sem setas nem pontos.
//   • CARROSSEL → `slides` com 2+ aberturas (home do Brasil e home da Argentina): setas voltar/avançar e pontos;
//                 cada slide leva à página correspondente pelos próprios botões.
// Páginas sem herói (agenda, interesse, legais) simplesmente não o usam.
import { useState, type ComponentType, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroBadge, heroBadgeText, heroPrimary, heroSecondary } from './styles';
import StatsBar, { type Stat } from './StatsBar';

export interface HeroAction {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  external?: boolean;
}

export interface HeroSlide {
  id?: string;
  badge: ReactNode; // conteúdo do selo (bandeira/ícone + HeroBadgeText)
  title: ReactNode;
  text: ReactNode;
  primary: HeroAction;
  secondary?: HeroAction;
  photo?: { src: string; alt: string; position?: string };
  backdrop: { src: string; alt: string; gradientClass?: string; position?: string };
  seal?: { src: string; alt: string }; // logo de aval no canto da imagem de fundo; some se o arquivo não existir
  extra?: ReactNode; // bloco dentro da coluna de texto (ex.: preço)
}

interface HeroBase {
  stats: Stat[];
  /** Carrossel: slide mostrado (controlado pela página) e aviso de troca. Sem isso o herói controla sozinho. */
  slideId?: string;
  onSlideChange?: (id: string) => void;
  labels?: { prev: string; next: string; carousel: string; slide: string };
}

export type HeroProps = (HeroSlide & HeroBase & { slides?: undefined }) | ({ slides: HeroSlide[] } & HeroBase);

export const HeroBadgeText = ({ children }: { children: ReactNode }) => <span className={heroBadgeText}>{children}</span>;

const defaultLabels = { prev: 'Slide anterior', next: 'Próximo slide', carousel: 'Destaques', slide: 'Ir para o slide' };

const arrow =
  'inline-flex items-center justify-center w-11 h-11 rounded-full border border-subtle bg-white/90 backdrop-blur-md text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm cursor-pointer';

export default function Hero(props: HeroProps) {
  const slides: HeroSlide[] = props.slides ?? [props];
  const carousel = slides.length > 1;
  const labels = props.labels ?? defaultLabels;

  const [own, setOwn] = useState(0);
  const found = props.slideId ? slides.findIndex((s) => s.id === props.slideId) : -1;
  const index = found >= 0 ? found : Math.min(own, slides.length - 1);
  const go = (i: number) => {
    const next = (i + slides.length) % slides.length;
    setOwn(next);
    const id = slides[next].id;
    if (id) props.onSlideChange?.(id);
  };

  const s = slides[index];
  const ext = (a: HeroAction) => (a.external ? { target: '_blank', rel: 'noreferrer' } : {});
  const Title = 'h1'; // só o slide ativo existe no DOM: sempre um único h1
  const hasPhoto = !!s.photo;

  return (
    <>
      <section
        className={`relative flex items-end overflow-hidden bg-gradient-to-b ${s.backdrop.gradientClass ?? 'from-hero-bg via-hero-bg to-hero-bg'} ${
          hasPhoto || carousel ? 'min-h-[90vh] md:min-h-[85vh]' : 'min-h-[70vh]'
        }`}
        {...(carousel ? { 'aria-roledescription': 'carousel', 'aria-label': labels.carousel } : {})}
      >
        <div className="absolute inset-0 z-0" key={`bg-${index}`}>
          <img
            alt=""
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            className="w-full h-full object-cover opacity-85 select-none motion-safe:animate-fade-in"
            src={s.backdrop.src}
            style={s.backdrop.position ? { objectPosition: s.backdrop.position } : undefined}
          />
          <div className="absolute inset-0 hero-gradient bg-gradient-to-t from-hero-bg via-hero-bg/70 to-hero-bg/20" />
        </div>

        <div
          key={`slide-${index}`}
          {...(carousel ? { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${index + 1} / ${slides.length}` } : {})}
          className={`relative z-10 px-6 md:px-12 pt-24 md:pt-28 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center motion-safe:animate-fade-in ${
            carousel ? 'pb-24' : 'pb-12'
          }`}
        >
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className={heroBadge}>{s.badge}</div>
              {s.seal && (
                <img
                  src={s.seal.src}
                  alt={s.seal.alt}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  className="h-12 w-auto rounded-xl bg-primary border border-primary-container/40 shadow-md px-2.5 py-1.5"
                />
              )}
            </div>
            <Title className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-950 font-bold leading-tight tracking-tight">{s.title}</Title>
            <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed max-w-xl font-sans font-medium">{s.text}</p>
            <div className="pt-2 pb-4 flex flex-wrap gap-4 items-center">
              <a href={s.primary.href} {...ext(s.primary)} className={heroPrimary}>
                {s.primary.icon && <s.primary.icon className="w-3.5 h-3.5" />} {s.primary.label}
              </a>
              {s.secondary && (
                <a href={s.secondary.href} {...ext(s.secondary)} className={heroSecondary}>
                  {s.secondary.icon && <s.secondary.icon className="w-3.5 h-3.5" />} {s.secondary.label}
                </a>
              )}
            </div>
            {s.extra}
          </div>

          {s.photo && (
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/10 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
              <img
                src={s.photo.src}
                alt={s.photo.alt}
                fetchPriority="high"
                decoding="async"
                style={{ objectPosition: s.photo.position ?? 'center' }}
                className="relative z-10 w-full h-[320px] sm:h-[420px] md:h-[540px] rounded-xl shadow-xl border border-slate-200 object-cover"
              />
            </div>
          )}
        </div>

        {carousel && (
          <div className="absolute z-20 bottom-5 inset-x-0 flex items-center justify-center gap-3">
            <button type="button" onClick={() => go(index - 1)} aria-label={labels.prev} className={arrow}>
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            <div className="flex items-center gap-1" role="group" aria-label={labels.carousel}>
              {slides.map((sl, i) => (
                <button
                  key={sl.id ?? i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${labels.slide} ${i + 1}`}
                  aria-current={i === index}
                  className="inline-flex items-center justify-center min-w-11 h-11 cursor-pointer"
                >
                  <span className={`block h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-2 bg-primary/30'}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(index + 1)} aria-label={labels.next} className={arrow}>
              <ChevronRight className="w-5 h-5" aria-hidden />
            </button>
          </div>
        )}
      </section>
      <StatsBar items={props.stats} />
    </>
  );
}
