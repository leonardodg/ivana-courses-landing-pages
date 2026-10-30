// Bloco de informação: o formato único para qualquer informação em cartões (diferenciais, passos, "incluso",
// módulos, "o que você aprende", "para quem é"). Visual da "A Diferença Ivana Academy": cartão em tom pedra,
// quadrado de ícone colorido, título em serifa e texto de apoio.
// Três disposições, SEMPRE com o mesmo cartão, cores, ícones e tamanhos:
//   • side    → ícone à esquerda, texto à direita (2 colunas)        — diferenciais, incluso com descrição, módulos
//   • stack   → ícone em cima, texto embaixo (3 ou 4 colunas)        — passos, "como funciona", grupos
//   • compact → ícone pequeno e uma linha de texto (2 colunas)       — listas curtas: aprende, para quem é, incluso
import type { ComponentType } from 'react';

export type InfoTint = 'rose' | 'gold';

export interface InfoBlockItem {
  icon?: ComponentType<{ className?: string }>;
  tile?: string; // texto dentro do quadrado (ex.: número do módulo), no lugar do ícone
  tint?: InfoTint;
  kicker?: string; // linha pequena acima do título (ex.: "MÓDULO 1")
  title?: string;
  text?: string;
  list?: string[]; // lista numerada (aulas do módulo)
  href?: string; // cartão inteiro vira link (o título é o link, esticado sobre o cartão)
}

const tint: Record<InfoTint, string> = {
  rose: 'bg-velas-accent text-primary',
  gold: 'bg-amber-100 text-amber-800',
};

const cols = {
  2: 'md:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

export default function InfoBlocks({
  items,
  layout = 'side',
  columns,
  tone = 'stone',
  numbered = false,
}: {
  items: InfoBlockItem[];
  layout?: 'side' | 'stack' | 'compact';
  columns?: 2 | 3 | 4;
  tone?: 'stone' | 'white'; // cor do cartão: pedra em seção branca, branco em seção creme
  numbered?: boolean; // stack: mostra o número do passo
}) {
  const card = tone === 'stone' ? 'bg-surface-container-low border-surface-container-high' : 'bg-white border-muted';
  const grid = layout === 'compact' ? 'grid-cols-1 sm:grid-cols-2 gap-4' : `grid-cols-1 gap-6 md:gap-8 ${cols[columns ?? (layout === 'stack' ? 4 : 2)]}`;
  const List = numbered ? 'ol' : 'ul';

  return (
    <List className={`grid ${grid}`}>
      {items.map((it, i) => {
        const Icon = it.icon;
        const small = layout === 'compact';
        const link = it.href ? 'relative hover:shadow-md hover:border-primary/40 transition-all' : '';
        const stretch = 'after:absolute after:inset-0 after:content-[""] focus-visible:outline-2 focus-visible:outline-tertiary';
        const label = (t?: string) => (it.href && t ? <a href={it.href} className={stretch}>{t}</a> : t);
        const tileBox = (Icon || it.tile) && (
          <span
            className={`${tint[it.tint ?? 'rose']} flex items-center justify-center shrink-0 ${
              small ? 'w-9 h-9 rounded-lg' : 'w-12 h-12 rounded-xl'
            } ${it.tile ? 'font-serif text-xl font-bold' : ''}`}
            aria-hidden
          >
            {it.tile ?? (Icon && <Icon className={small ? 'w-4 h-4' : 'w-6 h-6'} />)}
          </span>
        );
        const body = (
          <div className="min-w-0">
            {it.kicker && <span className="block text-micro font-mono font-bold tracking-widest text-primary uppercase mb-1.5">{it.kicker}</span>}
            {it.title && <h3 className="text-lg font-serif font-bold text-gray-950 mb-2 leading-snug">{label(it.title)}</h3>}
            {it.text && <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{it.text}</p>}
            {it.list && (
              <ol className="mt-3 list-decimal pl-5 space-y-1 text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {it.list.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            )}
          </div>
        );

        if (small) {
          return (
            <li key={it.text ?? it.title} className={`${card} ${link} rounded-xl border p-4 flex items-center gap-3 text-sm text-gray-900`}>
              {tileBox}
              <span>{label(it.title ?? it.text)}</span>
            </li>
          );
        }
        if (layout === 'stack') {
          return (
            <li key={it.title ?? i} className={`${card} ${link} rounded-2xl border p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                {tileBox}
                {numbered && <span className="font-mono text-xs font-bold text-primary/70">{String(i + 1).padStart(2, '0')}</span>}
              </div>
              {body}
            </li>
          );
        }
        return (
          <li key={it.title ?? i} className={`${card} ${link} rounded-2xl border p-6 md:p-8 flex items-start gap-4`}>
            {tileBox}
            {body}
          </li>
        );
      })}
    </List>
  );
}
