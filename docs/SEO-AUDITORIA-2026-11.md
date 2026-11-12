# Auditoria SEO — courses.ivana.academy (11/11/2026)

Fontes: Search Console (`sc-domain:ivana.academy` e `https://courses.ivana.academy/`, 90 dias),
GA4 (propriedade LandingPages 560764801) e crawl das 29 URLs do `sitemap.xml` como Googlebot.

## Resumo

O lado técnico está bom: prerender, hreflang recíproco em todas as páginas com par, sitemap
igual às páginas do código, JSON-LD na maioria das páginas e TTFB de cerca de 100 ms. **O
problema é alcance.** Nos 90 dias, o subdomínio somou ~5 cliques. Os 28 indexados quase não
aparecem para buscas sem a marca. Enquanto isso, a busca "ivana academy" (265 cliques) cai no
**Moodle** (`ivana.academy`), que até hoje não linkava as landing pages.

**Decisão de 11/11 (atualização):** a landing é a página oficial de cada curso, no Google e
na venda. O Moodle é só a plataforma onde as alunas estudam. Por isso, as páginas de curso
do Moodle (`course/info.php`) deixam de disputar com a landing:
- curso com página aqui → a página do Moodle aponta o `canonical` para esta landing;
- curso sem página aqui → `noindex`.
Veja "P1 — Cursos do Moodle sem página na landing" abaixo.

| Prioridade | Tema | Esforço |
|---|---|---|
| **P0** | Senhas versionadas em `n8n_secret.env` (repositório **público**) | 15 min + troca de senha |
| **P1** | **Cursos do Moodle sem página na landing (23 cursos)** | 1 página por curso/grupo |
| P1 | JSON-LD `Course` incompleto (sem resultado rico de curso) | 1 h |
| P1 | Páginas sem JSON-LD | 1 h |
| P1 | Moodle → landing: tráfego da marca não chega aqui | ✅ resolvido no Moodle (`ivana-academy#120`) |
| P2 | Descrições fora de 70–160 caracteres (9 páginas), 1 título > 65 | 30 min |
| P2 | Conteúdo por intenção de busca (presencial, cidade, "curso de velas") | contínuo |
| P3 | `alt` vazio em imagens, 404 do `cdn-cgi/l/email-protection`, raiz `/` fina | 30 min |

---

## P0 — Segredos no repositório público

`n8n_secret.env` está versionado desde **02/11/2026** e tem valores em `DB_POSTGRESDB_PASSWORD`
e `QUEUE_BULL_REDIS_PASSWORD`. O repositório é público.

1. **Trocar agora** as senhas do Postgres e do Redis do n8n na VPS onde ele roda. Elas já
   precisam ser tratadas como vazadas.
2. `git rm --cached n8n_secret.env` e adicionar `*secret*.env` / `*.env` ao `.gitignore`.
3. Limpar o histórico (`git filter-repo --path n8n_secret.env --invert-paths`) e fazer force-push,
   ou tornar o repositório privado. A troca de senha do passo 1 continua obrigatória.
4. Conferir **Settings › Code security › Secret scanning** no GitHub.

## P1 — Cursos do Moodle sem página na landing

Levantamento de 11/11/2026: os 34 cursos públicos do Moodle comparados com as páginas deste
projeto (`src/**/index.html`, `data/carreras_ar.ts`, `data/online_courses.ts`,
`data/presencial.ts`).

### Já têm página: o Moodle aponta o `canonical` para cá (11 cursos)

| Moodle (id) | Página |
|---|---|
| Tecnicatura Velas (4) e Profesorado Velas (21) | `/es-ar/carreras/tecnicatura-arte-diseno-velas/` |
| Tecnicatura Resinas (6) e Profesorado Resinas (34) | `/es-ar/carreras/tecnicatura-arte-decoracion-resinas/` |
| Tecnicatura Macramé (5) e Profesorado Macramé (8) | `/es-ar/carreras/tecnicatura-macrame/` |
| Tecnicatura Estampas textiles (26) | `/es-ar/carreras/tecnicatura-estampas-textiles/` |
| Tecnicatura Diseño de interiores (25) | `/es-ar/carreras/tecnicatura-diseno-interiores/` |
| Profesorado Arte Mix Media (7), 2 anos | `/es-ar/carreras/profesorado-arte-mix-media/` |
| Velas aromáticas, com moldes e wax melts (16) | `/pt-br/cursos/online/velas-aromaticas/` |
| Saboaria e extratos naturais (38) | `/pt-br/cursos/online/saboaria-com-extratos-naturais/` |

