FROM node:22-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
# Stelle sicher, dass sowohl package.json als auch pnpm-lock.yaml hier vorhanden sind.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS prod
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
