# Matrícula gratuita no Moodle (cadastro + matrícula via n8n)

Fluxo: card do curso com botão **Matricular-me grátis** (um card por curso em `free_courses`, `data/free_content.ts`) → modal com nome, sobrenome,
e-mail e consentimento → `POST /api/free-enroll` (Nginx: Origin, 5 req/min por IP, 4 KB, segredo próprio `FREE_ENROLL_WEBHOOK_SECRET`) →
webhook `/webhook/free-enroll` no n8n → API do Moodle (`ivana.academy`). **O navegador nunca manda o id do curso**: manda a chave (`course`, slug) e o
n8n resolve o id na tabela abaixo. Assim ninguém matricula em curso fora da lista.

## Requisição e resposta
`{ email, first_name, last_name, country: "BR"|"AR", course, form_source: "free_enroll_br|ar", consent, timestamp, cf_turnstile_token }`.
Responder `200 {"ok":true}` quando o usuário existir/for criado E estiver matriculado; `403` Turnstile; `429` limite. A resposta é a mesma
para e-mail novo ou já cadastrado (sem enumeração de contas).

## Mapa chave do curso → curso do Moodle (vive no n8n, nó "Validate & Sanitize" do `free-enroll`)
| `course` | Curso Moodle | País |
|---|---|---|
| `macrame-ar` | 45 Macramé (11 aulas) | AR |
| `resina-ar` | 46 Resina | AR |
| `textil-ar` | 47 Tecnicatura textil | AR |
| `mixmedia-ar` | 48 Mix media | AR |
| `saboaria-br` | 49 Saboaria | BR |
| `velas-br` | 50 Velas | BR |
| `arte-br` | 51 Artes | BR |

Curso novo: crie no Moodle (matrícula manual ativa), acrescente em `free_courses` (site) e em `COURSES` (n8n). O que o curso entrega: aulas em ordem
com controle de progresso, atestado de conclusão (não é certificado: certificado é dos cursos pagos), apostilas/PDFs, questionários, glossário, fórum.

## Moodle: preparar o webservice (uma vez)
1. Administração do site → Funcionalidades avançadas → **Habilitar serviços web** e protocolo **REST**.
2. Criar um usuário de serviço (ex.: `svc_n8n`, sem acesso à interface) e um papel só com as capabilities:
   `moodle/user:create`, `moodle/user:viewdetails`, `enrol/manual:enrol`, `moodle/course:view`, `webservice/rest:use`.
3. Serviço externo próprio (ex.: "n8n conteúdo gratuito") com SÓ estas funções: `core_user_get_users_by_field`, `core_user_create_users`,
   `enrol_manual_enrol_users`. Autorizar o usuário de serviço.
4. Criar o **token** desse usuário **com restrição de IP** (IP da VPS Oracle). Guardar o token só na credencial do n8n.
5. Nginx da AWS: `location ^~ /webservice/ { allow <IP da Oracle>; deny all; ... }` (o Cloudflare repassa `CF-Connecting-IP`; confira o `real_ip`).
6. O enrolment **manual** precisa estar ativo nos cursos gratuitos. Opcional: `Permitir contas com o mesmo e-mail` desligado (padrão).

## Workflow n8n (`Free Enroll - Moodle`)
Webhook (Header Auth `X-Webhook-Secret`) → Turnstile Verify (mesmo nó do `contact-v2`) → validar/sanitizar (e-mail, nomes 2–60, `item_id` no mapa;
senão 400) → HTTP `POST https://ivana.academy/webservice/rest/server.php` (corpo `application/x-www-form-urlencoded`, token na credencial, nunca na URL):
1. `wsfunction=core_user_get_users_by_field`, `field=email`, `values[0]=<email>`.
2. Se vazio: `wsfunction=core_user_create_users`, `users[0][username]=<email em minúsculas>`, `users[0][email]`, `users[0][firstname]`,
   `users[0][lastname]`, `users[0][auth]=manual`, `users[0][createpassword]=1` (o Moodle envia o e-mail "defina sua senha") e **`users[0][mailformat]=1`**
   (sem ele o core usa só os campos enviados e o e-mail de senha nova sai em **texto puro, sem o layout HTML**; o mesmo vale para qualquer cliente do webservice, como a loja Magento),
   `users[0][lang]=es` (AR) ou `pt_br` (BR). Guardar o `id` devolvido.
3. `wsfunction=enrol_manual_enrol_users`, `enrolments[0][roleid]=5` (aluno), `enrolments[0][userid]=<id>`, `enrolments[0][courseid]=<mapa>`.
4. Já existia a conta? Enviar e-mail próprio "você foi matriculado, entre com sua conta" (idioma do `country`).
5. Gravar/atualizar o lead no Postgres e na planilha (mesmo upsert do `free-content`, com `item_id` e `origem=moodle`) → Respond `{"ok":true}`.

Erros do Moodle chegam com HTTP 200 e um JSON com `exception`/`errorcode`: tratar como falha (responder 502) e **não** repetir o POST de criação sem antes
consultar o e-mail de novo (evita usuário duplicado).

## Segurança
- Token do Moodle e segredo do webhook só em credenciais do n8n e no ambiente do container; nada com `VITE_`. O CI barra `webhook/free-enroll` no `dist/`.
- Segredos diferentes por rota (`WEBHOOK_SECRET`, `FREE_CONTENT_WEBHOOK_SECRET`, `FREE_ENROLL_WEBHOOK_SECRET`): vazar um não vale para os outros.
- Usuário de serviço com o mínimo de permissões, token preso ao IP da Oracle e `/webservice/` fechado por IP no Nginx do Moodle.
