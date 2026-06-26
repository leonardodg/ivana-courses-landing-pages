// src/app/components/candles/CandlesCheckoutModal.tsx
//
// Modal de "Reserva de Vaga" para cursos sem link externo de matrícula
// (cursos presenciais). Adaptado do protótipo de checkout: removemos a
// simulação de pagamento/preço (o tipo Course real não tem preço — os
// valores são tratados comercialmente fora do site) e usamos o webhook
// real (useSubmitContact) para registrar o pedido. O cupom funciona como
// um código de desconto a ser validado pela equipe comercial no contato.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Tag, Check, X, GraduationCap } from 'lucide-react';
import { Course } from '../classes/types';
import { submitContact } from '../hooks/useSubmitContact';
import type { SubmitStatus } from '../hooks/useSubmitContact';
import { sanitize } from '../hooks/useContactForm';
import { candle_images } from '../data/candle_images';

interface CandlesCheckoutModalProps {
  course: Course;
  initialCoupon?: string;
  onClose: () => void;
}

export default function CandlesCheckoutModal({ course, initialCoupon = '', onClose }: CandlesCheckoutModalProps) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [coupon, setCoupon] = useState(initialCoupon);
  const [couponApplied, setCouponApplied] = useState(Boolean(initialCoupon));
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [protocolNumber, setProtocolNumber] = useState('');

  const imgUrl = (candle_images as Record<string, string>)[course.id] ?? '/images/courses/hero_candle.png';
  const submitting = status === 'loading';
  const success = status === 'success';

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;
    if (coupon.toUpperCase().startsWith('IVANA10')) {
      setCouponApplied(true);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || submitting) return;

    setStatus('loading');

    const protocol = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await submitContact({
      full_name: sanitize(userName, 150),
      email: sanitize(userEmail, 254).toLowerCase(),
      phone: '',
      subject: `Reserva de vaga — ${course.title.pt}`,
      message: `Reserva de vaga solicitada via página de velas. Curso: ${course.title.pt} (id: ${course.id}). Protocolo: ${protocol}.${couponApplied ? ` Cupom informado: ${coupon}.` : ''}`,
      form_source: 'candles',
    });

    if (result.status === 'success') {
      setProtocolNumber(protocol);
    }
    setStatus(result.status);
    if (result.status === 'rate_limited') setCooldown(result.cooldown);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#1c1c1a]/85 backdrop-blur-md">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col"
      >

        {/* Header toolbar */}
        <div className="h-16 border-b border-outline-variant/30 px-6 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4.5 h-4.5 text-primary" />
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">Reservar Vaga</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.form
              key="checkout-form"
              onSubmit={handleEnrollSubmit}
              className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between"
            >

              {/* Resumo do curso */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[9px] font-label font-bold text-primary bg-primary-fixed block px-2 py-0.5 rounded-sm uppercase w-max tracking-wide">
                    {course.modalidade === 'presencial' ? 'Presencial' : 'Online'}
                  </span>
                  <h4 className="font-display text-sm font-bold text-on-surface mt-1">{course.title.pt}</h4>
                  <span className="text-[11px] text-on-surface-variant/70 font-body">{course.duracao.pt}</span>
                </div>
              </div>

              {/* Campos */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="user-name" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-label mb-1.5">
                    Nome do Aluno
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    maxLength={150}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-3 text-sm text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="user-email" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-label mb-1.5">
                    E-mail para Contato
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    required
                    maxLength={254}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="seu@e-mail.com"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-3 text-sm text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Cupom */}
                <div>
                  <label htmlFor="user-coupon" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-label mb-1.5">
                    Tem um Cupom de Desconto?
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="user-coupon"
                      type="text"
                      placeholder="Ex: IVANA10-WELCOME"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg p-3 text-xs text-on-surface font-mono uppercase focus:outline-hidden focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container px-4 py-3 rounded-lg text-xs font-bold font-label uppercase transition-colors cursor-pointer shrink-0"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <span className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-1.5 font-label">
                      <Tag className="w-3.5 h-3.5" />
                      Cupom registrado — nossa equipe confirma o desconto no contato
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Valores e formas de pagamento são confirmados diretamente com nossa equipe comercial
                após o envio deste formulário, via e-mail ou WhatsApp.
              </p>

              {status === 'error' && (
                <p className="text-xs text-error text-center leading-relaxed">
                  Não foi possível enviar sua reserva agora. Tente novamente ou fale conosco pelo WhatsApp.
                </p>
              )}
              {status === 'rate_limited' && (
                <p className="text-xs text-amber-700 text-center">
                  Muitas tentativas. Aguarde {cooldown}s antes de tentar novamente.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || status === 'rate_limited'}
                className="w-full bg-primary hover:bg-primary/95 text-on-primary py-4 rounded-xl text-sm uppercase tracking-wider font-label font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <GraduationCap className="w-4.5 h-4.5" />
                {submitting ? 'Enviando...' : 'Confirmar Reserva de Vaga'}
              </button>

            </motion.form>
          ) : (
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-10 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-primary">
                  Reserva Recebida!
                </h3>
                <p className="text-on-surface-variant text-xs max-w-sm mx-auto font-body">
                  Obrigado, {userName}! Sua reserva foi registrada. Nossa equipe vai confirmar sua vaga
                  e os detalhes de pagamento pelo e-mail {userEmail} em até 24h úteis.
                </p>
              </div>

              <div className="p-5 bg-surface-container rounded-xl border border-dashed border-outline-variant/60 text-left space-y-2.5 text-xs">
                <div className="flex justify-between text-[10px] text-on-surface-variant font-label uppercase font-semibold">
                  <span>Protocolo de Reserva</span>
                </div>
                <div className="h-px bg-outline-variant/30"></div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Código:</span>
                  <span className="font-mono font-bold text-on-surface">{protocolNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Data:</span>
                  <span className="font-semibold text-on-surface">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Curso:</span>
                  <span className="font-bold text-primary text-right">{course.title.pt}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-label text-xs uppercase tracking-wider font-bold shadow-xs hover:shadow-md transition-shadow cursor-pointer"
              >
                Fechar
              </button>

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

    </div>
  );
}
