#!/bin/sh
# Gera /tmp/webhook-proxy.conf (incluído por location = /api/contact em conf.d/default.conf).
#
# O segredo do webhook do n8n existe SÓ aqui, como variável de ambiente do container em execução:
# nunca entra no build, no bundle JS nem na imagem. O navegador chama /api/contact sem credencial
# e o Nginx acrescenta o X-Webhook-Secret ao encaminhar para o n8n pela rede interna do Docker.
#
# Escreve em /tmp (tmpfs) para funcionar com o filesystem do container em modo somente leitura.
set -eu

OUT="${PROXY_OUT_DIR:-/tmp}/webhook-proxy.conf"
UPSTREAM="${N8N_WEBHOOK_UPSTREAM:-http://n8n_main:5678/webhook/contact-v2}"
SECRET="${WEBHOOK_SECRET:-}"

if [ -z "$SECRET" ]; then
  if [ "${ALLOW_NO_WEBHOOK:-0}" = "1" ]; then
    echo "05-webhook-proxy: WEBHOOK_SECRET vazio e ALLOW_NO_WEBHOOK=1; /api/contact responderá 503." >&2
    printf 'return 503;\n' > "$OUT"
    exit 0
  fi
  echo "05-webhook-proxy: ERRO: WEBHOOK_SECRET não definido (defina ALLOW_NO_WEBHOOK=1 só para testes locais)." >&2
  exit 1
fi

# Os valores entram dentro de um arquivo de configuração do Nginx: só caracteres seguros,
# para que um valor malformado nunca vire diretiva injetada.
case "$SECRET" in
  *[!A-Za-z0-9._~+=-]*) echo "05-webhook-proxy: ERRO: WEBHOOK_SECRET com caracteres inválidos (use hex/base64url)." >&2; exit 1 ;;
esac
if [ "${#SECRET}" -lt 24 ]; then
  echo "05-webhook-proxy: ERRO: WEBHOOK_SECRET curto demais (mínimo 24 caracteres; gere com: openssl rand -hex 32)." >&2
  exit 1
fi
case "$UPSTREAM" in
  http://*|https://*) ;;
  *) echo "05-webhook-proxy: ERRO: N8N_WEBHOOK_UPSTREAM deve começar com http:// ou https://." >&2; exit 1 ;;
esac
case "$UPSTREAM" in
  *[!A-Za-z0-9:/._-]*) echo "05-webhook-proxy: ERRO: N8N_WEBHOOK_UPSTREAM com caracteres inválidos." >&2; exit 1 ;;
esac

umask 077
cat > "$OUT" <<CONF
# Gerado em $(date -u +%Y-%m-%dT%H:%M:%SZ) por 05-webhook-proxy.sh (não editar).
# Upstream em variável + resolver do Docker: o Nginx sobe mesmo se o n8n estiver reiniciando.
resolver 127.0.0.11 valid=10s ipv6=off;
set \$n8n_upstream "$UPSTREAM";

proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_set_header X-Webhook-Secret "$SECRET";
proxy_set_header X-Real-IP        \$remote_addr;
proxy_set_header X-Forwarded-For  \$remote_addr;
proxy_set_header Cookie           "";
proxy_set_header Authorization    "";
proxy_connect_timeout 5s;
proxy_send_timeout    15s;
proxy_read_timeout    20s;
proxy_hide_header X-Powered-By;
proxy_pass \$n8n_upstream;
CONF
# O usuário do Nginx (não-root) precisa ler o arquivo.
chmod 0644 "$OUT"
echo "05-webhook-proxy: proxy do formulário configurado (segredo: ${#SECRET} caracteres, não exibido)." >&2

# ── Conteúdo gratuito: /api/free-content → n8n (outro webhook, OUTRO segredo) ──────────────────────────────────────
# Opcional: sem FREE_CONTENT_WEBHOOK_SECRET a rota responde 503 e o resto do site segue normal.
FREE_OUT="${PROXY_OUT_DIR:-/tmp}/free-content-proxy.conf"
FREE_SECRET="${FREE_CONTENT_WEBHOOK_SECRET:-}"
FREE_UPSTREAM="${N8N_FREE_CONTENT_UPSTREAM:-http://n8n_main:5678/webhook/free-content}"
if [ -z "$FREE_SECRET" ]; then
  printf 'return 503;\n' > "$FREE_OUT"
  chmod 0644 "$FREE_OUT"
  echo "05-webhook-proxy: FREE_CONTENT_WEBHOOK_SECRET vazio; /api/free-content responderá 503." >&2
  exit 0
fi
case "$FREE_SECRET" in
  *[!A-Za-z0-9._~+=-]*) echo "05-webhook-proxy: ERRO: FREE_CONTENT_WEBHOOK_SECRET com caracteres inválidos." >&2; exit 1 ;;
esac
if [ "${#FREE_SECRET}" -lt 24 ]; then
  echo "05-webhook-proxy: ERRO: FREE_CONTENT_WEBHOOK_SECRET curto demais (mínimo 24)." >&2
  exit 1
fi
case "$FREE_UPSTREAM" in
  http://*|https://*) ;;
  *) echo "05-webhook-proxy: ERRO: N8N_FREE_CONTENT_UPSTREAM deve começar com http:// ou https://." >&2; exit 1 ;;
esac
case "$FREE_UPSTREAM" in
  *[!A-Za-z0-9:/._-]*) echo "05-webhook-proxy: ERRO: N8N_FREE_CONTENT_UPSTREAM com caracteres inválidos." >&2; exit 1 ;;
esac
umask 077
cat > "$FREE_OUT" <<CONF
resolver 127.0.0.11 valid=10s ipv6=off;
set \$n8n_free_upstream "$FREE_UPSTREAM";

proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_set_header X-Webhook-Secret "$FREE_SECRET";
proxy_set_header X-Real-IP        \$remote_addr;
proxy_set_header X-Forwarded-For  \$remote_addr;
proxy_set_header Cookie           "";
proxy_set_header Authorization    "";
proxy_connect_timeout 5s;
proxy_send_timeout    15s;
proxy_read_timeout    20s;
proxy_hide_header X-Powered-By;
proxy_pass \$n8n_free_upstream;
CONF
chmod 0644 "$FREE_OUT"
echo "05-webhook-proxy: proxy do conteúdo gratuito configurado (segredo: ${#FREE_SECRET} caracteres, não exibido)." >&2
