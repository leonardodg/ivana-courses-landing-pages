# Guia de estilo das páginas (pt_BR é a referência; es_ar segue)

Criado em 27/10/2026. **O que está no ar no Brasil é o padrão.** As páginas da
Argentina (`/es-ar/…`) só trocam o idioma e o conteúdo, nunca o desenho: mesmos
componentes, mesmos tamanhos, mesma ordem. Se um componente de `es_ar` não tem
par neste guia, ele está fora do padrão.

## Páginas de curso online (no padrão desde 27/10/2026)

`/pt-br/cursos/online/velas-aromaticas/`, `/pt-br/cursos/online/saboaria-com-extratos-naturais/` e `/pt-br/apostilas/60-receitas-de-sabonetes/` eram páginas estáticas feitas fora do padrão (em `public/`). Foram
refeitas com os componentes de `ui/`: `OnlineCoursePageApp` (`src/app/pages/`) monta a página a partir do
conteúdo em `src/app/data/online_courses.ts` (textos, preço, links da Hotmart, fotos em `public/images/online/`).
Navbar, herói, faixa de números, depoimentos, perguntas, contato e rodapé são os mesmos do resto do site.
**Para mudar texto, preço ou link de compra, edite só `online_courses.ts`; para mudar o visual, edite `ui/`.**
Componentes novos desta migração: `StatsBar`, `Gallery`, `InfoGrid`, `Profile`, `PriceBlock`, `PurchaseCta`,
`StickyBuyBar`, `emphasis` (títulos com *destaque*).

## Regra de ouro: um componente, um lugar

**Toda página usa os componentes de `src/app/ui/`.** Não se recria botão, card, passo,
cabeçalho de seção, herói nem bloco de contato dentro de uma página. Para mudar o
desenho, **edita-se o componente em `ui/` uma única vez** e todas as páginas (Brasil e
Argentina) acompanham.

| Componente (`import … from '../ui'`) | O que é | Usado em |
|---|---|---|
| `Section` | seção: fundo (`cream`/`white`/`hero`), borda, largura (`prose`/`narrow`/`mid`/`wide`) e respiro | todas as páginas, incl. sobre, "por que nós", depoimentos, perguntas e a grade da home |
| `SectionHeader` | rótulo (opcional) + título + subtítulo | todas as seções |
| `Hero` (+ `HeroBadgeText`) | herói com selo, 2 botões em pílula, **imagem de fundo translúcida que representa a página (obrigatória)**, foto opcional, selo de aval opcional (`seal`, logo do Conservatorio Grassi em `public/images/ar/grassi-logo.png`) e **faixa de números sempre abaixo (`stats` de `data/hero_stats.ts`)**. Modo **fixo** (1 abertura, sem setas: páginas de curso e de carrera) ou **carrossel** (`slides`, setas voltar/avançar e pontos: home BR e home AR, cada slide com link para a página correspondente). Páginas sem herói: agenda, interesse e legais | BR: home (carrossel), velas, soap, aromas, resin, online · AR: home (carrossel), carreras |
| `Card` e `CardGrid`, `cardGridClass` | card 16/10 com `h-full`; grade de 2 colunas; aceita descrição, selo de nota e metadados | cursos BR, carreras AR, **cards online e presenciais da home (mesma grade)**. Um só card: foto · título · tópicos · turmas (presencial BR e carreras AR; online BR não mostra) · preço (só BR) · CTA · **"Ver grade" / "Ver plan de estudios" (modal `GradeModal`) só quando há conteúdo programático** · "ver detalhes" |
| `AgendaLayout`, `EventCard`, `DensityToggle`, `MonthNav`, `FilterChips` | agenda em duas colunas (título, ação e filtro fixos; navegação de mês com setas e cards de evento), mesmo desenho para turmas BR e etapas das carreras AR; `hooks/useMonthPager` separa por mês. **EventCard tem 2 versões**: `full` (completa) e `compact` (resumo + botão de expandir); `hooks/useEventDensity` escolhe sozinho (celular = compacta, tela maior = completa) e o `DensityToggle` deixa a pessoa trocar. Páginas de curso e de carrera usam `compact` com expandir (turmas do curso, início de cohorte) | `/pt-br/agenda/`, `/es-ar/agenda/` |
| `Steps` | 4 passos em colunas, com ou sem número | como funciona, cursada |
| `FeatureList` | grade 2 colunas "incluso" | incluso BR, incluido AR |
| `ContactCta` | bloco final de contato | todas as páginas de tema |
| `NavHeader` (+ `navGroupClass`, `navPill`, `navPortalPill`, `drawerItem`), `NavDropdown`, `LangSwitch`, `nav_icons` | casca da navbar, submenus, seletor PT \| ES e ícones | `SiteNavbar` |
| `ArgentinaFlag`, `BrazilFlag` | bandeiras (selo do herói e seletor de idioma) | herói, navbar da home |
| `btnPrimary`, `btnOutline`, `heroPrimary`, `heroSecondary`, `textLink`, `heroBadge`, `cardTag` | classes de botões e selos (`ui/styles.ts`) | todo o site |

