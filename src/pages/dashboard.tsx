// src/pages/dashboard/index.tsx
import { useEffect, useMemo, useState } from "react";
import type { JournalEntry, Product } from "../types/types";
import { Products } from "../services/products";
import { Journal } from "../services/journal";

type KPI = {
  ventasNetas: number;
  cogs: number;
  utilidadBruta: number;
  ivaPorPagar: number;
  valorInventario: number;
};

const money = (n: number) =>
  Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });

const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const dateKey = (d: string | Date) =>
  (typeof d === "string" ? new Date(d) : d).toISOString().slice(0, 10);

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga datos base (sin /api/dashboard)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ps, js] = await Promise.all([
          Products.list(),         // debe devolver Product[]
          Journal.list(),          // debe devolver JournalEntry[] con lines y account incluidos
        ]);
        setProducts(ps);
        setEntries(js);
      } catch (e: unknown) {
        setError(( e as Error ).message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { kpis, trend, recent } = useMemo(() => {
    // Construir sets de IDs de cuentas desde productos
    const revenueIds = new Set<string>();
    const cogsIds = new Set<string>();
    const inventoryIds = new Set<string>();
    const taxIds = new Set<string>();

    for (const p of products) {
      if (p.revenueAccountId) revenueIds.add(p.revenueAccountId);
      if (p.cogsAccountId) cogsIds.add(p.cogsAccountId);
      if (p.inventoryAccountId) inventoryIds.add(p.inventoryAccountId);
      if (p.taxAccountId) taxIds.add(p.taxAccountId);
    }

    // KPIs
    let ventasNetas = 0;
    let cogs = 0;
    let ivaPorPagar = 0;

    const porDia = new Map<string, { net: number; gp: number }>();

    for (const e of entries) {
      const d = dateKey(e.date as string);
      if (!porDia.has(d)) porDia.set(d, { net: 0, gp: 0 });
      const row = porDia.get(d)!;

      for (const l of e.lines) {
        const debit = Number(l.debit ?? 0);
        const credit = Number(l.credit ?? 0);
        const accId = l.account.id;

        if (revenueIds.has(accId)) {
          ventasNetas += credit;   // ingresos suelen ir al Haber
          row.net += credit;
        }
        if (cogsIds.has(accId)) {
          cogs += debit;           // COGS al Debe
          row.gp -= debit;         // resta en utilidad bruta
        }
        if (taxIds.has(accId)) {
          ivaPorPagar += credit;   // IVA por pagar al Haber
        }
      }
    }

    const utilidadBruta = ventasNetas - cogs;

    // tendencia ordenada
    const trendArr = [...porDia.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({ date, net: r2(v.net), gp: r2(v.net + v.gp) }));

    // inventario (si tienes qtyOnHand en Product)
    const valorInventario = products.reduce((acc, p) =>
      acc + Number(p.qtyOnHand ?? 0) * Number(p.cost ?? 0), 0);

    // recientes (últimos 10)
    const recentEntries = [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      kpis: {
        ventasNetas: r2(ventasNetas),
        cogs: r2(cogs),
        utilidadBruta: r2(utilidadBruta),
        ivaPorPagar: r2(ivaPorPagar),
        valorInventario: r2(valorInventario),
      } as KPI,
      trend: trendArr,
      recent: recentEntries,
    };
  }, [products, entries]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (loading) return <div>Cargando…</div>;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card title="Ventas netas" value={`$ ${money(kpis.ventasNetas)}`} />
        <Card title="COGS" value={`$ ${money(kpis.cogs)}`} />
        <Card title="Utilidad bruta" value={`$ ${money(kpis.utilidadBruta)}`} />
        <Card title="IVA por pagar" value={`$ ${money(kpis.ivaPorPagar)}`} />
        <Card title="Inventario" value={`$ ${money(kpis.valorInventario)}`} />
      </div>

      {/* Tendencia simple (lista; puedes cambiar a gráfico luego) */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold mb-2">Tendencia (ventas / utilidad)</h3>
        {trend.length === 0 ? (
          <div className="text-sm text-gray-600">Sin datos en el período.</div>
        ) : (
          <ul className="text-sm grid grid-cols-1 md:grid-cols-2 gap-1">
            {trend.map(r => (
              <li key={r.date} className="flex justify-between">
                <span className="text-gray-600">{r.date}</span>
                <span>Ventas: {money(r.net)} — Utilidad: {money(r.gp)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Asientos recientes */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold mb-2">Asientos recientes</h3>
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="p-2">Fecha</th>
              <th className="p-2">Referencia</th>
              <th className="p-2">Memo</th>
              <th className="p-2 text-right">Líneas de ventas/compras</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{dateKey(e.date)}</td>
                <td className="p-2">{e.reference ?? "-"}</td>
                <td className="p-2">{e.memo ?? "-"}</td>
                <td className="p-2 text-right">{e.lines.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
