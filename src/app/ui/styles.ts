// Classes compartilhadas: ÚNICA fonte dos estilos de botão e selo das páginas (pt_BR e es_ar).
// Mudou o visual de um botão? Edite aqui e todas as páginas acompanham. Ver docs/GUIA-DE-ESTILO.md.

/** Botão de card e de lista (retangular). */
export const btnPrimary =
  'flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer min-h-11';

/** Botão de card e de lista, secundário (contorno). */
export const btnOutline =
  'flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer min-h-11';

/** Botão principal do herói e do contato (pílula). */
export const heroPrimary =
  'bg-primary hover:bg-opacity-95 text-white font-semibold font-mono text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer min-h-11';

/** Botão secundário do herói (pílula com contorno suave). */
export const heroSecondary =
  'inline-flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary border border-subtle bg-white/80 hover:bg-white text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full transition-all min-h-11';

/** Link de texto sublinhado, com alvo de toque de 44 px. */
export const textLink = 'inline-flex min-h-11 items-center text-xs text-primary underline';

/** Selo (pílula) do herói. */
export const heroBadge =
  'inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-subtle px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm';
export const heroBadgeText = 'text-micro uppercase font-mono tracking-widest text-primary';

/** Pílula-etiqueta sobre a imagem dos cards. */
export const cardTag =
  'absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-micro font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm';
