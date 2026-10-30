// Carreras online da Argentina (Conservatorio Grassi, profesora Ivana Lerea).
// Fonte: conteudo/carreras-online-ar/carreras.json. Textos e temario vêm daqui; as DATAS vêm do
// feed da agenda (useAgenda('AR')), nunca escritas à mão.
//
// REGRA DO CONSERVATORIO: nenhum preço neste arquivo, nem em qualquer texto, meta ou JSON-LD da
// landing argentina. O valor só aparece na tienda.

import { TIENDA_AR_URL } from '../lib/tienda';

export type ArPageSlug = 'candles' | 'resin' | 'macrame' | 'textil' | 'interiores' | 'mixmedia';

export interface CarreraAr {
  course: string; // valor de `course` no feed (ar-velas, ...)
  nombre: string; // nome oficial completo, com o nível
  nombreConfirmado: boolean; // Profesorados de continuação ainda sem nome oficial confirmado
  nivel: 'tecnicatura' | 'profesorado';
  meses: number;
  continuaCon: string | null;
  page: ArPageSlug;
  sku: string; // SKU da tienda
  enCalendario2027: boolean;
  image: string;
  imagePos: string;
  /** Temario CONFIRMADO pela Ivana (um módulo por mês). Vazio = não publicado: o card não mostra "Ver plan de estudios". */
  temario: string[];
}

export const carreras_ar: Record<string, CarreraAr> = {
  'ar-velas': {
    course: 'ar-velas',
    nombre: "Tecnicatura en arte y diseño de velas",
    nombreConfirmado: true,
    nivel: 'tecnicatura',
    meses: 9,
    continuaCon: "ar-velas-prof",
    page: 'candles',
    sku: 'AR-TEC-VELAS',
    enCalendario2027: true,
    image: '/images/ar/velas.webp',
    imagePos: 'center 30%',
    temario: [
      'Aula 1: Velas aromáticas artesanales',
      'Aula 2: Velas terapéuticas',
      'Aditivos',
      'Etiqueta de seguridad de una vela: protección y prevención esencial',
      'Fabricación de velas con moldes y wax melts',
      'Velas con parafina gel: innovación en decoración',
      'Velas efecto porcelana',
      'Velas globo de nieve',
      'Velas gourmet',
      'Velas aromáticas',
    ],
  },
  'ar-velas-prof': {
    course: 'ar-velas-prof',
    nombre: "Profesorado en arte y diseño de velas",
    nombreConfirmado: false,
    nivel: 'profesorado',
    meses: 9,
    continuaCon: null,
    page: 'candles',
    sku: 'AR-PROF-VELAS',
    enCalendario2027: false,
    image: '/images/ar/velas.webp',
    imagePos: 'center 30%',
    temario: [],
  },
  'ar-resinas': {
    course: 'ar-resinas',
    nombre: "Tecnicatura en arte y decoración con resinas",
    nombreConfirmado: true,
    nivel: 'tecnicatura',
    meses: 9,
    continuaCon: "ar-resinas-prof",
    page: 'resin',
    sku: 'AR-TEC-RESINAS',
    enCalendario2027: true,
    image: '/images/ar/resinas.webp',
    imagePos: 'center',
    temario: [],
  },
  'ar-resinas-prof': {
    course: 'ar-resinas-prof',
    nombre: "Profesorado en arte y decoración con resinas",
    nombreConfirmado: false,
    nivel: 'profesorado',
    meses: 9,
    continuaCon: null,
    page: 'resin',
    sku: 'AR-PROF-RESINAS',
    enCalendario2027: false,
    image: '/images/ar/resinas.webp',
    imagePos: 'center',
    temario: [],
  },
  'ar-macrame': {
    course: 'ar-macrame',
    nombre: "Tecnicatura en macramé",
    nombreConfirmado: true,
    nivel: 'tecnicatura',
    meses: 9,
    continuaCon: "ar-macrame-prof",
    page: 'macrame',
    sku: 'AR-TEC-MACRAME',
    enCalendario2027: true,
    image: '/images/ar/macrame.webp',
    imagePos: 'center',
    temario: [],
  },
  'ar-macrame-prof': {
    course: 'ar-macrame-prof',
    nombre: "Profesorado en macramé",
    nombreConfirmado: false,
    nivel: 'profesorado',
    meses: 9,
    continuaCon: null,
    page: 'macrame',
    sku: 'AR-PROF-MACRAME',
    enCalendario2027: false,
    image: '/images/ar/macrame.webp',
    imagePos: 'center',
    temario: [],
  },
  'ar-estampas': {
    course: 'ar-estampas',
    nombre: "Tecnicatura en estampas textiles",
    nombreConfirmado: true,
    nivel: 'tecnicatura',
    meses: 9,
    continuaCon: null,
    page: 'textil',
    sku: 'AR-TEC-ESTAMPAS',
    enCalendario2027: true,
    image: '/images/ar/estampas.webp',
    imagePos: 'center',
    temario: [],
  },
  'ar-interiores': {
    course: 'ar-interiores',
    nombre: "Tecnicatura en diseño de interiores",
    nombreConfirmado: true,
    nivel: 'tecnicatura',
    meses: 9,
    continuaCon: null,
    page: 'interiores',
    sku: 'AR-TEC-INTERIORES',
    enCalendario2027: true,
    image: '/images/ar/interiores.webp',
    imagePos: 'center',
    temario: [],
  },
  'ar-mixmedia': {
    course: 'ar-mixmedia',
    nombre: "Profesorado en arte mix media",
    nombreConfirmado: true,
    nivel: 'profesorado',
    meses: 18,
    continuaCon: null,
    page: 'mixmedia',
    sku: 'AR-PROF-MIXMEDIA',
    enCalendario2027: false,
    image: '/images/ar/mixmedia.webp',
    imagePos: 'center',
    temario: [],
  },
};

