# Plano de pré-renderização, SEO, Analytics e prévia de links

Status: **plano, nada implementado**. Ordem de execução na seção 8. Decisões na seção 9.

**Decisão (2026-10-29): nada novo é instalado na VPS.** O build e a pré-renderização rodam no **GitHub Actions** a cada deploy; a VPS só recebe o `dist/` pronto e o serve com Nginx.

## 1. Objetivo

Hoje o HTML publicado de cada página traz `title`, meta, Open Graph, canonical, hreflang e JSON-LD, mas o **corpo** (títulos, textos, cards, FAQ) só existe depois que o JavaScript roda. Queremos que o HTML entregue pelo servidor já traga o corpo, sem mudar o comportamento do site para quem navega.

Resultados esperados:
- Google indexa o conteúdo na primeira passada, sem depender da fila de renderização.
- Buscadores e robôs que não executam JS (Bing em parte, DuckDuckGo, crawlers de IA, leitores) enxergam o conteúdo.
- A prévia ao compartilhar o link (WhatsApp, Instagram, Facebook, LinkedIn, X) sai com título, descrição e imagem corretos em **todas** as páginas.
- GA4 continua medindo certo, só depois do aceite, sem contar visita de robô.

## 2. Princípios (orientações do Google e boas práticas)

1. **Pré-renderização/SSG é o caminho recomendado.** O Google trata "dynamic rendering" (servir HTML diferente para robô) como solução provisória e desaconselhada. Aqui **todo mundo recebe o mesmo HTML**; o React assume por cima.
2. **Paridade de conteúdo.** O que o robô lê é o que a pessoa vê. Nada de texto só para robô (cloaking). Conteúdo recolhido (cards em lista, FAQ) conta, mas o texto precisa estar no HTML.
3. **O HTML final não pode ser mais pesado nem mais frágil que o atual.** Fail-open: se a pré-renderização falhar, o build entrega o `dist/` de hoje.
4. **Mobile-first indexing.** O Googlebot de smartphone é o que indexa. A página não pode esconder conteúdo importante no mobile; o que fica recolhido deve estar no DOM.
5. **Core Web Vitals contam.** A pré-renderização não pode piorar LCP, CLS ou INP.
6. **Links rastreáveis:** `<a href>` reais (já é assim), sem navegação só por JS.
7. **Um dado, um lugar.** Metadados e JSON-LD continuam em `src/app/seo/jsonld/*.json` e nos `index.html`; o prerender não os duplica.

## 3. Diagnóstico atual (medido no repositório)

| Item | Situação |
|---|---|
| Meta, OG, canonical, hreflang, JSON-LD no HTML | Sim, nas 30 páginas (o JSON-LD é injetado no build por `inject-json-ld`) |
| Corpo da página no HTML | **Não** (`<div id="root"></div>`) |
| `og:image` | Todas as páginas têm. Só **10 arquivos** para 30 páginas: `home-es.jpg` repetido em 14 páginas da Argentina, `home.jpg` em 7 |
| Prévia dos cursos online e da apostila | Usam foto de produto **vertical** (520x735, 720x955), não 1200x630: o corte no WhatsApp sai ruim |
| `og:image:width`, `height`, `alt` | Faltam em 6 páginas (`/`, interesse AR, 3 online, apostila) |
| `sitemap-*.xml` | Sem `lastmod`; `robots.txt` correto |
| GA4 | Só depois do aceite (`lib/consent.ts`), sem script de terceiros no HTML |
| Aviso de cookies | Montado por JS (`ConsentManager`): aparece sempre num navegador limpo |
| Agenda | Dados do feed, muda sozinha, chega por `fetch` |
| Cards em modo lista (celular) | Detalhes só entram no DOM quando expandidos |

## 4. Arquitetura da pré-renderização (caminho A)

Escolhida por não alterar componentes (formulários, carrossel e modais seguem como estão). Rejeitados: SSR com `renderToString` (as ~30 entradas `main.tsx` usam `createRoot` e há uso de `window`) e troca de framework.

Fluxo: `vite build` → `scripts/prerender.mjs` → pós-processamento → verificação → `dist/` final.

