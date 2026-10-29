// Layout das páginas de agenda: duas colunas (título, ação e filtro fixos à esquerda; navegação de mês e eventos à direita).
// Brasil e Argentina usam este mesmo layout.
import type { ReactNode } from 'react';

export default function AgendaLayout({
  kicker,
  title,
  sub,
  aside,
  children,
}: {
  kicker: ReactNode;
  title: string;
  sub: string;
  aside?: ReactNode; // ação principal e filtro
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 md:px-16 pt-28 md:pt-32 pb-12 md:pb-20 grid gap-10 lg:grid-cols-12 lg:gap-16">
      <aside className="min-w-0 lg:col-span-4">
        <div className="space-y-5 lg:sticky lg:top-28">
          <p className="flex items-center gap-2 text-micro font-mono font-bold uppercase tracking-widest text-primary">{kicker}</p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight text-gray-900">{title}</h1>
          <p className="max-w-md text-base text-on-surface-variant leading-relaxed">{sub}</p>
          {aside}
        </div>
      </aside>
      <section className="min-w-0 space-y-6 lg:col-span-8" aria-live="polite">
        {children}
      </section>
    </div>
  );
}
