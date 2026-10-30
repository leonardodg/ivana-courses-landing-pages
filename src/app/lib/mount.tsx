// Ponto único de montagem das páginas (chamado por cada main.tsx).
// • Página pré-renderizada (HTML com `data-prerendered`, gerado por scripts/prerender.mjs): HIDRATA o HTML existente,
//   mantendo os nós que o navegador já pintou (LCP e CLS continuam como no HTML cru).
// • Sem pré-renderização (dev, ou o pré-render falhou): monta do zero, como sempre.
// O aviso de cookies fica numa raiz separada: depende do consentimento salvo no navegador, então não pode fazer parte
// do HTML pré-renderizado (senão a hidratação encontraria elementos a mais).
import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import ConsentManager from '../components/ConsentManager.tsx';

export function mount(page: ReactNode) {
  const el = document.getElementById('root')!;
  const tree = <StrictMode>{page}</StrictMode>;
  if (el.hasAttribute('data-prerendered') && el.firstElementChild) {
    hydrateRoot(el, tree, {
      onRecoverableError: (error) => {
        // a página continua funcionando (o React refaz o trecho no navegador); só registramos
        (window as unknown as { __hydrationErrors?: string[] }).__hydrationErrors ??= [];
        (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors.push(String((error as Error)?.message ?? error).slice(0, 200));
        console.error('[hidratação]', error);
      },
    });
  } else {
    createRoot(el).render(tree);
  }

  const consent = document.createElement('div');
  consent.id = 'consent-root';
  document.body.appendChild(consent);
  createRoot(consent).render(<ConsentManager />);
}
