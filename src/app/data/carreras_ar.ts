// Carreras online da Argentina (Conservatorio Grassi, profesora Ivana Lerea).
// Fonte: conteudo/carreras-online-ar/carreras.json. Textos e temario vêm daqui; as DATAS vêm do
// feed da agenda (useAgenda('AR')), nunca escritas à mão.
//
// REGRA DO CONSERVATORIO: nenhum preço neste arquivo, nem em qualquer texto, meta ou JSON-LD da
// landing argentina. O valor só aparece na tienda.

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
  /** Rascunho: títulos das apostilas. Só aparece em DEV até a Ivana confirmar. */
  temarioBorrador: string[];
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
    image: '/images/ar/velas.jpg',
    imagePos: 'center 30%',
    temarioBorrador: ["Aditivos", "Aula 2Velas teraeuticas", "Aula1Velas Aromaticas Artesanales", "Etiqueta de Seguridad de una Vela Proteccion y Prevencion Esencial", "Fabricacion de Velas con Moldes y Wax Melts", "Velas con Parafina Gel Innovacion en Decoracion", "Velas efecto porcelana", "Velas globo de nieve", "Velas gourmet", "Velasaromaticas"],
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
    image: '/images/ar/velas.jpg',
    imagePos: 'center 30%',
    temarioBorrador: ["Aula 1", "Bandeja Mix Media", "Cera APF para velas en moldes y wax melts caracteristicas y uso", "Cópia de Bandeja Mix Media", "Curso de Velas Pilar con Piedras y Resinas Guia Paso a Paso", "Espejo", "Guia Completa", "Tapiz portamacetas", "Vela Horneada Ivana Academy", "Velas Terapéuticas. Las velas terapéuticas son velas creadas con ceras vegetales y aceites esenciales, trayendo las propiedades aroma terapéuticas de los mismos. Podemos optar por usar cera de soj", "Velas cóctel", "Velas Pilar hechas en Base de Concreto", "Velas con efecto marmol", "Velas de Gel y Cera de Soja", "Velas en gel", "Velas globo de nieve"],
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
    image: '/images/ar/resinas.jpg',
    imagePos: 'center',
    temarioBorrador: ["Aplicacion de Resina Epoxi 2", "Aula 1 resina epoxi", "Aula 2 resina con moldes", "Aula 9", "Creacion de un Reloj de Pared Efecto Mar con Resina sobre MDF", "Cuadro Geoda", "Encapsulados con Resina Epoxi y Terminaciones con Resina UV", "Jaboneras reciclando", "Joyas Botanicas con Resina UV Inspiracion y Tendencias", "Mesas de Rio con Resina Arte y Tecnica en Madera y Epoxi", "Paso a Paso para Decorar Vasos con Resinas Epoxi", "Pigmentos para Resina Definicion Tipos y Aplicaciones", "Presentacion del Proyecto", "Profesorado Resinas Efecto3D IvanaAcademy", "Tecnicatura en resinas", "Untitled", "guia resina epoxi pisos", "ultimo TP resina"],
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
    image: '/images/ar/resinas.jpg',
    imagePos: 'center',
    temarioBorrador: [],
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
    image: '/images/ar/macrame.jpg',
    imagePos: 'center',
    temarioBorrador: ["Aula 2 espejo", "Porta Macetas de Macrame", "Portamacetas", "Tapiz Porta Macetas", "Tapiz con repiza", "Tapiz de Hojas en Macrame", "Tapiz mediano bicolor", "tapiz semicircular"],
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
    image: '/images/ar/macrame.jpg',
    imagePos: 'center',
    temarioBorrador: ["Arbol de la Vida en Macrame Guia Paso a Paso", "Arbol de navidad", "Cama Para gato circular", "Encordado", "Lampara en macrame combinando nudos", "Sandalias de Macrame Personalizadas", "Vestido en Macrame Materiales"],
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
    image: '/images/ar/estampas.jpg',
    imagePos: 'center',
    temarioBorrador: ["Ecoprint La Alquimia Botanica sobre Tejidos Naturales", "Estampa tus Propias Creaciones", "Guia Creativa", "marmolado ivana academy", "preparacion lienzo eco print"],
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
    image: '/images/ar/interiores.jpg',
    imagePos: 'center',
    temarioBorrador: ["Arte y Revolucion", "Estilos", "Estilos en Diseno de Interiores Moderno Vintage Rustico Nordico Shabby Chic Industrial y Minimalista", "Iluminacion y Cortinas La Sinergia Perfecta en Diseno de Interiores", "Intervencion en Paredes", "Intervencion en pisos renovacion sin obras", "Tapiceria basica", "Tecnicatura en diseno de interiores"],
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
    image: '/images/ar/mixmedia.jpg',
    imagePos: 'center',
    temarioBorrador: ["Alambrismo Artesanal Creando Belleza con Hilos de Metal", "Apostilla Papel Mache y Cartapesta Ivana Academy ES 1Hoja", "Arte Mix Media y Fotomontaje", "Arte Mix media", "Cartapesta y Papel Mache Ivana Academy", "Craquelado sobre Madera", "Cuadro con relieve y hojas de oro", "Decoupage Invertido con Servilletas sobre Platos Transparentes", "El Circulo Cromatico", "Falso Decapado y Sublimacion sobre Madera Tecnicas y Aplicaciones", "Falso Enlozado Arte y Reciclaje en Latas Vidrios y Plasticos", "Guia Completa de Tecnicas Pictoricas y Decorativas", "Introduccion a la Teoria del Color", "Introduccion al Arte Mix Media Transformando una Bandeja de MDF", "Ivana Academy Decoracion Frascos", "Mariposa", "Materiales aula 8 Mix M", "Patinas Artesanales sobre Madera Yeso y Metal Arte y Ciencia del Envejecimiento Controlado", "Pinturas con Lacas Vitrales Arte Luminoso", "Steampunk y Arte Mix Media Creando una Caja Costurero con Piezas Cotidianas", "Sublimacion en Casa", "Tapiz con repiza"],
  },
};

export interface ArPage {
  slug: ArPageSlug;
  path: string; // caminho publicado
  title: string; // título curto da página (sempre com o nível nas carreras)
  courses: string[]; // carreras da página, a principal primeiro
}

export const ar_pages: Record<ArPageSlug, ArPage> = {
  candles:    { slug: 'candles',    path: '/es_ar/candles/',    title: 'Velas',        courses: ['ar-velas', 'ar-velas-prof'] },
  resin:      { slug: 'resin',      path: '/es_ar/resin/',      title: 'Resinas',      courses: ['ar-resinas', 'ar-resinas-prof'] },
  macrame:    { slug: 'macrame',    path: '/es_ar/macrame/',    title: 'Macramé',      courses: ['ar-macrame', 'ar-macrame-prof'] },
  textil:     { slug: 'textil',     path: '/es_ar/textil/',     title: 'Estampas textiles', courses: ['ar-estampas'] },
  interiores: { slug: 'interiores', path: '/es_ar/interiores/', title: 'Diseño de interiores', courses: ['ar-interiores'] },
  mixmedia:   { slug: 'mixmedia',   path: '/es_ar/mixmedia/',   title: 'Arte mix media', courses: ['ar-mixmedia'] },
};

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

/** Base da tienda (ex.: https://tienda.ivana.academy). Vazia até a tienda existir. */
const TIENDA_AR_URL = ((import.meta.env.VITE_TIENDA_AR_URL as string | undefined) ?? '').trim().replace(/\/+$/, '');

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
