// Biblioteca de componentes do site. TODA página nova usa estes componentes; nada de recriar
// botão, card, passo ou cabeçalho de seção dentro de uma página. Ver docs/GUIA-DE-ESTILO.md.
export * from './styles';
export { default as SectionHeader } from './SectionHeader';
export { default as Section } from './Section';
export { default as Hero, HeroBadgeText } from './Hero';
export type { HeroAction } from './Hero';
export { default as Card, CardGrid, cardGridClass } from './Card';
export { default as DateRow } from './DateRow';
export { default as Steps } from './Steps';
export type { StepItem } from './Steps';
export { default as FeatureList } from './FeatureList';
export { default as ContactCta } from './ContactCta';
export { ArgentinaFlag, BrazilFlag } from './Flags';
export { default as NavHeader, navGroupClass, navPill, navPortalPill, drawerItem } from './NavHeader';
