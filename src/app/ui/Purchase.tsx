// Compra (Hotmart): bloco de preço, chamada final e barra fixa no celular. Um lugar só para o visual.
import type { ReactNode } from 'react';
import { btnPrimary, heroPrimary } from './styles';

export function PriceBlock({ main, sub }: { main: string; sub: string }) {
  return (
    <div className="space-y-0.5">
      <b className="font-serif text-2xl md:text-3xl text-gray-900 font-normal block">{main}</b>
      <span className="text-xs text-on-surface-variant block">{sub}</span>
    </div>
  );
}

export function PurchaseCta({
  id,
  title,
  price,
  buy,
  small,
}: {
  id?: string;
  title: ReactNode;
  price: { main: string; sub: string };
  buy: { href: string; label: string };
  small?: string;
}) {
  return (
    <section id={id} className="py-16 md:py-24 bg-surface-hero border-t border-muted text-center px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">{title}</h2>
        <div className="flex justify-center"><PriceBlock {...price} /></div>
        <a href={buy.href} target="_blank" rel="noopener" className={heroPrimary}>
          {buy.label}
        </a>
        {small && <p className="text-xs text-on-surface-variant">{small}</p>}
      </div>
    </section>
  );
}

/** Barra fixa no rodapé do celular, com o preço e o botão de compra. */
export function StickyBuyBar({ price, buy, shortLabel }: { price: string; buy: { href: string }; shortLabel: string }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-subtle px-4 py-3 flex items-center justify-between gap-3">
      <b className="font-serif text-lg text-gray-900 font-normal">{price}</b>
      <a href={buy.href} target="_blank" rel="noopener" className={`${btnPrimary} px-6`}>
        {shortLabel}
      </a>
    </div>
  );
}