export interface ArPage {
  slug: ArPageSlug;
  path: string; // caminho publicado
  title: string; // título curto da página (sempre com o nível nas carreras)
  courses: string[]; // carreras da página, a principal primeiro
}

export const ar_pages: Record<ArPageSlug, ArPage> = {
  candles:    { slug: 'candles',    path: '/es-ar/carreras/tecnicatura-arte-diseno-velas/',    title: 'Velas',        courses: ['ar-velas', 'ar-velas-prof'] },
  resin:      { slug: 'resin',      path: '/es-ar/carreras/tecnicatura-arte-decoracion-resinas/',      title: 'Resinas',      courses: ['ar-resinas', 'ar-resinas-prof'] },
  macrame:    { slug: 'macrame',    path: '/es-ar/carreras/tecnicatura-macrame/',    title: 'Macramé',      courses: ['ar-macrame', 'ar-macrame-prof'] },
  textil:     { slug: 'textil',     path: '/es-ar/carreras/tecnicatura-estampas-textiles/',     title: 'Estampas textiles', courses: ['ar-estampas'] },
  interiores: { slug: 'interiores', path: '/es-ar/carreras/tecnicatura-diseno-interiores/', title: 'Diseño de interiores', courses: ['ar-interiores'] },
  mixmedia:   { slug: 'mixmedia',   path: '/es-ar/carreras/profesorado-arte-mix-media/',   title: 'Arte mix media', courses: ['ar-mixmedia'] },
};

/** Fundo do herói de cada página de carreras (ilustração da marca, em public/images/ar/). */
export const ar_hero: Record<ArPageSlug, string> = {
  candles: '/images/ar/hero-velas.svg',
  resin: '/images/ar/hero-resinas.svg',
  macrame: '/images/ar/hero-macrame.svg',
  textil: '/images/ar/hero-estampas.svg',
  interiores: '/images/ar/hero-interiores.svg',
  mixmedia: '/images/ar/hero-mixmedia.svg',
};
export const ar_hero_general = '/images/ar/hero-carreras.svg';

/** Carreras de entrada (as 6 da vitrine), na ordem da página inicial. */
export const carreras_principales = [
  'ar-velas',
  'ar-resinas',
  'ar-macrame',
  'ar-estampas',
  'ar-interiores',
  'ar-mixmedia',
] as const;

export const WHATSAPP_AR = 'https://wa.me/5493757201014';

/** Mensagem de inscrição para o WhatsApp AR (fluxo atual: nombre, DNI y e-mail). */
export const whatsappInscripcion = (c: CarreraAr) =>
  `${WHATSAPP_AR}?text=${encodeURIComponent(`¡Hola! Quiero inscribirme en ${c.nombre}`)}`;

/**
 * Destino do botão "Ver valores e inscribirme".
 * Com VITE_TIENDA_AR_URL: <base>/<sku>.html?utm_source=landing&utm_campaign=<course>.
 * Sem ela: WhatsApp AR. A inscrição vale o ano todo, então não há parâmetro de turma.
 */
export function tiendaLink(c: CarreraAr, utm?: string): string {
  if (!TIENDA_AR_URL) return whatsappInscripcion(c);
  const params = new URLSearchParams({ utm_source: 'landing', utm_campaign: utm ?? c.course });
  return `${TIENDA_AR_URL}/${c.sku.toLowerCase()}.html?${params.toString()}`;
}

/** true quando o botão leva à tienda (e não ao WhatsApp provisório). */
export const hayTienda = TIENDA_AR_URL !== '';
