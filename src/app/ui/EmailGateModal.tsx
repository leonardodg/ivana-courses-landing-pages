// Modal "informe seu e-mail": portão do conteúdo gratuito. Tem a caixa de consentimento (LGPD) e devolve o e-mail
// já validado em onSubmit (que devolve uma mensagem de erro ou nada). Textos vêm por props (sem texto de página aqui).
import { useId, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import PrivacyConsent from '../components/PrivacyConsent';
import { useDialog } from '../hooks/useDialog';
import { btnPrimary } from './styles';
import type { Language } from '../classes/types';

export interface EmailGateText {
  title: string;
  text: string;
  email: string;
  submit: string;
  sending: string;
  close: string;
  invalid: string;
  invalidName?: string; // erro de nome/sobrenome (só com askName)
  firstName?: string; // rótulos dos campos de nome (só aparecem com askName)
  lastName?: string;
}

export interface EmailSentText {
  title: string;
  text: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailGateModal({
  text,
  language,
  onClose,
  onSubmit,
  sent,
  askName = false,
}: {
  text: EmailGateText;
  language: Language;
  onClose: () => void;
  onSubmit: (data: { email: string; firstName: string; lastName: string }) => Promise<string | null>;
  /** Pede nome e sobrenome (matrícula na plataforma). */
  askName?: boolean;
  /** Quando preenchido, troca o formulário pela confirmação "enviamos por e-mail". */
  sent?: EmailSentText | null;
}) {
  const dialogRef = useDialog(onClose);
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (value.length > 254 || !EMAIL_RE.test(value)) {
      setError(text.invalid);
      inputRef.current?.focus();
      return;
    }
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (askName && (fn.length < 2 || ln.length < 2)) {
      setError(text.invalidName ?? text.invalid);
      return;
    }
    setError(null);
    setBusy(true);
    const msg = await onSubmit({ email: value, firstName: fn, lastName: ln });
    setBusy(false);
    if (msg) setError(msg);
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative bg-white rounded-2xl w-full max-w-[460px] shadow-2xl border border-gray-200 animate-slide-up p-6 md:p-8">
        <button type="button" onClick={onClose} aria-label={text.close} className="absolute top-3 right-3 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full text-gray-600 hover:bg-surface-cream cursor-pointer">
          <X className="w-4 h-4" />
        </button>
        <h3 id={titleId} className="text-xl md:text-2xl font-serif text-gray-900 leading-snug pr-8">{sent ? sent.title : text.title}</h3>
        <p className="text-sm text-on-surface-variant mt-2 mb-5" role={sent ? 'status' : undefined}>{sent ? sent.text : text.text}</p>
        {sent ? (
          <button type="button" onClick={onClose} className={`${btnPrimary} w-full`}>{text.close}</button>
        ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          {askName && (
            <div className="grid grid-cols-2 gap-3">
              {([[text.firstName, firstName, setFirstName, 'given-name'], [text.lastName, lastName, setLastName, 'family-name']] as const).map(([label, val, set, ac]) => (
                <div key={ac}>
                  <label htmlFor={`${titleId}-${ac}`} className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">{label}</label>
                  <input id={`${titleId}-${ac}`} type="text" autoComplete={ac} maxLength={60} value={val} onChange={(e) => set(e.target.value)} className="w-full min-h-11 rounded-lg border border-subtle bg-white px-4 text-sm focus-visible:border-primary" />
                </div>
              ))}
            </div>
          )}
          <div>
            <label htmlFor={`${titleId}-email`} className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">{text.email}</label>
            <input
              ref={inputRef}
              id={`${titleId}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus={!askName}
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${titleId}-err` : undefined}
              className="w-full min-h-11 rounded-lg border border-subtle bg-white px-4 text-sm focus-visible:border-primary"
            />
            {error && <p id={`${titleId}-err`} role="alert" className="text-xs text-error mt-1.5">{error}</p>}
          </div>
          <PrivacyConsent id={`${titleId}-consent`} checked={consent} onChange={setConsent} language={language} />
          <button type="submit" disabled={busy || !consent} className={`${btnPrimary} w-full disabled:opacity-60 disabled:cursor-not-allowed`}>
            {busy ? text.sending : text.submit}
          </button>
        </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
