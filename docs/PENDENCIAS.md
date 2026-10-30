# Pendências do projeto (atualizado em 2026-10-30)

Estado: `main` e `development` no mesmo commit (`304103e`), em produção. Deploy: push em `main` publica pelo GitHub Actions
(build e pré-render no CI; ver `docs/DEPLOY.md`). Só existem as branches `main` e `development`.

## 0. Trabalho em andamento
- ✅ Navbar do Brasil (itens de curso sempre redirecionam) e filtro por segmento com #hash nas homes BR e AR: **implementado e testado
  localmente (desktop e celular), commitado na `development`, AINDA NÃO PUBLICADO** (aguarda OK para dar push em `main`).
  Detalhes: `SegmentFilter`, `CardToolbar`, `useSegmentFilter`, guia de estilo atualizado.

## 1. Conteúdo (depende da Ivana / do usuário)
- Fotos reais para 5 cards sem foto: **Peças em Concreto** e **Tricô Gigante** (BR, presencial); **Tecnicatura en estampas textiles**,
  **Tecnicatura en diseño de interiores** e **Profesorado en arte mix media** (AR, online). Hoje usam capa de marca/placa.
  O Drive só tem peças de divulgação; fotos do iCloud só se o usuário indicar o álbum/pasta. Depois: atualizar cards e regerar `npm run og`.
- Temario confirmado de resinas, macramé, estampas, interiores, mix media e dos Profesorados (`src/app/data/carreras_ar.ts`, campo `temario`).
  Só `ar-velas` está publicado (lista do rascunho com ortografia corrigida). `carreras_ar_temario.ts` (rascunho, só DEV) é lista bruta
  de nomes de arquivo ("Untitled", "ultimo TP resina"): não publicar sem limpar.
- Nomes oficiais dos Profesorados (`nombreConfirmado: false`) e data de início do Mix Media.
- ✅ WhatsApp da Argentina confirmado: 5493757201014 (com 9), exibido como "+54 9 3757 20-1014" em todo o site.

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
