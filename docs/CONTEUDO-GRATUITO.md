# Conteúdo gratuito: contrato com o n8n

Páginas: `/pt-br/conteudo-gratuito/` e `/es-ar/contenido-gratuito/` (`pages/FreeContentApp`, itens em `data/free_content.ts`).
Segurança do endpoint `/api/free-content`: ver [SEGURANCA.md](SEGURANCA.md).

## Como cada coisa é entregue

A página tem **um card por curso gratuito da plataforma** (`free_courses`) e cards de **material** (`free_materials`).

| Card | Botões | No n8n |
|---|---|---|
| Curso | **Matricular-me grátis** (nome + e-mail) → `/api/free-enroll` com `course` (slug) | `free-enroll`: cria o usuário e matricula no Moodle |
| Curso | **Ver aula de amostra** (só e-mail; a 1ª aula; o navegador lembra, `ivana:free-access`) → `/api/free-content` com o `item_id` da aula | `free-content`: só registra o lead |
| Curso | **Ver aulas** (modal) | (só front) lista as aulas e o que a plataforma entrega |
| Apostila / modelo editável | **sempre** pede o e-mail → `/api/free-content` com o `item_id` do material | `free-content`: registra e **envia o link por e-mail** (o link vive no n8n, não no código) |

Os vídeos continuam públicos no YouTube; o que incentiva a matrícula é o que a plataforma entrega a mais.

## Requisição (POST /api/free-content)
`{ email, country: "BR"|"AR", item_id, form_source: "free_content_br"|"free_content_ar", consent, timestamp, cf_turnstile_token }`.
Resposta: `200 {"ok":true}` depois de gravar (e, nas apostilas, de enviar o e-mail); `403` Turnstile; `429` limite. Sempre a mesma
resposta, exista ou não o e-mail (sem enumeração).

## Links por `item_id` (mapa no n8n; mantenha FORA do código do site)
| item_id | País | Conteúdo | Link |
|---|---|---|---|
| `apostila-60-receitas-de-sabonetes` | BR | Apostila PDF, 60 receitas de sabonetes | `[link somente no n8n]` |
| `kit-etiquetas-canva` | BR | Kit de etiquetas editáveis do Canva | `[link somente no n8n]` |

Novo PDF: acrescente o item em `free_content.ts` (sem link) e a linha correspondente no mapa do workflow.

## Workflows no n8n (criados em 15/11/2026, NÃO publicados)
| Workflow | id | Webhook (produção) | Credencial do webhook |
|---|---|---|---|
| `Free Content - Receive [ivana]` | `xbAETAOwkMqSbyWO` | `/webhook/free-content` | Header Auth `IvanaLP Free Content` |
| `Free Enroll - Moodle [ivana]` | `UufldMAP3SUVzYMb` | `/webhook/free-enroll` | Header Auth `IvanaLP Free Enroll` |
| `Free Content - Verificar DB (one-off)` | `kaD19z39GJdqjn0u` | (schedule; só verifica a tabela) | Postgres existente |

**Antes de publicar (nesta ordem):**
1. **Tabela:** o usuário do n8n (`nocouser`) não cria tabelas. Aplique `docs/sql/free_content_leads.sql` como dono do banco; depois execute o workflow "Verificar DB" (deve dar `tabela_existe = true`, `pode_inserir = true`) e arquive-o.
2. **Credenciais novas** (Credentials > Create): Header Auth `IvanaLP Free Content` e `IvanaLP Free Enroll` (nome do header `X-Webhook-Secret`, valor = `FREE_CONTENT_WEBHOOK_SECRET` e `FREE_ENROLL_WEBHOOK_SECRET`, `openssl rand -hex 32` cada) e Custom Auth `Moodle WS Token (n8n)` com o JSON `{"qs":{"wstoken":"<token do webservice>"}}` (**`qs`, não `body`**: com `body` o n8n descarta os parâmetros do formulário `form-urlencoded` e o Moodle responde `invalidtoken` em XML; verificado em 15/11/2026).
   Os webhooks estão provisoriamente com a credencial `IvanaLP Contact` (o n8n auto-atribui outra se ficar vazio): **troque pela credencial própria** em cada Webhook e escolha a credencial Moodle nos 3 nós "Moodle - ...".
3. **Planilha:** na planilha "Leads Ivana" crie a aba `Conteudo Gratuito` com o cabeçalho na linha 1: `Data | E-mail | País | Último conteúdo | Tipo | Origem`.
4. Publique um de cada vez e teste com `curl` pelo Nginx (staging) antes de produção.

**O que cada workflow faz.** `free-content`: Turnstile → valida (e-mail, país, `item_id` no mapa; o link da apostila vive no nó "Validate & Sanitize") → upsert em `public.free_content_leads` → linha na planilha → se for apostila/recurso e o último e-mail tiver mais de 10 min, envia o link → `{"ok":true}`.
`free-enroll`: Turnstile → valida (nome, e-mail, `item_id` → curso) → Moodle `core_user_get_users_by_field` → (`core_user_create_users` com `createpassword=1`, se não existir) → `enrol_manual_enrol_users` (papel 5) → upsert + planilha → e-mail de acesso → `{"ok":true}`. Erros: 400 dados inválidos, 403 Turnstile, 500 banco, 502 Moodle.
Testado com dados simulados (nós de serviço fixados): item inválido (400), usuário novo, usuário existente e exceção do Moodle (502). Falta testar com Postgres, Moodle, planilha e SMTP reais.

