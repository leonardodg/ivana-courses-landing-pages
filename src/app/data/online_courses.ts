// Páginas de venda dos cursos online e da apostila (Hotmart): /velas/, /saboaria/ e /apostila/.
// Conteúdo migrado das antigas páginas estáticas (public/<slug>/index.html) para o padrão do site:
// a página é montada por pages/OnlineCoursePageApp.tsx só com componentes de ui/.
// Títulos aceitam *destaque* (itálico Rosé Profundo). Preço e links da Hotmart ficam aqui, num lugar só.

export interface OnlineBuy { href: string; label: string }

export type OnlineBlock =
  | { type: 'reviews'; eyebrow: string; title: string; items: { text: string; cite: string; big: boolean }[]; note: string }
  | { type: 'learn'; eyebrow: string; title: string; items: string[] }
  | { type: 'gallery'; eyebrow: string; title: string; items: { src: string; alt: string; caption: string; wide: boolean }[] }
  | { type: 'modules'; eyebrow: string; title: string; items: { eyebrow: string; title: string; lessons: string[] }[] }
  | { type: 'included'; eyebrow: string; title: string; items: { title: string; text: string }[] }
  | { type: 'audience'; eyebrow: string; title: string; items: string[] }
  | { type: 'groups'; eyebrow: string; title: string; groups: { n: string; title: string; text: string }[]; learn: string[] }
  | { type: 'profile'; eyebrow: string; title: string; img: { src: string; alt: string }; text: string }
  | { type: 'faq'; eyebrow: string; title: string; items: { q: string; a: string }[] }
  | { type: 'final'; title: string; small: string };

export interface OnlineCourse {
  slug: 'velas' | 'saboaria' | 'apostila';
  path: string;
  title: string; // <title>
  name: string; // nome do produto (JSON-LD)
  desc: string; // meta description
  kind: 'Course' | 'Product';
  price: string; // BRL, só JSON-LD
  sku: string;
  eyebrow: string;
  h1: string;
  lead: string;
  price_label: { main: string; sub: string };
  buy: OnlineBuy;
  guarantee: string;
  hero_img: { src: string; alt: string };
  stats: { value: string; label: string }[];
  sections: OnlineBlock[];
}

