// Página de interesse (/pt-br/interesse/ e /es-ar/interes/): áreas e cursos/carreras de cada país.
// Um só formulário (components/LeadForm) lê esta configuração; nada de lista escrita dentro da página.
import { courses_list_br } from './courses';
import { carreras_ar, carreras_principales } from './carreras_ar';
import { company } from '../legal/company';

export type InterestCountry = 'BR' | 'AR';

export interface InterestOption {
  key: string;
  label: string;
}

export interface InterestCourse {
  id: string;
  label: string;
  modalidade: 'online' | 'presencial' | 'hibrido';
  interests: string[]; // chaves de InterestOption a que o curso pertence
}

export interface InterestConfig {
  language: 'pt' | 'es';
  ddi: string;
  whatsapp: { label: string; url: string };
  showLocation: boolean; // "Ateliês": só no Brasil
  showModalidade: boolean; // as carreras da Argentina são todas 100% online
  options: InterestOption[]; // "todas" é acrescentada pelo formulário
  allLabel: string;
  courses: InterestCourse[];
  courseLabel: string;
  courseDefault: string;
  path: string; // URL desta versão
}

// Brasil: um segmento por opção (aromas e incensos, resinas e artes separados).
const BR_OPTIONS: InterestOption[] = [
  { key: 'velas', label: '🕯️ Velas' },
  { key: 'saboaria', label: '🧼 Sabonetes Artesanais' },
  { key: 'resinas', label: '🖌️ Resinas' },
  { key: 'artes', label: '🎨 Artes' },
  { key: 'aromas', label: '🌿 Aromas' },
  { key: 'incensos', label: '🔮 Incensos' },
  { key: 'macrame', label: '🧵 Macramê' },
];

const brInterest = (c: (typeof courses_list_br)[number]): string =>
  c.categoryId === 'aromas_incensos' ? (c.id.includes('incensaria') ? 'incensos' : 'aromas') : c.categoryId;

const BR_COURSES: InterestCourse[] = courses_list_br.map((c) => ({
  id: c.id,
  label: `${c.title.pt} — ${c.modalidade === 'presencial' ? 'Presencial' : 'Online'}`,
  modalidade: c.modalidade,
  interests: [brInterest(c)],
}));

// Argentina: as carreras online (nomes oficiais completos) e seus segmentos.
const AR_KEY: Record<string, string> = {
  'ar-velas': 'velas',
  'ar-resinas': 'resinas',
  'ar-macrame': 'macrame',
  'ar-estampas': 'textil',
  'ar-interiores': 'interiores',
  'ar-mixmedia': 'mixmedia',
};

const AR_OPTIONS: InterestOption[] = [
  { key: 'velas', label: '🕯️ Velas' },
  { key: 'resinas', label: '🖌️ Resinas' },
  { key: 'macrame', label: '🧵 Macramé' },
  { key: 'textil', label: '👗 Estampas textiles' },
  { key: 'mixmedia', label: '🎨 Arte mix media' },
  { key: 'interiores', label: '🛋️ Diseño de interiores' },
];

const AR_COURSES: InterestCourse[] = carreras_principales.map((c) => ({
  id: c,
  label: carreras_ar[c].nombre,
  modalidade: 'online',
  interests: [AR_KEY[c]],
}));

export const interest_config: Record<InterestCountry, InterestConfig> = {
  BR: {
    language: 'pt',
    ddi: '+55',
    whatsapp: { label: '+55 48 99167-1659', url: company.whatsappUrl },
    showLocation: true,
    showModalidade: true,
    options: BR_OPTIONS,
    allLabel: '✨ Todas as áreas',
    courses: BR_COURSES,
    courseLabel: 'Curso de interesse (opcional)',
    courseDefault: '-- Selecione um curso específico --',
    path: '/pt-br/interesse/',
  },
  AR: {
    language: 'es',
    ddi: '+54',
    whatsapp: { label: company.ar.whatsappLabel, url: company.ar.whatsappUrl },
    showLocation: false,
    showModalidade: false,
    options: AR_OPTIONS,
    allLabel: '✨ Todas las carreras',
    courses: AR_COURSES,
    courseLabel: 'Carrera de interés (opcional)',
    courseDefault: '-- Seleccioná una carrera --',
    path: '/es-ar/interes/',
  },
};
