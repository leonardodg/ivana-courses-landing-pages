// Conteúdo gratuito (/pt-br/conteudo-gratuito/ e /es-ar/contenido-gratuito/): UMA lista para os dois países.
// Para publicar ou tirar um conteúdo, edite SÓ este arquivo (e coloque a foto 16:10 em public/images/free/).
// Vídeo: `youtubeId` (abre no player depois do e-mail). Apostila/recurso: NÃO têm link aqui: o n8n recebe o `item_id`
// e ENVIA O LINK POR E-MAIL (valida o endereço e mantém o link fora do código público; ver docs/CONTEUDO-GRATUITO.md).
// Miniaturas dos vídeos ficam no próprio site (nada do YouTube carrega antes do e-mail).
import type { Language } from '../classes/types';

export type FreeCountry = 'BR' | 'AR';
export type FreeType = 'video' | 'apostila' | 'recurso';
export type FreeCategory = 'saboaria' | 'velas' | 'arte' | 'macrame' | 'resinas' | 'textil' | 'mixmedia';

export interface FreeItem {
  id: string; // vira o #hash do card e a chave nos eventos
  country: FreeCountry; // país/idioma do conteúdo
  category: FreeCategory;
  type: FreeType;
  title: string; // já no idioma do país
  summary?: string;
  image: string;
  youtubeId?: string;
  /** Curso gratuito equivalente na plataforma (Moodle), quando houver. */
  moodleCourseId?: number;
}

export const free_categories: Record<FreeCategory, { pt: string; es: string }> = {
  saboaria: { pt: 'Saboaria', es: 'Jabonería' },
  velas: { pt: 'Velas', es: 'Velas' },
  arte: { pt: 'Arte', es: 'Arte' },
  macrame: { pt: 'Macramé', es: 'Macramé' },
  resinas: { pt: 'Resina', es: 'Resina' },
  textil: { pt: 'Tecnicatura textil', es: 'Tecnicatura textil' },
  mixmedia: { pt: 'Mix media', es: 'Mix media' },
};

export const free_types: Record<FreeType, { pt: string; es: string; cta: { pt: string; es: string } }> = {
  video: { pt: 'Vídeo aula', es: 'Video clase', cta: { pt: 'Assistir grátis', es: 'Ver gratis' } },
  apostila: { pt: 'Apostila PDF', es: 'Apostilla PDF', cta: { pt: 'Receber por e-mail', es: 'Recibir por e-mail' } },
  recurso: { pt: 'Modelo editável', es: 'Modelo editable', cta: { pt: 'Receber por e-mail', es: 'Recibir por e-mail' } },
};

const img = (slug: string) => `/images/free/${slug}.webp`;

