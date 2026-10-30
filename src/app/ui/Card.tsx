// CARD ÚNICO de curso/carreira (presencial, online e carreras; home, página de tema e página de carreira).
// Estrutura fixa, de cima para baixo: foto 16/10 + etiqueta · título · benefícios · metadados · TURMAS ·
// preço · botão principal · "Ver grade" (modal) · link de detalhes. O que muda de um curso para outro é só o
// conteúdo (props); o desenho e a ordem são sempre estes. Altura igual na linha (h-full).
// Duas versões (como o EventCard da agenda): COMPLETO (foto grande, 2 colunas) e LISTA (uma linha por curso:
// miniatura, título, resumo e botão, com seta para expandir). A grade (CardGrid) escolhe a versão: automática
// pelo tamanho da tela (celular = lista) e com seletor para a pessoa trocar.
import { createContext, useContext, useState, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { btnOutline, cardTag } from './styles';
import GradeModal, { type GradeContent } from './GradeModal';
import { type Density } from './DensityToggle';
import CardToolbar from './CardToolbar';
import type { SegmentFilterProps } from './SegmentFilter';
import { useDensity } from '../hooks/useDensity';
import { usePageLanguage } from '../lib/lang';

const DensityContext = createContext<Density>('full');

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
  const density = useContext(DensityContext);
  const max = turmas?.max ?? 3;
  const shown = turmas?.items.slice(0, max) ?? [];
  const rest = (turmas?.items.length ?? 0) - shown.length;
  const es = usePageLanguage() === 'es';
  const [details_open, setDetailsOpen] = useState(false);

  const bulletsEl = bullets.length > 0 && (
    <ul className="space-y-2 mb-5">
      {bullets.map((b) => (
        <li key={b} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          {b}
        </li>
      ))}
    </ul>
  );

  const metaEl = meta && (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-5 border-t border-muted pt-4">{meta}</div>
  );

  const turmasEl = turmas && (
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
                + {rest} {turmas.moreLabel ?? (es ? 'grupos' : 'turmas')}
              </a>
            </li>
          )}
        </ul>
      ) : (
        turmas.emptyText && <p className="text-xs text-on-surface-variant italic">{turmas.emptyText}</p>
      )}
    </div>
  );

  const priceEl = price && (
    <div className="font-serif text-2xl text-gray-900">
      {price.main}
      <span className="text-xs font-sans text-on-surface-variant ml-2">{price.sub}</span>
    </div>
  );
  const gradeBtn = grade && (
    <button type="button" onClick={() => setOpen(true)} className={`${btnOutline} w-full`}>
      {grade.label}
    </button>
  );
  const detailsEl = details && (
    <a href={details.href} className="flex min-h-11 items-center justify-center text-xs text-primary underline">
      {details.label}
    </a>
  );
  const modal = open && grade && <GradeModal content={grade.content} closeLabel={grade.closeLabel} onClose={() => setOpen(false)} />;

  // ── Versão LISTA ──────────────────────────────────────────────────────────
  if (density === 'compact') {
    const next = turmas?.items[0];
    const summary = [price?.main, next ? `${next.day} ${next.month} · ${next.label}` : turmas?.emptyText].filter(Boolean).join(' · ');
    return (
      <article id={id} className="scroll-mt-24 bg-white rounded-2xl shadow-sm border border-muted overflow-hidden">
        <div className="p-3 md:p-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-surface-hero self-start">
            {titleHref && <a href={titleHref} aria-label={title} className="absolute inset-0 z-10" />}
            <img
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
              style={imagePos ? { objectPosition: imagePos } : undefined}
              className="w-full h-full object-cover select-none"
            />
          </div>
          <div className="min-w-0 grow basis-0 order-1">
            <span className="block text-micro font-mono font-bold uppercase tracking-wider text-primary mb-0.5">{tag}</span>
            <h3 className="font-serif text-lg leading-snug text-gray-900">{titleHref ? <a href={titleHref}>{title}</a> : title}</h3>
            {srText && <p className="sr-only">{srText}</p>}
            {summary && <p className="text-xs text-on-surface-variant mt-0.5">{summary}</p>}
          </div>
          {/* celular: botão embaixo, na largura toda; tela maior: botão à direita do texto */}
          {!details_open && <div className="order-3 basis-full sm:basis-auto sm:order-2 sm:min-w-[13rem]">{cta}</div>}
          <button
            type="button"
            onClick={() => setDetailsOpen(!details_open)}
            aria-expanded={details_open}
            aria-label={`${details_open ? (es ? 'Ver menos detalles' : 'Ver menos detalhes') : es ? 'Ver más detalles' : 'Ver mais detalhes'}: ${title}`}
            className="order-2 sm:order-3 shrink-0 self-start sm:self-center inline-flex items-center justify-center w-11 h-11 rounded-full border border-subtle text-primary hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${details_open ? 'rotate-180' : ''}`} aria-hidden />
          </button>
        </div>
        {details_open && (
          <div className="border-t border-muted p-4 md:p-6 grid gap-x-8 md:grid-cols-2">
            <div>
              {bulletsEl}
              {metaEl}
            </div>
            <div className="flex flex-col">
              {turmasEl}
              <div className="mt-auto space-y-3">
                {priceEl}
                {cta}
                {gradeBtn}
                {detailsEl}
              </div>
            </div>
          </div>
        )}
        {modal}
      </article>
    );
  }

  // ── Versão COMPLETA ───────────────────────────────────────────────────────
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
        {bulletsEl}
        {metaEl}
        {turmasEl}
        <div className="mt-auto space-y-3">
          {priceEl}
          {cta}
          {gradeBtn}
          {detailsEl}
        </div>
      </div>

      {modal}
    </article>
  );
}

/** Classe da grade padrão (também usada na home, sem a regra de largura). */
export const cardGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10';

/**
 * Grade padrão: no formato completo, SEMPRE 2 colunas (gap-8 lg:gap-10), nunca 3; com um card só, ele fica
 * centralizado e com a mesma largura de uma coluna. No formato lista, uma coluna.
 * `toggle`: mostra a barra com o seletor Completo | Lista (a escolha vale para todas as grades da página).
 * `filter`: acrescenta o filtro por segmento na mesma barra (páginas com cards de vários segmentos).
 */
export function CardGrid({ count, children, toggle = true, filter }: { count: number; children: ReactNode; toggle?: boolean; filter?: SegmentFilterProps }) {
  const { density } = useDensity();
  const compact = density === 'compact';
  const single = count === 1 && !compact ? ' md:*:col-span-2 md:*:justify-self-center md:*:w-[calc(50%-1rem)] lg:*:w-[calc(50%-1.25rem)]' : '';
  const showDensity = toggle && count > 1;
  return (
    <DensityContext.Provider value={density}>
      {(filter || showDensity) && <CardToolbar filter={filter} density={showDensity} />}
      <div className={`${compact ? 'grid grid-cols-1 gap-4' : cardGridClass} mx-auto${single}`}>{children}</div>
    </DensityContext.Provider>
  );
}