1. **Páginas:** a mesma lista do `discoverPages` do `vite.config.ts` (30 páginas), mais `404.html`.
2. **Servidor:** serve `dist/` localmente em porta efêmera (sem Nginx); abre cada URL num Chrome sem janela via `puppeteer-core` (no GitHub Actions o `ubuntu-latest` já traz o Google Chrome; em dev usa o Chrome do Mac).
3. **Ambiente determinístico do navegador:**
   - Viewport **1280x900** (desktop): cards completos, textos de grade e turmas **no DOM**, que é o que o Google precisa ler.
   - Fuso `America/Sao_Paulo`, idioma por página (`pt-BR`/`es-AR`), `prefers-reduced-motion: reduce` (sem animações no instante da captura), perfil limpo.
   - Interceptação de rede: **bloqueia** feed da agenda, webhook de formulários, GA, Hotmart e qualquer domínio externo. Só `localhost`.
4. **Quando capturar:** raiz com conteúdo (`#root` com filhos), fontes carregadas (`document.fonts.ready`) e rede ociosa. Tempo máximo de 15 s por página; falha vira aviso no relatório, não quebra o build.
5. **Estados que NÃO podem ir para o HTML:**
   - Aviso de cookies e preferências: removidos do HTML final (não é conteúdo).
   - Agenda: fica no estado "carregando"; nunca grava datas ou turmas do feed (ficariam velhas até o próximo deploy).
   - Qualquer texto relativo à data ("Em 8 dias", "Hoje"): só pode aparecer depois do carregamento no cliente.
   - Carrossel: só o primeiro slide (já é assim, só o ativo existe no DOM).
