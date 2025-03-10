# --------------------------------------
# 1) Base
# --------------------------------------
FROM node:lts AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

# https://stackoverflow.com/a/77490465
# Set environment variables during the build process
ENV VITE_API_URL=http://localhost:4000

# --------------------------------------
# 2) Build Stage
# --------------------------------------
FROM base AS build

COPY ../. /usr/src/app

WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN npm install -g turbo
RUN pnpm build

# Deploy to /prod folders
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy --filter=@workspace/database --prod /prod/database

# --------------------------------------
# 3) Prisma (DB Migration) Stage
# --------------------------------------
FROM base as database
COPY --from=build /prod/database /app
WORKDIR /app
RUN npx prisma generate
CMD [ "npx", "prisma", "migrate", "deploy" ]

# --------------------------------------
# 4) API Stage
# --------------------------------------
FROM base AS api
COPY --from=build /prod/api /app
WORKDIR /app
EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]

# --------------------------------------
# 5) Web Stage
# --------------------------------------
FROM base AS web
COPY --from=build /prod/web /app
WORKDIR /app
# Use Serve to serve the static files
RUN npm install -g serve
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]


    