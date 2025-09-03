import express from "express";
import { PrismaClient } from "./generated/prisma";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

//POSTS
app.post("/accounts", async (req, res) => {
  try {
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
