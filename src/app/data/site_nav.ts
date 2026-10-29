// Menu principal do site (um só, em todas as páginas) e pares de idioma do seletor PT | ES.
// Para mudar o menu ou criar uma página equivalente em outro idioma, edite SÓ este arquivo.
import { carreras_ar, carreras_principales, ar_pages } from './carreras_ar';
import { company } from '../legal/company';
import type { CategoryId } from '../classes/types';

export type L = { pt: string; es: string };
export type NavIconKey = 'flame' | 'droplets' | 'wind' | 'gem' | 'play' | 'file' | 'grid' | 'knot' | 'shirt' | 'sofa' | 'palette' | 'calendar' | 'br' | 'ar';

export interface NavItem {
  label: L | string;
  href: string;
  icon?: NavIconKey; // ícone do item (ui/navIcons.tsx)
  /** Home do Brasil: filtra os cards por este segmento em vez de mudar de página. */
  category?: CategoryId;
  external?: boolean;
}
export interface NavGroup { title: L; items: NavItem[] }

/** Brasil ▾: primeira opção, leva à home do Brasil (na própria home, tira o filtro e mostra todos os cursos). */
export const nav_brasil_todos: NavItem = { label: { pt: 'Todos os cursos', es: 'Todos los cursos' }, href: '/pt-br/', icon: 'grid' };

/** Brasil ▾: cursos por modalidade (presencial e online) e, dentro delas, os segmentos. */
export const nav_brasil: NavGroup[] = [
  {
    title: { pt: 'Cursos presenciais', es: 'Cursos presenciales' },
    items: [
      { label: { pt: 'Velas', es: 'Velas' }, href: '/pt-br/cursos/velas/', category: 'velas', icon: 'flame' },
      { label: { pt: 'Sabonetes', es: 'Jabones' }, href: '/pt-br/cursos/sabonetes/', category: 'saboaria', icon: 'droplets' },
      { label: { pt: 'Aromas e incensos', es: 'Aromas e inciensos' }, href: '/pt-br/cursos/aromas/', category: 'aromas_incensos', icon: 'wind' },
      { label: { pt: 'Resina e decoração', es: 'Resina y decoración' }, href: '/pt-br/cursos/resinas/', category: 'resinas', icon: 'gem' },
    ],
  },
  {
    title: { pt: 'Cursos online', es: 'Cursos online' },
    items: [
      { label: { pt: 'Velas aromáticas', es: 'Velas aromáticas' }, href: '/pt-br/cursos/online/velas-aromaticas/', icon: 'play' },
      { label: { pt: 'Saboaria com extratos naturais', es: 'Jabonería con extractos naturales' }, href: '/pt-br/cursos/online/saboaria-com-extratos-naturais/', icon: 'play' },
      { label: { pt: 'Apostila 60 receitas de sabonetes', es: 'Apostilla de 60 recetas de jabones' }, href: '/pt-br/apostilas/60-receitas-de-sabonetes/', icon: 'file' },
    ],
  },
];

const CARRERA_ICON: Record<string, NavIconKey> = {
  'ar-velas': 'flame',
  'ar-resinas': 'gem',
  'ar-macrame': 'knot',
  'ar-estampas': 'shirt',
  'ar-interiores': 'sofa',
  'ar-mixmedia': 'palette',
};

/** Argentina ▾: as carreras (nomes oficiais completos, em espanhol nos dois idiomas). */
export const nav_argentina: NavItem[] = [
  { label: { pt: 'Todas as carreras', es: 'Todas las carreras' }, href: '/es-ar/', icon: 'grid' },
  ...carreras_principales.map((c) => ({ label: carreras_ar[c].nombre, href: ar_pages[carreras_ar[c].page].path, icon: CARRERA_ICON[c] })),
];

/** Agenda ▾: uma por país. */
export const nav_agenda: NavItem[] = [
  { label: { pt: 'Agenda Brasil (turmas presenciais)', es: 'Agenda Brasil (clases presenciales)' }, href: '/pt-br/agenda/', icon: 'br' },
  { label: { pt: 'Agenda Argentina (Cohorte 2027)', es: 'Agenda Argentina (Cohorte 2027)' }, href: '/es-ar/agenda/', icon: 'ar' },
];

/** Contato: WhatsApp do país do idioma da página. */
export const nav_contato = {
  label: { pt: 'Contato', es: 'Contacto' },
  href: { pt: company.whatsappUrl, es: company.ar.whatsappUrl },
};

/** Interesse / Interés: uma página por país. */
export const nav_interesse = { label: { pt: 'Interesse', es: 'Interés' }, href: { pt: '/pt-br/interesse/', es: '/es-ar/interes/' } };

export const nav_portal = { label: { pt: 'Portal do Aluno', es: 'Portal del Alumno' }, href: company.platform };

/**
 * Pares de idioma do seletor PT | ES (e do hreflang, exceto a agenda). Se a página atual tem par, o seletor
 * navega para ele; se não tem, só troca o idioma do menu e do rodapé.
 * Cada linha: [caminho em português, caminho em espanhol].
 */
export const lang_pairs: [string, string][] = [
  ['/pt-br/', '/es-ar/'],
  ['/pt-br/cursos/velas/', '/es-ar/carreras/tecnicatura-arte-diseno-velas/'],
  ['/pt-br/cursos/resinas/', '/es-ar/carreras/tecnicatura-arte-decoracion-resinas/'],
  ['/pt-br/agenda/', '/es-ar/agenda/'],
  ['/pt-br/interesse/', '/es-ar/interes/'],
  ['/pt-br/privacidade/', '/es-ar/privacidad/'],
  ['/pt-br/termos/', '/es-ar/terminos/'],
  ['/pt-br/reembolso/', '/es-ar/reembolso/'],
  ['/pt-br/lgpd/', '/es-ar/derechos/'],
];

const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/** Página equivalente no outro idioma, ou null. */
export function pairFor(pathname: string, target: 'pt' | 'es'): string | null {
  const here = norm(pathname);
  for (const [pt, es] of lang_pairs) {
    if (target === 'es' && here === pt) return es;
    if (target === 'pt' && here === es) return pt;
  }
  return null;
}

export const label = (l: L | string, lang: 'pt' | 'es') => (typeof l === 'string' ? l : l[lang]);
