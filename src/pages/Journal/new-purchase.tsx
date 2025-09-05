import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Products } from "../../services/products";
import { Accounts } from "../../services/accounts";
import { Journal } from "../../services/journal";
import type { Product, Account } from "../../types/types";

export default function NewPurchase() {
  const nav = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({
    productId: "",
    qty: 1,
    unitCost: "" as number | string | undefined,
    paymentAccountId: "",
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
      if (!form.productId || !form.paymentAccountId || !form.qty) {
        throw new Error("Producto, cantidad y cuenta de pago son requeridos");
      }
      const payload = {
        productId: form.productId,
        qty: Number(form.qty),
        paymentAccountId: form.paymentAccountId,
        unitCost: form.unitCost === "" ? undefined : Number(form.unitCost),
        reference: form.reference || undefined,
        memo: form.memo || undefined,
      };
      await Journal.purchase(payload);
      setOk("Compra registrada ✔");
      setTimeout(() => nav("/journal"), 600);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-2xl font-bold">Registrar compra</h2>
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
            type="number" min={1}
            className="border rounded-lg px-3 py-2 w-full"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Costo unitario (opcional)</label>
          <input
            type="number" step="0.01"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.unitCost as string}
            onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
            placeholder="Usa el costo del producto si lo dejas vacío"
          />
        </div>

        <div>
          <label className="block text-sm">Cuenta de pago / por pagar</label>
          <select
            required
            className="border rounded-lg px-3 py-2 w-full"
            value={form.paymentAccountId}
            onChange={(e) => setForm({ ...form, paymentAccountId: e.target.value })}
          >
            <option value="">— Seleccionar —</option>
            {accounts.map(a => (
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
        {saving ? "Guardando…" : "Registrar compra"}
      </button>
    </form>
  );
}
