# Conteúdo gratuito: contrato com o n8n

Páginas: `/pt-br/conteudo-gratuito/` e `/es-ar/contenido-gratuito/` (`pages/FreeContentApp`, itens em `data/free_content.ts`).
Segurança do endpoint `/api/free-content`: ver [SEGURANCA.md](SEGURANCA.md).

## Como cada tipo é entregue

| Tipo | No navegador | No n8n |
|---|---|---|
| Vídeo | e-mail uma vez; o navegador lembra (`ivana:free-access`) e o player abre num modal | só registra o lead |
| Apostila / modelo editável | **sempre** pede o e-mail; o link NÃO está no código | registra o lead e **envia o link por e-mail** (valida que o endereço existe) |

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
2. **Credenciais novas** (Credentials > Create): Header Auth `IvanaLP Free Content` e `IvanaLP Free Enroll` (nome do header `X-Webhook-Secret`, valor = `FREE_CONTENT_WEBHOOK_SECRET` e `FREE_ENROLL_WEBHOOK_SECRET`, `openssl rand -hex 32` cada) e Custom Auth `Moodle WS Token (n8n)` com o JSON `{"body":{"wstoken":"<token do webservice>"}}`.
   Os webhooks estão provisoriamente com a credencial `IvanaLP Contact` (o n8n auto-atribui outra se ficar vazio): **troque pela credencial própria** em cada Webhook e escolha a credencial Moodle nos 3 nós "Moodle - ...".
3. **Planilha:** na planilha "Leads Ivana" crie a aba `Conteudo Gratuito` com o cabeçalho na linha 1: `Data | E-mail | País | Último conteúdo | Tipo | Origem`.
4. Publique um de cada vez e teste com `curl` pelo Nginx (staging) antes de produção.

**O que cada workflow faz.** `free-content`: Turnstile → valida (e-mail, país, `item_id` no mapa; o link da apostila vive no nó "Validate & Sanitize") → upsert em `public.free_content_leads` → linha na planilha → se for apostila/recurso e o último e-mail tiver mais de 10 min, envia o link → `{"ok":true}`.
`free-enroll`: Turnstile → valida (nome, e-mail, `item_id` → curso) → Moodle `core_user_get_users_by_field` → (`core_user_create_users` com `createpassword=1`, se não existir) → `enrol_manual_enrol_users` (papel 5) → upsert + planilha → e-mail de acesso → `{"ok":true}`. Erros: 400 dados inválidos, 403 Turnstile, 500 banco, 502 Moodle.
Testado com dados simulados (nós de serviço fixados): item inválido (400), usuário novo, usuário existente e exceção do Moodle (502). Falta testar com Postgres, Moodle, planilha e SMTP reais.

**Novo curso/PDF:** acrescente o item em `Validate & Sanitize` (`ITEMS` em `free-content`; `COURSES` e `ITEM_COURSE` em `free-enroll`).

## Desenho original (referência)
Webhook (Header Auth `X-Webhook-Secret`) → Turnstile Verify → upsert em Postgres (e-mail único; país, `item_id`, consentimento, 1ª e última
data) → linha na planilha Google → se o item for apostila/recurso, e-mail com o link (assunto e texto no idioma do `country`) → Respond `{"ok":true}`.
