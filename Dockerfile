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

# Create and switch to the app directory
WORKDIR /usr/src/app

# Copy only package.json and lockfile first for better caching
COPY package.json pnpm-lock.yaml ./

# Install Turbo globally (if your monorepo uses Turbo)
RUN npm install -g turbo

# Use Docker buildkit caching for pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Now copy the rest of your code
COPY . /usr/src/app

# (If you really need to remove the web folder, do it here)
# RUN rm -rf /usr/src/app/apps/web

# Build
RUN pnpm turbo run build

# Deploy to /prod folders
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=web --prod /prod/web

# Fix the Prisma bug by copying .prisma/client to the correct location
RUN find . -path '*/node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client' \
    | xargs -r -I{} sh -c "rm -rf /prod/web/{} && cp -R {} /prod/web/{}"

RUN find . -path '*/node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client' \
    | xargs -r -I{} sh -c "rm -rf /prod/api/{} && cp -R {} /prod/api/{}"


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
    