6. **Pós-processamento do HTML:** manter exatamente um `<script type="application/ld+json">` por página, os `<script type="module">` e `<link>` do Vite; remover scripts/estilos injetados em runtime que não sejam do Vite; marcar `<html data-prerendered>`; `lang` intacto.
7. **Montagem no cliente (`src/app/lib/mount.tsx`):** páginas com `data-prerendered` são **hidratadas** (`hydrateRoot`), mantendo os nós já pintados; sem pré-render (dev), `createRoot` como sempre. O aviso de cookies fica numa raiz separada (`#consent-root`), porque depende do consentimento salvo no navegador e não pode estar no HTML pré-renderizado. Na captura, textos vizinhos ganham `<!-- -->` entre eles (como o `renderToString` faz), senão o `innerHTML` os junta e a hidratação reclama (erro #418).
8. **Fail-open:** erro em qualquer página mantém o `index.html` original dela; o relatório lista o que ficou sem pré-render e o build **não** falha (configurável: `PRERENDER_STRICT=1` falha no CI).

### Entrega com build no GitHub Actions (sem Chromium nem Node na VPS)

Fluxo novo do workflow (`deploy.yml`):
1. **Job `build`** (ubuntu-latest): `npm ci` → `npm run build` com os segredos `VITE_*` do GitHub → `node scripts/prerender.mjs` → verificações da seção 5 → sobe `dist/` como artefato.
2. **Job `deploy`** (depende do `build`): baixa o artefato e envia `dist/` para a VPS por SSH (`rsync`/`scp`, mesma chave `SSH_PRIVATE_KEY` de hoje) para uma pasta de release; troca o `dist` ativo (`mv` atômico) e sobe o container Nginx.
3. **Dockerfile da VPS:** novo alvo `production-prebuilt`, só com `FROM nginx` + `COPY dist/` + configs; **sem estágio Node**. A VPS deixa de rodar `npm ci` e `vite build`, e os segredos do webhook deixam de passar pelo `docker compose build`.
4. Ganhos: VPS com menos software e menos superfície de ataque, deploy mais rápido (sem build na VPS), build reprodutível e testado no CI antes de qualquer publicação.
5. Rollback: manter as 3 últimas releases na VPS (`releases/AAAA-MM-DD-hhmm`); voltar é trocar o link `current` e reiniciar o container.

### Pontos de atenção
- **Mobile depois do JS:** quem abre no celular vê, por um instante, o HTML completo e em seguida a lista compacta. Mitigar: garantir mesma altura dos blocos acima da dobra e medir CLS; se piorar, esconder os cards pré-renderizados no mobile com CSS até a montagem.
- **Eventos (JSON-LD de agenda):** continuam montados no navegador (o Google processa JSON-LD injetado por JS). Não gravar eventos do feed no build.
- **Imagens:** o `<img>` do topo sem `loading="lazy"` e com `fetchpriority="high"` já existe no Hero; conferir que o HTML pré-renderizado preserva os atributos.

## 5. Google Search: lista de verificação técnica

Fazer junto com a pré-renderização (itens marcados "já" estão prontos):
- Canonical absoluto e igual ao `og:url` (já). Uma URL canônica por página, sem parâmetros.
- `hreflang` recíproco, incluindo `x-default` (já, inclusive nas legais). Validar no Search Console.
- **`lastmod`** nos sitemaps, gerado no build a partir da data do último commit da página (não da data do build, para o valor não mudar sem motivo).
- `robots.txt` sem bloquear CSS, JS e imagens (já). Páginas de links com `noindex` (já).
- Páginas de erro devolvem **404 real** (já, testado) e nada de soft 404.
- Títulos únicos de 50 a 60 caracteres e descrições de 140 a 160; **um `h1` por página** (corrigido no checklist).
- Imagens com `alt`, `width`/`height` onde o container não fixa a proporção, formato WebP (feito).
- JSON-LD: validar cada tipo (Organization, WebSite, WebPage, FAQPage, Course, Product, Service, ItemList) no Teste de Resultados Aprimorados; não marcar nada que não aparece na página (FAQ do JSON-LD = FAQ visível).
- Nenhum preço em páginas da Argentina (regra do projeto) tanto no HTML quanto no JSON-LD (teste automático já existe no checklist de deploy).
- Core Web Vitals: medir antes e depois no PageSpeed (celular). Metas: LCP até 2,5 s, CLS até 0,1, INP até 200 ms.

## 6. Analytics (GA4) e consentimento

1. **O prerender nunca carrega GA.** Sem consentimento (perfil limpo) o `lib/consent.ts` não injeta o script, e a rede do prerender bloqueia domínios do Google. Verificação automática: o HTML final **não** contém `googletagmanager`, `gtag(` nem `G-1MFXBHFE71`.
2. **Sem visita duplicada.** O HTML pré-renderizado não executa nada; o `page_view` continua sendo disparado uma vez quando o GA carrega depois do aceite. A troca do HTML pelo React não gera novo `page_view`.
3. **Eventos continuam funcionando:** cliques de WhatsApp, `select_career`, formulários e saídas dependem de listeners que o React cria ao montar. Teste manual no DebugView do GA4 (ver 8).
4. **Tráfego de robô e interno:** o Chromium do prerender não aceita cookies e não chega ao GA. Definir filtro de tráfego interno no GA4 (IPs da equipe) e marcar `?debug_mode` só em testes.
5. **Consent Mode v2:** hoje basta o bloqueio total antes do aceite (LGPD). Avaliar o Consent Mode v2 se a Ivana começar a anunciar no Google Ads; sem anúncios não é necessário.
6. Vincular GA4 ao Search Console (Administrador > Links do produto) para ver buscas orgânicas dentro do GA4.

## 7. Prévia ao compartilhar (WhatsApp, Instagram, Facebook, LinkedIn, X)

**Como funciona:** esses serviços leem só o HTML estático (`<head>`), sem executar JS. Por isso `title`, `og:*` e `twitter:*` já ficam no HTML de cada página (e continuarão). O corpo pré-renderizado ajuda, mas a prévia depende só do `<head>`.

Requisitos para uma boa prévia:
- `og:title` (até ~60 caracteres), `og:description` (até ~155), `og:url` canônico, `og:type`, `og:site_name`, `og:locale` (`pt_BR` / `es_AR`).
- `og:image` com **URL absoluta https**, **1200x630 (1,91:1)**, JPG ou PNG, de preferência **abaixo de 200 KB** (WhatsApp ignora ou degrada imagens grandes), sem redirecionamento e sem login. Texto seguro dentro de 1000x500 centrais (cortes laterais no celular).
- `og:image:width`, `og:image:height`, `og:image:alt`; `twitter:card=summary_large_image` com `twitter:image`.
- Imagem **específica por página**, com título legível em corpo grande, marca e (na Argentina) o selo do Conservatorio Grassi.

Plano de imagens (arte no padrão do design system: fundo creme, serifa Libre Caslon, rosé `#805252`, ilustração dos heróis):
- **Brasil:** home, 4 cursos presenciais (velas, sabonetes, aromas, resinas), 3 produtos online (velas, saboaria, apostila), agenda, interesse, e uma imagem padrão para as páginas legais.
- **Argentina:** home, **6 carreras**, agenda, interés e padrão para legais (hoje as 14 páginas usam a mesma `home-es.jpg`).
- Total: cerca de 22 imagens, geradas por script a partir de um modelo HTML (mesmo Chromium da pré-renderização), para que mudar título ou cor regenere tudo de uma vez.
- Nome com versão no arquivo (`og-velas-v2.jpg`) ao trocar a arte, porque o WhatsApp guarda a prévia em cache; para limpar o cache de uma URL, usar o Depurador de Compartilhamento do Facebook.

Teste de aceitação: enviar o link de 6 páginas (2 por país e tipo) pelo WhatsApp (celular e web), conferir imagem, título e descrição; repetir no Depurador do Facebook, no Post Inspector do LinkedIn e no X Card Validator.

## 8. Fases, entregas e critérios

| Fase | O que entrega | Risco | Critério de aceite |
|---|---|---|---|
| **0. Prévia e sitemap** ✅ **concluída em 2026-10-29** | Imagens OG por página (`npm run og`), atributos `og:image:*`/`alt` completos, `lastmod` e `image:image` nos sitemaps (`npm run sitemap`) | Baixo | Teste manual no WhatsApp e no Depurador do Facebook; `npm run check:urls` valida OG e sitemap |
| **1. Script de pré-render local** ✅ **concluída em 2026-10-29** (`npm run build:ssg`, `scripts/prerender.mjs`) | `scripts/prerender.mjs` com `puppeteer-core` e Chrome local; relatório por página | Baixo | `dist/` com corpo em 30/30 páginas; HTML sem GA, sem banner, sem dados do feed |
| **2. Teste de paridade e desempenho** ✅ **concluída em 2026-10-29** (`scripts/prerender-audit.mjs`, resultados na seção 11) | Script que compara o texto do HTML pré-renderizado com o DOM montado no cliente; PageSpeed antes/depois | Baixo | Paridade >= 95% do texto visível; LCP/CLS iguais ou melhores |
| **3. Build no GitHub Actions + entrega do `dist/`** ✅ **3a pronta (2026-10-29)**: pipeline manual, ainda não executado na VPS; **3b (trocar o deploy de `main`) pendente** (ver `docs/DEPLOY.md`) | Job `build` com pré-render e artefato; job `deploy` envia `dist/` por SSH; alvo `production-prebuilt` no Dockerfile (sem Node); releases com rollback | **Médio** (muda o pipeline) | Deploy de teste num caminho paralelo na VPS (ex.: porta 8089) antes de trocar o ativo; site idêntico ao de hoje e Nginx com os mesmos cabeçalhos |
| **4. CI** | O job "Build & Lint Check" roda o pré-render em modo estrito e as verificações da seção 5 | Baixo | Pipeline falha se faltar `h1`, JSON-LD duplicado, GA no HTML, preço na Argentina |
| **5. Publicação e acompanhamento** | Deploy; Inspeção de URL no Search Console (teste ao vivo, "ver página testada") nas 6 páginas principais; solicitar indexação; GA4 Tempo real/DebugView | Médio | HTML renderizado do Google mostra o corpo; GA4 recebe `page_view` e eventos; sem aumento de erros no Search Console |
| **6. Hidratação** ✅ **feita junto com a fase 2** | `hydrateRoot` em todas as páginas (`lib/mount.tsx`) | Médio | 29 páginas x desktop e celular sem erro de hidratação (confirmado) |

**Reversão:** a variável `PRERENDER=off` pula a etapa e entrega o `dist/` de hoje; reverter o commit da fase 3 volta o Dockerfile ao estado anterior. Publicar a fase 0 sozinha já melhora a prévia de links e não depende do resto.

## 9. Decisões e pendências

1. ~~Chromium na VPS~~ **Resolvido:** nada é instalado na VPS; build e pré-render no GitHub Actions (seção 4).
2. **Arte das imagens de prévia:** seguir o padrão do site (ilustrações dos heróis + serifa) ou usar fotos reais dos cursos? Recomendado: fotos reais onde existirem (velas, sabonetes, resinas, macramé) com a faixa de título do design system.
3. **Eventos da agenda como dados estruturados:** manter no cliente (recomendado) ou gerar no build (ficaria desatualizado até o próximo deploy).
4. **Sem pré-render no celular?** Se o CLS piorar, avaliar esconder o HTML pré-renderizado no mobile até o React montar.

## 10. Estimativa

Fase 0: 0,5 a 1 dia (imagens). Fases 1 e 2: 1 dia. Fase 3: 1 dia (pipeline e teste paralelo). Fase 4: 0,5 dia. Fase 5: 0,5 dia de acompanhamento. Total aproximado: 3 dias, publicável em duas entregas (fase 0 primeiro; depois 1 a 5).

## 11. Resultados da fase 2 (medidos em 2026-10-29)

Como medir: `npm run build` → copiar `dist/` para uma pasta (sem pré-render) → `npm run prerender` → `node scripts/prerender-audit.mjs --base <pasta> --pre dist`. Celular simulado: 390x844, CPU 4x mais lenta, rede 4G lenta, mediana de 3 execuções, feed da agenda sem resposta.

**Paridade (texto do HTML cru x página montada):** 100% nas 7 páginas testadas, em desktop. No celular (cards em lista, detalhes recolhidos) o HTML cru cobre 74% a 99% do texto visível: a home do Brasil é a que mais perde (74%) porque os cards compactos escondem benefícios e turmas.

**Hidratação:** 29 páginas x 2 telas sem nenhum erro.

**Desempenho (ms; CLS sem unidade):**

| Página | FCP sem → com | LCP sem → com | CLS |
|---|---|---|---|
| `/pt-br/` | 2904 → 2544 | 4048 → 3252 | 0 → 0 |
| `/es-ar/` | 2696 → 2380 | 3052 → 2380 | 0,035 → 0,035 |
| `/pt-br/cursos/velas/` | 3672 → 2680 | 4776 → 3788 | 0 → 0 |
| `/es-ar/carreras/tecnicatura-macrame/` | 2684 → 2184 | 4464 → 3808 | 0 → 0 |
| `/pt-br/cursos/online/velas-aromaticas/` | 2572 → 2412 | 3744 → 2424 | 0,023 → 0,023 |
| `/pt-br/interesse/` | 2636 → 2116 | 2656 → 3568 | 0 → 0 |
| `/pt-br/agenda/` | 2400 → 1784 | 2416 → 3368 | 0,028 → 0,028 |

Leitura: o **FCP melhora em todas** (0,2 a 1,0 s) e o **LCP melhora nas páginas com herói** (0,7 a 1,3 s). **CLS não piora** em nenhuma, inclusive no celular, apesar de o HTML ser de desktop. Em `/interesse/` e `/agenda/` o LCP "piora" por um efeito de medição: o conteúdo real aparece mais cedo (2,2 s), mas o **parágrafo do aviso de cookies**, maior que o do conteúdo, monta depois e vira o candidato a LCP (3,6 s); sem pré-render ele aparecia junto do conteúdo. Só ocorre na primeira visita (sem consentimento salvo). Melhorar exigiria encurtar o texto do aviso no celular, o que muda texto legal; decisão adiada.

**Decisão tomada:** a agenda agora tem conteúdo fixo no HTML (lista de cursos/carreras com links, sem datas), além do esqueleto de carregamento. **Ainda aberta:** cobertura de 74% da home no celular (se importar, renderizar os detalhes dos cards em lista no DOM, escondidos, em vez de montar só ao expandir).
