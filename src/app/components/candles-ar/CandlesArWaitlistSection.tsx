// src/app/components/candles-ar/CandlesArWaitlistSection.tsx
// Seção "Próximos Talleres Presenciales" — lista de espera para workshops
// presenciais em Buenos Aires. Envia via webhook real (submitContact).

import { useState } from 'react';
import { Send, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { submitContact } from '../../hooks/useSubmitContact';
import type { SubmitStatus } from '../../hooks/useSubmitContact';
import { sanitize } from '../../hooks/useContactForm';

export default function CandlesArWaitlistSection() {
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const submitting = status === 'loading';
  const success    = status === 'success';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setStatus('loading');

    const result = await submitContact({
      full_name:    sanitize(name || 'Sin nombre', 150),
      email:        sanitize(email, 254).toLowerCase(),
      phone:        '',
      subject:      'Lista de espera — Talleres Presenciales Buenos Aires',
      message:      `Inscripción en lista de espera para talleres presenciales en Buenos Aires (página es_ar/candles).`,
      form_source:  'candles',
    });

    setStatus(result.status);
  };

  return (
    <section id="interes" className="bg-primary py-16 md:py-20 text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/70 text-xs font-mono uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-white/60" />
            Buenos Aires, Argentina
          </span>
          <span className="hidden sm:block opacity-40">·</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-white/60" />
            Próximamente
          </span>
        </div>

        <h2 className="font-serif text-2xl md:text-4xl text-white leading-tight">
          Próximos Talleres Presenciales
        </h2>
        <p className="text-white/80 max-w-xl mx-auto italic text-xs md:text-sm leading-relaxed">
          Aunque hoy nos enfocamos en la excelencia online, la magia de lo presencial volverá pronto a Buenos Aires. Anotate en la lista prioritaria para ser la primera en enterarte.
        </p>

        {!success ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto space-y-3 pt-2"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={100}
                className="flex-1 px-4 py-3 rounded-xl text-on-surface bg-white border-none outline-none text-xs font-medium"
              />
              <input
                type="email"
                required
                placeholder="Tu email para la lista de espera"
                value={email}
                onChange={e => setEmail(e.target.value)}
                maxLength={254}
                className="flex-1 px-4 py-3 rounded-xl text-on-surface bg-white border-none outline-none text-xs font-medium"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-white text-primary hover:bg-primary-container hover:text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 shrink-0"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Enviando...' : 'Anotarme'}
              </button>
            </div>

            {status === 'error' && (
              <p className="text-xs text-white bg-red-900/40 p-2.5 rounded-lg font-bold border border-red-400">
                No se pudo registrar en este momento. Por favor intentá de nuevo o escribinos por WhatsApp.
              </p>
            )}
          </form>
        ) : (
          <div className="max-w-sm mx-auto pt-4 flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-white" />
            <p className="text-white font-bold text-base font-serif">¡Gracias! Te hemos añadido a la lista de espera prioritariamente.</p>
            <p className="text-white/70 text-xs">Te avisaremos a <span className="font-mono font-bold">{email}</span> en cuanto se publiquen las fechas.</p>
          </div>
        )}

      </div>
    </section>
  );
}
