// Modal "Ver grade": foto, etiqueta, título, dados rápidos e blocos de conteúdo (lista ou texto).
// Único modal de detalhes dos cards (presencial, online e carreras). Fecha com Esc, botão ou clique fora.
// Vai para o <body> (portal), prende o foco enquanto aberto e devolve o foco ao botão que o abriu.
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckSquare, X } from 'lucide-react';

export interface GradeSection {
  title: string;
  items?: string[];
  text?: string;
}

export interface GradeContent {
  image: string;
  imagePos?: string;
  tag: string;
  title: string;
  intro?: string;
  facts?: { label: string; value: string }[]; // ex.: Duração, Valor, Modalidade
  sections: GradeSection[];
  action?: ReactNode; // botão principal (o mesmo do card)
}

export default function GradeModal({
  content,
  onClose,
  closeLabel,
}: {
  content: GradeContent;
  onClose: () => void;
  closeLabel: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose; // o efeito abaixo roda uma vez só, mesmo que o pai recrie onClose a cada render
  const titleId = useId();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onCloseRef.current();
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onCloseRef.current()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-2xl w-full max-w-[620px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 animate-slide-up"
      >
        <div className="relative aspect-[16/7] shrink-0 bg-surface-cream">
          <img
            src={content.image}
            alt=""
            style={content.imagePos ? { objectPosition: content.imagePos } : undefined}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <div className="absolute bottom-5 left-6 right-14 text-white">
            <span className="text-micro uppercase font-mono tracking-widest text-inverse-primary font-bold">{content.tag}</span>
            <h3 id={titleId} className="text-xl md:text-2xl font-serif font-semibold mt-1 leading-tight">{content.title}</h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute top-3 right-3 min-h-11 min-w-11 inline-flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-5 overflow-y-auto">
          {content.intro && <p className="text-sm text-on-surface-variant leading-relaxed">{content.intro}</p>}

          {content.facts && content.facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-4 text-xs border-y border-muted py-4">
              {content.facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-bold text-gray-800 text-micro uppercase font-mono">{f.label}</dt>
                  <dd className="text-on-surface-variant mt-0.5">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {content.sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-xs uppercase tracking-wider text-gray-600 font-mono">{s.title}</h4>
              {s.text && <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{s.text}</p>}
              {s.items && (
                <ul className="space-y-2.5 mt-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="bg-surface-hero px-6 py-4 border-t border-muted flex items-center justify-between gap-4 shrink-0">
          <button type="button" onClick={onClose} className="min-h-11 text-xs font-bold text-gray-600 hover:text-gray-800 uppercase tracking-widest cursor-pointer px-4">
            {closeLabel}
          </button>
          {content.action}
        </div>
      </div>
    </div>,
    document.body,
  );
}
