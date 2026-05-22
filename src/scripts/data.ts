import { Course, CategorySpec, Review, FAQItem } from './types';

export const CATEGORIES: Record<string, CategorySpec> = {
  velas: {
    id: 'velas',
    name: { pt: 'Velas Artesanais', es: 'Velas Artesanales' },
    themeColor: 'from-[#805252] to-[#B27D7C]', // Elegant Dusty Rose transition
    accentBg: 'bg-[#ffdad9]',
    accentText: 'text-[#805252]',
    heroBgClass: 'from-[#FAF6F0] via-[#FAF6F0] to-[#EBC2C1]',
    badgeLogo: '✨'
  },
  saboaria: {
    id: 'saboaria',
    name: { pt: 'Saboaria Natural', es: 'Jabonería Natural' },
    themeColor: 'from-[#4D6551] to-[#76917A]', // Soft Sage Green
    accentBg: 'bg-[#D2E7D6]',
    accentText: 'text-[#324536]',
    heroBgClass: 'from-[#FAF6F0] via-[#FAF6F0] to-[#C9DACD]',
    badgeLogo: '🌿'
  },
  resinas: {
    id: 'resinas',
    name: { pt: 'Resina Epóxi', es: 'Resina Epoxi' },
    themeColor: 'from-[#3A6073] to-[#4F8CA3]', // Ocean Blue/Teal
    accentBg: 'bg-[#D5E6EE]',
    accentText: 'text-[#1B3E4F]',
    heroBgClass: 'from-[#FAF6F0] via-[#FAF6F0] to-[#BDD8E4]',
    badgeLogo: '💎'
  },
  macrame: {
    id: 'macrame',
    name: { pt: 'Macramê', es: 'Macramé' },
    themeColor: 'from-[#8A5134] to-[#B3795C]', // Terracotta earthy
    accentBg: 'bg-[#FFDFD2]',
    accentText: 'text-[#5C2B11]',
    heroBgClass: 'from-[#FAF6F0] via-[#FAF6F0] to-[#FFECD5]',
    badgeLogo: '🧶'
  },
  aromas_incensos: {
    id: 'aromas_incensos',
    name: { pt: 'Aromas & Incensos', es: 'Aromas e Inciensos' },
    themeColor: 'from-[#6E4B6E] to-[#9B6F9B]', // Deep Amethyst / Purple Rose
    accentBg: 'bg-[#F2DDF2]',
    accentText: 'text-[#441D44]',
    heroBgClass: 'from-[#FAF6F0] via-[#FAF6F0] to-[#ECCDEB]',
    badgeLogo: '🔮'
  }
};