**Como criar ou alterar uma página**
1. Monte a página só com componentes de `ui/` e com os blocos de `components/theme/` (BR: `ThemeSections.tsx`; AR: `CareerSections.tsx`), que por sua vez só compõem `ui/`.
2. Precisa de um bloco que não existe? Crie o componente **em `ui/`** (genérico, sem texto de uma página), exporte em `ui/index.ts`, registre na tabela acima e só então use.
3. Mudou o visual de algo? Mude em `ui/` e confira Brasil e Argentina (`?mock` na AR).
4. Nunca copie classes Tailwind de um componente para dentro de uma página.

## 1. Fundamentos (tokens)

Fonte única: `src/styles/index.css` (Tailwind v4) e `kit-de-marca` (Artisanal Elegance).

| Item | Valor |
|---|---|
| Cores | Creme `#F7EFE4` (`surface-hero`, `hero-bg`) · Papel `#FCF9F5` (`surface-cream`) · Dusty Rose `#D9A1A0` (`primary-container`) · Rosé Profundo `#805252` (`primary`) · Tinta `#1C1C1A` (`on-surface`) · Tinta Suave `#514443` (`on-surface-variant`) · Terracota `#805533` (`tertiary`) |
| Bordas | `border-subtle` `#E1DEDA` · `border-muted` `#EAE8E4` (cards) |
| Títulos | Libre Caslon Text (`font-serif`), peso 400. Destaque em *itálico Rosé Profundo*. Nunca bold pesado em título |
| Corpo | Plus Jakarta Sans (`font-sans`) |
| Rótulos e botões | JetBrains Mono (`font-mono`), `text-xs`, caixa alta, `tracking-wider` ou `tracking-widest` |
| Container | `max-w-[1280px] mx-auto px-6` (conteúdo estreito: `max-w-3xl`; passos e locais: `max-w-[1100px]`) |
| Ritmo vertical | seções `py-16 md:py-24` (cabeçalho de seção `mb-12`) |
| Raios | cards `rounded-2xl` · botões de card `rounded-lg` · botões de herói, selos e navbar `rounded-full` |
| Sombras | `shadow-sm`, e `hover:shadow-md` ou `hover:shadow-lg` nos cards |
| Alvos de toque | mínimo 44 px (`min-h-11`) em links e botões |
| Foco | `focus-visible:outline-2 outline-offset-2 outline-tertiary`; skip link no topo (`SkipLink`) |

**Fundos das seções alternam** (de cima para baixo): creme `bg-surface-cream` → branco
`bg-white border-y border-muted` → creme → branco… Nunca duas seções seguidas com o mesmo fundo.

## 2. Estrutura de uma página de tema

Ordem fixa (BR: `ThemePageApp` e `CandlesBrApp`; AR: `CareerPageApp`):

1. Navbar fixa
2. Herói
3. (opcional) barra de números
4. Turmas / Cohorte (lista)
5. Cursos / Carreras (grade de cards)
6. Online do tema (cards)
7. Como funciona (4 passos)
8. Incluso em todos
9. Locais (BR) · Salida laboral (AR)
10. Sobre a Ivana, depoimentos e perguntas
11. Contato (WhatsApp)
12. Rodapé

