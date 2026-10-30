# Pendências do projeto (atualizado em 2026-10-30)

Estado: `main` e `development` no mesmo commit (`304103e`), em produção. Deploy: push em `main` publica pelo GitHub Actions
(build e pré-render no CI; ver `docs/DEPLOY.md`). Só existem as branches `main` e `development`.

## 0. Trabalho em andamento (NÃO commitado, na `development` local)

**Navbar do Brasil + filtro por segmento nos cards** (pedido de 2026-10-30):
- Pedido: (a) no desktop, os itens Brasil > Cursos presenciais da navbar devem **sempre redirecionar** para a página do curso
  (hoje, na home `/pt-br/`, só filtram os cards); (b) para a home não ficar sem filtro, criar um **select de segmento** ao lado do
  seletor Completo | Lista, como componente do design system; (c) toda página com cards de vários segmentos usa o filtro
  (home BR e home AR); (d) o filtro também funciona por **#hash** na URL (`/pt-br/#velas` filtra e rola; `/pt-br/#imersao-velas`
  mostra o segmento do card e rola até ele), para links de campanha.
- Já feito (arquivos modificados/novos, `tsc` passa): `src/app/ui/SegmentFilter.tsx`, `src/app/ui/CardToolbar.tsx`,
  `src/app/hooks/useSegmentFilter.ts`, `src/app/ui/Card.tsx` (`CardGrid` aceita `filter` e usa `CardToolbar`), `src/app/ui/index.ts`.
- Falta fazer:
  1. `SiteNavbar.tsx`: remover o ramo `it.category && onSelectCategory` do `pick` (itens de curso viram link normal); "Todos os cursos"
     na home continua limpando o filtro e rolando para `#cursos`.
  2. `App.tsx` (home BR): usar `useSegmentFilter({ keys: categorias, aliases: { aromas: 'aromas_incensos', sabonetes: 'saboaria', resina: 'resinas' },
     cardSegment, sectionId: 'cursos' })`; remover `selectCategory`/sincronia do herói com o menu; passar o filtro ao `CourseGrid`.
  3. `CourseGrid.tsx`: renderizar `<CardToolbar filter=… />` uma vez acima dos grupos e usar `toggle={false}` nos `CardGrid` dos grupos;
     dar `id` aos cards antigos (`id={course.id}`); `cardSegment` = categoria do card (presencial por tema, antigos por `categoryId`).
  4. `CareerHomeApp.tsx` (home AR): filtro por carrera (chaves `velas`, `resinas`, `macrame`, `estampas` (apelido `textil`), `interiores`,
     `mixmedia`; rótulos curtos de `ar_pages[...].title`; textos "Filtrar por carrera" / "Todas las carreras") passando `filter` ao `CarrerasGrid` → `CardGrid`.
  5. Testar no navegador (desktop e celular), `npm run build:ssg`, `verify-dist`, `check:urls`; hash `#velas`, `#imersao-velas`, `#ar-macrame`;
     documentar no `docs/GUIA-DE-ESTILO.md` (SegmentFilter, CardToolbar, filtro por hash); commitar e, com OK da Ivana/usuário, publicar.

## 1. Conteúdo (depende da Ivana / do usuário)
- Fotos reais para 5 cards sem foto: **Peças em Concreto** e **Tricô Gigante** (BR, presencial); **Tecnicatura en estampas textiles**,
  **Tecnicatura en diseño de interiores** e **Profesorado en arte mix media** (AR, online). Hoje usam capa de marca/placa.
  O Drive só tem peças de divulgação; fotos do iCloud só se o usuário indicar o álbum/pasta. Depois: atualizar cards e regerar `npm run og`.
- Temario confirmado de resinas, macramé, estampas, interiores, mix media e dos Profesorados (`src/app/data/carreras_ar.ts`, campo `temario`).
  Só `ar-velas` está publicado (lista do rascunho com ortografia corrigida). `carreras_ar_temario.ts` (rascunho, só DEV) é lista bruta
  de nomes de arquivo ("Untitled", "ultimo TP resina"): não publicar sem limpar.
- Nomes oficiais dos Profesorados (`nombreConfirmado: false`) e data de início do Mix Media.
- Confirmar o WhatsApp da Argentina: os botões usam `wa.me/5493757201014` (com 9); o número exibido ainda é "+54 3757 20-1014".

## 2. SEO / Google (manual, fase 5 do plano)
- Search Console: reenviar `sitemap.xml`; Inspeção de URL (teste ao vivo + "ver página testada") em home BR, home AR, uma carrera, um curso
  presencial, um online e a agenda; pedir indexação.
- Depurador de Compartilhamento do Facebook ("Scrape Again") nas 3 páginas online + teste real no WhatsApp.
- GA4: conferir Tempo real/DebugView (`page_view` e eventos de WhatsApp) depois do aceite dos cookies.
- PageSpeed (celular) em 1 a 2 semanas e comparar com `docs/PLANO-PRE-RENDER.md` seção 11.

## 3. Código (pode ser feito quando pedirem)
- Formulário de interesse: `h2` antes do `h1` e subtítulo repetido (muda o layout que o usuário quis manter).
- Opção "Artes" do interesse BR sem curso associado (`data/interest_options.ts`).
- PT | ES em páginas sem versão no outro idioma troca o `<html lang>` sem traduzir.
- Fora do `ui/`: `CandlesOnlineSection`, `ContactForm`, `CandlesLeadForm`, páginas legais; botões "GRADE/MATRÍCULA" antigos da página de velas.
- Home BR no celular: HTML cru cobre só 74% do texto (cards em lista escondem detalhes); opção: renderizar detalhes escondidos.
- Aviso de cookies vira o LCP na primeira visita no celular (decisão: adiado, mexe em texto legal).
- Agenda: HTML pré-renderizado tem só conteúdo fixo + esqueleto (turmas vêm do feed).
- Pré-render no CI: opcional rodar também `scripts/prerender-audit.mjs` (hidratação).
- GitHub Actions: avisos de Node 20 (`checkout`, `setup-node`, `upload-artifact`); atualizar versões.
- Textos ainda < 11px em algumas páginas (velas) e alguns links de texto < 44px de alvo de toque; mobile da home AR tem a ilustração atrás do título.
- GradeModal e aria-live já corrigidos; restam melhorias menores de a11y listadas no code review.

## 4. VPS / operação
- ✅ Docker da VPS limpo e staging removido (2026-10-30, feito pelo usuário). Opcional: acrescentar prune automático e seguro ao script de deploy.
- Deploy de reserva (se o fluxo novo estiver fora do ar): `gh workflow run deploy.yml` (a VPS constrói o site como antes, sem pré-render).
  Deploy normal manual: `gh workflow run deploy-prebuilt.yml -f target=production -f confirm_production=sim`. Detalhes em `docs/DEPLOY.md`.

## 5. Arquivos locais não versionados
- `conteudo/` e `ivana.png` (do usuário) ficam fora do git. `public/es-ar/links/index.html` já está commitado.
