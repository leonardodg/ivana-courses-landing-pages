// Navegação de mês da agenda, estilo calendário: seta para voltar, mês e ano, seta para avançar.
// As setas se desativam quando não há eventos em meses anteriores ou posteriores.
import { ChevronLeft, ChevronRight } from 'lucide-react';

const arrow =
  'inline-flex items-center justify-center w-11 h-11 rounded-full border border-subtle bg-white text-primary hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary disabled:hover:border-subtle';

export default function MonthNav({
  label,
  count,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  label: string; // "Novembro de 2026"
  count?: string; // "3 eventos"
  onPrev?: () => void; // undefined = não há mês anterior
  onNext?: () => void;
  prevLabel: string; // texto para leitor de tela
  nextLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-muted shadow-sm px-3 py-2.5">
      <button type="button" onClick={onPrev} disabled={!onPrev} aria-label={prevLabel} className={arrow}>
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>
      <div className="text-center min-w-0" aria-live="polite" aria-atomic="true">
        <h2 className="font-serif text-xl md:text-2xl text-gray-900 leading-tight first-letter:uppercase">{label}</h2>
        {count && <p className="text-micro font-mono uppercase tracking-wider text-on-surface-variant mt-0.5">{count}</p>}
      </div>
      <button type="button" onClick={onNext} disabled={!onNext} aria-label={nextLabel} className={arrow}>
        <ChevronRight className="w-5 h-5" aria-hidden />
      </button>
    </div>
  );
}
