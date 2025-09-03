// prisma/seed.ts

import { AccountNature, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Cuentas contables mínimas
  const inv = await prisma.account.upsert({
    where: { code: "1435" },
    update: {},
    create: { code: "1435", name: "Inventarios", nature: AccountNature.DEBIT },
  });

  const sales = await prisma.account.upsert({
    where: { code: "4135" },
    update: {},
    create: { code: "4135", name: "Ingresos por ventas", nature: AccountNature.CREDIT },
  });

  const cogs = await prisma.account.upsert({
    where: { code: "6135" },
    update: {},
    create: { code: "6135", name: "Costo de ventas", nature: AccountNature.DEBIT },
  });

  const vat = await prisma.account.upsert({
    where: { code: "2408" },
    update: {},
    create: { code: "2408", name: "IVA por pagar", nature: AccountNature.CREDIT },
  });

  // Producto de ejemplo
  await prisma.product.upsert({
    where: { sku: "SKU-001" },
    update: {},
    create: {
      sku: "SKU-001",
      name: "Cuaderno rayado",
      price: 5000,
      cost: 3000,
      taxRate: 19,
      inventoryAccountId: inv.id,
      revenueAccountId: sales.id,
      cogsAccountId: cogs.id,
      taxAccountId: vat.id,
    },
  });

  // asiento de venta demo
  await prisma.journalEntry.create({
    data: {
      memo: "Venta de cuadernos rayados",
      date: new Date(),
      reference: "REF-001",
      lines: {
        create: [
          { accountId: sales.id, debit: 5950, credit: 0, description: "Cobro" },
          { accountId: vat.id,  debit: 0, credit: 5000, description: "Ingreso" },
          { accountId: cogs.id, debit: 3000, credit: 0, description: "COGS" },
          { accountId: inv.id,  debit: 0, credit: 3000, description: "Salida inventario" },
        ],
      },
    },
  });


  console.log("🌱 Seed ejecutado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