export const free_items: FreeItem[] = [
  // ── Brasil ──
  { id: 'apostila-60-receitas-de-sabonetes', country: 'BR', category: 'saboaria', type: 'apostila', title: 'Apostila com 60 receitas de sabonetes', summary: 'PDF gratuito com 60 receitas para começar na saboaria.', image: '/images/free/apostila-60-receitas.webp' },
  { id: 'kit-etiquetas-canva', country: 'BR', category: 'saboaria', type: 'recurso', title: 'Kit de etiquetas editáveis do Canva', summary: 'Modelos prontos para personalizar as etiquetas dos seus sabonetes.', image: '/images/free/kit-etiquetas-canva.webp' },
  { id: 'sabonete-aveia-mel', country: 'BR', category: 'saboaria', type: 'video', title: 'Sabonete glicerinado de aveia e mel (efeito favo de mel)', image: img('sabonete-aveia-mel'), youtubeId: 'vcqvo7nGRPk' },
  { id: 'embalar-sabonetes', country: 'BR', category: 'saboaria', type: 'video', title: 'Como embalar sabonetes', image: img('embalar-sabonetes'), youtubeId: 'Zd_Hj0-cDfI' },
  { id: 'velas-que-crescem', country: 'BR', category: 'velas', type: 'video', title: 'Velas que crescem: efeito forno, passo a passo', image: img('velas-que-crescem'), youtubeId: 'mVaB7c9f4ho' },
  { id: 'decoupage-pratos', country: 'BR', category: 'arte', type: 'video', title: 'Decoupage sobre pratos, passo a passo', image: img('decoupage-pratos'), youtubeId: 'wKiLbc2M-eM' },
  // ── Argentina ──
  { id: 'llavero-ondas', country: 'AR', category: 'macrame', type: 'video', title: 'Llavero ondas en macramé', image: img('llavero-ondas'), youtubeId: 'IFKYTJfyLr0' },
  { id: 'llavero-diamante', country: 'AR', category: 'macrame', type: 'video', title: 'Llavero punto diamante en macramé', image: img('llavero-diamante'), youtubeId: 'sJWKAkBXhb0' },
  { id: 'agregar-hilos', country: 'AR', category: 'macrame', type: 'video', title: 'Cómo agregar hilos en macramé', image: img('agregar-hilos'), youtubeId: '-0E-6qvIOgU' },
  { id: 'posa-vasos', country: 'AR', category: 'macrame', type: 'video', title: 'Posa vasos en macramé', image: img('posa-vasos'), youtubeId: '5ExOgS68Nlk' },
  { id: 'porta-macetas', country: 'AR', category: 'macrame', type: 'video', title: 'Porta macetas en macramé, paso a paso', image: img('porta-macetas'), youtubeId: 'nCqJsqZfqqw' },
  { id: 'collar-macrame', country: 'AR', category: 'macrame', type: 'video', title: 'Collar en macramé, paso a paso', image: img('collar-macrame'), youtubeId: '1NQY_nXaBKo' },
  { id: 'moldes-silicona', country: 'AR', category: 'resinas', type: 'video', title: 'Cómo hacer moldes de silicona', image: img('moldes-silicona'), youtubeId: 'w8fwIRa7o00' },
  { id: 'lapicera-resina', country: 'AR', category: 'resinas', type: 'video', title: 'Lapicera de resina, paso a paso', image: img('lapicera-resina'), youtubeId: 'rwZ9EKNBKF8' },
  { id: 'maquina-tumbler', country: 'AR', category: 'resinas', type: 'video', title: 'Máquina tumbler para vasos de resina', image: img('maquina-tumbler'), youtubeId: 'DX0boiHI00s' },
  { id: 'jabonera-resina', country: 'AR', category: 'resinas', type: 'video', title: 'Jabonera de resina y vidrios, con moldes caseros', image: img('jabonera-resina'), youtubeId: '_4K6sQFoVcw' },
  { id: 'resina-acrilica', country: 'AR', category: 'resinas', type: 'video', title: 'Resina acrílica, paso a paso', image: img('resina-acrilica'), youtubeId: 'op6ByQF4Ur4' },
  { id: 'funda-almohada', country: 'AR', category: 'textil', type: 'video', title: 'Cosiendo una funda de almohada, paso a paso', image: img('funda-almohada'), youtubeId: 'VfxMpWyiO0Q' },
  { id: 'delantal', country: 'AR', category: 'textil', type: 'video', title: 'Corte y confección de un delantal', image: img('delantal'), youtubeId: 'LTD3JGi1w0Y' },
  { id: 'campera-jeans', country: 'AR', category: 'textil', type: 'video', title: 'Modificando mi campera de jeans', image: img('campera-jeans'), youtubeId: 'luKdVjssTDg' },
  { id: 'foto-montaje', country: 'AR', category: 'mixmedia', type: 'video', title: 'Foto montaje en mix media', image: img('foto-montaje'), youtubeId: 'mDYeej908ok' },
];

export const free_text = {
  pt: {
    title: 'Conteúdo gratuito',
    subtitle: 'Vídeo aulas e apostilas de graça. Informe seu e-mail uma vez e libere tudo.',
    filterCategory: 'Filtrar por categoria', allCategories: 'Todas as categorias',
    filterType: 'Filtrar por tipo', allTypes: 'Todos os tipos',
    empty: 'Nenhum conteúdo com esses filtros.',
    unlocked: 'Acesso liberado neste navegador', change: 'Usar outro e-mail',
    gateTitle: 'Libere o conteúdo gratuito', gateText: 'Informe seu e-mail e o acesso é liberado na hora.',
    email: 'Seu e-mail', submit: 'Liberar acesso', sending: 'Enviando…', close: 'Fechar',
    invalid: 'Informe um e-mail válido.', failed: 'Não deu certo agora. Tente novamente em instantes.', limited: 'Muitas tentativas. Aguarde um minuto.',
    mailTitle: 'Receba no seu e-mail', mailText: 'Informe seu e-mail e enviamos o link agora mesmo.',
    sentTitle: 'Enviamos para o seu e-mail', sentText: 'Confira a caixa de entrada e também o spam. Se não chegar em alguns minutos, tente de novo.',
  },
  es: {
    title: 'Contenido gratuito',
    subtitle: 'Video clases y apostillas gratis. Dejá tu e-mail una vez y accedé a todo.',
    filterCategory: 'Filtrar por categoría', allCategories: 'Todas las categorías',
    filterType: 'Filtrar por tipo', allTypes: 'Todos los tipos',
    empty: 'No hay contenido con esos filtros.',
    unlocked: 'Acceso habilitado en este navegador', change: 'Usar otro e-mail',
    gateTitle: 'Accedé al contenido gratuito', gateText: 'Dejá tu e-mail y el acceso se habilita al instante.',
    email: 'Tu e-mail', submit: 'Habilitar acceso', sending: 'Enviando…', close: 'Cerrar',
    invalid: 'Ingresá un e-mail válido.', failed: 'No se pudo ahora. Intentá de nuevo en unos instantes.', limited: 'Demasiados intentos. Esperá un minuto.',
    mailTitle: 'Recibilo en tu e-mail', mailText: 'Dejá tu e-mail y te enviamos el enlace ahora mismo.',
    sentTitle: 'Te lo enviamos por e-mail', sentText: 'Revisá la bandeja de entrada y también el spam. Si no llega en unos minutos, intentá de nuevo.',
  },
} satisfies Record<Language, Record<string, string>>;
