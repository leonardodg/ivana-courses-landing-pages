// src/app/components/LeadForm.tsx
//
// Formulário de captura de leads da homepage (página geral de cursos).
//
// Segurança — espelha ContactForm.tsx:
//   • Honeypot invisível para bots
//   • sanitize() em todos os campos antes do envio
//   • Validação inline com feedback on-blur (useLeadForm → useContactForm validators)
//   • Rate-limit client-side via submitContact (3 submissões / 60s)
//   • Retry com backoff exponencial via postWithRetry (max 3 tentativas, 5xx)
//   • Timeout de 10s por requisição (AbortSignal.timeout)
//   • VITE_WEBHOOK_URL + VITE_WEBHOOK_SECRET via env vars
//
// UI — elementos portados do protótipo AI Studio:
//   • País picker (BR / AR) que alinha o DDI do telefone
//   • Checkboxes de interesse por categoria com toggle "Todas"
//   • Radio de modalidade (online / presencial)
//   • Dropdown de cursos filtrado pelas categorias marcadas
//   • Spinner no botão durante loading, estados idle/loading/success/error/rate_limited

import { useId, useState, useMemo, isValidElement, cloneElement, type ReactElement } from 'react';
import {
  Send,
  MessageCircle,
  Clock,
  Check,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { interest_config, type InterestCountry } from '../data/interest_options';
import { useLeadForm, sanitize, type LeadModalidade } from '../hooks/useLeadForm';
import { applyPhoneMask, DDI_OPTIONS }           from '../hooks/usePhoneMask';
import { submitContact }                         from '../hooks/useSubmitContact';
import PrivacyConsent, { CONSENT_TEXT_VERSION } from './PrivacyConsent';
import type { SubmitStatus }                     from '../hooks/useSubmitContact';
import { lead_text as text }                     from '../lang/lead_form';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LeadFormProps {
  /** Versão da página: BR (/pt-br/interesse/) ou AR (/es-ar/interes/). Define idioma, áreas, cursos e contato. */
  country:     InterestCountry;
  /** Identificador de origem para o webhook (ex: 'interest') */
  formSource?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Classes de estado para inputs — espelha ContactForm */
function inputStateClass(isTouched: boolean, error?: string): string {
  if (!isTouched) return '';
  if (error)      return 'border-error! shadow-none! ring-1 ring-error/40!';
  return                  'border-primary/60! shadow-none! ring-1 ring-primary/30!';
}

// ─── Sub-componente Field ─────────────────────────────────────────────────────

interface FieldProps {
  label:     string;
  required?: boolean;
  error?:    string;
  children:  React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  const id = useId();
  // o filho (input) recebe o id; o rótulo aponta para ele
  const child = isValidElement(children) && children.type !== 'div' ? cloneElement(children as ReactElement<{ id?: string }>, { id }) : children;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      {child}
      <div className="min-h-[16px] mt-1">
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    </div>
  );
}

// ─── Sub-componente InterestCheckbox ─────────────────────────────────────────

interface InterestCheckboxProps {
  label:    string;
  checked:  boolean;
  onChange: (checked: boolean) => void;
}

function InterestCheckbox({ label, checked, onChange }: InterestCheckboxProps) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tertiary ${
        checked
          ? 'bg-primary/5 border-primary/40 text-primary font-semibold'
          : 'bg-surface-container-low border-muted hover:bg-surface-container text-on-surface'
      }`}
    >
      {/* Checkbox visual customizado — acessível via label wrapping */}
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-primary border-primary text-on-primary'
            : 'border-on-surface-variant/30 bg-white'
        }`}
        aria-hidden="true"
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}

// ─── Sub-componente ModalidadeRadio ───────────────────────────────────────────

interface ModalidadeRadioProps {
  label:    string;
  value:    'online' | 'presencial';
  current:  LeadModalidade;
  onChange: (v: LeadModalidade) => void;
}

