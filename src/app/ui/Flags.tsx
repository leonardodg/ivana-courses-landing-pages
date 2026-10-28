// Bandeiras (selo do herói e seletor de idioma da home). Únicas no site.
// `selected` só no seletor de idioma: bandeira inativa fica dessaturada.
const cls = (selected?: boolean) =>
  selected === undefined
    ? 'w-4.5 h-3 opacity-95 rounded-[1px] scale-105'
    : `w-4.5 h-3 opacity-95 rounded-[1px] transition-all duration-300 ${
        selected ? 'grayscale-0 scale-105' : 'grayscale opacity-40 hover:opacity-75'
      }`;

export const ArgentinaFlag = ({ selected }: { selected?: boolean }) => (
  <svg viewBox="0 0 3 2" className={cls(selected)} aria-hidden="true">
    <rect width="3" height="2" fill="#74ACDF" />
    <rect y="0.66" width="3" height="0.66" fill="#FFFFFF" />
    <circle cx="1.5" cy="1" r="0.18" fill="#FFAF36" />
  </svg>
);

export const BrazilFlag = ({ selected }: { selected?: boolean }) => (
  <svg viewBox="0 0 720 500" className={cls(selected)} aria-hidden="true">
    <rect width="720" height="500" fill="#009c3b" />
    <polygon points="360,60 60,250 360,440 660,250" fill="#ffdf00" />
    <circle cx="360" cy="250" r="120" fill="#002776" />
  </svg>
);
