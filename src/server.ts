import express from "express";
import { PrismaClient } from "./generated/prisma";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

//POSTS
app.post("/accounts", async (req, res) =>{
  try{
    const account = await prisma.account.createMany({ data: req.body });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
})

app.post("/products", async (req, res) => {
  try {
    const product = await prisma.product.createMany({ data: req.body });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

//GETS
// Endpoint para cuentas
app.get("/accounts", async (req, res) => {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint para productos
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint para ventas (journal)
app.get("/journal/sale", async (req, res) => {
  try {
    const sales = await prisma.journal.findMany({ where: { type: "SALE" } });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Endpoint para compras (journal)
app.get("/journal/purchase", async (req, res) => {
  try {
    const purchases = await prisma.journal.findMany({ where: { type: "PURCHASE" } });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
