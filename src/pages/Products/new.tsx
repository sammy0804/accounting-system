import { useEffect, useState } from "react";
import { Products } from "../../services/products";
import { Accounts } from "../../services/accounts";
import { useNavigate } from "react-router-dom";
import type { Account, FormType } from "../../types/types";

export default function ProductNew() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        sku: "",
        name: "",
        price: 0,
        cost: 0,
        taxRate: 0,
        inventoryAccountId: "",
        revenueAccountId: "",
        cogsAccountId: "",
        taxAccountId: "",
    });
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Accounts.list().then(setAccounts).catch(e => setError(String(e)));
    }, []);


    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setSaving(true); setError(null);
            await Products.create(form);
            nav("/products");
        } catch (e: unknown) { setError((e as Error).message); } finally { setSaving(false); }
    }


    return (
        <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-bold">Nuevo producto</h2>
            {error && <div className="text-red-600">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">SKU</label>
                    <input required className="border rounded-lg px-3 py-2 w-full" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm">Nombre</label>
                    <input required className="border rounded-lg px-3 py-2 w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm">Precio</label>
                    <input type="number" step="0.01" className="border rounded-lg px-3 py-2 w-full" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div>
                    <label className="block text-sm">Costo</label>
                    <input type="number" step="0.01" className="border rounded-lg px-3 py-2 w-full" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} />
                </div>
                <div>
                    <label className="block text-sm">IVA %</label>
                    <input type="number" step="0.01" className="border rounded-lg px-3 py-2 w-full" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: Number(e.target.value) })} />
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                {([
                    ["Inventario", "inventoryAccountId"],
                    ["Ingresos", "revenueAccountId"],
                    ["COGS", "cogsAccountId"],
                    ["Impuesto", "taxAccountId"],
                ] as const).map(([label, key]) => (
                    <div key={key}>
                        <label className="block text-sm">{label}</label>
                        <select className="border rounded-lg px-3 py-2 w-full" value={(form as FormType)[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                            <option value="">— Seleccionar —</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.code} — {a.name}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>


            <button disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
                {saving ? "Guardando…" : "Guardar"}
            </button>
        </form>
    );
}