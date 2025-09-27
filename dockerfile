# Etapa 1: construir el frontend
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# ⚡ Generar Prisma Client antes del build
RUN npx prisma generate

RUN npm run build   # genera /dist con Vite

# Etapa 2: backend + servir frontend
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY . .

EXPOSE 3000

CMD ["node", "src/server.ts"]
