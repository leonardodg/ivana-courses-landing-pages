// Formulário de direitos do titular (LGPD, art. 18). Coleta só o necessário:
// nome, e-mail e o pedido. Sem telefone, CPF ou documentos.
import { useCooldownReset } from '../hooks/useCooldownReset';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Language } from '../classes/types';
import CandlesNavbar from '../components/CandlesNavbar';
import { buildArMenu } from '../components/theme/CareerSections';
import Footer from '../components/Footer';
import { submitContact } from '../hooks/useSubmitContact';
import type { SubmitStatus } from '../hooks/useSubmitContact';
import { sanitize, EMAIL_RE } from '../hooks/useContactForm';
import { company } from '../legal/company';

const REQUESTS_PT = [
  'Confirmar se vocês tratam meus dados',
  'Acessar meus dados',
  'Corrigir dados incompletos ou desatualizados',
  'Anonimizar, bloquear ou eliminar dados',
  'Portabilidade dos meus dados',
  'Saber com quem meus dados foram compartilhados',
  'Revogar um consentimento que dei',
  'Me opor a um tratamento',
  'Outro pedido sobre meus dados',
] as const;

const REQUESTS_ES = [
  'Confirmar si tratan mis datos',
  'Acceder a mis datos',
  'Rectificar o actualizar datos',
  'Suprimir (eliminar) mis datos',
  'Saber con quién se compartieron mis datos',
  'Retirar un consentimiento que di',
  'Otro pedido sobre mis datos',
] as const;

const REQUESTS: Record<Language, readonly string[]> = { pt: REQUESTS_PT, es: REQUESTS_ES };

const UI = {
  pt: {
    title: 'Direitos do titular de dados (LGPD)',
    intro1: 'Use este formulário para pedir acesso, correção, eliminação ou outro direito sobre os seus dados pessoais. Pedimos só o necessário para localizar o seu cadastro e responder. Respondemos em até 15 dias, no e-mail informado. Também aceitamos o pedido por',
    intro2: 'Veja como tratamos os dados na',
    policy: 'Política de Privacidade',
    policyHref: '/pt-br/privacidade/',
    okTitle: 'Pedido recebido',
    okText: 'Vamos responder no e-mail informado em até 15 dias. Se precisarmos confirmar a sua identidade, escreveremos para você.',
    name: 'Nome completo *',
    email: 'E-mail usado no cadastro ou compra *',
    request: 'O que você precisa? *',
    details: 'Detalhes (opcional)',
    hint: 'Não envie senhas, CPF ou documentos por aqui.',
    errorPre: 'Não conseguimos enviar agora. Tente de novo ou escreva para',
    rate: 'Muitos envios seguidos. Aguarde',
    send: 'Enviar pedido',
    sending: 'Enviando…',
    other: 'Español (Argentina)',
    otherHref: '/es-ar/derechos/',
  },
  es: {
    title: 'Derechos sobre tus datos personales',
    intro1: 'Usá este formulario para pedir acceso, rectificación, supresión u otro derecho sobre tus datos personales (Ley 25.326). Pedimos solo lo necesario para ubicar tu registro y responderte. Respondemos en un máximo de 10 días corridos (acceso) o 5 días hábiles (rectificación o supresión), al correo que indiques. También aceptamos el pedido por',
    intro2: 'Mirá cómo tratamos los datos en la',
    policy: 'Política de Privacidad',
    policyHref: '/es-ar/privacidad/',
    okTitle: 'Pedido recibido',
    okText: 'Vamos a responderte al correo indicado dentro de los plazos legales. Si necesitamos confirmar tu identidad, te escribiremos.',
    name: 'Nombre completo *',
    email: 'Correo usado en el registro o la compra *',
    request: '¿Qué necesitás? *',
    details: 'Detalles (opcional)',
    hint: 'No envíes contraseñas, DNI ni documentos por acá.',
    errorPre: 'No pudimos enviarlo ahora. Intentá de nuevo o escribinos a',
    rate: 'Demasiados envíos seguidos. Esperá',
    send: 'Enviar pedido',
    sending: 'Enviando…',
    other: 'Português (Brasil)',
    otherHref: '/pt-br/lgpd/',
  },
} as const;

