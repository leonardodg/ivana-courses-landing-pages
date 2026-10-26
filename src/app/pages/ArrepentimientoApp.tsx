// Botón de arrepentimiento (Argentina, Res. SCI 424/2020 y art. 34 de la Ley 24.240).
// Sin registro previo ni trámites: solo lo necesario para identificar la compra.
import { useState } from 'react';
import { Send } from 'lucide-react';
import CandlesArNavbar from '../components/CandlesArNavbar';
import Footer from '../components/Footer';
import { submitContact } from '../hooks/useSubmitContact';
import type { SubmitStatus } from '../hooks/useSubmitContact';
import { sanitize } from '../hooks/useContactForm';
import { company } from '../legal/company';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const newCode = () => `ARR-${Math.floor(100000 + Math.random() * 900000)}`;

export default function ArrepentimientoApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [code, setCode] = useState('');

  const valid = name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && course.trim().length >= 3;
  const busy = status === 'loading';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || busy) return;
    if (honeypot) { setStatus('success'); return; }
    setStatus('loading');
    const ref = newCode();
    const result = await submitContact({
      full_name: sanitize(name, 150),
      email: sanitize(email, 254).toLowerCase(),
      phone: '',
      subject: `Arrepentimiento ${ref}: ${sanitize(course, 200)}`,
      message: `Pedido de arrepentimiento (art. 34 Ley 24.240). Código: ${ref}. Compra: ${sanitize(course, 200)}.`,
      form_source: 'arrepentimiento-ar',
    });
    setStatus(result.status);
    if (result.status === 'rate_limited') setCooldown(result.cooldown);
    if (result.status === 'success') setCode(ref);
  }

  const field = 'w-full rounded-lg border border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';
  const label = 'block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono';

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <CandlesArNavbar onOpenPortal={() => window.open(company.platform, '_blank', 'noreferrer')} />
      <main id="conteudo" tabIndex={-1} className="grow pt-28 pb-16 px-6 focus:outline-none">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">Botón de arrepentimiento</h1>
          <p className="text-sm text-gray-800 leading-relaxed mt-4">
            Si compraste un curso y querés revocar la compra, podés hacerlo acá sin explicar el motivo y sin registrarte, dentro de los 10 días corridos desde la
            contratación o desde que recibís el servicio, lo que ocurra último (art. 34 de la Ley 24.240). Te enviamos el código de tu pedido por este mismo medio y por
            correo dentro de las 24 horas. Más detalles en la{' '}
            <a href="/es_ar/reembolso/" className="underline text-primary">Política de Reembolso y Cancelación</a>.
          </p>

          {status === 'success' ? (
            <div role="status" className="mt-8 bg-white border border-muted rounded-2xl p-6">
              <h2 className="font-serif text-xl">Pedido registrado</h2>
              <p className="text-sm text-gray-800 mt-2">Tu código de arrepentimiento es:</p>
              <p className="font-mono text-2xl text-primary mt-1">{code}</p>
              <p className="text-sm text-gray-800 mt-3">Guardalo. Te confirmamos el pedido y el reembolso por correo dentro de las 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label htmlFor="arr-name" className={label}>Nombre completo *</label>
                <input id="arr-name" className={field} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required maxLength={150} />
              </div>
              <div>
                <label htmlFor="arr-email" className={label}>Correo usado en la compra *</label>
                <input id="arr-email" type="email" className={field} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required maxLength={254} />
              </div>
              <div>
                <label htmlFor="arr-course" className={label}>Curso comprado *</label>
                <input id="arr-course" className={field} value={course} onChange={e => setCourse(e.target.value)} required maxLength={200} placeholder="Ej.: Velas Aromáticas y de Moldes, 14/11" />
              </div>

              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label>No <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} /></label>
              </div>

              {status === 'error' && <p role="alert" className="text-xs text-error">No pudimos enviarlo ahora. Intentá de nuevo o escribinos a {company.ar.email}.</p>}
              {status === 'rate_limited' && <p role="alert" className="text-xs text-amber-700">Demasiados envíos seguidos. Esperá {cooldown}s.</p>}

              <button type="submit" disabled={!valid || busy || status === 'rate_limited'} className="brand-btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" aria-hidden="true" /> {busy ? 'Enviando…' : 'Revocar la compra'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer language="es" setLanguage={() => undefined} />
    </div>
  );
}
