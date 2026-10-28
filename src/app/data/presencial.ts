// Cursos presenciais vendidos em loja.ivana.academy.
// Origem: conteudo/cursos-presenciais/cursos.json (capas copiadas para public/images/cursos).
// Datas, locais e vagas NÃO ficam aqui: vêm do feed da agenda (useAgenda).

export interface PresencialCourse {
  key: string;
  name: string;
  price: number;
  tag: string;
  subtitle: string;
  takesHome: string[];
  duration: string;
  includes: string[];
  image: string; // foto autoral do curso; sem foto, capa da marca (bloco Dusty Rose + folha, como as peças de oferta)
  urlLoja: string;
  naLoja: boolean; // false = ainda sem turma na loja
}

export const presencial_courses: Record<string, PresencialCourse> = {
  'saboaria-extratos': {
    key: 'saboaria-extratos',
    name: "Saboaria e Extratos Naturais",
    price: 265,
    tag: "Workshop presencial",
    subtitle: "Do zero, pelo método melt and pour, em cerca de 3h",
    takesHome: ["Vários tipos de sabonete para levar para casa", "Tinturas-mãe e extratos naturais", "Apostila com receitas, materiais e fornecedores"],
    duration: "cerca de 3 horas",
    includes: ["Todos os materiais", "Café da manhã nas turmas da manhã; cafezinho nas demais", "Apostila com receitas, lista de materiais e fornecedores", "Certificado Ivana Academy"],
    image: '/images/cursos/saboaria-extratos-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-saboaria-extratos.html",
    naLoja: true,
  },
  'velas-aromaticas-moldes': {
    key: 'velas-aromaticas-moldes',
    name: "Velas Aromáticas e de Moldes",
    price: 380,
    tag: "Workshop presencial",
    subtitle: "Do zero, em um encontro de 3h30",
    takesHome: ["Cada aluno leva 2 velas aromáticas e 2 de molde", "Todos os materiais inclusos", "Apostila e certificado"],
    duration: "3h30",
    includes: ["Todos os materiais", "Apostila", "Certificado Ivana Academy"],
    image: '/images/cursos/velas-aromaticas-moldes-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-velas-aromaticas-moldes.html",
    naLoja: true,
  },
  'aromatizantes-perfumes': {
    key: 'aromatizantes-perfumes',
    name: "Aromatizantes e Perfumes",
    price: 330,
    tag: "Workshop presencial",
    subtitle: "6 produtos prontos para levar, em 3h",
    takesHome: ["Home spray, água para tecidos, varetas, body splash, difusor de carro e sachê", "Todos os materiais inclusos e kit pronto", "Apostila, lista de fornecedores e certificado"],
    duration: "3 horas",
    includes: ["Todos os materiais e o kit pronto", "Apostila e lista de fornecedores", "Certificado Ivana Academy", "Café"],
    image: '/images/cursos/aromatizantes-perfumes-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-aromatizantes-perfumes.html",
    naLoja: true,
  },
  'imersao-velas': {
    key: 'imersao-velas',
    name: "Imersão de Velas",
    price: 520,
    tag: "Curso presencial",
    subtitle: "Do zero a todos os tipos de vela, com ceras vegetais",
    takesHome: ["Velas aromáticas, terapêuticas, de molde, wax melts, de massagem e gourmet", "Todas as velas que você fizer, prontas", "Apostila completa e lista de materiais e fornecedores"],
    duration: "o dia todo, das 9h30 às 16h30",
    includes: ["Todos os materiais", "Café da manhã e lanche", "Apostila completa, lista de materiais e fornecedores", "Certificado Ivana Academy"],
    image: '/images/cursos/imersao-velas-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-imersao-velas.html",
    naLoja: true,
  },
  'velas-oratorio': {
    key: 'velas-oratorio',
    name: "Velas de Oratório",
    price: 375,
    tag: "Workshop presencial",
    subtitle: "Resina, moldes e velas com pedras, em 3h",
    takesHome: ["Você leva 4 velas e os moldes", "Aprenda a trabalhar com resina e criar seus moldes", "Apostila completa"],
    duration: "3 horas",
    includes: ["Todos os materiais", "Os moldes que você fizer", "Apostila completa e cafezinho", "Certificado Ivana Academy"],
    image: '/images/cursos/velas-oratorio-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-velas-oratorio.html",
    naLoja: true,
  },
  'velas-gel': {
    key: 'velas-gel',
    name: "Velas Gel",
    price: 320,
    tag: "Workshop presencial",
    subtitle: "Do zero, em cerca de 4h, com café da manhã",
    takesHome: ["Velas em copos estilo latte, drinks, luminárias e autoportantes", "Todos os materiais inclusos", "Você leva um kit de velas completo"],
    duration: "cerca de 4 horas",
    includes: ["Todos os materiais", "Kit de velas completo para levar", "Café da manhã", "Apostila e material de apoio", "Certificado Ivana Academy"],
    image: '/images/cursos/velas-gel-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-velas-gel.html",
    naLoja: false,
  },
  'resina-pedras': {
    key: 'resina-pedras',
    name: "Resina com Pedras",
    price: 220,
    tag: "Workshop presencial",
    subtitle: "Sem precisar de experiência, em cerca de 3h30",
    takesHome: ["Você faz e leva um kit lavabo", "Todos os materiais disponíveis", "Apostila completa"],
    duration: "cerca de 3h30",
    includes: ["Todos os materiais", "Apostila completa", "Cafezinho", "Certificado Ivana Academy"],
    image: '/images/courses/resina-relogio-praia.jpg',
    urlLoja: "https://loja.ivana.academy/curso-resina-pedras.html",
    naLoja: false,
  },
  'workshop-resina': {
    key: 'workshop-resina',
    name: "Workshop de Resina",
    price: 250,
    tag: "Workshop presencial",
    subtitle: "Resina epóxi do zero, em cerca de 3h",
    takesHome: ["Canetas, chaveiros e joias com moldes", "Laminações para quadros, relógios e bandejas", "Caneta, chaveiro, separador de página e bandeja"],
    duration: "cerca de 3 horas",
    includes: ["Todos os materiais", "Apostila e material de apoio", "Certificado Ivana Academy"],
    image: '/images/courses/resina-bandeja-flores.jpg',
    urlLoja: "https://loja.ivana.academy/curso-workshop-resina.html",
    naLoja: false,
  },
  'incensaria-natural': {
    key: 'incensaria-natural',
    name: "Incensaria Natural",
    price: 190,
    tag: "Workshop presencial",
    subtitle: "Vários tipos de incenso para levar, em cerca de 3h",
    takesHome: ["Varetas, cones e palo santo", "Todos os materiais inclusos", "Apostila com passo a passo e receitas"],
    duration: "cerca de 3 horas",
    includes: ["Todos os materiais", "Apostila com passo a passo e receitas", "Certificado Ivana Academy"],
    image: '/images/cursos/incensaria-natural-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-incensaria-natural.html",
    naLoja: false,
  },
  'pecas-concreto': {
    key: 'pecas-concreto',
    name: "Peças em Concreto",
    price: 210,
    tag: "Workshop presencial",
    subtitle: "Misturas, acabamentos, cura e secagem, em 3h",
    takesHome: ["Você leva copos, bandejas e potinhos", "Diversos materiais e acabamentos", "Apostila completa"],
    duration: "3 horas",
    includes: ["Todos os materiais", "Apostila completa", "Certificado Ivana Academy"],
    image: '/images/cursos/pecas-concreto-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-pecas-concreto.html",
    naLoja: false,
  },
  'trico-gigante': {
    key: 'trico-gigante',
    name: "Tricô Gigante",
    price: 320,
    tag: "Workshop presencial",
    subtitle: "Sua manta de lã 100% merino, em cerca de 2h",
    takesHome: ["Manta de ~0,90 x 1,70 m (1 kg de lã)", "Não precisa ter experiência", "Cafezinho incluso"],
    duration: "cerca de 2 horas",
    includes: ["A lã 100% merino (1 kg)", "Cafezinho", "Apostila e material de apoio", "Certificado Ivana Academy"],
    image: '/images/cursos/trico-gigante-foto.jpg',
    urlLoja: "https://loja.ivana.academy/curso-trico-gigante.html",
    naLoja: false,
  },
};

