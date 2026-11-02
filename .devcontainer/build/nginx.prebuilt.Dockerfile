# =============================================================================
# Ivana Academy - Courses Landing Pages: imagem de produção com o site JÁ CONSTRUÍDO
#
# O build (npm ci, vite build e pré-renderização) roda no GitHub Actions (.github/workflows/deploy-prebuilt.yml).
# A VPS só recebe o dist/ pronto e monta a imagem do Nginx: sem Node, sem npm, sem Chromium.
#
# Uso (a partir da raiz do repositório, com ./dist presente):
#   docker compose -p <projeto> -f .devcontainer/compose/prod-prebuilt.yml build
# =============================================================================
# Nginx sem root, stable (1.30). Fixado por digest para o build ser reproduzível; o Dependabot (ecossistema docker)
# propõe a atualização do digest. Para conferir: docker buildx imagetools inspect nginxinc/nginx-unprivileged:1.30-alpine
FROM nginxinc/nginx-unprivileged:1.31-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e

LABEL maintainer="LeoDG <callme@leodg.dev>" \
    org.opencontainers.image.title="Ivana Academy - Courses Landing Pages (prebuilt)" \
    org.opencontainers.image.source="https://github.com/leonardodg/ivana-courses-landing-pages"

ENV ENVIRONMENT=production \
    DEBUG=false \
    WEBSITE_URL=https://courses.ivana.academy \
    TZ=America/Sao_Paulo \
    LANG=en_US.UTF-8

WORKDIR /usr/share/nginx/html

USER root
# Correções de segurança do Alpine publicadas depois do digest da imagem base (ex.: brotli CVE-2026-111497, curl)
RUN apk upgrade --no-cache

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
 && rm -f /etc/nginx/conf.d/default.conf

COPY .devcontainer/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .devcontainer/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY .devcontainer/nginx/snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf
# Gera o proxy do formulário (com o segredo do ambiente, em runtime) antes do Nginx subir
COPY --chmod=755 .devcontainer/nginx/docker-entrypoint.d/05-webhook-proxy.sh /docker-entrypoint.d/05-webhook-proxy.sh

# Site construído pelo CI (contexto do build: ./dist)
COPY dist /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html

# Não-root (uid 101). Porta 8080: portas < 1024 exigiriam root.
USER 101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
