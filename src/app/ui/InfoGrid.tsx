// Cartões informativos em grade: módulos de um curso (com lista numerada) e grupos de receitas (com número grande).
export interface InfoCardData {
  eyebrow?: string;
  title: string;
  big?: string; // número em destaque (ex.: "10")
  text?: string;
  lessons?: string[];
}

export default function InfoGrid({ items, cols = 2 }: { items: InfoCardData[]; cols?: 2 | 3 }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((it) => (
        <div key={it.title} className="bg-white rounded-2xl border border-muted shadow-sm p-6">
          {it.big && <span className="font-serif text-4xl leading-none text-primary block mb-2">{it.big}</span>}
          {it.eyebrow && <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase block mb-2">{it.eyebrow}</span>}
          <h3 className="font-serif text-xl text-gray-900 leading-snug">{it.title}</h3>
          {it.text && <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{it.text}</p>}
          {it.lessons && (
            <ol className="mt-3 list-decimal pl-5 space-y-1 text-xs text-on-surface-variant leading-relaxed">
              {it.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}
