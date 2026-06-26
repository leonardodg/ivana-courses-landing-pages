// src/app/components/candles/CandlesLeadForm.tsx
//
// Formulário de captura de leads exclusivo da página /pt_br/candles.
// Mantém a experiência de geração de cupom de boas-vindas (diferencial
// de conversão), mas envia o lead pelo webhook real do projeto
// (useSubmitContact), em vez do mock em localStorage do protótipo.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Copy, Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { submitContact } from '../hooks/useSubmitContact';
import type { SubmitStatus } from '../hooks/useSubmitContact';
import { sanitize } from '../hooks/useContactForm';
import { candles_lead_text as t } from '../lang/candles_lead_form';

interface CandlesLeadFormProps {
  onCouponAwarded?: (coupon: string) => void;
}

export default function CandlesLeadForm({ onCouponAwarded }: CandlesLeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(t.formInterestOptions[0]);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [generatedCoupon, setGeneratedCoupon] = useState('');
  const [copied, setCopied] = useState(false);

  const submitting = status === 'loading';
  const success = status === 'success';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || submitting) return;

    setStatus('loading');

    const couponCode = `IVANA10-${name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'WELCOME'}`;

    const result = await submitContact({
      full_name: sanitize(name, 150),
      email: sanitize(email, 254).toLowerCase(),
      phone: '',
      subject: `Lead — cupom de boas-vindas (${interest})`,
      message: `Lead capturado na página de velas PT-BR. Interesse: ${interest}. Cupom gerado: ${couponCode}.`,
      form_source: 'candles',
    });

    if (result.status === 'success') {
      setGeneratedCoupon(couponCode);
      onCouponAwarded?.(couponCode);
    }
    setStatus(result.status);
    if (result.status === 'rate_limited') setCooldown(result.cooldown);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCoupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contato" className="py-24 bg-surface-container-low relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute left-0 top-0 w-64 h-64 bg-secondary-container/25 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Informative column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-primary font-label text-xs uppercase tracking-widest font-bold block mb-3">
                {t.tagLabel}
              </span>
              <h2 className="font-display text-4xl text-primary leading-tight font-semibold">
                {t.title}
              </h2>
              <p className="text-on-surface-variant text-base mt-4 leading-relaxed font-body">
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
              <a
                href={`tel:${t.contactPhoneDisplay}`}
                className="flex items-center gap-4 text-on-surface hover:text-primary group transition-colors cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-surface flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-label tracking-wide text-on-surface-variant block">{t.whatsappLabel}</span>
                  <span className="text-sm font-semibold">{t.contactPhoneDisplay}</span>
                </div>
              </a>

              <a
                href={`mailto:${t.contactEmailDisplay}`}
                className="flex items-center gap-4 text-on-surface hover:text-primary group transition-colors cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-surface flex items-center justify-center text-primary shadow-xs group-hover:scale-105 transition-transform">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-label tracking-wide text-on-surface-variant block">{t.emailLabel}</span>
                  <span className="text-sm font-semibold">{t.contactEmailDisplay}</span>
                </div>
              </a>

              <div className="flex items-center gap-4 text-on-surface">
                <div className="w-11 h-11 rounded-lg bg-surface flex items-center justify-center text-primary shadow-xs">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-label tracking-wide text-on-surface-variant block">{t.locationLabel}</span>
                  <span className="text-sm font-semibold">{t.contactLocationDisplay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="bg-surface p-6 sm:p-10 rounded-2xl shadow-xl shadow-secondary-container/20 border border-outline-variant/30 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="lead-name" className="block text-xs font-semibold text-on-surface uppercase tracking-wider font-label mb-2">
                        {t.formName}
                      </label>
                      <input
                        id="lead-name"
                        type="text"
                        required
                        maxLength={150}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.formNamePlaceholder}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="lead-email" className="block text-xs font-semibold text-on-surface uppercase tracking-wider font-label mb-2">
                        {t.formEmail}
                      </label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.formEmailPlaceholder}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="lead-select" className="block text-xs font-semibold text-on-surface uppercase tracking-wider font-label mb-2">
                        {t.formInterest}
                      </label>
                      <select
                        id="lead-select"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 text-sm text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 cursor-pointer"
                      >
                        {t.formInterestOptions.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {status === 'error' && (
                      <p className="text-xs text-error text-center leading-relaxed">{t.errorMsg}</p>
                    )}
                    {status === 'rate_limited' && (
                      <p className="text-xs text-amber-700 text-center">
                        {t.rateLimitMsg} {cooldown}{t.rateLimitSuffix}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || status === 'rate_limited'}
                      className="w-full bg-primary hover:bg-primary/95 text-on-primary py-4 rounded-xl text-sm uppercase tracking-wider font-label font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-75 disabled:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4.5 h-4.5" />
                      {submitting ? t.formBtnSubmitting : t.formBtnSubmit}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-6"
                  >
                    <div className="w-16 h-16 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-10 h-10" />
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-bold text-primary mb-2">
                        {t.successTitle}
                      </h3>
                      <p className="text-on-surface-variant text-sm font-body max-w-md mx-auto">
                        {t.successDescPrefix} {email}. {t.successDescSuffix}
                      </p>
                    </div>

                    <div className="bg-surface-container border border-dashed border-primary/50 max-w-sm mx-auto p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest block font-label">
                          {t.couponLabel}
                        </span>
                        <span className="text-lg font-mono font-bold tracking-wider text-on-surface">
                          {generatedCoupon}
                        </span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-on-primary px-3.5 py-2.5 rounded-lg text-xs font-semibold font-label uppercase transition-all cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            {t.copiedLabel}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {t.copyLabel}
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-on-surface-variant font-label flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                      {t.couponHint}
                    </div>

                    <button
                      onClick={() => { setStatus('idle'); setName(''); setEmail(''); }}
                      className="text-xs font-label uppercase font-bold text-primary underline hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      {t.resetCta}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
