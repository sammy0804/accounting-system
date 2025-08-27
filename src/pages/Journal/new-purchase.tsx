import { useEffect, useState } from "react";
import { Products } from "../../services/products";
import { Accounts } from "../../services/accounts";
import { Journal } from "../../services/journal";
import type { Account, Product } from "../../types/types";


export default function NewPurchase() {
    const [products, setProducts] = useState<Product[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [form, setForm] = useState({ productId: "", qty: 1, unitCost: 0, paymentAccountId: "" });
    const [msg, setMsg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        Products.list().then(setProducts).catch(e => setError(String(e)));
        Accounts.list().then(setAccounts).catch(e => setError(String(e)));
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setError(null); setMsg(null);
            await Journal.postPurchase(form);
            setMsg("Compra registrada ✔");
        } catch (e: unknown) { setError((e as Error).message); }
    }


    return (
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
            <h2 className="text-2xl font-bold">Asiento de Compra</h2>
            {msg && <div className="text-green-700">{msg}</div>}
            {error && <div className="text-red-600">{error}</div>}


            <div>
                <label className="block text-sm">Producto</label>
                <select className="border rounded-lg px-3 py-2 w-full" value={form.productId}
                    onChange={e => setForm({ ...form, productId: e.target.value })}>
                    <option value="">— Seleccionar —</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
                </select>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">Cantidad</label>
                    <input type="number" className="border rounded-lg px-3 py-2 w-full" value={form.qty}
                        onChange={e => setForm({ ...form, qty: Number(e.target.value) })} />
                </div>
                <div>
                    <label className="block text-sm">Costo unitario</label>
                    <input type="number" step="0.01" className="border rounded-lg px-3 py-2 w-full" value={form.unitCost}
                        onChange={e => setForm({ ...form, unitCost: Number(e.target.value) })} />
                </div>
            </div>


            <div>
                <label className="block text-sm">Cuenta de pago/por pagar</label>
                <select className="border rounded-lg px-3 py-2 w-full" value={form.paymentAccountId}
                    onChange={e => setForm({ ...form, paymentAccountId: e.target.value })}>
                    <option value="">— Seleccionar —</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
                </select>
            </div>


            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg">Registrar compra</button>
        </form>
    );
}