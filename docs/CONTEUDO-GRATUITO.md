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

## Workflow sugerido
Webhook (Header Auth `X-Webhook-Secret`) → Turnstile Verify → upsert em Postgres (e-mail único; país, `item_id`, consentimento, 1ª e última
data) → linha na planilha Google → se o item for apostila/recurso, e-mail com o link (assunto e texto no idioma do `country`) → Respond `{"ok":true}`.
