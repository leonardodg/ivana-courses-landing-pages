// Conteúdo gratuito (/pt-br/conteudo-gratuito/ e /es-ar/contenido-gratuito/): UMA lista para os dois países.
// A página tem um CARD POR CURSO GRATUITO DA PLATAFORMA (Moodle) e cards de MATERIAL (apostila, modelo editável).
// Curso: botão principal = matrícula na plataforma (nome + e-mail); secundário = aula de amostra (a primeira aula,
// só com o e-mail, no player da própria página). Os vídeos continuam públicos no YouTube; o que a plataforma entrega a
// mais está em `included`. Material: sempre por e-mail (o n8n envia o link; ele NÃO está aqui, ver docs/CONTEUDO-GRATUITO.md).
// Para publicar ou tirar algo, edite SÓ este arquivo (foto 16:10 em public/images/free/).
import type { Language } from '../classes/types';

export type FreeCountry = 'BR' | 'AR';
export type FreeKind = 'curso' | 'material';
export type FreeCategory = 'saboaria' | 'velas' | 'arte' | 'macrame' | 'resinas' | 'textil' | 'mixmedia';

export interface FreeLesson {
  id: string; // chave da aula de amostra no n8n (free-content) e nos eventos
  title: string;
  youtubeId: string;
}

export interface FreeCourse {
  id: string; // slug do curso: #hash do card e chave da matrícula no n8n (o id do Moodle vive só no n8n)
  country: FreeCountry;
  category: FreeCategory;
  title: string;
  image: string;
  moodleCourseId: number; // só para conferência/documentação: o navegador NUNCA manda o id do curso
  lessons: FreeLesson[]; // em ordem; a primeira é a aula de amostra
}

