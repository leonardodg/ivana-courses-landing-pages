// Dados legais do controlador e da operação. Fonte única para rodapé, políticas e JSON-LD.
export const company = {
  legalName: 'Ivana Lerea LTDA',
  tradeName: 'Ivana Academy',
  cnpj: '63.991.300/0001-08',
  email: 'contato@ivana.academy',
  whatsappLabel: '(48) 99167-1659',
  whatsappUrl: 'https://wa.me/5548991671659',
  dpoName: 'Ivana Lerea',
  site: 'https://courses.ivana.academy',
  store: 'https://loja.ivana.academy',
  platform: 'https://ivana.academy',
  updated: '25 de outubro de 2026',
  updatedEs: '25 de octubre de 2026',
  // Contato usado nas páginas argentinas (mesmos dados já publicados em /es-ar/carreras/tecnicatura-arte-diseno-velas/)
  ar: {
    email: 'contacto@ivana.academy',
    whatsappLabel: '+54 3757 20-1014',
    whatsappUrl: 'https://wa.me/543757201014',
  },
} as const;

export const legalLinks = [
  { href: '/pt-br/privacidade/', hrefEs: '/es-ar/privacidad/', label: { pt: 'Política de Privacidade', es: 'Política de Privacidad' } },
  { href: '/pt-br/termos/', hrefEs: '/es-ar/terminos/', label: { pt: 'Termos de Uso', es: 'Términos de Uso' } },
  { href: '/pt-br/reembolso/', hrefEs: '/es-ar/reembolso/', label: { pt: 'Reembolso e Cancelamento', es: 'Reembolso y Cancelación' } },
  { href: '/pt-br/lgpd/', hrefEs: '/es-ar/derechos/', label: { pt: 'Direitos LGPD', es: 'Derechos sobre tus datos' } },
] as const;