## 3. Componentes

Cada linha diz **onde está o modelo pt_BR**. O `es_ar` deve usar o mesmo componente
(ou uma variante com o mesmo desenho) e só trocar textos.

### 3.1 Navbar (uma só, em todas as páginas)

`SiteNavbar` (`components/SiteNavbar.tsx`), montada sobre o `NavHeader` de `ui/`. O conteúdo (opções, ícones, links e
pares de idioma) fica em `data/site_nav.ts`; os ícones, em `ui/navIcons.tsx`. **Não existe navbar por página nem por país.**

- **Esquerda:** logo (leva à home do idioma: `/pt-br/` ou `/es-ar/`).
- **Menu principal (pílulas, a partir de 1280 px; abaixo disso, gaveta):**
  **Brasil ▾** (Cursos presenciais por segmento: velas, sabonetes, aromas e incensos, resina e decoração · Cursos online:
  velas aromáticas, saboaria com extratos naturais, apostila 60 receitas) · **Argentina ▾** (todas as carreras e cada uma,
  com o nome oficial) · **Agenda ▾** (Brasil e Argentina) · **Contato** (WhatsApp do país do idioma) · **Interesse / Interés**
  (uma página por país: `/pt-br/interesse/` e `/es-ar/interes/`). Cada opção tem um ícone; Brasil e Argentina usam a bandeira.
- **Direita:** seletor **PT (bandeira do Brasil) | ES (bandeira da Argentina)** e a pílula **Portal do Aluno**.
- **PT | ES:** se a página tem equivalente no outro idioma (`lang_pairs` em `site_nav.ts`), vira link e muda de página;
  se não tem, só troca o idioma do menu, do rodapé e dos componentes que seguem `usePageLanguage` (as páginas sem par
  mantêm o texto da página).
- **Home do Brasil:** os segmentos do menu filtram os cards da própria página (`onSelectCategory`).
- **Gaveta (celular):** as mesmas opções, com ícone, em caixas brancas; PT | ES no topo.

### 3.2 Herói

Dois desenhos aprovados. Cada página usa o do seu par no Brasil.

- **A. Imagem de fundo** (`ThemePageApp`, páginas soap, aromas, resin): seção `min-h-[70vh] flex items-end`, foto em tela cheia `opacity-85` com gradiente `from-hero-bg via-hero-bg/70 to-hero-bg/20`, conteúdo `px-6 md:px-12 pt-28 pb-12`: **um** selo (pílula branca, `text-micro uppercase font-mono tracking-widest text-primary`), `h1` (`text-3xl sm:text-4xl md:text-5xl font-serif font-bold`), parágrafo `max-w-xl`, e **dois botões**.
- **B. Dividido** (`CandlesBrApp`, página de velas): texto à esquerda, foto emoldurada à direita (`rounded-xl shadow-xl`, moldura rosa `-rotate-2`), selo com bandeira.

**Botões do herói (sempre estes dois, nesta ordem, ambos pílula):**

```
Primário:   bg-primary text-white font-semibold font-mono text-xs tracking-widest uppercase
            inline-flex items-center gap-2 px-8 py-4 rounded-full shadow-sm  (+ ícone lucide w-3.5 h-3.5)
Secundário: border border-subtle bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary
            font-bold font-mono text-xs uppercase tracking-wider px-8 py-4 rounded-full  (+ ícone)
```

Rótulos BR: "Catálogo de cursos" / "Entrar em contato" (ou "Ver próximas turmas" /
"Prefere online?"). **Regra es_ar (aplicada):** todas as páginas usam o herói **B**
(dividido). Selo único com a bandeira ("100% online · Conservatorio Grassi"); primário
"Ver carreras" no inicio e "Ver cohorte 2027" nas páginas de carreira; secundário
"Hablar por WhatsApp". O botão "Ver valores e inscribirme" **não vai no herói**: fica
nos cards e na seção de cohorte. Sem 3 selos, sem botão `rounded-lg`, sem borda
`border-primary` no secundário. Constantes: `heroPrimary` e `heroSecondary`
(`CareerSections.tsx`).

