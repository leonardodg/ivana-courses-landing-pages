// Atalho para teclado/leitor de tela: aparece ao receber foco e leva ao conteúdo principal.
import { usePageLanguage } from '../lib/lang';

export default function SkipLink() {
  const lang = usePageLanguage();
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-white focus:text-primary focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-semibold"
    >
      {lang === 'es' ? 'Saltar al contenido' : 'Pular para o conteúdo'}
    </a>
  );
}
