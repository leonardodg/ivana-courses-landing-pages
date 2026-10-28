// CARD ÚNICO de curso/carreira (presencial, online e carreras; home, página de tema e página de carreira).
// Estrutura fixa, de cima para baixo: foto 16/10 + etiqueta · título · benefícios · metadados · TURMAS ·
// preço · botão principal · "Ver grade" (modal) · link de detalhes. O que muda de um curso para outro é só o
// conteúdo (props); o desenho e a ordem são sempre estes. Altura igual na linha (h-full).
import { useState, type ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { btnOutline, cardTag } from './styles';
import GradeModal, { type GradeContent } from './GradeModal';

export interface CardTurma {
  key: string;
  day: number | string;
  month: string; // "nov"
  label: string; // "9h · Florianópolis"
  href: string;
}

export interface CardProps {
  id?: string;
  image: string;
  alt: string;
  imagePos?: string;
  tag: ReactNode; // "Presencial", "Online", "100% online"
  title: string;
  titleHref?: string; // título e foto clicáveis (home)
  srText?: string; // texto só para leitor de tela
  bullets?: string[];
  meta?: ReactNode; // duração, nº de turmas…
  /** Lista de turmas (ou início de cohorte). Sem itens, mostra `emptyText`. */
  turmas?: { items: CardTurma[]; max?: number; moreLabel?: string; moreHref?: string; emptyText?: string };
  price?: { main: string; sub: string };
  cta: ReactNode; // botão principal já montado (loja, tienda, matrícula…)
  /** "Ver grade": só passe quando houver conteúdo programático; sem `grade`, o botão não aparece. */
  grade?: { label: string; closeLabel: string; content: GradeContent };
  details?: { label: string; href: string }; // link "Ver detalhes do curso"
}

export default function Card({
  id,
  image,
  alt,
  imagePos,
  tag,
  title,
  titleHref,
  srText,
  bullets = [],
  meta,
  turmas,
  price,
  cta,
  grade,
  details,
}: CardProps) {
  const [open, setOpen] = useState(false);
  const max = turmas?.max ?? 3;
  const shown = turmas?.items.slice(0, max) ?? [];
  const rest = (turmas?.items.length ?? 0) - shown.length;

  return (
    <article
      id={id}
      className="scroll-mt-24 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-muted overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-hero">
        {titleHref && <a href={titleHref} aria-label={title} className="absolute inset-0 z-10" />}
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={imagePos ? { objectPosition: imagePos } : undefined}
          className="w-full h-full object-cover select-none"
        />
        <span className={cardTag}>{tag}</span>
      </div>

      <div className="p-6 md:p-8 flex flex-col grow">
        <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug mb-4">
          {titleHref ? <a href={titleHref}>{title}</a> : title}
        </h3>
        {srText && <p className="sr-only">{srText}</p>}

        {bullets.length > 0 && (
          <ul className="space-y-2 mb-5">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {meta && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-5 border-t border-muted pt-4">
            {meta}
          </div>
        )}

        {turmas && (
          <div className="mb-5">
            {shown.length > 0 ? (
              <ul className="space-y-2">
                {shown.map((t) => (
                  <li key={t.key}>
                    <a
                      href={t.href}
                      className="flex items-center gap-3 rounded-lg border border-muted bg-surface-cream/60 hover:bg-surface-cream px-3 py-2 min-h-11 text-xs text-gray-900"
                    >
                      <span className="font-serif text-lg leading-none w-9 text-center">
                        {t.day}
                        <small className="block text-[9px] font-mono uppercase text-on-surface-variant">{t.month}</small>
                      </span>
                      <span className="grow">{t.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                    </a>
                  </li>
                ))}
                {rest > 0 && turmas.moreHref && (
                  <li>
                    <a href={turmas.moreHref} className="inline-flex min-h-11 items-center text-xs text-primary underline">
                      + {rest} {turmas.moreLabel ?? 'turmas'}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              turmas.emptyText && <p className="text-xs text-on-surface-variant italic">{turmas.emptyText}</p>
            )}
          </div>
        )}

        <div className="mt-auto space-y-3">
          {price && (
            <div className="font-serif text-2xl text-gray-900">
              {price.main}
              <span className="text-xs font-sans text-on-surface-variant ml-2">{price.sub}</span>
            </div>
          )}
          {cta}
          {grade && (
            <button type="button" onClick={() => setOpen(true)} className={`${btnOutline} w-full`}>
              {grade.label}
            </button>
          )}
          {details && (
            <a href={details.href} className="flex min-h-11 items-center justify-center text-xs text-primary underline">
              {details.label}
            </a>
          )}
        </div>
      </div>

      {open && grade && <GradeModal content={grade.content} closeLabel={grade.closeLabel} onClose={() => setOpen(false)} />}
    </article>
  );
}

/** Classe da grade padrão (também usada na home, sem a regra de largura). */
export const cardGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10';

/**
 * Grade padrão: SEMPRE 2 colunas (gap-8 lg:gap-10), nunca 3. Com um card só, ele fica centralizado e com a
 * mesma largura de uma coluna, igual aos cards das outras páginas.
 */
export function CardGrid({ count, children }: { count: number; children: ReactNode }) {
  const single = count === 1 ? ' md:*:col-span-2 md:*:justify-self-center md:*:w-[calc(50%-1rem)] lg:*:w-[calc(50%-1.25rem)]' : '';
  return <div className={`${cardGridClass} mx-auto${single}`}>{children}</div>;
}
