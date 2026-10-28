// Bloco final de contato (WhatsApp) das páginas de tema.
import type { ReactNode } from 'react';

export default function ContactCta({
  id,
  title,
  text,
  action,
  below,
  tone = 'cream',
}: {
  id?: string;
  title: string;
  text: string;
  action: { label: string; href: string };
  below?: ReactNode;
  tone?: 'cream' | 'white'; // alterna com o fundo da seção anterior (perguntas: branco)
}) {
  return (
    <section id={id} className={`py-16 ${tone === 'cream' ? 'bg-surface-cream' : 'bg-white'} border-t border-muted text-center px-6`}>
      <h2 className="text-2xl md:text-3xl font-serif text-gray-900">{title}</h2>
      <p className="text-sm text-on-surface-variant mt-2">{text}</p>
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-11 items-center gap-2 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider px-8 py-4 rounded-full"
      >
        {action.label}
      </a>
      {below}
    </section>
  );
}
