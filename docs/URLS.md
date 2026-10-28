# URLs do site (padrão oficial)

Criado em 28/10/2026. **O caminho do arquivo em `src/` é a URL publicada**: `src/pt-br/cursos/velas/index.html`
vira `https://courses.ivana.academy/pt-br/cursos/velas/`. Uma página nova é um `index.html` na pasta certa
(o `vite.config.ts` registra sozinho todas as pastas com `index.html`).

## Regras

1. **País e idioma no primeiro nível:** `/pt-br/` (Brasil, português) e `/es-ar/` (Argentina, espanhol),
   sempre em minúsculas e com hífen. No HTML (`<html lang>` e `hreflang`) a forma é `pt-BR` e `es-AR`.
2. **Raiz `/`:** página seletora de país (sem redirecionamento automático por IP ou idioma). É o `x-default`.
3. **Slugs no idioma do mercado**, em minúsculas, com hífen, sem acento e sem ID.
4. **Cada página tem canonical para si mesma** e URL absoluta no `og:url`.
5. **`hreflang` só entre páginas equivalentes** (ver "Pares de idioma"); nunca por ter o mesmo assunto.
6. **Mudou um slug?** Sempre 301 da URL antiga em `.devcontainer/nginx/conf.d/default.conf`, links internos
   atualizados e sitemap revisado. `npm run check:urls` confere tudo.
7. **`?mock`** (dados de exemplo da agenda) só existe no servidor de desenvolvimento; não existe no build.

## Mapa

### Brasil (`/pt-br/`)
| URL | Página |
|---|---|
| `/pt-br/` | Home |
| `/pt-br/cursos/velas/` · `/sabonetes/` · `/aromas/` · `/resinas/` | Páginas por segmento (presencial e online do tema) |
| `/pt-br/cursos/online/velas-aromaticas/` | Curso online de velas (Hotmart) |
| `/pt-br/cursos/online/saboaria-com-extratos-naturais/` | Curso online de saboaria (Hotmart) |
| `/pt-br/apostilas/60-receitas-de-sabonetes/` | Apostila em PDF (Hotmart) |
| `/pt-br/agenda/` | Agenda de turmas presenciais |
| `/pt-br/interesse/` | Cadastro de interesse (é o canal de contato) |
| `/pt-br/links/` | Links da bio do Instagram |
| `/pt-br/privacidade/` · `/termos/` · `/reembolso/` · `/lgpd/` | Páginas legais |

### Argentina (`/es-ar/`)
| URL | Página |
|---|---|
| `/es-ar/` | Home (as 6 carreras) |
| `/es-ar/carreras/tecnicatura-arte-diseno-velas/` | Tecnicatura en arte y diseño de velas |
| `/es-ar/carreras/tecnicatura-arte-decoracion-resinas/` | Tecnicatura en arte y decoración con resinas |
| `/es-ar/carreras/tecnicatura-macrame/` | Tecnicatura en macramé |
| `/es-ar/carreras/tecnicatura-estampas-textiles/` | Tecnicatura en estampas textiles |
| `/es-ar/carreras/tecnicatura-diseno-interiores/` | Tecnicatura en diseño de interiores |
| `/es-ar/carreras/profesorado-arte-mix-media/` | Profesorado en arte mix media |
| `/es-ar/agenda/` | Calendario de la Cohorte 2027 |
| `/es-ar/links/` | Links da bio do Instagram |
| `/es-ar/privacidad/` · `/terminos/` · `/reembolso/` · `/derechos/` · `/arrepentimiento/` | Páginas legales |

Não há página de inscrição própria: os botões levam à loja (Brasil: `loja.ivana.academy`; Argentina: tienda, ou
WhatsApp enquanto a tienda não existe). `/es-ar/carreras/` e `/pt-br/cursos/` (diretórios) redirecionam para a
seção de carreras/cursos da home.

### Pares de idioma (`hreflang` e seletor PT | ES)
`/pt-br/` ↔ `/es-ar/` · `/pt-br/cursos/velas/` ↔ `/es-ar/carreras/tecnicatura-arte-diseno-velas/` ·
`/pt-br/cursos/resinas/` ↔ `/es-ar/carreras/tecnicatura-arte-decoracion-resinas/` · páginas legais equivalentes.
Os demais cursos do Brasil e as demais carreras não são versões um do outro.

## URLs antigas (todas com 301)
`/pt_br/candles/` → `/pt-br/cursos/velas/` · `/pt_br/soap/` → `/pt-br/cursos/sabonetes/` · `/pt_br/aromas/` →
`/pt-br/cursos/aromas/` · `/pt_br/resin/` → `/pt-br/cursos/resinas/` · `/velas/` → `/pt-br/cursos/online/velas-aromaticas/` ·
`/saboaria/` → `/pt-br/cursos/online/saboaria-com-extratos-naturais/` · `/apostila/` →
`/pt-br/apostilas/60-receitas-de-sabonetes/` · `/agenda/` → `/pt-br/agenda/` · `/interest` → `/pt-br/interesse/` ·
`/links/br/` → `/pt-br/links/` · `/links/arg/` → `/es-ar/links/` · `/es_ar/candles/`, `/resin/`, `/macrame/`, `/textil/`,
`/interiores/`, `/mixmedia/` → `/es-ar/carreras/…` · `/es_ar/agenda/` → `/es-ar/agenda/` · legais `/pt_br/…` e `/es_ar/…`
→ `/pt-br/…` e `/es-ar/…`. A query string (UTM) é preservada.

## Sitemaps
`sitemap.xml` é o índice de `sitemap-global.xml` (raiz), `sitemap-pt-br.xml` e `sitemap-es-ar.xml`, com `hreflang`
nos pares. Só entram URLs canônicas e indexáveis (as páginas de links da bio ficam de fora).

## Conferência
`npm run build && npm run check:urls` verifica canonical, `hreflang` recíproco, links internos (no HTML e nos textos de
`src/`), URLs dos sitemaps, páginas fora do sitemap e restos de `/pt_br/` e `/es_ar/`.