export interface PresencialTheme {
  id: 'velas' | 'saboaria' | 'aromas' | 'resina';
  utm: string;
  courses: string[];
}

export const presencial_themes: Record<PresencialTheme['id'], PresencialTheme> = {
  velas:    { id: 'velas',    utm: 'candles', courses: ['imersao-velas', 'velas-aromaticas-moldes', 'velas-oratorio', 'velas-gel'] },
  saboaria: { id: 'saboaria', utm: 'soap',    courses: ['saboaria-extratos'] },
  aromas:   { id: 'aromas',   utm: 'aromas',  courses: ['aromatizantes-perfumes', 'incensaria-natural'] },
  resina:   { id: 'resina',   utm: 'resin',   courses: ['resina-pedras', 'workshop-resina', 'pecas-concreto', 'trico-gigante'] },
};

export const LOJA_BASE = 'https://loja.ivana.academy';
export const WHATSAPP_URL = 'https://wa.me/5548991671659';

export const brl = (n: number) => `R$ ${n.toLocaleString('pt-BR')}`;

// Link da loja com a turma escolhida: ?turma=<início do id do evento> + UTM da página.
export function lojaLink(course: PresencialCourse, utm: string, eventId?: string): string {
  const params = new URLSearchParams();
  if (eventId) params.set('turma', eventId.slice(0, 8).toUpperCase());
  params.set('utm_source', 'landing');
  params.set('utm_campaign', utm);
  return `${course.urlLoja}?${params.toString()}`;
}

// Home: categoria → tema presencial e página. Categorias sem entrada (macramé) seguem o card antigo.
export const home_category_themes: Record<string, { theme: PresencialTheme['id']; page: string }> = {
  velas:           { theme: 'velas',    page: '/pt-br/cursos/velas/' },
  saboaria:        { theme: 'saboaria', page: '/pt-br/cursos/sabonetes/' },
  aromas_incensos: { theme: 'aromas',   page: '/pt-br/cursos/aromas/' },
  resinas:         { theme: 'resina',   page: '/pt-br/cursos/resinas/' },
};
