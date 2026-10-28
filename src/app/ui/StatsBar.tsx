// Faixa de números (3 colunas) logo abaixo do herói.
export interface Stat { value: string; label: string }

export default function StatsBar({ items }: { items: Stat[] }) {
  return (
    <section className="bg-white border-y border-subtle py-8">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
        {items.map((it, i) => (
          <div key={it.label} className={`space-y-1 ${i === 1 ? 'border-y md:border-y-0 md:border-x border-subtle py-4 md:py-0' : ''}`}>
            <span className="text-3xl md:text-4xl font-serif text-primary font-black block">{it.value}</span>
            <span className="text-micro uppercase font-mono tracking-wider font-bold text-gray-600 block">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
