export type Language = 'pt' | 'es';

export type CategoryId = 'velas' | 'saboaria' | 'resinas' | 'macrame' | 'aromas_incensos';

export interface CategorySpec {
  id: CategoryId;
  name: { pt: string; es: string };
  themeColor: string; // Tailwind accent class or hex
  accentBg: string; // background color for badges
  accentText: string; // text color for badges
  heroBgClass: string; // background color gradient or similar
  badgeLogo: string; // emoji or icon reference
}

export interface Course {
  id: string;
  categoryId: CategoryId;
  title: { pt: string; es: string };
  duracao: { pt: string; es: string };
  modalidade: 'presencial' | 'online' | 'hibrido';
  location: { pt: string; es: string };
  materials: { pt: string; es: string };
  description: { pt: string; es: string };
  features: { pt: string[]; es: string[] };
  url?: string;
  rating: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  photoUrl: string;
  courseName: { pt: string; es: string };
  text: { pt: string; es: string };
  stars: number;
}

export interface FAQItem {
  id: string;
  question: { pt: string; es: string };
  answer: { pt: string; es: string };
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  category: CategoryId;
  createdAt: string;
}
