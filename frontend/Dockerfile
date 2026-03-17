# ---- Dev stage ----
FROM node:24-alpine AS dev

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

# Source is bind-mounted in docker-compose for hot reload
EXPOSE 5173
CMD ["pnpm", "dev"]


# ---- Build stage ----
FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build


# ---- Prod stage ----
FROM node:24-alpine AS prod

RUN corepack enable

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --prod

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "build"]
