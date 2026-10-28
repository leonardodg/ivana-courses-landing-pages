// Card de curso/carreira: foto 16/10 + etiqueta + título + benefícios + metadados + rodapé (preço/botões).
// Único card do site: mesma largura, altura (h-full) e proporção em BR e AR.
import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cardTag } from './styles';

export default function Card({
  id,
  image,
  alt,
  imagePos,
  tag,
  href,
  title,
  srText,
  bullets,
  meta,
  extra,
  footer,
}: {
  id?: string;
  image: string;
  alt: string;
  imagePos?: string;
  tag: string; // "Presencial", "100% online"
  href?: string; // título e imagem clicáveis (home)
  title: string;
  srText?: string; // texto só para leitor de tela (ex.: subtítulo)
  bullets: string[];
  meta?: ReactNode; // linha de metadados (duração, nº de turmas…)
  extra?: ReactNode; // ex.: lista de turmas na home
  footer: ReactNode; // preço + botões
}) {
  return (
    <article
      id={id}
      className="scroll-mt-24 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-muted overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-hero">
        {href && <a href={href} aria-label={title} className="absolute inset-0 z-10" />}
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
          {href ? <a href={href}>{title}</a> : title}
        </h3>
        {srText && <p className="sr-only">{srText}</p>}
        <ul className="space-y-2 mb-5">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>
        {meta && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-5 border-t border-muted pt-4">
            {meta}
          </div>
        )}
        {extra}
        <div className="mt-auto">{footer}</div>
      </div>
    </article>
  );
}

/** Classe da grade padrão (também usada na home, sem a regra de largura). */
export const cardGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10';

/** Grade padrão: 2 colunas (gap-8 lg:gap-10); 1 card = max-w-md, 2 cards = max-w-4xl. Nunca 3 colunas. */
export function CardGrid({ count, children }: { count: number; children: ReactNode }) {
  const width = count === 1 ? 'max-w-md' : count === 2 ? 'max-w-4xl' : '';
  return <div className={`${cardGridClass} mx-auto ${width}`.trim()}>{children}</div>;
}
