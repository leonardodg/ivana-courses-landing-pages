# =============================================================================
# Ivana Academy - Courses Landing Pages: imagem de produção com o site JÁ CONSTRUÍDO
#
# O build (npm ci, vite build e pré-renderização) roda no GitHub Actions (.github/workflows/deploy-prebuilt.yml).
# A VPS só recebe o dist/ pronto e monta a imagem do Nginx: sem Node, sem npm, sem Chromium.
#
# Uso (a partir da raiz do repositório, com ./dist presente):
#   docker compose -p <projeto> -f .devcontainer/compose/prod-prebuilt.yml build
# =============================================================================
FROM nginx:1.28-alpine

LABEL maintainer="LeoDG <callme@leodg.dev>" \
    org.opencontainers.image.title="Ivana Academy - Courses Landing Pages (prebuilt)" \
    org.opencontainers.image.source="https://github.com/leonardodg/ivana-courses-landing-pages"

ENV ENVIRONMENT=production \
    DEBUG=false \
    WEBSITE_URL=https://courses.ivana.academy \
    TZ=America/Sao_Paulo \
    LANG=en_US.UTF-8

WORKDIR /usr/share/nginx/html

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
 && rm -f /etc/nginx/conf.d/default.conf

COPY .devcontainer/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .devcontainer/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY .devcontainer/nginx/snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Site construído pelo CI (contexto do build: ./dist)
COPY dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
