import { useEffect, useState } from "react";
import { Products } from "../../services/products";
import { Accounts } from "../../services/accounts";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import type { Account, FormType } from "../../types/types";
import { LucideChevronLeft } from "lucide-react";

export default function ProductNew() {
    const nav = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        sku: "",
        name: "",
        price: 0,
        cost: 0,
        qtyOnHand: 0,
        taxRate: 0,
        inventoryAccountId: "",
        revenueAccountId: "",
        cogsAccountId: "",
        taxAccountId: "",
    });

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [msg, setMsg] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar las cuentas
    useEffect(() => {
        Accounts.list().then(setAccounts).catch(e => setError(String(e)));
    }, []);

    // Cargar el producto si es edición
    useEffect(() => {
        if (!isEdit || !id) {
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const product = await Products.get(id);
                setForm(
                    {
                        sku: product.sku,
                        name: product.name,
                        price: product.price,
                        cost: product.cost ?? 0,
                        taxRate: product.taxRate,
                        qtyOnHand: product.qtyOnHand,
                        inventoryAccountId: product.inventoryAccountId ?? "",
                        revenueAccountId: product.revenueAccountId ?? "",
                        cogsAccountId: product.cogsAccountId ?? "",
                        taxAccountId: product.taxAccountId ?? "",
                    }
                );
            } catch (e: unknown) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, [isEdit, id]);

    // Calcular el precio
    useEffect(() => {
        const price = Number(
            (Number(form.cost || 0) * (1 + Number(form.taxRate || 0) / 100)).toFixed(2)
        );
        setForm(f => ({ ...f, price }));
    }, [form.cost, form.taxRate]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setSaving(true); setError(null);

            if (isEdit) {
                await Products.update(id!, form);
                setMsg("Producto actualizado ✔");
            } else {
                await Products.create(form);
                setMsg("Producto creado ✔");
            }
            // navega después de un pequeño feedback
            setTimeout(() => nav("/products"), 600);
        } catch (e: unknown) { setError((e as Error).message); } finally { setSaving(false); }
    }

    if (loading) return <div>Cargando…</div>;

    const title = isEdit ? "Editar producto" : "Nueva producto";
    const submitText = saving ? "Guardando…" : (isEdit ? "Guardar cambios" : "Guardar");

    return (
        <div>
            <NavLink to="/products" className="flex gap-1.5 mb-4"><LucideChevronLeft />Volver</NavLink>
            <form onSubmit={onSubmit} className="space-y-4 max-w-2xl border-black border rounded-lg px-3 py-2">
                <h2 className="text-2xl font-bold">{title}</h2>
                {msg && <div className="text-green-700">{msg}</div>}
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
                        <label className="block text-sm">Costo unitario</label>
                        <input type="number" className="border rounded-lg px-3 py-2 w-full appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black"
                            step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm">IVA %</label>
                        <input type="number" className="border rounded-lg px-3 py-2 w-full appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-black"
                            step="0.01" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm">Cantidad</label>
                        <input disabled type="number" className="border rounded-lg px-3 py-2 w-full appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-600 cursor-not-allowed"
                            value={form.qtyOnHand} onChange={e => setForm({ ...form, qtyOnHand: Number(e.target.value) })} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm">Precio</label>
                        <input disabled type="number" className="border rounded-lg px-3 py-2 w-full appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-gray-600 cursor-not-allowed"
                            value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} readOnly />
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
                                    a.isActive &&
                                    <option key={a.id} value={a.id}>{a.code} — {a.name}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>


                <button disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
                    {submitText}
                </button>
            </form>

        </div>
    );
}