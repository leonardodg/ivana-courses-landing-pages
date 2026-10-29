import { useMemo, useState } from 'react';

// Paginação por mês para as agendas: separa os eventos por mês (YYYY-MM) e permite voltar/avançar
// para o mês anterior/seguinte que tenha eventos. Se o filtro esvazia o mês escolhido, vai para o mais próximo.
export function useMonthPager<T extends { date: string }>(events: T[], today: string) {
  const [chosen, setChosen] = useState<string | null>(null);

  const months = useMemo(() => Array.from(new Set(events.map((e) => e.date.slice(0, 7)))).sort(), [events]);

  const current = useMemo(() => {
    if (months.length === 0) return null;
    if (chosen && months.includes(chosen)) return chosen;
    const ref = chosen ?? today.slice(0, 7);
    return months.find((m) => m >= ref) ?? months[months.length - 1];
  }, [months, chosen, today]);

  const index = current ? months.indexOf(current) : -1;
  const items = useMemo(() => (current ? events.filter((e) => e.date.startsWith(current)) : []), [events, current]);

  return {
    month: current, // "2026-11"
    items,
    prev: index > 0 ? () => setChosen(months[index - 1]) : undefined,
    next: index >= 0 && index < months.length - 1 ? () => setChosen(months[index + 1]) : undefined,
  };
}

/** "2026-11" → "novembro de 2026" (no idioma pedido). */
export function monthTitle(month: string, locale: string): string {
  return new Date(`${month}-15T12:00:00Z`).toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
