# --------------------------------------
# 1) Base
# --------------------------------------
FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --------------------------------------
# 2) Build Stage
# --------------------------------------
FROM base AS build

COPY ./apps /usr/src/app

WORKDIR /usr/src/app

# Use Docker buildkit caching for pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN npm install -g turbo
# Build
RUN pnpm turbo run build

# Deploy to /prod folders
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=web --prod /prod/web

# --------------------------------------
# 3) Final API Stage
# --------------------------------------
FROM base AS api
COPY --from=build /prod/api /app
WORKDIR /app
EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]


# --------------------------------------
# 4) Final Web Stage
# --------------------------------------
FROM base AS web
COPY --from=build /prod/web /app
WORKDIR /app
# If your built site is served on port 4173, or 3000, or any custom port
EXPOSE 5173
CMD [ "npm", "run", "start" ]
    