function ModalidadeRadio({ label, value, current, onChange }: ModalidadeRadioProps) {
  const active = current === value;
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none rounded-md has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tertiary">
      <input
        type="radio"
        name="lead-modalidade"
        value={value}
        checked={active}
        onChange={() => {}}
        onClick={() => onChange(active ? '' : value)}   // clicar de novo desmarca: a escolha é opcional
        className="sr-only"
      />
      <span
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          active ? 'border-primary bg-white' : 'border-on-surface-variant/40 bg-white'
        }`}
        aria-hidden="true"
      >
        {active && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </span>
      <span className={`text-sm ${active ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}>
        {label}
      </span>
    </label>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function LeadForm({ country, formSource = 'interest' }: LeadFormProps) {
  const config   = interest_config[country];
  const language = config.language;
  const t = text[language];

  const optionKeys = useMemo(() => config.options.map(o => o.key), [config]);

  const {
    form,
    errors,
    touched,
    setField,
    blurField,
    setModalidade,
    toggleInterest,
    activeCategories,
    isValid,
    reset,
  } = useLeadForm(config.ddi, optionKeys);

  const [honeypot, setHoneypot] = useState('');
  const [status,   setStatus]   = useState<SubmitStatus>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [consent, setConsent]   = useState(false);

  // ── Cursos (BR) ou carreras (AR) filtrados pelas áreas marcadas e, no Brasil, pela modalidade ──
  const filteredCourses = config.courses
    .filter(c => !config.showModalidade || !form.modalidade
      || (form.modalidade === 'online'
        ? c.modalidade === 'online' || c.modalidade === 'hibrido'
        : c.modalidade === 'presencial' || c.modalidade === 'hibrido'))
    .filter(c => activeCategories.length === 0 || c.interests.some(i => activeCategories.includes(i)));

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot — bot preencheu, simula sucesso silenciosamente
    if (honeypot) { setStatus('success'); return; }

    setStatus('loading');

    const interestList = Object.entries(form.interests)
      .filter(([k, v]) => v && k !== 'todas')
      .map(([k]) => k)
      .join(', ');

    const result = await submitContact({
      full_name:   sanitize(form.fullName, 150),
      email:       sanitize(form.email, 254).toLowerCase(),
      phone:       `${form.ddi} ${form.phone.replace(/\D/g, '')}`,
      subject:     `Interesse: ${interestList || 'geral'}${config.showModalidade && form.modalidade ? ` — ${form.modalidade}` : ''}`,
      message:     [
        config.showModalidade ? (form.modalidade ? `Modalidade: ${form.modalidade}` : '') : 'Modalidade: online (carreras)',
        `Interesses: ${interestList || 'geral'}`,
        form.courseId && filteredCourses.some(c => c.id === form.courseId) ? `${country === 'AR' ? 'Carrera' : 'Curso'}: ${form.courseId}` : '',
        `País: ${country}`,
      ].filter(Boolean).join('\n'),
      form_source: country === 'AR' ? `${formSource}_ar` : formSource,
      consent:     CONSENT_TEXT_VERSION,
    });

    setStatus(result.status);
    if (result.status === 'rate_limited') setCooldown(result.cooldown);
    if (result.status === 'success') reset();
  }

  // ── Rótulo do botão ───────────────────────────────────────────────────────
  const btnLabels: Record<SubmitStatus, string> = {
    idle:         t.btnSubmit,
    loading:      t.btnLoading,
    success:      t.btnSuccess,
    error:        t.btnError,
    rate_limited: `${t.rateLimitMsg} ${cooldown}${t.rateLimitSuffix}`,
  };

  const btnDisabled =
    !isValid ||
    !consent ||
    status === 'loading'    ||
    status === 'rate_limited' ||
    status === 'success';

  // ── Bloco de sucesso ──────────────────────────────────────────────────────
  const successBlock = (
    <div className="bg-emerald-50 text-emerald-900 rounded-xl p-6 border border-emerald-100 flex flex-col items-center text-center space-y-3">
      <span className="text-3xl" aria-hidden="true">🎉</span>
      <div>
        <p className="text-sm font-semibold mb-1">{t.successTitle}</p>
        <p className="text-xs text-emerald-700 leading-relaxed">
          {t.successDesc} <strong>{form.email}</strong>.
        </p>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section
      id="contato"
      className="py-16 md:py-24 bg-surface-form border-t border-subtle"
      aria-label={t.badge}
    >
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ── Coluna esquerda: narrativa ───────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-600 bg-surface-tag px-3 py-1 rounded-full">
            {t.badge}
          </span>

          <h2 className="text-2xl md:text-3xl font-serif text-gray-950 font-bold leading-tight">
            {t.headline}
          </h2>

          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {t.subtitle}
          </p>

          <div
            className="flex flex-col gap-8 max-w-md"
            id="contact-info-container"
          >
            <div>
              <span
                className="text-xs font-bold tracking-widest text-brand-primary uppercase block mb-3"
                id="contact-section-subtitle"
              >
                {t.sectionSubtitle}
              </span>
              <h1
                className="font-serif text-4xl md:text-5xl font-bold leading-tight text-brand-primary-dark tracking-tight mb-4"
                id="contact-main-heading"
              >
                {t.mainHeading}
              </h1>
              <p
                className="text-brand-muted text-base leading-relaxed"
                id="contact-subtitle-description"
              >
                {t.subtitle}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="flex flex-col gap-5" id="contact-details-list">
              {/* Whatsapp / Phone */}
              <div
                className="flex items-start gap-4 p-1 group"
                id="contact-row-whatsapp"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300"
                  id="contact-icon-whatsapp"
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase block mb-0.5">
                    {t.whatsappLabel}
                  </span>
                  <a
                    href={config.whatsapp.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="font-sans text-lg font-bold text-brand-dark hover:text-brand-primary transition-colors duration-200 block"
                  >
                    {config.whatsapp.label}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div
                className="flex items-start gap-4 p-1 group"
                id="contact-row-email"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300"
                  id="contact-icon-email"
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase block mb-0.5">
                    {t.emailLabel}
                  </span>
                  <a
                    href="mailto:contato@ivana.academy"
                    className="font-sans text-lg font-bold text-brand-dark hover:text-brand-primary transition-colors duration-200 block break-all"
                  >
                    contato@ivana.academy
                  </a>
                </div>
              </div>

              {/* Atelier: só no Brasil */}
              {config.showLocation && (
              <div
                className="flex items-start gap-4 p-1 group"
                id="contact-row-atelier"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300"
                  id="contact-icon-atelier"
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase block mb-0.5">
                    {t.atelierLabel}
                  </span>
                  <span className="font-sans text-lg font-bold text-brand-dark block">
                    Florianópolis, SC — Brasil
                  </span>
                </div>
              </div>
              )}
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-muted text-xs text-on-surface-variant space-y-4">
            <div className="flex gap-3 leading-relaxed items-start">
              <MessageCircle
                className="w-5 h-5 text-primary shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">
                  {t.trustDirectTitle}
                </span>
                <span>{t.trustDirectDesc}</span>
              </div>
            </div>
            <div className="flex gap-3 leading-relaxed items-start">
              <Clock
                className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">
                  {t.trustResponseTitle}
                </span>
                <span>{t.trustResponseDesc}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Coluna direita: card do formulário ──────────────────────────── */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-muted p-6 md:p-8">
          {status === "success" ? (
            successBlock
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Honeypot — invisível para humanos, armadilha para bots */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* ── Nome + Email ───────────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label={t.labelName}
                  required
                  error={
                    touched.has("fullName")
                      ? (t[errors.fullName as keyof typeof t] as string)
                      : undefined
                  }
                >
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    maxLength={150}
                    value={form.fullName}
                    placeholder={t.placeholderName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    onBlur={() => blurField("fullName")}
                    className={`input-minimal ${inputStateClass(touched.has("fullName"), errors.fullName)}`}
                  />
                </Field>

                <Field
                  label={t.labelEmail}
                  required
                  error={
                    touched.has("email")
                      ? (t[errors.email as keyof typeof t] as string)
                      : undefined
                  }
                >
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    placeholder={t.placeholderEmail}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => blurField("email")}
                    className={`input-minimal ${inputStateClass(touched.has("email"), errors.email)}`}
                  />
                </Field>
              </div>

              {/* ── Telefone com DDI ───────────────────────────────────────── */}
              <Field
                label={t.labelPhone}
                required
                error={
                  touched.has("phone")
                    ? (t[errors.phone as keyof typeof t] as string)
                    : undefined
                }
              >
                <div className="flex gap-2">
                  <select
                    aria-label={language === "es" ? "Código de país (DDI)" : "Código do país (DDI)"}
                    value={form.ddi}
                    autoComplete="tel-country-code"
                    onChange={(e) => {
                      setField("ddi", e.target.value);
                      setField("phone", "");
                    }}
                    className="input-minimal w-28 shrink-0 px-2!"
                  >
                    {DDI_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    autoComplete="tel-national"
                    aria-label={t.labelPhone}
                    maxLength={20}
                    value={form.phone}
                    placeholder={t.placeholderPhone}
                    onChange={(e) =>
                      setField(
                        "phone",
                        applyPhoneMask(e.target.value, form.ddi),
                      )
                    }
                    onBlur={() => blurField("phone")}
                    className={`input-minimal flex-1 ${inputStateClass(touched.has("phone"), errors.phone)}`}
                  />
                </div>
              </Field>

              {/* ── Interesses ─────────────────────────────────────────────── */}
              <div>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2 font-mono">
                  {t.labelInterests}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {config.options.map((o) => (
                    <InterestCheckbox
                      key={o.key}
                      label={o.label}
                      checked={!!form.interests[o.key]}
                      onChange={(v) => toggleInterest(o.key, v)}
                    />
                  ))}
                  <InterestCheckbox
                    label={config.allLabel}
                    checked={!!form.interests.todas}
                    onChange={(v) => toggleInterest("todas", v)}
                  />
                </div>
              </div>

              {/* ── Modalidade (só Brasil) ─────────────────────────────────── */}
              {config.showModalidade && (
              <div>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2 font-mono">
                  {t.labelModalidade}
                </p>
                <div className="flex gap-6">
                  <ModalidadeRadio
                    label={t.modalidadeOnline}
                    value="online"
                    current={form.modalidade}
                    onChange={setModalidade}
                  />
                  <ModalidadeRadio
                    label={t.modalidadePresencial}
                    value="presencial"
                    current={form.modalidade}
                    onChange={setModalidade}
                  />
                </div>
              </div>
              )}

              {/* ── Dropdown de cursos (opcional) ──────────────────────────── */}
              {filteredCourses.length > 0 && (
                <div className="border-t border-subtle pt-5">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
                    {config.courseLabel}
                  </label>
                  <select
                    aria-label={config.courseLabel}
                    value={form.courseId}
                    onChange={(e) => setField("courseId", e.target.value)}
                    className="input-minimal font-sans"
                  >
                    <option value="">{config.courseDefault}</option>
                    {filteredCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ── Feedback de erro / rate limit ──────────────────────────── */}
              {status === "error" && (
                <p className="text-xs text-error text-center leading-relaxed">
                  {t.errorMsg}
                </p>
              )}
              {status === "rate_limited" && (
                <p className="text-xs text-amber-700 text-center">
                  {t.rateLimitMsg} {cooldown}
                  {t.rateLimitSuffix}
                </p>
              )}

              <PrivacyConsent id="consent-lead" checked={consent} onChange={setConsent} language={language} />

              {/* ── Submit ─────────────────────────────────────────────────── */}
              <button
                type="submit"
                disabled={btnDisabled}
                className="brand-btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {status === "loading" ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{btnLabels[status]}</span>
              </button>

              {/* ── Consentimento ──────────────────────────────────────────── */}
              <p className="text-[10px] text-on-surface-variant text-center leading-relaxed max-w-md mx-auto">
                {t.consent}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