export interface FreeMaterial {
  id: string;
  country: FreeCountry;
  category: FreeCategory;
  kind: 'apostila' | 'recurso';
  title: string;
  summary: string;
  image: string;
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

export const free_kinds: Record<FreeKind, { pt: string; es: string }> = {
  curso: { pt: 'Curso gratuito', es: 'Curso gratuito' },
  material: { pt: 'Material', es: 'Material' },
};

const img = (slug: string) => `/images/free/${slug}.webp`;
const yt = (id: string, title: string, youtubeId: string): FreeLesson => ({ id, title, youtubeId });

export const free_courses: FreeCourse[] = [
  // ── Argentina ──
  {
    id: 'macrame-ar', country: 'AR', category: 'macrame', title: 'Macramé', image: img('lampara-macrame'), moodleCourseId: 45,
    lessons: [
      yt('bandolera-macrame', 'Bandolera en macramé, paso a paso', 'ICCkBzXM9mo'),
      yt('hombreras-macrame', 'Hombreras en macramé estilosas, paso a paso', 'LkGuBvuvC_c'),
      yt('lampara-macrame', 'Lámpara de macramé', 'O7w1YImH4w8'),
      yt('porta-macetas', 'Porta macetas en macramé, paso a paso', 'nCqJsqZfqqw'),
      yt('vestido-playa-macrame', 'Vestido de playa en macramé', '4gR205bhOBk'),
      yt('llavero-ondas', 'Llavero ondas en macramé', 'IFKYTJfyLr0'),
      yt('llavero-diamante', 'Llavero punto diamante en macramé', 'sJWKAkBXhb0'),
      yt('agregar-hilos', 'Cómo agregar hilos en macramé', '-0E-6qvIOgU'),
      yt('posa-vasos', 'Posa vasos en macramé', '5ExOgS68Nlk'),
      yt('collar-macrame', 'Collar en macramé, paso a paso', '1NQY_nXaBKo'),
      yt('manta-nordica', 'Manta nórdica, paso a paso', 'XFl0a4DtstM'),
    ],
  },
  {
    id: 'resina-ar', country: 'AR', category: 'resinas', title: 'Resina', image: img('maquina-tumbler'), moodleCourseId: 46,
    lessons: [
      yt('moldes-silicona', 'Cómo hacer moldes de silicona', 'w8fwIRa7o00'),
      yt('lapicera-resina', 'Lapicera de resina, paso a paso', 'rwZ9EKNBKF8'),
      yt('maquina-tumbler', 'Máquina tumbler para vasos de resina', 'DX0boiHI00s'),
      yt('jabonera-resina', 'Jabonera de resina y vidrios, con moldes caseros', '_4K6sQFoVcw'),
      yt('resina-acrilica', 'Resina acrílica, paso a paso', 'op6ByQF4Ur4'),
    ],
  },
  {
    id: 'textil-ar', country: 'AR', category: 'textil', title: 'Tecnicatura textil', image: img('delantal'), moodleCourseId: 47,
    lessons: [
      yt('funda-almohada', 'Cosiendo una funda de almohada, paso a paso', 'VfxMpWyiO0Q'),
      yt('delantal', 'Corte y confección de un delantal', 'LTD3JGi1w0Y'),
      yt('campera-jeans', 'Modificando mi campera de jeans', 'luKdVjssTDg'),
    ],
  },
  {
    id: 'mixmedia-ar', country: 'AR', category: 'mixmedia', title: 'Mix media', image: img('foto-montaje'), moodleCourseId: 48,
    lessons: [yt('foto-montaje', 'Foto montaje en mix media', 'mDYeej908ok')],
  },
  // ── Brasil ──
  {
    id: 'saboaria-br', country: 'BR', category: 'saboaria', title: 'Saboaria', image: img('sabonete-aveia-mel'), moodleCourseId: 49,
    lessons: [
      yt('sabonete-aveia-mel', 'Sabonete glicerinado de aveia e mel (efeito favo de mel)', 'vcqvo7nGRPk'),
      yt('embalar-sabonetes', 'Como embalar sabonetes', 'Zd_Hj0-cDfI'),
    ],
  },
  {
    id: 'velas-br', country: 'BR', category: 'velas', title: 'Velas', image: img('velas-que-crescem'), moodleCourseId: 50,
    lessons: [yt('velas-que-crescem', 'Velas que crescem: efeito forno, passo a passo', 'mVaB7c9f4ho')],
  },
  {
    id: 'arte-br', country: 'BR', category: 'arte', title: 'Artes', image: img('decoupage-pratos'), moodleCourseId: 51,
    lessons: [yt('decoupage-pratos', 'Decoupage sobre pratos, passo a passo', 'wKiLbc2M-eM')],
  },
];

export const free_materials: FreeMaterial[] = [
  { id: 'apostila-60-receitas-de-sabonetes', country: 'BR', category: 'saboaria', kind: 'apostila', title: 'Apostila com 60 receitas de sabonetes', summary: 'PDF gratuito com 60 receitas para começar na saboaria.', image: img('apostila-60-receitas') },
  { id: 'kit-etiquetas-canva', country: 'BR', category: 'saboaria', kind: 'recurso', title: 'Kit de etiquetas editáveis do Canva', summary: 'Modelos prontos para personalizar as etiquetas dos seus sabonetes.', image: img('kit-etiquetas-canva') },
];

export const free_text = {
  pt: {
    title: 'Conteúdo gratuito',
    subtitle: 'Cursos gratuitos na plataforma da Ivana Academy, aulas de amostra e materiais para baixar.',
    filterCategory: 'Filtrar por categoria', allCategories: 'Todas as categorias',
    filterKind: 'Filtrar por tipo', allKinds: 'Todos os tipos',
    empty: 'Nenhum conteúdo com esses filtros.',
    unlocked: 'Aulas de amostra liberadas neste navegador', change: 'Usar outro e-mail',
    lessons: 'aulas', lesson: 'aula',
    enroll: 'Matricular-me grátis', preview: 'Ver aula de amostra', viewLessons: 'Ver aulas', closeLessons: 'Fechar',
    getMaterial: 'Receber por e-mail',
    included: [
      'Aulas em ordem, com controle do que você já assistiu',
      'Atestado de conclusão da Ivana Academy',
      'Apostilas e PDFs no mesmo lugar',
      'Questionários, glossário e fórum',
    ],
    includedTitle: 'O que você recebe na plataforma',
    lessonsTitle: 'Aulas do curso', freeHere: 'Aula de amostra: assista aqui sem se matricular',
    courseIntro: 'Curso gratuito na plataforma de ensino da Ivana Academy. Crie seu acesso e acompanhe seu progresso.',
    factLessons: 'Aulas', factCert: 'Atestado', factCertValue: 'De conclusão', factPrice: 'Valor', factPriceValue: 'Gratuito',
    gateTitle: 'Libere a aula de amostra', gateText: 'Informe seu e-mail e a aula abre na hora.',
    enrollTitle: 'Matricule-se no curso gratuito', enrollText: 'Criamos seu acesso gratuito na plataforma de ensino da Ivana Academy.',
    mailTitle: 'Receba no seu e-mail', mailText: 'Informe seu e-mail e enviamos o link agora mesmo.',
    sentTitle: 'Enviamos para o seu e-mail', sentText: 'Confira a caixa de entrada e também o spam. Se não chegar em alguns minutos, tente de novo.',
    enrollSent: 'Acesso criado', enrollSentText: 'Enviamos um e-mail para você definir a senha e entrar no curso. Confira também o spam.',
    invalidName: 'Informe nome e sobrenome.', firstName: 'Nome', lastName: 'Sobrenome',
    email: 'Seu e-mail', submit: 'Liberar aula', sending: 'Enviando…', close: 'Fechar',
    invalid: 'Informe um e-mail válido.', failed: 'Não deu certo agora. Tente novamente em instantes.', limited: 'Muitas tentativas. Aguarde um minuto.',
  },
  es: {
    title: 'Contenido gratuito',
    subtitle: 'Cursos gratuitos en la plataforma de Ivana Academy, clases de muestra y materiales para descargar.',
    filterCategory: 'Filtrar por categoría', allCategories: 'Todas las categorías',
    filterKind: 'Filtrar por tipo', allKinds: 'Todos los tipos',
    empty: 'No hay contenido con esos filtros.',
    unlocked: 'Clases de muestra habilitadas en este navegador', change: 'Usar otro e-mail',
    lessons: 'clases', lesson: 'clase',
    enroll: 'Inscribirme gratis', preview: 'Ver clase de muestra', viewLessons: 'Ver clases', closeLessons: 'Cerrar',
    getMaterial: 'Recibir por e-mail',
    included: [
      'Clases en orden, con control de lo que ya viste',
      'Constancia de finalización de Ivana Academy',
      'Apostillas y PDF en un solo lugar',
      'Cuestionarios, glosario y foro',
    ],
    includedTitle: 'Lo que recibís en la plataforma',
    lessonsTitle: 'Clases del curso', freeHere: 'Clase de muestra: mirala acá sin inscribirte',
    courseIntro: 'Curso gratuito en la plataforma de aprendizaje de Ivana Academy. Creá tu acceso y seguí tu progreso.',
    factLessons: 'Clases', factCert: 'Constancia', factCertValue: 'De finalización', factPrice: 'Valor', factPriceValue: 'Gratis',
    gateTitle: 'Habilitá la clase de muestra', gateText: 'Dejá tu e-mail y la clase se abre al instante.',
    enrollTitle: 'Inscribite en el curso gratuito', enrollText: 'Creamos tu acceso gratuito en la plataforma de aprendizaje de Ivana Academy.',
    mailTitle: 'Recibilo en tu e-mail', mailText: 'Dejá tu e-mail y te enviamos el enlace ahora mismo.',
    sentTitle: 'Te lo enviamos por e-mail', sentText: 'Revisá la bandeja de entrada y también el spam. Si no llega en unos minutos, intentá de nuevo.',
    enrollSent: 'Acceso creado', enrollSentText: 'Te enviamos un e-mail para definir tu contraseña y entrar al curso. Revisá también el spam.',
    invalidName: 'Ingresá nombre y apellido.', firstName: 'Nombre', lastName: 'Apellido',
    email: 'Tu e-mail', submit: 'Habilitar clase', sending: 'Enviando…', close: 'Cerrar',
    invalid: 'Ingresá un e-mail válido.', failed: 'No se pudo ahora. Intentá de nuevo en unos instantes.', limited: 'Demasiados intentos. Esperá un minuto.',
  },
} satisfies Record<Language, Record<string, string | string[]>>;
