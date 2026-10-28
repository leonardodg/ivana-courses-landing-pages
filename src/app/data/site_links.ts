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
      { href: '/pt-br/cursos/velas/', label: { pt: 'Velas', es: 'Velas' } },
      { href: '/pt-br/cursos/sabonetes/', label: { pt: 'Saboaria', es: 'Jabonería' } },
      { href: '/pt-br/cursos/aromas/', label: { pt: 'Aromas e Incensos', es: 'Aromas e Inciensos' } },
      { href: '/pt-br/cursos/resinas/', label: { pt: 'Resina e Decoração', es: 'Resina y Decoración' } },
      { href: '/pt-br/agenda/', label: { pt: 'Agenda de turmas', es: 'Agenda de clases' } },
    ],
  },
  {
    title: { pt: 'Carreras online (Argentina)', es: 'Carreras online' },
    links: [
      { href: '/es-ar/', label: { pt: 'Todas as carreras', es: 'Todas las carreras' } },
      { href: '/es-ar/carreras/tecnicatura-arte-diseno-velas/', label: { pt: 'Tecnicatura en arte y diseño de velas', es: 'Tecnicatura en arte y diseño de velas' } },
      { href: '/es-ar/carreras/tecnicatura-arte-decoracion-resinas/', label: { pt: 'Tecnicatura en arte y decoración con resinas', es: 'Tecnicatura en arte y decoración con resinas' } },
      { href: '/es-ar/carreras/tecnicatura-macrame/', label: { pt: 'Tecnicatura en macramé', es: 'Tecnicatura en macramé' } },
      { href: '/es-ar/carreras/tecnicatura-estampas-textiles/', label: { pt: 'Tecnicatura en estampas textiles', es: 'Tecnicatura en estampas textiles' } },
      { href: '/es-ar/carreras/tecnicatura-diseno-interiores/', label: { pt: 'Tecnicatura en diseño de interiores', es: 'Tecnicatura en diseño de interiores' } },
      { href: '/es-ar/carreras/profesorado-arte-mix-media/', label: { pt: 'Profesorado en arte mix media', es: 'Profesorado en arte mix media' } },
      { href: '/es-ar/agenda/', label: { pt: 'Calendário Cohorte 2027', es: 'Agenda Cohorte 2027' } },
    ],
  },
  {
    title: { pt: 'Online e materiais', es: 'Online y materiales' },
    links: [
      { href: '/pt-br/cursos/online/velas-aromaticas/', label: { pt: 'Curso online de Velas', es: 'Curso online de Velas' } },
      { href: '/pt-br/cursos/online/saboaria-com-extratos-naturais/', label: { pt: 'Curso online de Saboaria', es: 'Curso online de Jabonería' } },
      { href: '/pt-br/apostilas/60-receitas-de-sabonetes/', label: { pt: 'Apostila de 60 receitas', es: 'Apostilla de 60 recetas' } },
      { href: company.store, label: { pt: 'Loja (compre seu curso)', es: 'Tienda (compra tu curso)' }, external: true },
      { href: company.platform, label: { pt: 'Plataforma de ensino', es: 'Plataforma de aprendizaje' }, external: true },
    ],
  },
  {
    title: { pt: 'Links e contato', es: 'Enlaces y contacto' },
    links: [
      { href: '/pt-br/links/', label: { pt: 'Links do Instagram (Brasil)', es: 'Enlaces de Instagram (Brasil)' } },
      { href: '/es-ar/links/', label: { pt: 'Links do Instagram (Argentina)', es: 'Enlaces de Instagram (Argentina)' } },
      { href: '/pt-br/interesse/', label: { pt: 'Registrar interesse', es: 'Registrar interés' } },
      { href: `mailto:${company.email}`, hrefEs: `mailto:${company.ar.email}`, label: { pt: company.email, es: company.ar.email } },
      { href: company.whatsappUrl, hrefEs: company.ar.whatsappUrl, label: { pt: `WhatsApp ${company.whatsappLabel}`, es: `WhatsApp ${company.ar.whatsappLabel}` }, external: true },
    ],
  },
];
