# Basis-Image, in dem pnpm global installiert wird
FROM node:22-alpine AS base
RUN npm install -g pnpm

# Abhängigkeiten installieren
FROM base AS dependencies
WORKDIR /app
# Kopiere nur die für die Installation nötigen Dateien (Caching nutzen)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Build-Stufe: Kompiliere die Anwendung
FROM base AS build
WORKDIR /app
# Kopiere den kompletten Quellcode
COPY . .
# Übernehme die bereits installierten node_modules
COPY --from=dependencies /app/node_modules ./node_modules
# Baue die Anwendung (z. B. NestJS kompilieren)
RUN pnpm build
# Entferne Development-Abhängigkeiten, um ein schlankeres Produktionsimage zu erhalten
RUN pnpm prune --prod

# Produktions-Stufe: Nur Build-Artefakte und die nötigen Abhängigkeiten
FROM base AS prod
WORKDIR /app
# Kopiere den kompilierten Code (z. B. im Ordner "dist")
COPY --from=build /app/dist/ ./dist/
# Kopiere die pruned node_modules aus der Build-Stufe
COPY --from=build /app/node_modules ./node_modules

# Startbefehl für die Anwendung
CMD ["node", "dist/main.js"]
