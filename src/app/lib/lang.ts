// Idioma da página pelo atributo lang do <html> (pt-BR ou es-AR). Usado por componentes
// compartilhados que não recebem a prop `language` (banner de cookies, atalho de teclado).
// A home troca de idioma sem recarregar: quem troca chama setPageLanguage, que atualiza o
// <html lang> e avisa os componentes que escutam com usePageLanguage.
import { useEffect, useState } from 'react';
import type { Language } from '../classes/types';

const LANG_EVENT = 'ivana:lang';

export const pageLanguage = (): Language =>
  typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'pt';

export function setPageLanguage(language: Language) {
  document.documentElement.lang = language === 'es' ? 'es-AR' : 'pt-BR';
  window.dispatchEvent(new Event(LANG_EVENT));
}

/** Escolhe o texto pelo idioma: tr(language, 'espanhol', 'português'). */
export const tr = <T,>(l: Language, es: T, pt: T): T => (l === 'es' ? es : pt);

export function usePageLanguage(): Language {
  const [lang, setLang] = useState<Language>(pageLanguage);
  useEffect(() => {
    const onChange = () => setLang(pageLanguage());
    window.addEventListener(LANG_EVENT, onChange);
    return () => window.removeEventListener(LANG_EVENT, onChange);
  }, []);
  return lang;
}
