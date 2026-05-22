
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
FROM node:22-alpine AS node-builder

WORKDIR /app

# Copy manifests first to leverage layer cache
COPY package*.json ./

# Install ALL dependencies (dev included) - needed for Tailwind CLI, esbuild etc.
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
# Output is at /app/dist/

# =============================================================================
#            STAGE 2 - Nginx base (shared between prod and dev)
# =============================================================================
FROM nginx:1.28-alpine AS base

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
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Remove config default of nginx
RUN rm -f /etc/nginx/conf.d/default.conf

# Nginx configuration
COPY .devcontainer/nginx/nginx.conf      /etc/nginx/nginx.conf
COPY .devcontainer/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY .devcontainer/nginx/courses.conf    /etc/nginx/conf.d/courses.conf

# Copy built static files
COPY --from=node-builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck - curl is available in alpine by default
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
#            STAGE 3a - Production (lean, no dev tools)
# =============================================================================
FROM base AS production

ENV ENVIRONMENT=production \
    DEBUG=false

# Nothing extra to install - Alpine base is already minimal (~25 MB).
# Built assets are already copied in the base stage above.

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