// Todos os links do projeto, usados no rodapé. Um só lugar para manter.
import { company } from '../legal/company';

type Label = { pt: string; es: string };
export interface SiteLink {
  href: string;
  label: Label;
  external?: boolean;
  hrefEs?: string; // destino diferente na versão argentina
}
export interface SiteLinkGroup {
  title: Label;
  links: SiteLink[];
}

export const site_link_groups: SiteLinkGroup[] = [
  {
    title: { pt: 'Cursos presenciais', es: 'Cursos presenciales' },
    links: [
      { href: '/pt_br/candles/', label: { pt: 'Velas', es: 'Velas' } },
      { href: '/pt_br/soap/', label: { pt: 'Saboaria', es: 'Jabonería' } },
      { href: '/pt_br/aromas/', label: { pt: 'Aromas e Incensos', es: 'Aromas e Inciensos' } },
      { href: '/pt_br/resin/', label: { pt: 'Resina e Decoração', es: 'Resina y Decoración' } },
      { href: '/agenda/', label: { pt: 'Agenda de turmas', es: 'Agenda de clases' } },
    ],
  },
  {
    title: { pt: 'Carreras online (Argentina)', es: 'Carreras online' },
    links: [
      { href: '/es_ar/', label: { pt: 'Todas as carreras', es: 'Todas las carreras' } },
      { href: '/es_ar/candles/', label: { pt: 'Velas (Tecnicatura)', es: 'Velas' } },
      { href: '/es_ar/resin/', label: { pt: 'Resinas (Tecnicatura)', es: 'Resinas' } },
      { href: '/es_ar/macrame/', label: { pt: 'Macramé (Tecnicatura)', es: 'Macramé' } },
      { href: '/es_ar/textil/', label: { pt: 'Estampas textiles', es: 'Estampas textiles' } },
      { href: '/es_ar/interiores/', label: { pt: 'Diseño de interiores', es: 'Diseño de interiores' } },
      { href: '/es_ar/mixmedia/', label: { pt: 'Arte mix media (Profesorado)', es: 'Arte mix media' } },
    ],
  },
  {
    title: { pt: 'Online e materiais', es: 'Online y materiales' },
    links: [
      { href: '/velas/', label: { pt: 'Curso online de Velas', es: 'Curso online de Velas' } },
      { href: '/saboaria/', label: { pt: 'Curso online de Saboaria', es: 'Curso online de Jabonería' } },
      { href: '/apostila/', label: { pt: 'Apostila de 60 receitas', es: 'Apostilla de 60 recetas' } },
      { href: company.store, label: { pt: 'Loja (compre seu curso)', es: 'Tienda (compra tu curso)' }, external: true },
      { href: company.platform, label: { pt: 'Plataforma de ensino', es: 'Plataforma de aprendizaje' }, external: true },
    ],
  },
  {
    title: { pt: 'Links e contato', es: 'Enlaces y contacto' },
    links: [
      { href: '/links/br/', label: { pt: 'Links do Instagram (Brasil)', es: 'Enlaces de Instagram (Brasil)' } },
      { href: '/links/arg/', label: { pt: 'Links do Instagram (Argentina)', es: 'Enlaces de Instagram (Argentina)' } },
      { href: '/interest', label: { pt: 'Registrar interesse', es: 'Registrar interés' } },
      { href: `mailto:${company.email}`, hrefEs: `mailto:${company.ar.email}`, label: { pt: company.email, es: company.ar.email } },
      { href: company.whatsappUrl, hrefEs: company.ar.whatsappUrl, label: { pt: `WhatsApp ${company.whatsappLabel}`, es: `WhatsApp ${company.ar.whatsappLabel}` }, external: true },
    ],
  },
];