O profesorado é a continuação e especialização da tecnicatura do mesmo segmento, vendido na
mesma página. Por isso divide o `canonical` com a tecnicatura.

### Faltam páginas (23 cursos)

Enquanto não têm página aqui, ficam com `noindex` no Moodle, ou seja, fora do Google.

**A. Destaque na home do Moodle, sem página: criar primeiro**

| Moodle (id) | Idioma | Sugestão de página |
|---|---|---|
| Productos de limpieza para el hogar (32) | es | `/es-ar/cursos/online/productos-de-limpieza/` |
| Mentoría (37) | es | `/es-ar/mentoria/` (confirmar o que é vendido: individual, grupo, preço) |
| Mesas de río (39) | es | `/es-ar/cursos/online/mesas-de-rio/` (hoje é módulo da Tecnicatura Resinas; ver C) |

**B. Cursos online curtos em espanhol (sem carrera)**

| Moodle (id) | Sugestão |
|---|---|
| Aromatizantes y difusores (10) | uma página por curso em `/es-ar/cursos/online/…`, no molde de `OnlineCoursePageApp` (já tem dicionário ES em `online_courses_es.ts`) |
| Jabones artesanales (11) | idem; par natural de `/pt-br/cursos/online/saboaria-com-extratos-naturais/` (hreflang) |
| Sahumerios naturales (13) | idem |
| Luna iluminada (27) | idem |
| Mantas nórdicas (19) | idem |
| Yeso – Concreto (12) | idem |
| Bandolerita (24), Hombreras en macramé (28) | confirmar se são módulos do Profesorado Macramé (não estão no temario) |

**C. Módulos de carrera (pelo `carreras_ar_temario.ts`, rascunho ainda não confirmado pela Ivana)**

No Moodle eles também ficam com `noindex`, e quem clica neles vai para a página da carrera.
Só precisam de página própria **se também forem vendidos sozinhos**.

| Moodle (id) | Carrera |
|---|---|
| Mesas de río (39) | Resinas |
| Porta macetas (29), Lámpara en macramé (36), Encordado y tapicería (43), Vestido de playa (18) | Macramé |
| Velas cóctel (40), Velas con piedras y resina (31), Workshop Velas gourmet (14) | Velas |
| Workshop Cuadro con relieve (15) | Arte Mix Media |

**D. Cursos online em português sem página**

As páginas `/pt-br/cursos/velas|resinas/` vendem a versão **presencial** (loja), que é outro
produto. Para estes cursos online, criar a página em `/pt-br/cursos/online/…`:

| Moodle (id) | Presencial equivalente (`presencial.ts`) |
|---|---|
| Velas gel (33) | Velas Gel |
| Velas efeito porcelana (35) | — |
| Velas com pedras e resina (30) | Resina com Pedras |
| Tricô com as mãos (41) | Tricô Gigante |

### Ao publicar uma página nova

1. Entra no `sitemap.xml` e no `scripts/routes` como as outras.
2. JSON-LD `Course` completo (ver a seção abaixo).
3. **No Moodle**, em *Administração › Plugins › Plugins locais › SEO*, acrescentar uma linha em
   "Mesmo produto na landing": `idcurso URL`. Não precisa de deploy. A página do curso no Moodle
   passa a apontar o `canonical` para cá, e o card da home do Moodle ganha o link "Conocé el curso →".
4. Se era um módulo (lista C) e passou a ser vendido sozinho, tirar a linha dele de
   "Parte de uma carrera na landing".
5. Search Console: pedir a indexação da página nova.

## P1 — JSON-LD `Course` (resultado rico de curso)

