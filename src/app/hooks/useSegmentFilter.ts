import { useCallback, useEffect, useState } from 'react';

// Filtro por segmento sincronizado com o #hash da URL, para links de campanha:
//   /pt-br/#velas            → filtra os cards de velas e rola até a lista
//   /pt-br/#imersao-velas    → mostra o segmento desse card e rola até ele
// Escolher no select atualiza o hash (sem recarregar), então o link da página já é compartilhável.
// Hashes que não são segmento nem card (#cursos, #contato) só rolam até o elemento (a página monta depois do HTML, então o navegador não acha o alvo sozinho).
export function useSegmentFilter({
  keys,
  aliases = {},
  cardSegment,
  sectionId,
}: {
  keys: string[]; // valores válidos do filtro
  aliases?: Record<string, string>; // apelidos aceitos no hash (ex.: aromas → aromas_incensos)
  cardSegment?: (cardId: string) => string | undefined; // segmento de um card pelo id dele
  sectionId: string; // id da seção dos cards (destino da rolagem quando o hash é um segmento)
}): [string, (v: string) => void] {
  const [value, setValue] = useState('');

  useEffect(() => {
    const apply = () => {
      const h = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (!h) return;
      const seg = keys.includes(h) ? h : aliases[h] ?? cardSegment?.(h);
      const isSegment = !!seg && keys.includes(seg);
      if (isSegment) setValue(seg);
      // Espera o React desenhar os cards filtrados e a página terminar de carregar (imagens mudam a altura) antes de rolar;
      // repete uma vez depois para corrigir o deslocamento causado pelo que carregou no meio do caminho.
      const scroll = () => {
        const target = document.getElementById(h) ?? (isSegment ? document.getElementById(sectionId) : null);
        if (!target) return false;
        target.style.scrollMarginTop = '96px'; // navbar fixa
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      };
      const run = () => {
        let tries = 0;
        const first = () => (scroll() ? setTimeout(scroll, 900) : tries++ < 10 && setTimeout(first, 100));
        setTimeout(first, 150);
      };
      if (document.readyState === 'complete') run();
      else window.addEventListener('load', run, { once: true });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
    // chaves e funções vêm de dados estáticos da página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = useCallback((v: string) => {
    setValue(v);
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', v ? `${base}#${v}` : base);
  }, []);

  return [value, set];
}