### 3.3 Botões (resumo)

| Uso | Classes |
|---|---|
| Herói primário / secundário | acima |
| Botão de card e de lista (`btnPrimary`) | `bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-lg`, `w-full` dentro de card |
| Botão de card secundário (`btnOutline`) | `border border-primary text-primary hover:bg-primary hover:text-white` + mesmas medidas |
| Formulário | classe `brand-btn-primary` / `brand-btn-secondary` (`index.css`) |

Um mesmo bloco nunca mistura pílula e `rounded-lg`.

### 3.4 Cabeçalho de seção (`sectionHeader`)

`text-center max-w-2xl mx-auto mb-12`: rótulo `text-xs font-mono font-bold tracking-widest text-primary uppercase mb-3`, título `text-3xl md:text-4xl font-serif text-gray-900`, subtítulo opcional `text-sm text-on-surface-variant mt-3`.
Exemplos BR: "PRÓXIMAS TURMAS / Escolha a sua data", "CURSOS PRESENCIAIS / Do zero, com a mão na massa".

### 3.5 Card de curso (`CursoCard`) e grade

**Este é o card padrão. Carreras usam exatamente o mesmo, sem variação de tamanho.**

- **Grade:** `grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10` (2 colunas no desktop em **todas** as páginas, home e tema). Com 1 curso: `max-w-md mx-auto`; com 2: `max-w-4xl mx-auto`. **Nunca 3 colunas.**
- **Card:** `bg-white rounded-2xl shadow-sm hover:shadow-md border border-muted overflow-hidden flex flex-col h-full` (todos os cards da linha têm a mesma altura).
- **Imagem:** `aspect-[16/10]`, `object-cover`, selo "Presencial" no canto superior esquerdo (pílula branca `text-micro uppercase tracking-wider`).
- **Corpo:** `p-6 md:p-8 flex flex-col grow`: título `text-xl md:text-2xl font-serif mb-4`, lista de benefícios com ícone `Check` verde `w-4 h-4`, linha de metadados (duração, nº de turmas) com borda superior, bloco de preço (só no BR), botão `w-full` ao fim (`mt-auto`).
- **Equivalente AR:** mesma estrutura, selo "100% online", benefícios (nivel e meses, título Conservatorio Grassi, continuação), **sem preço**, botão "Ver valores e inscribirme".

### 3.6 Lista de turmas (`TurmaCard`) e Cohorte

`ul space-y-4`; cada item `bg-white rounded-2xl border border-muted shadow-sm p-4 flex gap-4`: bloco de data à esquerda (`w-14`, dia `font-serif text-3xl`, mês `text-[10px] font-mono uppercase`), título `font-semibold`, horário e local com ícone `w-3 h-3 text-primary`, botão à direita (`btnPrimary`). Largura `max-w-3xl`, fundo `bg-surface-cream`.
Estados: carregando, vazio e erro como cartão branco centralizado com ícone `CalendarDays`.
**AR:** `CohorteSection` deve usar este mesmo item (bloco de data, título, botão à direita); o cronograma expansível vem logo abaixo, no mesmo cartão.

### 3.7 Como funciona (passos)

`ComoFuncionaSection`: seção `bg-white border-t border-muted`, `max-w-[1100px]`; `ol grid gap-6 sm:grid-cols-2 lg:grid-cols-4`; cada passo `bg-surface-cream rounded-2xl p-6 border border-muted` com linha de ícone e número (`flex items-center gap-2 text-primary font-mono font-bold text-xs mb-3`), título `font-serif text-lg` e texto `text-xs text-on-surface-variant`; frase de rodapé centralizada `text-xs`.
**AR:** `ComoInscribirmeSection` precisa virar este bloco: 4 passos em 4 colunas, com ícone e número, não 2 colunas com número grande.

### 3.8 Incluso em todos · Locais · Selos

