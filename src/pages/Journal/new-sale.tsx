import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Products } from "../../services/products";
import { Accounts } from "../../services/accounts";
import { Journal } from "../../services/journal";
import type { Product, Account } from "../../types/types";

export default function NewSale() {
  const nav = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({
    productId: "",
    qty: 1,
    unitPrice: "" as number | string | undefined,
    cashAccountId: "",
    reference: "",
    memo: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [ps, ac] = await Promise.all([Products.list(), Accounts.list()]);
        setProducts(ps);
        setAccounts(ac);
      } catch (e: unknown) {
        setError((e as Error).message);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true); setError(null); setOk(null);
      if (!form.productId || !form.cashAccountId || !form.qty) {
        throw new Error("Producto, cantidad y cuenta de caja son requeridos");
      }
      // unitPrice opcional: si no viene, backend usará product.price
      const payload = {
        productId: form.productId,
        qty: Number(form.qty),
        cashAccountId: form.cashAccountId,
        unitPrice: form.unitPrice === "" ? undefined : Number(form.unitPrice),
        reference: form.reference || undefined,
        memo: form.memo || undefined,
      };
      await Journal.sale(payload);
      setOk("Venta registrada ✔");
      setTimeout(() => nav("/journal"), 600);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl p-6 rounded-lg border">
      <h2 className="text-2xl font-bold">Registrar venta</h2>
      {error && <div className="text-red-600">{error}</div>}
      {ok && <div className="text-green-700">{ok}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Producto</label>
          <select
            required
            className="border rounded-lg px-3 py-2 w-full"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
          >
            <option value="">— Seleccionar —</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Cantidad</label>
          <input
            type="number"
            min={1}
            className="border rounded-lg px-3 py-2 w-full"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Precio unitario (opcional)</label>
          <input
            type="number" step="0.01"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.unitPrice as string}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
            placeholder="Usa el precio del producto si lo dejas vacío"
          />
        </div>

        <div>
          <label className="block text-sm">Cuenta Caja/Banco</label>
          <select
            required
            className="border rounded-lg px-3 py-2 w-full"
            value={form.cashAccountId}
            onChange={(e) => setForm({ ...form, cashAccountId: e.target.value })}
          >
            <option value="">— Seleccionar —</option>
            {accounts.map(a => (
              a.isActive &&
              <option key={a.id} value={a.id}>{a.code} — {a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Referencia (opcional)</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm">Memo (opcional)</label>
          <input
            className="border rounded-lg px-3 py-2 w-full"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
          />
        </div>
      </div>

      <button disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
        {saving ? "Guardando…" : "Registrar venta"}
      </button>
    </form>
  );
}
