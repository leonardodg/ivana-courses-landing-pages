// Cartão-link grande (escolha de país, atalhos): ícone/bandeira, título, texto e chamada.
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export default function LinkCard({
  href,
  icon,
  title,
  text,
  cta,
  lang,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
  cta: string;
  lang?: string; // idioma do destino (hrefLang)
}) {
  return (
    <a
      href={href}
      hrefLang={lang}
      className="group bg-white rounded-2xl border border-muted shadow-sm hover:shadow-md transition-all p-8 flex flex-col gap-3 h-full"
    >
      <span className="text-3xl">{icon}</span>
      <h2 className="text-2xl font-serif text-gray-900 leading-snug">{title}</h2>
      <p className="text-sm text-on-surface-variant leading-relaxed grow">{text}</p>
      <span className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-primary">
        {cta} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </a>
  );
}
