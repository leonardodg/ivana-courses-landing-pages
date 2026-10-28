// Galeria de fotos com legenda (trabalhos da Ivana). `wide` ocupa as duas colunas.
export interface GalleryItem { src: string; alt: string; caption?: string; wide?: boolean }

export default function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {items.map((it) => (
        <figure key={it.src + it.alt} className={`bg-white rounded-2xl border border-muted shadow-sm overflow-hidden ${it.wide ? 'col-span-2' : ''}`}>
          <img
            src={it.src}
            alt={it.alt}
            loading="lazy"
            decoding="async"
            className={`w-full object-cover ${it.wide ? 'aspect-[4/3] md:aspect-[16/9]' : 'aspect-square'}`}
          />
          {it.caption && <figcaption className="p-3 text-xs text-on-surface-variant leading-relaxed">{it.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
