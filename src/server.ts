import express from "express";
import { PrismaClient } from "./generated/prisma";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// helper redondeo 2 decimales
const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;


//POSTS
// POST /accounts
app.post("/accounts", async (req, res) => {
  try {
    const account = await prisma.account.createMany({ data: req.body });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
})

// POST /products
app.post("/products", async (req, res) => {
  try {
    const product = await prisma.product.createMany({ data: req.body });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /journal/purchase (simple)
app.post("/journal/purchase", async (req, res) => {
  try {
    const { productId, qty, unitCost, paymentAccountId, reference, memo } = req.body;
    if (!productId || !qty || !paymentAccountId) return res.status(400).send("productId, qty, paymentAccountId requeridos");

    const p = await prisma.product.findUnique({ where: { id: productId } });
    if (!p) return res.status(400).send("Producto no existe");
    if (!p.inventoryAccountId) return res.status(400).send("Falta cuenta de Inventario");

    const cost = Number(unitCost ?? p.cost ?? 0);
    const total = r2(cost * Number(qty));
    if (total <= 0) return res.status(400).send("Total inválido");

    const entry = await prisma.journalEntry.create({
      data: {
        reference, memo: memo ?? `Compra ${qty} x ${p.name}`,
        lines: {
          create: [
            { accountId: p.inventoryAccountId, debit: total, credit: 0, description: "Ingreso inventario" },
            { accountId: paymentAccountId,     debit: 0,     credit: total, description: "Pago/por pagar" },
          ],
        },
      },
      include: { lines: true },
    });

    // (opcional) actualizar cost estándar al último costo
    await prisma.product.update({ 
      where: { id: p.id }, 
      data: { qtyOnHand: r2(Number(p.qtyOnHand ?? 0) + Number(qty)), cost }
    });

    res.status(201).json(entry);
  } catch (e) {
    res.status(400).send(e as string || "Error");
  }
});

// POST /journal/sale (simple)
app.post("/journal/sale", async (req, res) => {
  try {
    const { productId, qty, unitPrice, cashAccountId, unitCostOverride, reference, memo } = req.body;
    if (!productId || !qty || !cashAccountId) return res.status(400).send("productId, qty, cashAccountId requeridos");

    const p = await prisma.product.findUnique({ where: { id: productId } });
    if (!p) return res.status(400).send("Producto no existe");
    if (!p.revenueAccountId || !p.cogsAccountId || !p.inventoryAccountId)
      return res.status(400).send("Faltan cuentas (ingresos/COGS/inventario)");
    if (Number(p.taxRate) > 0 && !p.taxAccountId) return res.status(400).send("Falta cuenta de impuesto");

    const price = Number(unitPrice ?? p.price);
    const cost  = Number(unitCostOverride ?? p.cost ?? 0);
    const net   = r2(price * Number(qty));
    const tax   = r2(net * Number(p.taxRate) / 100);
    const gross = r2(net + tax);
    const cogs  = r2(cost * Number(qty));

    const lines: { accountId: string, debit: number, credit: number, description: string }[] = [
      { accountId: cashAccountId,      debit: gross, credit: 0,   description: "Cobro" },
      { accountId: p.revenueAccountId, debit: 0,     credit: net, description: "Ingresos por venta" },
    ];
    if (tax > 0 && p.taxAccountId)
      lines.push({ accountId: p.taxAccountId, debit: 0, credit: tax, description: "IVA por pagar" });
    if (cogs > 0) {
      lines.push({ accountId: p.cogsAccountId,      debit: cogs, credit: 0,   description: "COGS" });
      lines.push({ accountId: p.inventoryAccountId, debit: 0,    credit: cogs, description: "Salida inventario" });
    }

    const entry = await prisma.journalEntry.create({
      data: { reference, memo: memo ?? `Venta ${qty} x ${p.name}`, lines: { create: lines } },
      include: { lines: true },
    });

    await prisma.product.update({
      where: { id: p.id },
      data: { qtyOnHand: r2(Number(p.qtyOnHand ?? 0) - Number(qty)) }
    });

    res.status(201).json(entry);
  } catch (e) {
    res.status(400).send(e as string || "Error");
  }
});

//GETS
// Endpoint para cuentas
app.get("/accounts", async (_, res) => {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint para productos
app.get("/products", async (_, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});


// Endpoint para ventas (journal)
app.get("/journals", async (_, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        lines:
        {
          include: {
            account: true,
          },
        },
      },
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
