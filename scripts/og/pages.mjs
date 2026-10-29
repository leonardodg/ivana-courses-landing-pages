// Imagens de prévia de link (Open Graph, 1200x630) de cada página. Uma entrada = uma imagem.
// `file`: nome em public/images/og/ (com versão: ao trocar a arte, suba -v3 para o WhatsApp não usar o cache).
// `photo`: arquivo em public/ (foto ou ilustração do herói). `title`: use <em> para o destaque em itálico rosé.
const BR = 'BRASIL';
const AR = 'ARGENTINA';

export const og_pages = [
  // ── Brasil ────────────────────────────────────────────────
  { file: 'br-home-v2', country: 'BR', kicker: 'CURSOS NO BRASIL', title: 'Velas, saboaria <em>e resinas</em>', sub: 'Cursos presenciais e online com a Ivana Lerea. +3.000 alunas.', photo: '/images/ivana-com-velas.webp', pos: '50% 18%' },
  { file: 'br-velas-v2', country: 'BR', kicker: 'CURSOS PRESENCIAIS', title: 'Curso de <em>velas artesanais</em>', sub: 'Turmas na agenda, com compra na loja.', photo: '/images/cursos/velas-aromaticas-moldes-foto.webp', pos: '50% 50%' },
  { file: 'br-sabonetes-v2', country: 'BR', kicker: 'CURSOS PRESENCIAIS', title: 'Saboaria e <em>extratos naturais</em>', sub: 'Aprenda do zero, pelo método melt and pour.', photo: '/images/cursos/saboaria-extratos-foto.webp', pos: '50% 50%' },
  { file: 'br-aromas-v2', country: 'BR', kicker: 'CURSOS PRESENCIAIS', title: 'Aromas e <em>incensos naturais</em>', sub: 'Aromatizantes, perfumes e incensaria.', photo: '/images/cursos/aromatizantes-perfumes-foto.webp', pos: '50% 50%' },
  { file: 'br-resinas-v2', country: 'BR', kicker: 'CURSOS PRESENCIAIS', title: 'Resina e <em>decoração</em>', sub: 'Peças em resina com acabamento profissional.', photo: '/images/courses/resina-relogio-praia.webp', pos: '50% 50%' },
  { file: 'br-online-velas-v2', country: 'BR', kicker: 'CURSO ONLINE GRAVADO', title: 'Velas aromáticas, <em>moldes e wax melts</em>', sub: 'Videoaulas passo a passo com a Ivana Lerea.', photo: '/images/courses/velas-online.webp', pos: '50% 40%' },
  { file: 'br-online-saboaria-v2', country: 'BR', kicker: 'CURSO ONLINE GRAVADO', title: 'Saboaria com <em>extratos naturais</em>', sub: 'Do primeiro sabonete ao seu próprio portfólio.', photo: '/images/courses/saboaria-sabonetes.webp', pos: '50% 50%' },
  { file: 'br-apostila-v2', country: 'BR', kicker: 'APOSTILA EM PDF', title: '60 receitas de <em>sabonetes</em>', sub: 'Melt and pour, com quantidades e proporções.', photo: '/images/online/apostila-03.webp', pos: '50% 40%' },
  { file: 'br-agenda-v2', country: 'BR', kicker: 'AGENDA', title: 'Agenda de <em>cursos e oficinas</em>', sub: 'Datas, horários e endereços sempre atualizados.', photo: '/images/courses/imersao-turma.webp', pos: '50% 40%' },
  { file: 'br-interesse-v2', country: 'BR', kicker: 'INTERESSE', title: 'Receba as próximas <em>turmas</em>', sub: 'Deixe seus dados e a Ivana avisa quando abrir.', photo: '/images/portfolio/ivana-servindo-cera.webp', pos: '50% 25%' },
  { file: 'br-padrao-v2', country: 'BR', kicker: 'IVANA ACADEMY', title: 'Cursos de velas, <em>saboaria e resinas</em>', sub: 'Brasil · Argentina', photo: '/images/courses/velas-pavio-madeira.webp', pos: '50% 50%' },

  // ── Argentina ─────────────────────────────────────────────
  { file: 'ar-home-v2', country: 'AR', kicker: 'CARRERAS 100% ONLINE', title: 'Título del <em>Conservatorio Grassi</em>', sub: 'Tecnicaturas y profesorados con la profesora Ivana Lerea.', photo: '/images/ar/hero-carreras.svg', pos: '92% 50%', seal: true },
  { file: 'ar-velas-v2', country: 'AR', kicker: 'TECNICATURA · 9 MESES', title: 'Tecnicatura en <em>arte y diseño de velas</em>', sub: '100% online, con título del Conservatorio Grassi.', photo: '/images/ar/hero-velas.svg', pos: '92% 50%', seal: true },
  { file: 'ar-resinas-v2', country: 'AR', kicker: 'TECNICATURA · 9 MESES', title: 'Tecnicatura en <em>arte y decoración con resinas</em>', sub: '100% online, con título del Conservatorio Grassi.', photo: '/images/ar/hero-resinas.svg', pos: '92% 50%', seal: true },
  { file: 'ar-macrame-v2', country: 'AR', kicker: 'TECNICATURA · 9 MESES', title: 'Tecnicatura en <em>macramé</em>', sub: '100% online, con título del Conservatorio Grassi.', photo: '/images/ar/hero-macrame.svg', pos: '92% 50%', seal: true },
  { file: 'ar-estampas-v2', country: 'AR', kicker: 'TECNICATURA · 9 MESES', title: 'Tecnicatura en <em>estampas textiles</em>', sub: '100% online, con título del Conservatorio Grassi.', photo: '/images/ar/hero-estampas.svg', pos: '92% 50%', seal: true },
  { file: 'ar-interiores-v2', country: 'AR', kicker: 'TECNICATURA · 9 MESES', title: 'Tecnicatura en <em>diseño de interiores</em>', sub: '100% online, con título del Conservatorio Grassi.', photo: '/images/ar/hero-interiores.svg', pos: '92% 50%', seal: true },
  { file: 'ar-mixmedia-v2', country: 'AR', kicker: 'PROFESORADO · 18 MESES', title: 'Profesorado en <em>arte mix media</em>', sub: '100% online, con título del Conservatorio Grassi.', photo: '/images/ar/hero-mixmedia.svg', pos: '92% 50%', seal: true },
  { file: 'ar-agenda-v2', country: 'AR', kicker: 'COHORTE 2027', title: 'Agenda de <em>las carreras</em>', sub: 'Fechas de inicio y cronograma de cada carrera.', photo: '/images/ar/hero-carreras.svg', pos: '92% 50%', seal: true },
  { file: 'ar-interes-v2', country: 'AR', kicker: 'INTERÉS', title: 'Recibí las novedades <em>de las carreras</em>', sub: 'Dejanos tus datos y te escribimos.', photo: '/images/ar/hero-carreras.svg', pos: '92% 50%', seal: true },
  { file: 'ar-padrao-v2', country: 'AR', kicker: 'IVANA ACADEMY', title: 'Carreras online <em>con título Grassi</em>', sub: 'Argentina · Brasil', photo: '/images/ar/hero-carreras.svg', pos: '92% 50%', seal: true },
];
