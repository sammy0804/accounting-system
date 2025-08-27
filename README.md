# 📒 Sistema de Contabilidad — Accounting System

Proyecto en **Node.js + TypeScript + Prisma** con **PostgreSQL en Docker**.  
Incluye un modelo contable básico (cuentas, asientos, productos) y una semilla inicial.

---

### 🛠️ Requisitos

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/) o **npm**

---

### 🚀 Primeros pasos

### 1. Clonar e instalar dependencias
```bash
git clone <repo-url>
cd accounting-system
npm install
```

### 2. Levantar PostgreSQL con Docker
```bash
docker compose up -d
```
Esto arranca un contenedor `accounting_pg` en `localhost:5432`.

### 3. Configurar variables de entorno

Crea un archivo .env en la raíz:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/accounting?schema=public"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=accounting
```
---

### 🗄️ Migraciones con Prisma

Generar tablas en la base de datos:
```bash
npx prisma migrate dev --name init
```

Generar cliente Prisma:
```bash
npx prisma generate
```

Abrir Prisma Studio para explorar datos:
```bash
npx prisma studio
```
---

### 🌱 Semillas de datos

La semilla se encuentra en src/seed/seed.ts.

#### Ejecutar con Prisma
```bash
npx prisma db seed
```
#### Ejecutar manualmente
```bash
npx tsx src/seed/seed.ts
```

Esto crea:

- Cuentas mínimas (Caja, Inventarios, Ingresos por ventas, Costo de ventas, IVA por pagar)

- Un producto de ejemplo (SKU-001 — Cuaderno rayado)

---

### 📚 Comandos útiles
```bash
# Levantar contenedor Postgres
docker compose up -d

# Apagar contenedor
docker compose down

# Crear migración
npx prisma migrate dev --name <nombre>

# Ejecutar seed
npx prisma db seed

# Ver base en navegador
npx prisma studio
```