**Novo curso/aula/PDF:** aula nova = acrescente em `free_courses` (site) e em `ITEMS` do `free-content` (n8n); curso novo = também em `COURSES` do `free-enroll`; PDF novo = `free_materials` (site, sem link) e `ITEMS` com o link (n8n).

## Desenho original (referência)
Webhook (Header Auth `X-Webhook-Secret`) → Turnstile Verify → upsert em Postgres (e-mail único; país, `item_id`, consentimento, 1ª e última
data) → linha na planilha Google → se o item for apostila/recurso, e-mail com o link (assunto e texto no idioma do `country`) → Respond `{"ok":true}`.

## Achados do teste com serviços reais (15/11/2026)
- Postgres, planilha e e-mail testados com sucesso no `free-content` (e-mail da apostila aceito pelo Gmail).
- A credencial SMTP `SMTP account GMAIL (Ivana)` estava recusada pelo Gmail (`535 Username and Password not accepted`): precisou de nova senha de app. Ela também é usada pelo `Contact - Process [ivana]`, então vale conferir se os e-mails do formulário de contato estavam falhando.
- `free-enroll` testado com Moodle, Postgres, planilha e SMTP reais (usuário novo criado, matriculado no curso 49, e-mail de acesso aceito pelo Gmail). O Moodle leva ~4,5 s para criar e ~4,5 s para matricular (execução total ~16 s), então o workflow **responde 200 logo depois da matrícula** e grava banco/planilha/e-mail depois; o Nginx dá 45 s à rota `/api/free-enroll` e o navegador espera até 45 s.
- **Segurança:** o token do Moodle em uso pertence ao usuário **admin** (`userissiteadmin`). O ideal é o usuário de serviço `svc_n8n` (papel mínimo) e o serviço externo só com as 3 funções (`core_user_get_users_by_field`, `core_user_create_users`, `enrol_manual_enrol_users`); o serviço atual também expõe `enrol_manual_unenrol_users`, `core_course_get_courses*`, `core_enrol_get_*`. Gerar novo token para o `svc_n8n` e trocar na credencial `Moodle WS Token`.

## Layout dos e-mails do n8n
Os e-mails de apostila/modelo e de acesso ao curso usam o layout da marca (baseado no e-mail de boas-vindas da loja: fundo creme `#f7efe4`, cartão branco de 600 px, cabeçalho com o logo `courses.ivana.academy/images/logo.png`, botão rosé `#805252`, rodapé com a marca; só tabelas e estilos inline), em HTML **e** texto simples (`emailFormat: both`), em português ou espanhol conforme o país.
- Fonte da verdade: [`docs/email/layout.js`](email/layout.js). O n8n não importa arquivos: o MESMO código é colado nos nós **Validate & Sanitize** de `free-content` e `free-enroll` e no nó **Montar e-mails** de `Contact - Process [ivana]`. Mudou o layout? Atualize os três nós e **republique** os workflows. (A opção `noSign`, sem despedida, só existe no nó do contato; nos outros dois entra na próxima edição.)
- **Contact - Process [ivana]** (formulário de contato): o nó novo **Montar e-mails** gera o aviso ao suporte (em português, com os dados do contato, WhatsApp clicável, botão "Responder por e-mail" e `Reply-To` do cliente) e a confirmação ao cliente (português ou espanhol; texto diferente para pedidos `lgpd`/`arrepentimiento`). Antes, os nós `Email Suporte` e `Email Cliente` estavam **sem corpo de mensagem** (só assunto). Se o nó falhar, os e-mails saem em texto simples (falha segura).
- Prévia local: `node docs/email/preview.mjs` gera `/tmp/ivana-email-*.html`.
- O e-mail "defina sua senha" do Moodle é do **Moodle** (não do n8n): o layout dele se configura no Moodle (strings de idioma e tema), à parte.

## WhatsApp opcional e pedidos de direitos (16/11/2026)
- **WhatsApp (opcional)** no modal do conteúdo gratuito (aula de amostra, apostila e matrícula): `whatsapp` vai em `/api/free-content` e `/api/free-enroll`; o n8n guarda só dígitos (8 a 15, senão fica vazio) em `free_content_leads.whatsapp`, na coluna `WhatsApp` da aba `Conteudo Gratuito` e, na matrícula de usuário novo, em `phone2` do Moodle. Só o e-mail é obrigatório. Nós novos: `Normalizar WhatsApp` (free-content) e `Normalizar contato` (free-enroll). Migração: [`sql/2026-11-16_whatsapp_e_direitos.sql`](sql/2026-11-16_whatsapp_e_direitos.sql).
- **Pedidos de direitos** (`lgpd`, `lgpd-ar`, `arrepentimiento-ar`): não têm telefone e **não entram em `public.leads`** (`phone` é NOT NULL e único: um upsert sobrescreveria outro lead). `Contact - Process` grava uma linha por pedido em `public.rights_requests`, na aba `Reembolsos` (arrependimento) ou `Remocao de Dados` (LGPD) da planilha Leads Ivana (cabeçalho: `Data | País | Nome | E-mail | Assunto | Mensagem | Origem | Status`) e avisa `contato@ivana.academy` com assunto `[URGENTE - ...]`.
- **Planilha de contatos:** a aba `Contatos` e as abas por curso ganharam a coluna `País` (`BR`/`AR`, idioma do formulário), gravada por `Contact - Process`. A coluna precisa existir no cabeçalho de cada aba.
