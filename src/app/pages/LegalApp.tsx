// Páginas legais (política de privacidade, termos de uso e reembolso) em pt-BR e es-AR.
import { Language } from '../classes/types';
import CandlesNavbar from '../components/CandlesNavbar';
import CandlesArNavbar from '../components/CandlesArNavbar';
import Footer from '../components/Footer';
import { company } from '../legal/company';
import { privacidade, termos, reembolso, LegalDoc } from '../legal/content';
import { privacidadEs, terminosEs, reembolsoEs } from '../legal/content_es';

export type LegalDocKey = 'privacidade' | 'termos' | 'reembolso';

const DOCS: Record<Language, Record<LegalDocKey, LegalDoc>> = {
  pt: { privacidade, termos, reembolso },
  es: { privacidade: privacidadEs, termos: terminosEs, reembolso: reembolsoEs },
};

// Mesma página no outro idioma.
const OTHER_PATH: Record<Language, Record<LegalDocKey, string>> = {
  pt: { privacidade: '/es_ar/privacidad/', termos: '/es_ar/terminos/', reembolso: '/es_ar/reembolso/' },
  es: { privacidade: '/pt_br/privacidade/', termos: '/pt_br/termos/', reembolso: '/pt_br/reembolso/' },
};

const UI = {
  pt: { updated: 'Última atualização', toc: 'Neste documento', other: 'Español (Argentina)' },
  es: { updated: 'Última actualización', toc: 'En este documento', other: 'Português (Brasil)' },
};

export default function LegalApp({ doc, language = 'pt' }: { doc: LegalDocKey; language?: Language }) {
  const d = DOCS[language][doc];
  const ui = UI[language];

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      {language === 'es' ? (
        <CandlesArNavbar base="/es_ar/candles/" onOpenPortal={() => window.open(company.platform, '_blank', 'noreferrer')} />
      ) : (
        <CandlesNavbar base="/pt_br/candles/" />
      )}
      <main id="conteudo" tabIndex={-1} className="grow pt-28 pb-16 px-6 focus:outline-none">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{d.title}</h1>
          <p className="text-xs text-on-surface-variant mt-2">
            {ui.updated}: {language === 'es' ? company.updatedEs : company.updated} ·{' '}
            <a href={OTHER_PATH[language][doc]} hrefLang={language === 'es' ? 'pt-BR' : 'es-AR'} lang={language === 'es' ? 'pt-BR' : 'es-AR'} className="underline text-primary">
              {ui.other}
            </a>
          </p>
          <div className="mt-6 text-sm leading-relaxed text-gray-800 space-y-3">{d.intro}</div>

          <nav aria-label={ui.toc} className="mt-8 bg-white border border-muted rounded-2xl p-5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">{ui.toc}</h2>
            <ol className="text-sm space-y-1">
              {d.sections.map(s => (
                <li key={s.id}><a href={`#${s.id}`} className="underline text-primary">{s.title}</a></li>
              ))}
            </ol>
          </nav>

          {d.sections.map(s => (
            <section key={s.id} id={s.id} className="mt-10 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-serif text-gray-900 mb-3">{s.title}</h2>
              <div className="text-sm leading-relaxed text-gray-800 space-y-3">{s.body}</div>
            </section>
          ))}
        </article>
      </main>
      <Footer language={language} setLanguage={() => undefined} />
    </div>
  );
}