export default function LgpdApp({ language = 'pt' }: { language?: Language }) {
  const es = language === 'es';
  const t = UI[language];
  const requests = REQUESTS[language];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState<string>(requests[0]);
  const [details, setDetails] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [cooldown, setCooldown] = useState(0);

  useCooldownReset(status, cooldown, setCooldown, setStatus);

  const valid = name.trim().length >= 2 && EMAIL_RE.test(email.trim());
  const busy = status === 'loading';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || busy) return;
    if (honeypot) { setStatus('success'); return; }
    setStatus('loading');
    const result = await submitContact({
      full_name: sanitize(name, 150),
      email: sanitize(email, 254).toLowerCase(),
      phone: '',
      subject: `${es ? 'Derechos datos AR' : 'LGPD'}: ${request}`,
      message: sanitize(details, 2000) || '(sem detalhes)',
      form_source: es ? 'lgpd-ar' : 'lgpd',
    });
    setStatus(result.status);
    if (result.status === 'rate_limited') setCooldown(result.cooldown);
    if (result.status === 'success') { setName(''); setEmail(''); setDetails(''); }
  }

  const field = 'w-full rounded-lg border border-subtle bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';
  const label = 'block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono';
  const contact = es ? company.ar.email : company.email;

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      {es ? (
        <CandlesNavbar language="es" menu={buildArMenu(undefined, '/es-ar/')} />
      ) : (
        <CandlesNavbar base="/pt-br/cursos/velas/" />
      )}
      <main id="conteudo" tabIndex={-1} className="grow pt-28 pb-16 px-6 focus:outline-none">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">{t.title}</h1>
          <p className="text-xs text-on-surface-variant mt-2">
            <a href={t.otherHref} hrefLang={es ? 'pt-BR' : 'es-AR'} lang={es ? 'pt-BR' : 'es-AR'} className="underline text-primary">{t.other}</a>
          </p>
          <p className="text-sm text-gray-800 leading-relaxed mt-4">
            {t.intro1} <a href={`mailto:${contact}`} className="underline text-primary">{contact}</a>.{' '}
            {t.intro2} <a href={t.policyHref} className="underline text-primary">{t.policy}</a>.
          </p>

          {status === 'success' ? (
            <div role="status" className="mt-8 bg-white border border-muted rounded-2xl p-6">
              <h2 className="font-serif text-xl">{t.okTitle}</h2>
              <p className="text-sm text-gray-800 mt-2">{t.okText}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label htmlFor="lgpd-name" className={label}>{t.name}</label>
                <input id="lgpd-name" className={field} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required maxLength={150} />
              </div>
              <div>
                <label htmlFor="lgpd-email" className={label}>{t.email}</label>
                <input id="lgpd-email" type="email" className={field} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required maxLength={254} />
              </div>
              <div>
                <label htmlFor="lgpd-request" className={label}>{t.request}</label>
                <select id="lgpd-request" className={field} value={request} onChange={e => setRequest(e.target.value)}>
                  {requests.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lgpd-details" className={label}>{t.details}</label>
                <textarea id="lgpd-details" className={field} rows={4} value={details} onChange={e => setDetails(e.target.value)} maxLength={2000} />
                <p className="text-xs text-on-surface-variant mt-1">{t.hint}</p>
              </div>

              {/* Honeypot: invisível para pessoas */}
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label>No <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} /></label>
              </div>

              {status === 'error' && <p role="alert" className="text-xs text-error">{t.errorPre} {contact}.</p>}
              {status === 'rate_limited' && <p role="alert" className="text-xs text-amber-700">{t.rate} {cooldown}s.</p>}

              <button type="submit" disabled={!valid || busy || status === 'rate_limited'} className="brand-btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" aria-hidden="true" /> {busy ? t.sending : t.send}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer language={language} setLanguage={() => undefined} />
    </div>
  );
}