- **Incluso:** `max-w-3xl`, `grid grid-cols-2 gap-4`, itens `bg-white rounded-xl border border-muted p-4` com ícone `Gift`.
- **Locais:** `grid gap-6 md:grid-cols-3`, `bg-surface-cream rounded-2xl border border-muted p-6`, ícone de pino, cidade em `font-serif`, link "Abrir no mapa".
- **Selo / pílula:** `bg-white/95 border border-subtle px-3.5 py-1.5 rounded-full text-micro uppercase font-mono tracking-wider text-primary font-semibold`.

### 3.9 Cards online (`CandlesOnlineSection`)

`bg-white border-t border-muted`, cabeçalho em linha com selo "ATELIER MASTERCLASS VIRTUAL", cards horizontais com imagem, badge de cor, "GRADE" e "MATRÍCULA". Só existe no BR; a AR não cria equivalente (sem curso online avulso).

### 3.10 Sobre, números, depoimentos, perguntas

| Bloco | Componente | Fundo |
|---|---|---|
| Barra de números | seção em `CandlesBrApp` (3 colunas, `font-serif text-primary font-black`) | `bg-white border-y border-subtle py-8` |
| Sobre a Ivana | `AboutSection` (foto 3/4 à esquerda, texto à direita) | `bg-white border-y border-subtle` |
| Por que nós | `WhyUsSection` | `bg-white` |
| Depoimentos | `ReviewsCarousel` (cartão `max-w-[750px] rounded-2xl`) | `bg-surface-hero border-t border-review` |
| Perguntas | `FAQSection` (`max-w-[800px]`, acordeão) | `bg-white` |

### 3.11 Contato e rodapé

- **Contato (tema):** seção `bg-white border-t border-muted text-center`, `h2 font-serif text-2xl md:text-3xl`, texto, um botão pílula "Chamar no WhatsApp".
- **Rodapé:** `Footer.tsx` igual em todas as páginas (`bg-surface-hero border-t border-subtle`), com links legais; em `es` inclui arrepentimiento e Defensa del Consumidor.

### 3.12 Agenda

`AgendaApp.tsx`: cabeçalho simples, coluna lateral com título, texto, botão e filtro (chips `rounded-full min-h-11`), lista por mês com cartões `rounded-2xl border bg-surface-cream`. A `AgendaArApp` segue o mesmo desenho (já alinhada).

## 4. Alinhamento de `es_ar` ao padrão (estado em 27/10/2026)

| # | Item | Antes (fora do padrão) | Agora (= pt_BR) |
|---|---|---|---|
| 1 | **Cards** | 3 colunas, alturas livres | `CarreraCard` = `CursoCard`: 2 colunas, `h-full`, imagem 16/10, mesmo corpo `p-6 md:p-8`; 1 card `max-w-md`, 2 cards `max-w-4xl` (`CarrerasGrid`) |
| 2 | **Passos** | 2 colunas, número grande | `ComoInscribirmeSection` = `ComoFuncionaSection`: 4 colunas, ícone + número, `max-w-[1100px]` |
| 3 | **Menu** | `CareerNavbar`: opções em texto solto, fora do estilo | `CandlesNavbar language="es" menu={…}`: **mesmas opções de antes** (Carreras ▾, Agenda, Cómo inscribirme, WhatsApp, PT) em pílulas no estilo da home, mais logo e "Portal del Alumno" |
| 4 | **Herói** | 3 selos, botões retangulares | herói dividido, 1 selo, 2 botões em pílula (`heroPrimary` / `heroSecondary`) |
| 5 | Cohorte | cartão próprio | item `TurmaCard` (data `w-14`, botão à direita) + cronograma no mesmo cartão |
| 6 | Incluso | inexistente | `InclusoSection` ("Incluido en todas") |
| 7 | Contato | botão retangular | pílula `px-8 py-4 rounded-full`, `id="contacto"` |

Itens que continuam iguais ao Brasil e **não** são da AR: alvos menores que 44 px na
logo (40 px), no botão de menu (32 px) e nas setas dos depoimentos (36 px). Corrigir nos
componentes compartilhados, para valer nos dois países.

## 4b. Catálogo de componentes (código)

