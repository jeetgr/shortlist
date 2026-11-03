# syntax=docker/dockerfile:1

# Keep in sync with node-version in .github/workflows/ci.yml.
ARG NODE_VERSION=26.12.0
# Keep in sync with the pnpm version in .github/workflows/ci.yml.
ARG PNPM_VERSION=12.11.2

# ---------- base: node + pnpm, used by every build stage ----------
FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
RUN npm install --global pnpm@${PNPM_VERSION}
WORKDIR /app

# ---------- build: install deps, then bundle ----------
# Manifests are copied before source, so a code-only change skips the install. The cache
# mount keeps pnpm's download store between builds without putting it in the image.
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store
COPY . .
# The Prisma config needs a URL to load, but generating the client never connects to it.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build pnpm db:generate
RUN pnpm build
RUN pnpm build:worker

# ---------- migrate-build: only what `prisma migrate deploy` needs ----------
# The full install is about 2 GB. Both versions are exact pins read from package.json.
FROM base AS migrate-build
COPY package.json /tmp/app-package.json
COPY pnpm-workspace.yaml ./
RUN node -e "const { dependencies: d, devDependencies: v } = JSON.parse(require('fs').readFileSync('/tmp/app-package.json')); require('fs').writeFileSync('package.json', JSON.stringify({ private: true, dependencies: { prisma: v.prisma, dotenv: d.dotenv } }))"
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --store-dir /pnpm/store

# ---------- runtime images ----------
# Runs once per start, applies pending migrations, and exits.
FROM node:${NODE_VERSION}-alpine AS migrate
ENV TZ=Asia/Kolkata
WORKDIR /app
COPY --from=migrate-build --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node prisma7.config.ts ./
USER node
CMD ["node_modules/.bin/prisma", "migrate", "deploy", "--config", "prisma7.config.ts"]

# One bundle with no node_modules. Picks up background jobs from Redis.
FROM node:${NODE_VERSION}-alpine AS worker
ENV NODE_ENV=production \
    TZ=Asia/Kolkata
WORKDIR /app
COPY --from=build --chown=node:node /app/dist/worker ./dist
USER node
CMD ["node", "dist/index.mjs"]

# The Nitro bundle carries its own node_modules.
FROM node:${NODE_VERSION}-alpine AS app
ENV NODE_ENV=production \
    TZ=Asia/Kolkata \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