O Google só mostra o resultado rico de curso com `offers` e com `hasCourseInstance` contendo
`courseMode` **e** `courseWorkload` ou `courseSchedule`
([doc](https://developers.google.com/search/docs/appearance/structured-data/course-info)).

| Arquivo (`src/app/seo/jsonld/`) | Falta |
|---|---|
| `es-ar/carreras/*.json` (6 carreras) | `offers` |
| `pt-br/cursos/online/velas-aromaticas.json` | `courseWorkload` (ex.: `"PT12H"`) ou `courseSchedule` |
| `pt-br/cursos/online/saboaria-com-extratos-naturais.json` | idem |

Modelo de `offers` (valores reais vêm de `data/`):
```json
"offers": [{
  "@type": "Offer",
  "category": "Paid",
  "price": "…",
  "priceCurrency": "ARS",
  "availability": "https://schema.org/InStock",
  "url": "https://courses.ivana.academy/es-ar/carreras/tecnicatura-macrame/"
}]
```
Validar com o [Rich Results Test](https://search.google.com/test/rich-results) depois do build.

## P1 — Páginas sem JSON-LD

| URL | Sugestão |
|---|---|
| `/pt-br/cursos/sabonetes/`, `/pt-br/cursos/aromas/`, `/pt-br/cursos/resinas/` | igual a `pt-br/cursos/velas.json` (`Service` + `FAQPage`), ou `Course` com `courseMode: "onsite"` e `location` quando for presencial |
| `/pt-br/agenda/` | `ItemList` de `EducationEvent`, com datas e local de cada turma; é o melhor candidato a aparecer em "perto de mim" |
| `/es-ar/interes/` | `WebPage` (igual ao `pt-br/interesse.json`) |
| `/` | `WebSite` + `Organization` (a raiz é o seletor de país) |

As páginas legais podem continuar sem JSON-LD.

## P1 — O tráfego da marca não chega aqui

No Search Console, `https://ivana.academy/` (Moodle) recebe 320 dos 347 cliques.

**Resolvido do lado do Moodle:**
- `ivana-academy#119` (em produção): `sameAs: https://courses.ivana.academy/` no Organization.
- PR `ivana-academy#120`: na home do Moodle, para quem não fez login, o card de cada curso com
  página aqui ganha o link "Conocé el curso →" para a landing. O card em si continua abrindo o
  curso, porque a aluna entra por ali. Os `course/info.php` apontam o `canonical` para cá.

**Ainda falta:** um link visível da home do Moodle para `/pt-br/` e `/es-ar/`, para os cursos
que não têm card. Isso se configura em *Administração › Página inicial* do Moodle. Na direção
contrária, o rodapé daqui já linka a plataforma.

Os perfis em `sameAs` devem ser os mesmos nos dois sites. Hoje o rodapé do Moodle tem
YouTube, TikTok, Facebook e o Instagram `ivana_da_mora`, além dos dois `ivana.lerea.*`.

## P2 — Títulos e descrições

Faixa recomendada: título até ~60 caracteres; descrição entre 70 e 160.

| URL | Atual | Ação |
|---|---|---|
| `/` | desc 169 | encurtar: "Cursos de velas, saboaria, aromas e resina no Brasil e carreras online en Argentina. Escolha seu país · Elegí tu país." |
| `/pt-br/` | desc 63 ("Aprenda a criar velas, sabonetes e resinas com a Ivana Academy.") | incluir modalidade e local: presencial/online, cidade, certificado |
| `/es-ar/` | título 67, desc 186 | título: "Carreras online con título del Conservatorio Grassi"; desc ≤ 160 |
| `/es-ar/carreras/tecnicatura-arte-diseno-velas/` | desc 195 | cortar "Inscripción abierta todo el año." e reduzir |
| `/es-ar/carreras/tecnicatura-arte-decoracion-resinas/` | desc 169 | reduzir para ≤ 160 |
| `/pt-br/termos/`, `/pt-br/lgpd/`, `/es-ar/terminos/`, `/es-ar/derechos/` | 54–63 | baixa prioridade (páginas legais) |

## P2 — Conteúdo × buscas reais

As buscas sem marca que já aparecem, com poucas impressões: "curso de velas aromáticas
presencial", "candle making classes near me", "soap making classes near me". Ou seja, a intenção
é **local/presencial**.

- Nas páginas presenciais (velas, sabonetes, aromas, resinas): cidade/bairro no `<h1>` ou logo
  abaixo, endereço e mapa, próximas turmas (a agenda já tem os dados) e FAQ local.
- **Perfil da Empresa no Google** (Google Business Profile) com o endereço das aulas presenciais,
  ligado a `/pt-br/agenda/`. Para "perto de mim", esse é o fator mais forte.
- Uma página por tema que valha a busca: "curso de velas aromáticas" (presencial + online),
  "curso de saboaria artesanal", "curso de resina epóxi". Hoje `/pt-br/cursos/velas/` concentra
  as duas intenções.
- No es-AR, os termos fortes são "tecnicatura en velas online", "curso de macramé online" e
  "título Conservatorio Grassi". Já estão nos títulos; o que falta são links e menções externas.

## P3 — Detalhes

- **`alt` vazio:** 1–2 imagens por página (`ui/Hero.tsx:82` e `ui/GradeModal.tsx:87` usam
  `alt=""`). Se a foto do herói não for decorativa, usar um alt descritivo (ex.: "Ivana Lerea
  ensinando a fazer velas").
- **`/cdn-cgi/l/email-protection` 404** no Search Console: é o *Email Obfuscation* da Cloudflare
  reescrevendo os `mailto:` (`LgpdApp.tsx`, `LeadForm.tsx`, `data/site_links.ts`). Pode desligar
  em Cloudflare › Scrape Shield, ou ignorar (não prejudica).
- **Links `course/view.php` para o Moodle** em `src/app/data/courses.ts` (linhas 39, 52 e 65:
  ids 21, 4 e 16). Atualizado em 11/11: como a landing agora é a página oficial do curso, **não**
  trocar por `course/info.php`, porque ele aponta de volta para cá. Se o botão é para a aluna
  entrar no curso, manter `view.php` com um texto como "Entrar na plataforma"; se é para
  informar ou vender, apontar para a página da landing e tirar o link do Moodle.
- **`/pt-br/links/` e `/es-ar/links/`** com `noindex`: correto (páginas de bio).
- **GA4:** carrega só depois do aceite, como deve ser. Nos últimos 28 dias: 148 sessões, sendo
  60% direto, 36% social orgânico e **2% busca orgânica (3 sessões)**. Para medir o efeito deste
  plano, acompanhar *Aquisição › Busca orgânica* e o relatório do Search Console por página.

## Fora deste repositório (feito em 11/11)

- Cloudflare: Transform Rule "noindex subdominios de infraestrutura" (`X-Robots-Tag: noindex,
  nofollow` em bot, chatwoot, evolution, minio, n8n, nocodb, pgadmin, rabbitmq, redis, typebot,
  webhook e whatsapi). Remoção temporária dos 12 hosts no Search Console.
- Pendente: Cloudflare Access na frente dos painéis (redis, rabbitmq, minio, pgadmin, nocodb,
  editor do n8n), e `noindex` nas páginas de conta, pedidos e busca da `loja`.

## Checklist de entrega

- [ ] P0: senhas trocadas, arquivo fora do git e do histórico
- [ ] Ivana confirma o temario das carreras (define os módulos da lista C)
- [ ] Páginas da lista A (Productos de limpieza, Mentoría, Mesas de río)
- [ ] Páginas das listas B e D, uma por vez, cada uma com a linha no `local_seo` do Moodle
- [ ] JSON-LD `Course` com `offers` e workload; Rich Results Test OK nas 8 páginas
- [ ] JSON-LD nas 6 páginas sem dados estruturados
- [ ] Descrições e título ajustados; `npm run build:ssg` e `npm run audit:ssg`
- [ ] Search Console: reenviar o `sitemap.xml` e pedir indexação de `/pt-br/`, `/es-ar/`, uma carrera e a agenda
- [ ] Perfil da Empresa no Google com o endereço das aulas presenciais