| Componente | Arquivo | Uso | BR | AR |
|---|---|---|---|---|
| `SiteNavbar` | `components/SiteNavbar.tsx` | `<SiteNavbar onSelectCategory? />` (menu em `data/site_nav.ts`) | sim | sim |
| Herói dividido | `pages/CandlesBrApp.tsx`, `CareerPageApp.tsx` | `heroPrimary` + `heroSecondary` | sim | sim |
| Herói imagem de fundo | `pages/ThemePageApp.tsx` | `bg-primary` pílula + `border-subtle` pílula | sim | não usado |
| `sectionHeader` | `ThemeSections.tsx`, `CareerSections.tsx` | `(kicker, title, sub?)` | sim | sim |
| `CursoCard` / `CarreraCard` | `ThemeSections.tsx` / `CareerSections.tsx` | card padrão 16/10 + `h-full` | sim | sim |
| `CarrerasGrid` | `CareerSections.tsx` | `<CarrerasGrid items={…} linkTo={…} />` | (grade `grid md:grid-cols-2`) | sim |
| `TurmasSection` / `CohorteSection` | idem | lista com item `TurmaCard` | sim | sim |
| `ComoFuncionaSection` / `ComoInscribirmeSection` | idem | 4 passos | sim | sim |
| `InclusoSection` | idem | grade 2 colunas | sim | sim |
| `LocaisSection` | `ThemeSections.tsx` | 3 cartões | sim | não se aplica (online) |
| `AboutSection`, `ReviewsCarousel`, `FAQSection` | `components/` | `language="pt\|es"` | sim | sim |
| Contato (WhatsApp) | `ThemePageApp.tsx`, `WhatsAppFooterCta` | pílula | sim | sim |
| `Footer` | `components/Footer.tsx` | `language` | sim | sim |
| `PrivacyConsent` | `components/PrivacyConsent.tsx` | todo formulário | sim | sim |

**Novo componente = primeiro conferir a tabela da "Regra de ouro" e esta.** Se já existe um equivalente no
Brasil, reaproveite (parametrizando o idioma); se não existe, crie nos dois idiomas ao
mesmo tempo e registre aqui.

## 5. Regras de conteúdo es_ar (valem sobre o desenho)

- **Nenhum preço**, nem o campo `price` do feed. O valor só aparece na tienda.
- **Nomes oficiais completos com o nível** ("Tecnicatura en arte y diseño de velas").
- **Só online.** Espanhol rioplatense (voseo). Datas só do feed.
- Fotos só da Ivana ou de alunas autorizadas; sem foto, capa da marca.

## 6. Checklist para aprovar uma página nova

- [ ] Navbar, herói, botões e rodapé idênticos aos do par pt_BR
- [ ] Grade de cards em 2 colunas, todos com a mesma altura e proporção de imagem
- [ ] Passos em 4 colunas com ícone e número
- [ ] Fundos de seção alternados, `py-16 md:py-24`
- [ ] Alvos de toque ≥ 44 px, sem rolagem horizontal em 390 px, sem erro no console
- [ ] `npm run lint` e `npm run build` limpos; busca por preço em `dist/es_ar` = zero

## Pendências (fazer depois)

1. ~~Alinhar as páginas `es_ar` a este guia~~ (feito em 27/10/2026, ver seção 4). Falta conferir no celular real e com a Ivana.
2. ~~Refazer as páginas de curso online `/pt-br/cursos/online/velas-aromaticas/`, `/pt-br/cursos/online/saboaria-com-extratos-naturais/` e `/pt-br/apostilas/60-receitas-de-sabonetes/`~~ (feito em 27/10/2026, ver o início do guia).
3. ~~Extrair os blocos repetidos para um módulo compartilhado~~ (feito: `src/app/ui/`). ~~Migrar navbar da home, cards online da home, sobre, "por que nós", depoimentos e perguntas~~ (feito em 27/10/2026). **Ainda com `<section>` próprio** (migrar na próxima rodada): `ContactForm` e `CandlesLeadForm` (formulários), `CandlesOnlineSection` (cards online horizontais de velas), `AgendaApp` (agenda do Brasil; a da Argentina já usa `ui/`) e as páginas legais (que já usam a navbar padrão).