export const COURSES: Course[] = [
  // VELAS
  {
    id: 'imersao-velas-br',
    categoryId: 'velas',
    title: { 
      pt: 'Imersão de Velas Presencial', 
      es: 'Inmersión de Velas Presencial' 
    },
    duracao: { pt: '2 dias Intensivos', es: '2 días Intensivos' },
    modalidade: 'presencial',
    location: { pt: 'Brasil (Florianópolis / Curitiba / Rio de Janeiro)', es: 'Brasil (Florianópolis / Curitiba / Río de Janeiro)' },
    materials: { pt: 'Inclusos no valor', es: 'Incluidos en el precio' },
    rating: 5,
    featured: true,
    description: { 
      pt: 'O curso presencial de imersão mais completo do Brasil. Aprenda de forma prática do absoluto zero a produzir velas aromáticas, terapêuticas, moldáveis, velas gourmet, wax melts e velas para massagens ricas em detalhes visuais e de aroma primoroso.', 
      es: 'El curso de inmersión presencial más completo de Brasil. Aprende de forma práctica desde cero a producir velas aromáticas, terapéuticas, con moldes, velas gourmet, wax melts y velas para masajes con un diseño y aroma de lujo.' 
    },
    features: {
      pt: [
        'Aulas 100% práticas ministradas por Ivana Lerea',
        'Todos os insumos importados e materiais de apoio inclusos',
        'Modelos gourmet texturizados e velas de massagem terapêutica',
        'Apostila física passo a passo e mentorias pós-curso',
        'Certificação de Conclusão Oficial Ivana Academy'
      ],
      es: [
        'Clases 100% prácticas dictadas por Ivana Lerea',
        'Todos los insumos premium y materiales de apoyo incluidos',
        'Modelos gourmet texturizados y velas de masaje terapéuticas',
        'Dossier impreso paso a paso y mentorías post-curso',
        'Certificado de Conclusión Oficial de Ivana Academy'
      ]
    }
  },
  {
    id: 'workshop-velas-br',
    categoryId: 'velas',
    title: { 
      pt: 'Workshop de Velas Presencial', 
      es: 'Workshop de Velas Presencial' 
    },
    duracao: { pt: '1 dia (4 horas)', es: '1 día (4 horas)' },
    modalidade: 'presencial',
    location: { pt: 'Brasil (Florianópolis / Curitiba)', es: 'Brasil (Florianópolis / Curitiba)' },
    materials: { pt: 'Inclusos no valor', es: 'Incluidos en el precio' },
    rating: 4.9,
    description: { 
      pt: 'Workshop intensivo ideal para iniciantes para perder o medo e entrar com segurança na confecção de ceras. Você aprenderá a fazer velas aromáticas, velas moldáveis e deliciosas pastilhas wax melts.', 
      es: 'Workshop intensivo ideal para principiantes que buscan iniciarse con seguridad en el arte de las velas de cera vegetal. Aprenderás a fabricar velas aromáticas, velas moldeables y pastillas aromáticas wax melts.' 
    },
    features: {
      pt: [
        'Formulação básica de ceras eco-friendly e pavios de algodão/madeira',
        'Manipulação de essências e controle de temperatura seguro',
        'Fabricação prática de 3 produtos para levar para casa',
        'Apostila técnica digital detalhada'
      ],
      es: [
        'Formulación de ceras ecológicas y selección de pabilos de algodón/madera',
        'Manipulación de fragancias y control seguro de temperatura',
        'Elaboración práctica de 3 productos para llevar a casa',
        'Dossier técnico digital muy detallado'
      ]
    }
  },
  {
    id: 'profesorado-velas-ar',
    categoryId: 'velas',
    title: { 
      pt: 'Profesorado en Velas (Conservatório Grassi)', 
      es: 'Profesorado en Velas (Conservatorio Grassi)' 
    },
    duracao: { pt: '1 a 2 anos (Prático + Teórico)', es: '1 a 2 años (Teórico + Práctico)' },
    modalidade: 'virtual',
    location: { pt: 'Argentina (Plataforma Moodle)', es: 'Argentina / Online (Plataforma Moodle)' },
    materials: { pt: 'Material didático mensal e vídeos de apoio', es: 'Apostilas mensuales y videos grabados' },
    rating: 5,
    url: 'https://ivana.academy/course/view.php?id=21',
    description: { 
      pt: 'Formação com validação oficial internacional do reputado Conservatório Grassi na Argentina. Prepara você pedagogicamente para dar aulas e ministrar workshops, com domínio perfeito das técnicas fundamentais e avançadas.', 
      es: 'Formación con título oficial avalado por el Conservatorio Grassi de Argentina. Te capacita pedagógicamente para dar clases y talleres avanzados, con dominio perfecto de la teoría de ceras, pigmentos y fragancias.' 
    },
    features: {
      pt: [
        'Estudo continuado dividido em módulos mensais com exames práticos',
        'Certificação de peso internacional reconhecida',
        'Dicas profundas de gestão de turmas e elaboração de currículos de ensino',
        'Mentoria direta com a Professora Ivana Lerea'
      ],
      es: [
        'Estudio continuo en módulos mensuales con evaluación técnica',
        'Certificación con validez internacional de gran prestigio',
        'Claves de didáctica y diseño curricular de tus propios cursos',
        'Seguimiento directo con la Profesora Ivana Lerea'
      ]
    }
  },
  {
    id: 'tecnicatura-velas-ar',
    categoryId: 'velas',
    title: { 
      pt: 'Tecnicatura en Arte y Diseño de Velas', 
      es: 'Tecnicatura en Arte y Diseño de Velas' 
    },
    duracao: { pt: '9 meses (Modular)', es: '9 meses (Nueve módulos)' },
    modalidade: 'virtual',
    location: { pt: 'Online via Moodle (Comunidade de Alunas)', es: 'Moodle online con Comunidad de Estudiantes' },
    materials: { pt: 'Dossiês técnicos completos e fornecedores AR/BR', es: 'Videos HD, dossieres completos de estudio y proveedores' },
    rating: 4.8,
    url: 'https://ivana.academy/course/view.php?id=4',
    description: { 
      pt: 'Estude o desenvolvimento acadêmico do design de velas: aromáticas, terapêuticas, moldáveis, wax melts, velas massagens, gourmet, gel de parafina cristal, técnicas coreanas minimalistas e moldagem em base de cimento.', 
      es: 'La tecnicatura más completa. Aprende sobre cera vegetal, de abejas y gel coreano, técnicas de vaciado, moldes de cemento, velas gourmet, gel transparente con encapsulado y velas de diseño contemporáneo.' 
    },
    features: {
      pt: [
        'Nove módulos extremamente ricos, liberados mensalmente',
        'Formulação de pavios, base de concreto autossustentável',
        'Técnicas requintadas de acabamento, embalagens e design visual',
        'Dossier técnico super detalhado por e-mail e WhatsApp'
      ],
      es: [
        'Nueve módulos ricos y progresivos que se habilitan mensualmente',
        'Formulación de pabilos, base de concreto autosustentable',
        'Técnicas de acabado premium, empaques y diseño visual de marca',
        'Acceso ilimitado a vídeos de soporte y lista de proveedores certificados'
      ]
    }
  },
  {
    id: 'curso-velas-virtual-br',
    categoryId: 'velas',
    title: { 
      pt: 'Curso de Velas Aromáticas & Terapêuticas (Digital)', 
      es: 'Curso Virtual de Velas Aromáticas y Terapéuticas' 
    },
    duracao: { pt: 'Acesso Vitalício', es: 'Acceso de por vida' },
    modalidade: 'virtual',
    location: { pt: 'Vídeo-Aulas (Acesso imediato) + WhatsApp suporte', es: 'Video-Clases (Acceso inmediato) + Soporte WhatsApp' },
    materials: { pt: 'Lista de fornecedores de confiança no Brasil', es: 'Lista directa de proveedores clave en Brasil' },
    rating: 5,
    url: 'https://ivana.academy/course/view.php?id=16',
    description: { 
      pt: 'Aprenda do extremo zero a produzir suas velas profissionais com qualidade de boutique. Inclui técnicas completas de cera vegana de soja, aditivos naturais, essências hidrossolúveis e bônus incríveis como vela decorativa Oratório em resina.', 
      es: 'Descubre cómo crear tu propia marca de velas Premium desde casa. Incluye clases paso a paso de velas de cera de soya 100% natural, velas de masaje, velas de parafina en gel transparente y un módulo extra de velas Oratorio con resina.' 
    },
    features: {
      pt: [
        'Inclui bônus: Curso completo de Velas Terapêuticas e Veganas 100% Naturais',
        'Bônus 2: Módulo Velas de Oratório com técnicas de resina epóxi e moldes',
        'Lista vip de fornecedores brasileiros de alta qualidade e frete justo',
        'Suporte de dúvidas dedicado diretamente por áudio no WhatsApp'
      ],
      es: [
        'Módulo extra incluido: Curso completo de Velas Terapéuticas y Veganas 100% orgánicas',
        'Módulo extra 2: Técnicas de resina epoxi para Velas de Oratorio',
        'Lista premium de distribuidores brasileños recomendados con envío rápido',
        'Preguntas respondidas directamente por la profesora Ivana vía WhatsApp'
      ]
    }
  },

  // SABOARIA
  {
    id: 'saboaria-presencial',
    categoryId: 'saboaria',
    title: { 
      pt: 'Curso de Saboaria Natural Presencial', 
      es: 'Curso Presencial de Jabonería Natural' 
    },
    duracao: { pt: '4 horas Intensivo', es: '4 horas Intensivo' },
    modalidade: 'presencial',
    location: { pt: 'Florianópolis / SC', es: 'Florianópolis, SC, Brasil' },
    materials: { pt: 'Todos os insumos Premium inclusos', es: 'Todos los materiales incluidos' },
    rating: 4.9,
    description: { 
      pt: 'Aprenda do zero absoluto a criar sabonetes artesanais e 100% naturais. Trabalharemos com bases vegetais prontas com o método glicerinado "Melt & Pour" (derreter e verter), além de desenvolver extratos e tinturas fitoterápicas aromáticas.', 
      es: 'Aprende desde cero absoluto a diseñar jabones terapéuticos 100% naturales. Utilizaremos el método "Melt and Pour" (derretir y verter) con ingredientes naturales, arcillas depurativas, exfoliantes, extractos y tinturas madre fitoterapia.' 
    },
    features: {
      pt: [
        'Diferenciação prática de bases de glicerina de qualidade e suas propriedades',
        'Misturas ricas com argilas purificantes, esfoliantes de café e ervas secas',
        'Prática de formulação de extratos fito-botânicos naturais e suas tinturas',
        'Apostila detalhada e produtos fabricados por você para levar para casa'
      ],
      es: [
        'Diferencias entre bases e ingredientes nocivos en cosmética industrial',
        'Recetas con arcillas medicinales, extractos regenerantes y exfoliantes',
        'Aprendizaje práctico para formular extractos botánicos naturales y tinturas madre',
        'Dossier impreso con recetas listas para replicar y vender'
      ]
    }
  },
  {
    id: 'saboaria-virtual',
    categoryId: 'saboaria',
    title: { 
      pt: 'Curso de Saboaria Terapêutica (Virtual)', 
      es: 'Curso Virtual de Jabonería Terapéutica' 
    },
    duracao: { pt: 'Acesso Vitalício', es: 'Acceso de por vida' },
    modalidade: 'virtual',
    location: { pt: 'Video-Aulas Gravadas + Plataforma Moodle', es: 'Vídeo Clases Grabadas + Moodle' },
    materials: { pt: 'E-book completo de receitas e fornecedores', es: 'Dossier completo de recetas y materia prima' },
    rating: 4.8,
    description: { 
      pt: 'Leve bem-estar para suas clientes com sabonetes clássicos, esfoliantes, fitoterápicos, hidratantes e rejuvenescedores. Você irá dominar a criação de receitas exclusivas, sabonetes botânicos e tintura-mãe hidratante.', 
      es: 'Comienza hoy un negocio de bienestar en auge. Domina jabones tradicionales, faciales de arcilla, exfoliantes rústicos, hidratantes de avena y líneas fitoterapéuticas con recetas personalizadas y extractos hechos en casa.' 
    },
    features: {
      pt: [
        'Aulas gravadas passo a passo de como estruturar fórmulas saudáveis',
        'Como fixar fragrâncias essenciais sem solventes químicos artificiais',
        'Calculadora de insumos básica para organizar custos e precificação rápida',
        'Suporte por WhatsApp direto com Ivana'
      ],
      es: [
        'Clases explicativas en alta definición para crear fórmulas equilibradas',
        'Fijación natural de aromas mediante aceites esenciales puros',
        'Herramientas sencillas para calcular costos y precios de venta',
        'Seguimiento uno a uno mediante WhatsApp'
      ]
    }
  },

  // RESINAS
  {
    id: 'resinas-presencial',
    categoryId: 'resinas',
    title: { 
      pt: 'Curso de Resina Epóxi e Encapsulados (Presencial)', 
      es: 'Curso Presencial de Resina Epoxi y Encapsulados' 
    },
    duracao: { pt: '5 horas Intensivas', es: '5 horas Intensivas' },
    modalidade: 'presencial',
    location: { pt: 'Florianópolis, SC, Brasil', es: 'Florianópolis, SC, Brasil' },
    materials: { pt: 'Resinas com proteção UV e moldes inclusos', es: 'Resinas especiales con protección UV incluidas' },
    rating: 4.9,
    description: { 
      pt: 'Técnica passo a passo para trabalhar com segurança usando resina epóxi premium. Aprenda a escolher a viscosidade ideal de resina para chaveiros, canetas personalizadas, bandejas de luxo, porta-copos e técnicas de flores encapsuladas.', 
      es: 'Aprende a formular y vaciar resina epoxi de alta gama con protección UV. Te enseñaremos a seleccionar viscosidades para llaveros personalizados, marcapáginas, canetas decoradas, posavasos y encapsulado eterno de flores.' 
    },
    features: {
      pt: [
        'Precauções de segurança, mistura exata, uso de balança de precisão',
        'Técnicas de eliminação de bolhas por calor e acabamento espelhado',
        'Encapsulamento de flores desidratadas, glitter e películas douradas',
        'Apostila física passo a passo e tabela de cura rápida'
      ],
      es: [
        'Normas de seguridad, mezcla exacta y uso de básculas de precisión',
        'Técnicas de desgasificación para eliminar burbujas y lograr acabados pulidos',
        'Encapsulamiento eterno de flores naturales, polvos micas y pan de oro',
        'Dossier técnico de regalo con tablas de curado y tiempos'
      ]
    }
  },

  // MACRAME
  {
    id: 'macrame-presencial',
    categoryId: 'macrame',
    title: { 
      pt: 'Curso de Macramê Criativo (Presencial)', 
      es: 'Curso Presencial de Macramé Creativo' 
    },
    duracao: { pt: '4 horas com Mentoria', es: '4 horas Personalizadas' },
    modalidade: 'presencial',
    location: { pt: 'Florianópolis (Ateliê Central)', es: 'Florianópolis (Atelier Central)' },
    materials: { pt: 'Cordões de algodão ecológico inclusos', es: 'Hilados de algodón orgánico incluidos' },
    rating: 5,
    description: { 
      pt: 'Os cursos de Macramê são desenhados tanto para iniciantes absolutos quanto para experientes. Você pode trazer um design próprio que tenha visto e queira modelar, e Ivana guiará o nó-a-nó até concluir seu lindo vaso de macramê ou peça de parede decorativa.', 
      es: 'Taller personalizado y cercano. Diseñado para principiantes y avanzadas: puedes traer un proyecto exclusivo que te encante y yo te ayudo a tejerlo paso a paso. Domina nudos llanos, alondras, festones y flecos perfectos.' 
    },
    features: {
      pt: [
        'Estruturação de nós leste-oeste, nós duplos e franjas rústicas impecáveis',
        'Suporte de madeira tratada para painéis de parede incluído',
        'Turmas reduzidas de no máximo 4 alunas para atendimento VIP',
        'Leve sua obra de arte têxtil finalizada'
      ],
      es: [
        'Clasificación de fibras ideales, grosores de cuerdas y acabados perfectos',
        'Nudo plano, plano alternado, espirales e integración de cuentas decorativas',
        'Grupos pequeños de máximo 4 alumnas para garantizar atención cercana',
        'Te llevas a casa tu primer soporte textil o tapiz listo para colgar'
      ]
    }
  },

  // AROMATIZANTES & INCENSARIA
  {
    id: 'incensaria-natural-presencial',
    categoryId: 'aromas_incensos',
    title: { 
      pt: 'Curso de Incensaria Natural Seca (Presencial)', 
      es: 'Curso Presencial de Incensaria Natural Seca' 
    },
    duracao: { pt: '3 horas de Prática', es: '3 horas de Taller' },
    modalidade: 'presencial',
    location: { pt: 'Florianópolis, SC', es: 'Florianópolis, SC, Brasil' },
    materials: { pt: 'Ervas finas aromáticas inclusas', es: 'Hierbas y resinas naturales incluidas' },
    rating: 4.8,
    description: { 
      pt: 'Inicie-se no mundo mágico das defumações naturais e incensos artesanais. Criaremos diversos tipos de incensos em pirâmide, bastões rústicos de ervas florais secas com propriedades calmantes que purificam ambientes.', 
      es: 'Iníciate en el milenario mundo de los sahumerios naturales e inciensos de autor. Moldearemos conos de purificación, atados botánicos silvestres con flores secas y resinas naturales que armonizan espacios.' 
    },
    features: {
      pt: [
        'Como colher, desidratar e escolher as plantas nacionais seguras',
        'Moagem e aglutinantes naturais (como goma de tragacanto e carvão vegetal)',
        'Combinações curativas: Alecrim, Lavanda, Mirra, Breuzinho e Rosas',
        'Produção prática de incensos para levar para casa'
      ],
      es: [
        'Proceso de secado idóneo, molienda y aglutinantes orgánicos naturales',
        'Formulación de aromas según beneficios emocionales y relajantes',
        'Elaboración práctica de 5 formatos distintos con su tiempo de secado',
        'Te llevas un kit completo con tus propias creaciones listas para encender'
      ]
    }
  },
  {
    id: 'aromatizantes-presencial',
    categoryId: 'aromas_incensos',
    title: { 
      pt: 'Curso de Aromatizantes de Ambientes (Presencial)', 
      es: 'Curso Presencial de Perfumería Hogar' 
    },
    duracao: { pt: '4 horas Práticas', es: '4 horas Prácticas' },
    modalidade: 'presencial',
    location: { pt: 'Florianópolis, SC, Brasil', es: 'Florianópolis, SC, Brasil' },
    materials: { pt: 'Todas as essências e embalagens inclusas', es: 'Todos los atomizadores y fragancias incluidos' },
    rating: 4.9,
    description: { 
      pt: 'Formulação prática onde você aprende a produzir e leva de imediato para casa uma linha completa de Home Spray premium, Body Splash refrescante, Água aromática para tecidos, Sachê perfumado delicado, e difusores para varetas e carro.', 
      es: 'Aprende perfumería de ambientes de calidad profesional. Elaborarás y te llevarás a casa un set completo: Home Spray de alta persistencia, Body Splash hidratante, agua perfumada de planchado, saquito aromático y difusor de varitas.' 
    },
    features: {
      pt: [
        'Técnica de maceração de álcool de cereais sob abrigo de luz',
        'Organização de notas de saída, corpo e fundo olfativos',
        'Embalagem, tampas herméticas elegantes e fixadores de alta qualidade',
        'Materiais impressos passo a passo com fórmulas de alta fixação'
      ],
      es: [
        'Técnica tradicional de maceración a oscuras usando alcohol de cereal neutro',
        'Comprensión práctica de notas olfativas: salida, corazón e identidad de fondo',
        'Rotulado estético, envases reutilizables y secretos de ultra fijación en telas',
        'Dossier de fórmulas matemáticas listas para personalizar en casa'
      ]
    }
  },
  {
    id: 'aromatizantes-virtual',
    categoryId: 'aromas_incensos',
    title: { 
      pt: 'Curso de Aromatizantes de Ambientes (Virtual)', 
      es: 'Curso Virtual de Aromas del Hogar' 
    },
    duracao: { pt: 'Acesso Vitalício', es: 'Acceso de por vida' },
    modalidade: 'virtual',
    location: { pt: 'Plataforma Moodle e Suporte VIP', es: 'Plataforma Moodle Múltiples Dispositivos' },
    materials: { pt: 'Apostilas em PDF + Contato de Fornecedores', es: 'Guías PDF descargables e insumos' },
    rating: 4.7,
    description: { 
      pt: 'Aprenda do conforto de sua casa. Vídeos detalhados e apostila técnica completa com o passo a passo com fórmulas exatas para fazer Home Spray de longa duração, difusores duradouros e body splash.', 
      es: 'Inicia tu marca de marketing olfativo para locales y hogares. Aprende paso a paso en línea la formulación matemática de home spray ultra concentrados, difusores de varitas de lenta evaporación y body splash sedosos.' 
    },
    features: {
      pt: [
        'Fórmulas comerciais exatas sem risco de turvar ou decantar essências',
        'Qual o segredo das melhores lojas de marca do mundo para fixação de semanas',
        'Contatos de importadores de insumos e vidraria barata com entrega em domicílio',
        'Certificado homologado pela Ivana Academy'
      ],
      es: [
        'Modelos exentos de enturbiarse o separarse gracias a solubilizantes sanos',
        'Secretos de las marcas de centros comerciales para fijación duradera',
        'Contactos de importadores directos de botellones de perfumería del hogar y esencias puras',
        'Certificación homologada por Ivana Academy que respalda tu negocio'
      ]
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'crit-1',
    name: 'Carolina Mendes',
    location: 'Florianópolis, SC',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpcPZQg6dT0JFv_K5x3xi_r78DtbLTYarPxDKlwuOMEmLTzK2gxoJE5Hh8snL8pK5Q3a_6gmi0iqj9s8wMjB5J1hzE-DFiaPCI4hlCI-NZ-7EswoIlB7W-bQANk8DHiszlIxnY6YeuoW6iXAY3qyBWqn_HsxRbTLyqgB5V4ODehOyusTDucCbCuY3yp2z2nPuUdf-XYfIHoSS9GS4EQaXyqdEFGIDyuTw0vxBpb6x8w_TP3hKYDDwVYGNTLDuB4prJ8T9khdfYHqN3', // Ivana as placeholder or clean female faces, let's use standard placeholders if needed but these high quality assets are safe. Wait, let's keep references clean
    courseName: { pt: 'Imersão de Velas Presencial', es: 'Inmersión de Velas Presencial' },
    text: {
      pt: 'O curso de velas mudou completamente meus finais de semana e abriu um novo negócio. Trabalho na minha mesa de jantar e hoje faturo mais de 4 mil reais por mês vendendo para lojas de decoração locais!',
      es: '¡El curso de velas cambió mis fines de semana y se convirtió en un gran negocio familiar! Trabajo desde mi comedor y hoy gano muy bien vendiendo velas a boutiques de decoración locales.'
    },
    stars: 5
  },
  {
    id: 'crit-2',
    name: 'Gabriela Soriano',
    location: 'Buenos Aires, Argentina',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpcPZQg6dT0JFv_K5x3xi_r78DtbLTYarPxDKlwuOMEmLTzK2gxoJE5Hh8snL8pK5Q3a_6gmi0iqj9s8wMjB5J1hzE-DFiaPCI4hlCI-NZ-7EswoIlB7W-bQANk8DHiszlIxnY6YeuoW6iXAY3qyBWqn_HsxRbTLyqgB5V4ODehOyusTDucCbCuY3yp2z2nPuUdf-XYfIHoSS9GS4EQaXyqdEFGIDyuTw0vxBpb6x8w_TP3hKYDDwVYGNTLDuB4prJ8T9khdfYHqN3',
    courseName: { pt: 'Profesorado en Velas (Conservatório Grassi)', es: 'Profesorado en Velas (Conservatorio Grassi)' },
    text: {
      pt: 'La doble certificación con el Conservatorio Grassi me habilitó a abrir mi propio taller educativo de jabonería y velas en mi provincia. La paciencia de Ivana para enseñar es incomparable, te da todas las recetas sin esconder nada.',
      es: 'La doble certificación del Conservatorio Grassi me habilitó a abrir mi propio taller de velas en mi provincia. La paciencia de Ivana al enseñar es incomparable, te entrega todas las recetas listas sin esconder nada.'
    },
    stars: 5
  },
  {
    id: 'crit-3',
    name: 'Manuela Santos',
    location: 'Curitiba, PR',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpcPZQg6dT0JFv_K5x3xi_r78DtbLTYarPxDKlwuOMEmLTzK2gxoJE5Hh8snL8pK5Q3a_6gmi0iqj9s8wMjB5J1hzE-DFiaPCI4hlCI-NZ-7EswoIlB7W-bQANk8DHiszlIxnY6YeuoW6iXAY3qyBWqn_HsxRbTLyqgB5V4ODehOyusTDucCbCuY3yp2z2nPuUdf-XYfIHoSS9GS4EQaXyqdEFGIDyuTw0vxBpb6x8w_TP3hKYDDwVYGNTLDuB4prJ8T9khdfYHqN3',
    courseName: { pt: 'Workshop de Velas Presencial', es: 'Workshop de Velas Presencial' },
    text: {
      pt: 'Fui na edição presencial de Curitiba no mês passado. O clima do workshop é leve, perfumado e imensamente acolhedor. Ivana se preocupa com os mínimos detalhes e te ensina a vender as velas, não só fazer de forma bonita.',
      es: 'Fui a la edición presencial de Curitiba. El ambiente es ligero, aromático y muy cálido. Ivana se preocupa por cada detalle y te enseña a vender tus velas de inmediato, dándote bases firmes de emprendimiento.'
    },
    stars: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: {
      pt: 'Preciso de experiência prévia para participar de algum curso?',
      es: '¿Necesito experiencia previa para participar de algún curso?'
    },
    answer: {
      pt: 'Não! Absolutamente todos os nossos módulos, presenciais e virtuais, são estruturados com metodologia passo a passo, facilitando o aprendizado saudável para quem nunca segurou uma balança na vida.',
      es: '¡No! Absolutamente todos nuestros módulos, presenciales o virtuales, están organizados con una metodología paso a paso muy comprensible, diseñada para personas que nunca han elaborado manualidades.'
    }
  },
  {
    id: 'faq-2',
    question: {
      pt: 'Como funcionam os materiais nos workshops presenciais?',
      es: '¿Cómo funcionan los materiales en los talleres presenciales?'
    },
    answer: {
      pt: 'Todos os insumos (ceras vegetais, pavios importados, essências concentradas, recipientes de vidro de luxo e corantes químicos seguros) estão inclusos no preço da inscrição. Você só precisa trazer sua criatividade e interesse!',
      es: 'Todos los ingredientes de alta calidad (ceras vegetales biodegradables, esencias de alta concentración, pabilos de algodón, frascos de diseño y pigmentos) están incluidos. ¡Solo necesitas traer tu energía y ganas de aprender!'
    }
  },
  {
    id: 'faq-3',
    question: {
      pt: 'Como recebo o certificado e a validação do Conservatório Grassi?',
      es: '¿Cómo recibo el certificado de aprobación y la firma del Conservatorio Grassi?'
    },
    answer: {
      pt: 'Para o Curso Virtual do Brasil e os Workshops práticos, fornecemos um certificado oficial da Ivana Academy após conclusão. Para a Tecnicatura e Profesorado da Argentina, o envio do portfólio de atividades prontas é corrigido mensalmente e, ao término de todos os exames exigidos, o Conservatório emite o certificado autenticado internacionalmente.',
      es: 'Para los cursos libres y talleres presenciales entregamos certificado oficial de la Academia Ivana Lerea. Para la Tecnicatura y Profesorado, tus trabajos se envían por correo/plataforma Moodle para corrección y, al completar todos los exámenes obligatorios, el Conservatorio Grassi emite el diploma oficial con validez internacional.'
    }
  },
  {
    id: 'faq-4',
    question: {
      pt: 'O suporte via WhatsApp really funciona? Como tiro minhas dúvidas?',
      es: '¿Cómo funciona el soporte directo telefónico de consultas?'
    },
    answer: {
      pt: 'Sim! As alunas da Ivana Academy recebem um link com senha para entrar em contato com um canal exclusivo. Suas dúvidas de formulação, cálculo de essências ou imperfeições estéticas podem ser enviadas por foto/áudio e são respondidas pessoalmente pela Ivana Lerea.',
      es: '¡Sí! Al iniciar recibes el contacto exclusivo premium de WhatsApp. Cualquier inquietud sobre una mezcla, aromas, problemas de fragancia o acabado estético en tus productos se puede enviar directamente con foto o audio y es respondido en horas por Ivana.'
    }
  },
  {
    id: 'faq-5',
    question: {
      pt: 'É possível pagar parcelado com cartão de crédito?',
      es: '¿Es posible realizar pagos fraccionados o con tarjeta de crédito?'
    },
    answer: {
      pt: 'Sim! Para os cursos brasileiros e presenciais, aceitamos Pix e parcelamento em até 12 vezes via cartão de crédito. Para as matrículas do Conservatório Grassi na Argentina ou matrículas internacionais, aceitamos pagamentos via PayPal ou depósito local.',
      es: '¡Sí! Aceptamos pagos con tarjeta de crédito de cuotas flexibles. Para las inscripciones internacionales en la plataforma académica se puede abonar mediante PayPal, procesadores digitales o depósitos bancarios locales.'
    }
  }
];
