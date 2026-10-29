// Filtro por botões (cidade no Brasil, carreira na Argentina). No celular rola na horizontal; no desktop quebra linha.
export default function FilterChips({
  options,
  value,
  onChange,
  allLabel,
  ariaLabel,
}: {
  options: { value: string; label: string }[];
  value: string; // '' = todas
  onChange: (value: string) => void;
  allLabel: string;
  ariaLabel: string;
}) {
  return (
    <div
      className="-mx-6 px-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:flex-wrap lg:overflow-visible"
      role="group"
      aria-label={ariaLabel}
    >
      {[{ value: '', label: allLabel }, ...options].map((o) => (
        <button
          key={o.value || 'todas'}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`min-h-11 shrink-0 lg:shrink lg:max-w-full rounded-full border px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider text-left transition-all cursor-pointer ${
            value === o.value
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-subtle text-on-surface-variant hover:border-primary hover:text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
