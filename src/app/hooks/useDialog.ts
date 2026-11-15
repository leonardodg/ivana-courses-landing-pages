// Comportamento comum dos modais: Esc fecha, Tab fica preso dentro, rolagem da página travada e o foco volta ao botão que abriu.
import { useEffect, useRef } from 'react';

export function useDialog(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, iframe, [tabindex]:not([tabindex="-1"])') ?? []);
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
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, []);
  return dialogRef;
}
