
# =============================================================================
# Ivana Academy - Courses Landing Pages
# Stack: React 19 + Vite 6 + Tailwind CSS v4 + TypeScript + Nginx
#
# Multi-stage build:
#   stage 1 → node-builder   : instala dependências e executa `vite build`
#   stage 2 → base           : nginx alpine com configs compartilhadas
#   stage 3a → production    : imagem final mínima (~25 MB)
#   stage 3b → development   : imagem com Node disponível para hot-reload via volume
#
# Build production:
#   docker build --target production -f .devcontainer/build/Dockerfile .
#
# Build development:
#   docker build --target development -f .devcontainer/build/Dockerfile .
# =============================================================================

# =============================================================================
#  STAGE 1 - node-builder: transpile TypeScript + bundle Vite + Tailwind v4
# =============================================================================
# Node fixado (22.23.4 inclui as correções de segurança de out/2026) por digest; o Dependabot propõe atualizações.
FROM node:22.23.4-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS node-builder

WORKDIR /app

# Copy manifests first to leverage layer cache
COPY package*.json ./

# Install ALL dependencies (dev included) - needed for Tailwind CLI, esbuild etc.
RUN npm ci

# Copy source and build
COPY . .

# Variáveis VITE_* passadas como build args são PÚBLICAS (entram no bundle). O segredo do webhook NÃO passa por aqui:
# é variável de runtime do container (WEBHOOK_SECRET), usada pelo Nginx em /api/contact.
ARG VITE_TURNSTILE_SITE_KEY=
ARG VITE_GA_ID=
ARG VITE_TIENDA_AR_URL=
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
ENV VITE_GA_ID=$VITE_GA_ID
ENV VITE_TIENDA_AR_URL=$VITE_TIENDA_AR_URL

RUN npm run build
# Output is at /app/dist/

# =============================================================================
#            STAGE 2 - Nginx base (shared between prod and dev)
# =============================================================================
# Nginx sem root (stable 1.30), fixado por digest.
FROM nginxinc/nginx-unprivileged:1.30-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS base

USER root

# OCI metadata
LABEL maintainer="LeoDG <callme@leodg.dev>" \
    org.opencontainers.image.title="Ivana Academy - Courses Landing Pages" \
    org.opencontainers.image.source="https://github.com/leonardodg/ivana-courses-landing-pages"

ENV ENVIRONMENT=development \
    DEBUG=true \
    WEBSITE_URL=http://localhost \
    TZ=America/Sao_Paulo \
    LANG=en_US.UTF-8

WORKDIR /usr/share/nginx/html

# Timezone
# Correções de segurança do Alpine publicadas depois do digest da imagem base (ex.: brotli CVE-2026-111497, curl)
RUN apk upgrade --no-cache

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Remove config default of nginx
RUN rm -f /etc/nginx/conf.d/default.conf

# Nginx configuration
COPY .devcontainer/nginx/nginx.conf      /etc/nginx/nginx.conf
COPY .devcontainer/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY .devcontainer/nginx/snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf
# Gera o proxy do formulário (com o segredo do ambiente, em runtime) antes do Nginx subir
COPY --chmod=755 .devcontainer/nginx/docker-entrypoint.d/05-webhook-proxy.sh /docker-entrypoint.d/05-webhook-proxy.sh

# Copy built static files (o default.conf serve de /usr/share/nginx/html)
COPY --from=node-builder /app/dist /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
#            STAGE 3a - Production (lean, no dev tools)
# =============================================================================
FROM base AS production

ENV ENVIRONMENT=production \
    DEBUG=false

# Nothing extra to install - Alpine base is already minimal (~25 MB).
# Built assets are already copied in the base stage above. Roda sem root (uid 101).
USER 101

# =============================================================================
#            STAGE 3b - Development (hot-reload tools, Node available)
# =============================================================================
FROM base AS development

ENV ENVIRONMENT=development \
    DEBUG=true

# Install dev utilities using apk (Alpine package manager)
RUN apk add --no-cache \
    curl \
    git \
    nano \
    openssl \
    bash

# Copy Node.js binaries from the builder stage so npm/npx/node are available
# inside the container (useful for watch scripts, linting on the fly, etc.)
COPY --from=node-builder /usr/local/bin/node /usr/local/bin/node
COPY --from=node-builder /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node-builder /usr/local/include/node /usr/local/include/node
RUN ln -sf ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -sf ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Copy project source so developers can rebuild inside the container
COPY --from=node-builder /app /usr/share/nginx/html/