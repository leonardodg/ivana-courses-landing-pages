// Base da tienda Argentina (ex.: https://tienda.ivana.academy), vinda de VITE_TIENDA_AR_URL no build.
// Vazia até a tienda existir: os botões "Ver valores e inscribirme" levam ao WhatsApp AR.
// Módulo mínimo e separado de data/carreras_ar.ts de propósito: lib/analytics.ts (carregado em todas as
// páginas, inclusive no Brasil) importa só isto, sem arrastar os dados das carreras.
export const TIENDA_AR_URL = ((import.meta.env.VITE_TIENDA_AR_URL as string | undefined) ?? '').trim().replace(/\/+$/, '');
