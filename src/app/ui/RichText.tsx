// Texto com destaque: "Velas aromáticas, com *moldes e wax melts*" → o trecho entre asteriscos vira
// itálico Rosé Profundo (assinatura da marca nos títulos).
import type { ReactNode } from 'react';

export const emphasis = (text: string): ReactNode[] =>
  text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <em key={i} className="italic text-primary">{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
