# Verwende ein schlankes Node-Image
FROM node:22-alpine

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Kopiere die Package-Dateien und installiere die Abhängigkeiten
COPY package*.json ./
RUN npm install --production

# Kopiere den Rest des Codes (inklusive Prisma-Schema und Migrations)
COPY . .

# Generiere den Prisma Client
RUN npx prisma generate

# Standard-Command: Migrations anwenden, um die DB auf den Stand des Prisma-Schemas zu bringen
CMD ["npx", "prisma", "migrate", "deploy"]
