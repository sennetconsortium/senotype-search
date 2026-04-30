# Base
FROM node:22-bookworm-slim AS base

# Install git for pnpm workspaces
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm
WORKDIR /usr/src/app

# Dependencies
FROM base AS deps

# Copy workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json ./
COPY src/search-ui/package.json ./src/search-ui/

RUN pnpm install

# Builder
FROM base AS builder

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/src/search-ui/node_modules ./src/search-ui/node_modules

COPY next.config.mjs jsconfig.json package.json pnpm-workspace.yaml ./
COPY .env.docker .env.production
COPY public ./public
COPY src ./src

# Compile stylus css
RUN pnpm exec stylus --include-css --compress src/styles/main.styl -o src/app/main.css

ENV NODE_ENV=production
RUN pnpm build

# Final
FROM node:22-bookworm-slim AS final
WORKDIR /usr/src/app

ENV NODE_ENV=production
ARG PORT_MAPPING
ENV PORT=$PORT_MAPPING
ENV HOSTNAME="0.0.0.0"

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
ARG HOST_GID=1002
ARG HOST_UID=1002
RUN addgroup --system --gid $HOST_GID codcc \
    && adduser --system --uid $HOST_UID --ingroup codcc codcc

# Standalone output bundles only what is needed at runtime
COPY --from=builder --chown=codcc:codcc /usr/src/app/public ./public
COPY --from=builder --chown=codcc:codcc /usr/src/app/.next/standalone ./
COPY --from=builder --chown=codcc:codcc /usr/src/app/.next/static ./.next/static

USER codcc

EXPOSE $PORT

CMD ["node", "server.js"]
