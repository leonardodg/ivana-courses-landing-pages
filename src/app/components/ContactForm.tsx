// src/app/components/ContactForm.tsx
import { useState, useEffect }               from 'react';
import { Send, MessageCircle, Clock }        from 'lucide-react';
import { Language, Course }                  from '../classes/types';
import { useContactForm, sanitize }          from '../hooks/useContactForm';
import { applyPhoneMask, DDI_OPTIONS }       from '../hooks/usePhoneMask';
import { submitContact }                     from '../hooks/useSubmitContact';
import type { SubmitStatus }                 from '../hooks/useSubmitContact';
import { contact_form_text as text }         from '../lang/contact_form';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactFormProps {
  language:   Language;
  coursePage: 'candles' | 'soap' | 'resins' | 'homepage';
  /** Curso clicado em "Garantir Minha Vaga" no CourseGrid — pre-preenche assunto/mensagem e rola a tela até aqui. */
  selectedCourse?: Course | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputStateClass(isTouched: boolean, error?: string): string {
  if (!isTouched) return '';
  if (error)      return 'border-error! shadow-none! ring-1 ring-error/40!';
  return                  'border-primary/60! shadow-none! ring-1 ring-primary/30!';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label:    string;
  required?: boolean;
  error?:   string;
  hint?:    string;
  children: React.ReactNode;
}

function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      {children}
      <div className="flex justify-between items-center mt-1 min-h-[16px]">
        {error
          ? <p className="text-xs text-error">{error}</p>
          : <span />}
        {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContactForm({ language, coursePage, selectedCourse }: ContactFormProps) {
  const t = text[language];
  const { form, errors, touched, setField, blurField, isValid } = useContactForm();
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus]     = useState<SubmitStatus>('idle');
  const [cooldown, setCooldown] = useState(0);

  // ── Pre-preenche assunto/mensagem e rola até o form quando um curso é selecionado externamente ──
  useEffect(() => {
    if (!selectedCourse) return;
    const title = selectedCourse.title[language];
    setField('subject', language === 'pt' ? `Interesse: ${title}` : `Interés: ${title}`);
    setField(
      'message',
      language === 'pt'
        ? `Gostaria de mais informações sobre o curso "${title}".`
        : `Me gustaría más información sobre el curso "${title}".`,
    );
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedCourse, language, setField]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot — bot preencheu, simula sucesso silenciosamente
    if (honeypot) { setStatus('success'); return; }

    setStatus('loading');

    const result = await submitContact({
      full_name:   sanitize(form.fullName, 150),
      email:       sanitize(form.email, 254).toLowerCase(),
      phone:       `${form.ddi} ${form.phone.replace(/\D/g, '')}`,
      subject:     sanitize(form.subject, 255),
      message:     sanitize(form.message, 2000),
      form_source: coursePage,
    });

    setStatus(result.status);
    if (result.status === 'rate_limited') setCooldown(result.cooldown);
  }

  // ── Button label ────────────────────────────────────────────────────────────
  const btnLabels: Record<SubmitStatus, string> = {
    idle:         t.btnSubmit,
    loading:      t.btnLoading,
    success:      t.btnSuccess,
    error:        t.btnError,
    rate_limited: `${t.rateLimitMsg} ${cooldown}${t.rateLimitSuffix}`,
  };

  const btnDisabled =
    !isValid ||
    status === 'loading' ||
    status === 'rate_limited' ||
    status === 'success';

  // ── Success state ────────────────────────────────────────────────────────────
  const successBlock = (
    <div className="bg-emerald-50 text-emerald-900 rounded-xl p-6 border border-emerald-100 flex flex-col items-center text-center space-y-4">
      <span className="text-3xl">🎉</span>
      <div>
        <p className="text-sm font-semibold mb-1">{t.successTitle}</p>
        <p className="text-xs text-emerald-700">
          {t.successDesc} <strong>{form.email}</strong>.
        </p>
      </div>
    </div>
  );

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <section id="contato" className="py-16 md:py-24 bg-surface-form border-t border-subtle">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── Left column: narrative ─────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">

          <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500 bg-surface-tag px-3 py-1 rounded-full">
            {t.badge}
          </span>

          <h2 className="text-2xl md:text-3xl font-serif text-gray-950 font-bold leading-tight">
            {t.headline}
          </h2>

          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {t.subtitle}
          </p>

          <div className="p-5 bg-white rounded-xl border border-muted text-xs text-on-surface-variant space-y-4">
            <div className="flex gap-3 leading-relaxed items-start">
              <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">{t.trustDirect}</span>
                <span>{t.trustDirectDesc}</span>
              </div>
            </div>
            <div className="flex gap-3 leading-relaxed items-start">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">{t.trustResponse}</span>
                <span>{t.trustResponseDesc}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right column: form card ────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-muted p-6 md:p-8">

          {status === 'success' ? successBlock : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Honeypot — invisível para humanos */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Nome */}
              <Field
                label={t.labelName}
                required
                error={touched.has('fullName') ? t[errors.fullName] : undefined}
              >
                <input
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={150}
                  value={form.fullName}
                  placeholder={t.placeholderName}
                  onChange={e => setField('fullName', e.target.value)}
                  onBlur={() => blurField('fullName')}
                  className={`input-minimal ${inputStateClass(touched.has('fullName'), errors.fullName)}`}
                />
              </Field>

              {/* Email + Telefone — grid 2 col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label={t.labelEmail}
                  required
                  error={touched.has('email') ? t[errors.email] : undefined}
                >
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    placeholder={t.placeholderEmail}
                    onChange={e => setField('email', e.target.value)}
                    onBlur={() => blurField('email')}
                    className={`input-minimal ${inputStateClass(touched.has('email'), errors.email)}`}
                  />
                </Field>

                <Field
                  label={t.labelPhone}
                  required
                  error={touched.has('phone') ? t[errors.phone] : undefined}
                >
                  <div className="flex gap-2">
                    <select
                      value={form.ddi}
                      autoComplete="tel-country-code"
                      onChange={e => { setField('ddi', e.target.value); setField('phone', ''); }}
                      className="input-minimal w-28 shrink-0 px-2!"
                    >
                      {DDI_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.value}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      autoComplete="tel-national"
                      maxLength={20}
                      value={form.phone}
                      placeholder={t.placeholderPhone}
                      onChange={e => setField('phone', applyPhoneMask(e.target.value, form.ddi))}
                      onBlur={() => blurField('phone')}
                      className={`input-minimal flex-1 ${inputStateClass(touched.has('phone'), errors.phone)}`}
                    />
                  </div>
                </Field>
              </div>

              {/* Assunto */}
              <Field label={t.labelSubject}>
                <input
                  type="text"
                  maxLength={255}
                  value={form.subject}
                  placeholder={t.placeholderSubject}
                  onChange={e => setField('subject', e.target.value)}
                  onBlur={() => blurField('subject')}
                  className="input-minimal"
                />
              </Field>

              {/* Mensagem */}
              <Field
                label={t.labelMessage}
                required
                error={touched.has('message') ?  t[errors.message] : undefined}
                hint={`${form.message.length} ${t.charCount}`}
              > 
                <textarea
                  required
                  rows={5}
                  maxLength={2000}
                  value={form.message}
                  placeholder={t.placeholderMessage}
                  onChange={e => setField('message', e.target.value)}
                  onBlur={() => blurField('message')}
                  className={`input-minimal resize-y ${inputStateClass(touched.has('message'), t[errors.message])}`}
                />
              </Field>

              {/* Feedback de erro / rate limit */}
              {status === 'error' && (
                <p className="text-xs text-error text-center leading-relaxed">
                  {t.errorMsg}
                </p>
              )}
              {status === 'rate_limited' && (
                <p className="text-xs text-amber-700 text-center">
                  {t.rateLimitMsg} {cooldown}{t.rateLimitSuffix}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={btnDisabled}
                className="brand-btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {status === 'loading' ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{btnLabels[status]}</span>
              </button>

            </form>
          )}

        </div>
      </div>
    </section>
  );
}