export const online_courses: Record<OnlineCourse['slug'], OnlineCourse> = {
  "velas": {
    "slug": "velas",
    "path": "/velas/",
    "title": "Velas Aromáticas Online | Ivana Academy",
    "name": "Curso online de Velas Aromáticas, com moldes e wax melts",
    "desc": "Aprenda velas aromáticas, velas em moldes e wax melts do zero, com videoaulas passo a passo da Ivana Lerea. 12x R$ 16,42 ou R$ 197. Garantia de 7 dias.",
    "kind": "Course",
    "price": "197",
    "sku": "hotmart-L107965905C",
    "eyebrow": "Curso online gravado",
    "h1": "Velas aromáticas, com *moldes e wax melts*",
    "lead": "Aprenda do zero, com videoaulas passo a passo, e já saia produzindo. Com a Ivana Lerea, da Ivana Academy.",
    "price_label": {
      "main": "12x R$ 16,42",
      "sub": "sem juros no cartão · ou R$ 197 no total"
    },
    "buy": {
      "href": "https://pay.hotmart.com/L107965905C",
      "label": "Quero entrar no curso"
    },
    "guarantee": "Garantia de 7 dias. Se não gostar, você pede o reembolso.",
    "hero_img": {
      "alt": "Ivana Lerea de avental, segurando duas velas em copo",
      "src": "/images/online/velas-03.jpg"
    },
    "stats": [
      {
        "value": "+3.000",
        "label": "alunas na Ivana Academy"
      },
      {
        "value": "Online",
        "label": "e presencial em Florianópolis"
      },
      {
        "value": "12 mil",
        "label": "seguidoras no @ivana.lerea.br"
      }
    ],
    "sections": [
      {
        "eyebrow": "Quem já fez um curso com a Ivana",
        "title": "O que dizem as *alunas*",
        "type": "reviews",
        "items": [
          {
            "text": "Amei muito o curso e a companhia de vocês! Nossa Profe é maravilhosa, sempre muito dedicada e impecável em tudo o que faz!",
            "cite": "Lirane M. · aluna de saboaria",
            "big": true
          },
          {
            "text": "Seus cursos são ótimos, uma linguagem didática excelente para o aprendizado, eu amei em fazer.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          },
          {
            "text": "Amei o curso. Foi muito enriquecedor pra mim a troca que tivemos.",
            "cite": "Luciene · aluna de velas, Lisboa",
            "big": false
          },
          {
            "text": "Eu amei tudo! Foi muito bom! Nada é por acaso, tudo é aprendizado!",
            "cite": "Fernanda · aluna de velas, Rio",
            "big": false
          },
          {
            "text": "Você ministra maravilhosamente bem. Muito profissional. Quero fazer muitos cursos com você.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          },
          {
            "text": "Amei o curso, em breve pretendo fazer outros.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          }
        ],
        "note": "Mensagens reais enviadas pelas alunas nos grupos dos cursos da Ivana Academy, publicadas com o texto original."
      },
      {
        "eyebrow": "O que você aprende",
        "title": "Da primeira vela ao seu *próprio ateliê*",
        "type": "learn",
        "items": [
          "Trabalhar com ceras, essências e moldes",
          "Fazer velas aromáticas, velas em moldes e wax melts",
          "Seguir o passo a passo em videoaulas, sem precisar de experiência",
          "Usar as apostilas para acertar quantidades e proporções",
          "Saber onde comprar os materiais, com a lista de fornecedores",
          "Bônus: velas veganas com óleos essenciais"
        ]
      },
      {
        "eyebrow": "Velas para inspirar",
        "title": "O que você pode *criar*",
        "type": "gallery",
        "items": [
          {
            "src": "/images/online/velas-04.jpg",
            "alt": "Velas moldáveis brancas em formatos variados",
            "caption": "Velas moldáveis em formatos variados",
            "wide": true
          },
          {
            "src": "/images/online/velas-05.jpg",
            "alt": "Vela de cera cremosa em pote de madeira com pavio de madeira",
            "caption": "Vela aromática, com diversos pavios",
            "wide": false
          },
          {
            "src": "/images/online/velas-06.jpg",
            "alt": "Vela espiral branca sobre bandeja de bambu",
            "caption": "",
            "wide": false
          },
          {
            "src": "/images/online/velas-07.jpg",
            "alt": "Vela em copo com pavio de madeira e logo da Ivana Academy",
            "caption": "Vela aromática, com diversos pavios",
            "wide": false
          },
          {
            "src": "/images/online/velas-08.jpg",
            "alt": "Velas em formato de rosas e ursinho em caixas rosa",
            "caption": "",
            "wide": false
          }
        ]
      },
      {
        "eyebrow": "Conteúdo do curso",
        "title": "Aula por aula, do *material ao acabamento*",
        "type": "modules",
        "items": [
          {
            "eyebrow": "Módulo 1 · 12 aulas",
            "title": "Velas aromáticas",
            "lessons": [
              "Introdução e boas-vindas",
              "O que é uma vela aromática?",
              "Lista de materiais",
              "Lista da matéria-prima",
              "Tipos e tamanhos de pavios",
              "Testes de pavios",
              "Essências",
              "Calcular quantidade",
              "Preparação de recipientes",
              "Passo a passo de vela aromática",
              "Acabamento e cura",
              "Velas veganas com óleos essenciais"
            ]
          },
          {
            "eyebrow": "Módulo 2 · 6 aulas",
            "title": "Velas com moldes e wax melts",
            "lessons": [
              "Introdução",
              "Lista de materiais",
              "Passo a passo",
              "Escolha de pavios",
              "Corantes",
              "Desenforme"
            ]
          }
        ]
      },
      {
        "eyebrow": "O que está incluso",
        "title": "Tudo para *começar a produzir*",
        "type": "included",
        "items": [
          {
            "title": "Aulas gravadas",
            "text": "Assista quando quiser e quantas vezes precisar, na plataforma Ivana Academy."
          },
          {
            "title": "Apostila",
            "text": "Apostilas com quantidades e proporções para você seguir com segurança."
          },
          {
            "title": "Fornecedores",
            "text": "Lista de onde comprar ceras, essências, moldes e embalagens."
          },
          {
            "title": "Bônus",
            "text": "Velas veganas com óleos essenciais."
          },
          {
            "title": "Grupo de alunas",
            "text": "Grupo para receber informações e novidades da Ivana Academy."
          }
        ]
      },
      {
        "eyebrow": "Para quem é",
        "title": "Este curso é *para você* se",
        "type": "audience",
        "items": [
          "Nunca fez vela e quer começar do zero, sem complicação.",
          "Quer uma renda extra vendendo velas artesanais.",
          "Já faz velas e quer aprender moldes e wax melts."
        ]
      },
      {
        "eyebrow": "Sua professora",
        "title": "Ivana Lerea, da *Ivana Academy*",
        "type": "profile",
        "img": {
          "src": "/images/online/velas-09.jpg",
          "alt": "Ivana Lerea sorrindo, com velas e wax melts sobre a mesa"
        },
        "text": "Mais de 3.000 alunas já aprenderam com a Ivana, online e em cursos presenciais em Florianópolis, em outras cidades do Brasil e na Argentina. Agora você leva o jeito dela de ensinar, com linguagem simples e passo a passo, para assistir em casa, no seu ritmo."
      },
      {
        "eyebrow": "Dúvidas",
        "title": "Perguntas frequentes",
        "type": "faq",
        "items": [
          {
            "q": "Como recebo o acesso?",
            "a": "Depois da compra na Hotmart você recebe a aula \"Como acessar o curso na plataforma\". Ela tem o link, o passo a passo para criar sua conta e a chave de inscrição."
          },
          {
            "q": "Por quanto tempo posso assistir?",
            "a": "As aulas são gravadas. Você assiste no seu ritmo, quantas vezes quiser."
          },
          {
            "q": "Preciso ter experiência?",
            "a": "Não. O curso foi feito para quem quer começar, com videoaulas passo a passo."
          },
          {
            "q": "E se eu não gostar?",
            "a": "Você tem 7 dias para pedir o reembolso direto pela Hotmart."
          }
        ]
      },
      {
        "title": "Pronta para fazer sua *primeira vela*?",
        "type": "final",
        "small": "Compra segura pela Hotmart. Garantia de 7 dias."
      }
    ]
  },
  "saboaria": {
    "slug": "saboaria",
    "path": "/saboaria/",
    "title": "Saboaria com Extratos Naturais | Ivana Academy",
    "name": "Curso online de Saboaria com Extratos Naturais",
    "desc": "Aprenda a fazer sabonetes de base glicerinada com extratos e tinturas naturais, no seu ritmo, com a Ivana Lerea. 12x R$ 16,42 ou R$ 197. Garantia de 7 dias.",
    "kind": "Course",
    "price": "197",
    "sku": "hotmart-F107966501Y",
    "eyebrow": "Curso online gravado",
    "h1": "Saboaria artesanal com *extratos naturais*",
    "lead": "Aprenda a fazer sabonetes de base glicerinada com extratos e tinturas, no seu ritmo, com a Ivana Lerea.",
    "price_label": {
      "main": "12x R$ 16,42",
      "sub": "sem juros no cartão · ou R$ 197 no total"
    },
    "buy": {
      "href": "https://pay.hotmart.com/F107966501Y?off=3rpeex9f",
      "label": "Quero entrar no curso"
    },
    "guarantee": "Garantia de 7 dias. Se não gostar, você pede o reembolso.",
    "hero_img": {
      "alt": "Ivana Lerea de avental, segurando uma barra de base glicerinada perolada",
      "src": "/images/online/saboaria-03.jpg"
    },
    "stats": [
      {
        "value": "+3.000",
        "label": "alunas na Ivana Academy"
      },
      {
        "value": "Online",
        "label": "e presencial em Florianópolis"
      },
      {
        "value": "12 mil",
        "label": "seguidoras no @ivana.lerea.br"
      }
    ],
    "sections": [
      {
        "eyebrow": "Quem já fez um curso com a Ivana",
        "title": "O que dizem as *alunas*",
        "type": "reviews",
        "items": [
          {
            "text": "Amei muito o curso e a companhia de vocês! Nossa Profe é maravilhosa, sempre muito dedicada e impecável em tudo o que faz!",
            "cite": "Lirane M. · aluna de saboaria",
            "big": true
          },
          {
            "text": "Seus cursos são ótimos, uma linguagem didática excelente para o aprendizado, eu amei em fazer.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          },
          {
            "text": "Amei o curso. Foi muito enriquecedor pra mim a troca que tivemos.",
            "cite": "Luciene · aluna de velas, Lisboa",
            "big": false
          },
          {
            "text": "Eu amei tudo! Foi muito bom! Nada é por acaso, tudo é aprendizado!",
            "cite": "Fernanda · aluna de velas, Rio",
            "big": false
          },
          {
            "text": "Você ministra maravilhosamente bem. Muito profissional. Quero fazer muitos cursos com você.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          },
          {
            "text": "Amei o curso, em breve pretendo fazer outros.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          }
        ],
        "note": "Mensagens reais enviadas pelas alunas nos grupos dos cursos da Ivana Academy, publicadas com o texto original."
      },
      {
        "eyebrow": "O que você aprende",
        "title": "Do primeiro sabonete ao seu *próprio portfólio*",
        "type": "learn",
        "items": [
          "Trabalhar com base glicerinada (melt and pour): branca, transparente ou perolada",
          "Fazer seus próprios extratos e tinturas, para levar todas as propriedades das plantas aos sabonetes",
          "Calcular as quantidades e proporções com a apostila",
          "Fazer vários tipos de sabonete: hidratante, limpador, esfoliante, com bucha vegetal, energizante, com argilas e muitos mais",
          "Receber um guia com mais de 60 receitas para praticar e criar a sua linha",
          "Saber onde comprar os materiais, com a lista de fornecedores"
        ]
      },
      {
        "eyebrow": "Feito nas aulas da Ivana",
        "title": "Sabonetes que você vai aprender a *fazer*",
        "type": "gallery",
        "items": [
          {
            "src": "/images/online/saboaria-04.jpg",
            "alt": "Sabonete massageador de melancia",
            "caption": "Sabonete massageador de melancia",
            "wide": false
          },
          {
            "src": "/images/online/saboaria-05.jpg",
            "alt": "Sabonete esfoliante de maracujá com óleo de amêndoas",
            "caption": "Maracujá com óleo de amêndoas, esfoliante e hidratante",
            "wide": false
          }
        ]
      },
      {
        "eyebrow": "Feitos pela Ivana",
        "title": "Sabonetes que você vai *aprender a fazer*",
        "type": "gallery",
        "items": [
          {
            "src": "/images/online/saboaria-06.jpg",
            "alt": "Sabonete de aveia e mel com bucha vegetal ao fundo",
            "caption": "Sabonete de aveia e mel",
            "wide": false
          },
          {
            "src": "/images/online/saboaria-07.jpg",
            "alt": "Sabonetes de alecrim com bucha vegetal ao fundo",
            "caption": "Sabonetes de alecrim",
            "wide": false
          }
        ]
      },
      {
        "eyebrow": "Conteúdo do curso",
        "title": "Dos extratos ao *sabonete embalado*",
        "type": "modules",
        "items": [
          {
            "eyebrow": "Módulo 1",
            "title": "Material de apoio",
            "lessons": [
              "Material de apoio"
            ]
          },
          {
            "eyebrow": "Módulo 2",
            "title": "Materiais",
            "lessons": [
              "Lista de materiais"
            ]
          },
          {
            "eyebrow": "Módulo 3",
            "title": "Aditivos e quantidades",
            "lessons": [
              "Proporções"
            ]
          },
          {
            "eyebrow": "Módulo 4",
            "title": "Extratos",
            "lessons": [
              "Origem dos extratos",
              "Passo a passo",
              "Tipos de extratos indicados para cada tipo de pele",
              "Receitas de extratos"
            ]
          },
          {
            "eyebrow": "Módulo 5",
            "title": "Iniciamos!",
            "lessons": [
              "Passo a passo",
              "Sabonete para peles sensíveis",
              "Sabonete de maracujá"
            ]
          },
          {
            "eyebrow": "Módulo 6",
            "title": "Mais receitas",
            "lessons": [
              "Sabonete de lavanda",
              "Sabonete de aveia e mel",
              "Sabonete limpador e energético",
              "Desenformando",
              "Apostila de receitas",
              "Ebook: Receitas de sabonetes Melt & Pour"
            ]
          },
          {
            "eyebrow": "Módulo 7",
            "title": "Embalagem e precificação",
            "lessons": [
              "Embalagem"
            ]
          }
        ]
      },
      {
        "eyebrow": "O que está incluso",
        "title": "Tudo para *começar a produzir*",
        "type": "included",
        "items": [
          {
            "title": "Aulas gravadas",
            "text": "Assista quando quiser e quantas vezes precisar, na plataforma Ivana Academy."
          },
          {
            "title": "Guia de receitas",
            "text": "Mais de 60 receitas para você produzir e criar a sua própria linha de sabonetes."
          },
          {
            "title": "Apostila",
            "text": "Quantidades e proporções para você seguir as receitas com segurança."
          },
          {
            "title": "Fornecedores",
            "text": "Indicação de onde comprar bases, extratos e embalagens."
          },
          {
            "title": "Suporte",
            "text": "Dúvidas? Fale com a Ivana pelo Instagram @ivana.lerea.br."
          },
          {
            "title": "Grupo de alunas",
            "text": "Grupo para receber informações e novidades da Ivana Academy."
          }
        ]
      },
      {
        "eyebrow": "Para quem é",
        "title": "Este curso é *para você* se",
        "type": "audience",
        "items": [
          "Nunca fez sabonete e quer começar do zero, sem complicação.",
          "Quer uma renda extra vendendo sabonetes artesanais.",
          "Já faz sabonete e quer usar extratos naturais com mais segurança."
        ]
      },
      {
        "eyebrow": "Sua professora",
        "title": "Ivana Lerea, da *Ivana Academy*",
        "type": "profile",
        "img": {
          "src": "/images/online/saboaria-08.jpg",
          "alt": "Ivana Lerea sorrindo no ateliê"
        },
        "text": "Mais de 3.000 alunas já aprenderam com a Ivana, online e em cursos presenciais em Florianópolis, em outras cidades do Brasil e na Argentina. Agora você leva o jeito dela de ensinar, com linguagem simples e passo a passo, para assistir em casa, no seu ritmo."
      },
      {
        "eyebrow": "Dúvidas",
        "title": "Perguntas frequentes",
        "type": "faq",
        "items": [
          {
            "q": "Como recebo o acesso?",
            "a": "Depois da compra na Hotmart você recebe a aula \"Como acessar o curso na plataforma\". Ela tem o link, o passo a passo para criar sua conta e a chave de inscrição."
          },
          {
            "q": "Por quanto tempo posso assistir?",
            "a": "As aulas são gravadas. Você assiste no seu ritmo, quantas vezes quiser."
          },
          {
            "q": "Preciso ter experiência?",
            "a": "Não. O curso começa do básico, com base glicerinada pronta, sem trabalhar com soda cáustica."
          },
          {
            "q": "E se eu não gostar?",
            "a": "Você tem 7 dias para pedir o reembolso direto pela Hotmart."
          }
        ]
      },
      {
        "title": "Pronta para fazer seu *primeiro sabonete*?",
        "type": "final",
        "small": "Compra segura pela Hotmart. Garantia de 7 dias."
      }
    ]
  },
  "apostila": {
    "slug": "apostila",
    "path": "/apostila/",
    "title": "Apostila 60 Receitas de Sabonetes | Ivana Academy",
    "name": "Apostila 60 receitas de sabonetes Melt & Pour (PDF)",
    "desc": "60 receitas de sabonetes Melt & Pour com quantidades prontas para 1 kg de base glicerinada, em PDF, pela Ivana Lerea. R$ 37, acesso imediato.",
    "kind": "Product",
    "price": "37",
    "sku": "hotmart-S107970503L",
    "eyebrow": "Apostila em PDF",
    "h1": "60 receitas de *sabonetes* Melt & Pour",
    "lead": "Quantidades prontas para 1 kg de base glicerinada, com extratos e tinturas naturais, feitas pela Ivana Lerea.",
    "price_label": {
      "main": "R$ 37",
      "sub": "à vista ou em até 3x sem juros"
    },
    "buy": {
      "href": "https://pay.hotmart.com/S107970503L",
      "label": "Quero a apostila"
    },
    "guarantee": "Acesso imediato em PDF. Garantia de 7 dias.",
    "hero_img": {
      "alt": "Capa da apostila 60 receitas de sabonetes",
      "src": "/images/online/apostila-03.jpg"
    },
    "stats": [
      {
        "value": "60",
        "label": "receitas organizadas em 6 grupos"
      },
      {
        "value": "46",
        "label": "páginas em PDF"
      },
      {
        "value": "+3.000",
        "label": "alunas na Ivana Academy"
      }
    ],
    "sections": [
      {
        "eyebrow": "Feitos pela Ivana",
        "title": "Sabonetes das *receitas*",
        "type": "gallery",
        "items": [
          {
            "src": "/images/online/saboaria-06.jpg",
            "alt": "Sabonete de aveia e mel com bucha vegetal ao fundo",
            "caption": "Sabonete de aveia e mel",
            "wide": false
          },
          {
            "src": "/images/online/saboaria-07.jpg",
            "alt": "Sabonetes de alecrim com bucha vegetal ao fundo",
            "caption": "Sabonetes de alecrim",
            "wide": false
          }
        ]
      },
      {
        "eyebrow": "O que tem dentro",
        "title": "Seis grupos, *dez receitas* em cada",
        "type": "groups",
        "groups": [
          {
            "n": "10",
            "title": "Hidratantes",
            "text": "Manteigas, leites e óleos para peles secas."
          },
          {
            "n": "10",
            "title": "Limpadores",
            "text": "Extratos para uma limpeza suave do dia a dia."
          },
          {
            "n": "10",
            "title": "Esfoliantes",
            "text": "Café, sal, aveia, fubá e outros grãos e pós."
          },
          {
            "n": "10",
            "title": "Com bucha vegetal",
            "text": "Sabonetes massageadores, com um disco de bucha."
          },
          {
            "n": "10",
            "title": "Energizantes",
            "text": "Aromas e extratos que despertam no banho."
          },
          {
            "n": "10",
            "title": "Com argilas",
            "text": "Verde, branca, rosa, vermelha, preta, amarela e roxa."
          }
        ],
        "learn": [
          "Tabela com o máximo de cada ingrediente para 1 kg de base",
          "Modo de preparo e dica da Ivana em cada receita",
          "Guia de extratos glicerinados para cada tipo de pele",
          "Como fazer seus próprios extratos e tinturas mãe",
          "Materiais, utensílios e passo a passo básico",
          "Receitas testadas para você praticar e adaptar à sua linha"
        ]
      },
      {
        "eyebrow": "Quem já fez um curso com a Ivana",
        "title": "O que dizem as *alunas*",
        "type": "reviews",
        "items": [
          {
            "text": "Amei muito o curso e a companhia de vocês! Nossa Profe é maravilhosa, sempre muito dedicada e impecável em tudo o que faz!",
            "cite": "Lirane M. · aluna de saboaria",
            "big": true
          },
          {
            "text": "Seus cursos são ótimos, uma linguagem didática excelente para o aprendizado, eu amei em fazer.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          },
          {
            "text": "Você ministra maravilhosamente bem. Muito profissional. Quero fazer muitos cursos com você.",
            "cite": "Aluna da Ivana Academy",
            "big": false
          },
          {
            "text": "Amei o curso. Foi muito enriquecedor pra mim a troca que tivemos.",
            "cite": "Luciene · aluna de velas, Lisboa",
            "big": false
          }
        ],
        "note": "Mensagens reais das alunas dos cursos da Ivana Academy, com o texto original."
      },
      {
        "eyebrow": "Sua professora",
        "title": "Ivana Lerea, da *Ivana Academy*",
        "type": "profile",
        "img": {
          "src": "/images/online/saboaria-08.jpg",
          "alt": "Ivana Lerea sorrindo no ateliê"
        },
        "text": "Mais de 3.000 alunas já aprenderam com a Ivana, online e em cursos presenciais em Florianópolis, em outras cidades do Brasil e na Argentina. As receitas desta apostila vêm do jeito dela de ensinar: simples, com medidas claras e passo a passo."
      },
      {
        "eyebrow": "Dúvidas",
        "title": "Perguntas frequentes",
        "type": "faq",
        "items": [
          {
            "q": "Em que formato recebo a apostila?",
            "a": "Em PDF, com acesso imediato depois da compra. Você lê no celular, no tablet ou no computador e pode imprimir."
          },
          {
            "q": "Preciso ter experiência?",
            "a": "Não. A apostila traz materiais, utensílios e o passo a passo básico, e todas as receitas usam base glicerinada pronta, sem soda cáustica."
          },
          {
            "q": "Quais bases posso usar?",
            "a": "Branca, transparente ou perolada. Cada receita indica a mais indicada."
          },
          {
            "q": "E se eu não gostar?",
            "a": "Você tem 7 dias para pedir o reembolso direto pela Hotmart."
          }
        ]
      },
      {
        "title": "Comece a fazer seus *sabonetes* hoje",
        "type": "final",
        "small": "Compra segura pela Hotmart. Garantia de 7 dias."
      }
    ]
  }
};
