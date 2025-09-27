# Etapa 1: construir backend + frontend
FROM node:18 AS builder

WORKDIR /app

# Copiar package.json y lock primero (mejor cache)
COPY package*.json ./

RUN npm install

# Copiar el resto del proyecto
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TS y frontend
RUN npm run build


# Etapa 2: solo runtime (más liviano)
FROM node:18-slim AS runner

WORKDIR /app

# Copiar solo lo necesario del builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Exponer puerto
EXPOSE 3000

# Arrancar el backend (ya compilado en dist)
CMD ["node", "dist/server.js"]
