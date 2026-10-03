// src/app/lang/candles_lead_form.ts
// Textos exclusivos da página /pt_br/candles — formulário de captura
// de leads com geração de cupom de boas-vindas (10% OFF).

export const candles_lead_text = {
  tagLabel: 'FALE CONOSCO',
  title: 'Garanta seu Cupom de Boas-Vindas',
  subtitle:
    'Deixe seus dados e receba a agenda completa de turmas, o catálogo de cursos e um cupom exclusivo de 10% de desconto para usar na sua matrícula.',
  whatsappLabel: 'WhatsApp / Ligação',
  emailLabel: 'Email',
  locationLabel: 'Ateliês',
  contactPhoneDisplay: '+55 48 99999-0000',
  contactEmailDisplay: 'contato@ivana.academy',
  contactLocationDisplay: 'Florianópolis, SC — Brasil',

  formName: 'Nome completo',
  formNamePlaceholder: 'Seu nome completo',
  formEmail: 'E-mail',
  formEmailPlaceholder: 'Seu melhor e-mail',
  formInterest: 'Curso de interesse',
  formInterestOptions: [
    'Imersão Presencial de Velas',
    'Workshop Presencial de Velas',
    'Curso Online de Velas Aromáticas & Terapêuticas',
    'Profesorado em Velas Online',
    'Tecnicatura em Arte e Design de Velas',
    'Ainda não decidi',
  ],
  formBtnSubmit: 'Quero meu cupom',
  formBtnSubmitting: 'Gerando cupom...',

  successTitle: 'Inscrição Realizada!',
  successDescPrefix: 'Enviamos a agenda completa e catálogo para o e-mail:',
  successDescSuffix: 'Use seu cupom de 10% de desconto:',
  couponLabel: 'CUPOM DE BOAS-VINDAS',
  copyLabel: 'Copiar',
  copiedLabel: 'Copiado',
  couponHint: 'Você pode aplicar este cupom no checkout dos cursos online!',
  resetCta: 'Enviar outro contato',

  errorMsg:
    'Não foi possível enviar após algumas tentativas. Tente novamente ou nos contate pelo WhatsApp.',
  rateLimitMsg: 'Muitas tentativas. Aguarde',
  rateLimitSuffix: 's antes de tentar novamente.',

  formPhone: 'WhatsApp / Celular',
  formPhonePlaceholder: 'Número com DDD',
  errPhoneShort: 'Número muito curto',
};

// Textos da mesma secao para /es_ar/candles — mesma estrutura, mercado AR.
export const candles_lead_text_es = {
  tagLabel: 'CONTÁCTANOS',
  title: 'Asegurá tu Cupón de Bienvenida',
  subtitle:
    'Dejanos tus datos y recibí el calendario completo de clases, el catálogo de cursos y un cupón exclusivo del 10% de descuento para tu inscripción.',
  whatsappLabel: 'WhatsApp / Llamada',
  emailLabel: 'Email',
  locationLabel: 'Talleres',
  contactPhoneDisplay: '+54 11 0000-0000',
  contactEmailDisplay: 'contacto@ivana.academy',
  contactLocationDisplay: 'Buenos Aires, Argentina',

  formName: 'Nombre completo',
  formNamePlaceholder: 'Tu nombre completo',
  formEmail: 'Correo electrónico',
  formEmailPlaceholder: 'Tu mejor correo',
  formPhone: 'WhatsApp / Celular',
  formPhonePlaceholder: 'Número con código de área',
  formInterest: 'Curso de interés',
  formInterestOptions: [
    'Profesorado en Velas',
    'Tecnicatura en Arte y Diseño de Velas',
    'Certificación Internacional Conservatorio Grassi',
    'Aún no decidí',
  ],
  formBtnSubmit: 'Quiero mi cupón',
  formBtnSubmitting: 'Generando cupón...',

  successTitle: '¡Inscripción Realizada!',
  successDescPrefix: 'Enviamos el calendario completo y catálogo al correo:',
  successDescSuffix: 'Usá tu cupón de 10% de descuento:',
  couponLabel: 'CUPÓN DE BIENVENIDA',
  copyLabel: 'Copiar',
  copiedLabel: 'Copiado',
  couponHint: '¡Podés aplicar este cupón en el checkout de los cursos online!',
  resetCta: 'Enviar otro contacto',

  errorMsg:
    'No se pudo enviar después de varios intentos. Intentá de nuevo o contactanos por WhatsApp.',
  rateLimitMsg: 'Demasiados intentos. Esperá',
  rateLimitSuffix: 's antes de volver a intentar.',
  errPhoneShort: 'Número muy corto',
};
