import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Products } from "../../services/products";
import type { Product } from "../../types/types";
import { SquarePen, Trash } from "lucide-react";


export default function ProductsList() {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nav = useNavigate();

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await Products.remove(id);
            setItems(items.filter(a => a.id !== id));
        } catch (err: unknown) {
            if ((err as Error).message && (err as Error).message.includes("Foreign key constraint")) {
                alert("No se puede eliminar este producto porque esta siendo utilizado en otros registros.");
            } else {
                alert("Error al eliminar el producto.");
            }
        }
    };

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await Products.list();
            setItems(data);
        } catch (e: unknown) {
            setError((e as Error).message);
        } finally { setLoading(false); }
    }, [setLoading, setError, setItems]);

    useEffect(() => { load(); }, [load]);


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Productos</h2>
                <Link to="/products/new" className="px-3 py-2 bg-gray-900 text-white rounded-lg">Nuevo</Link>
            </div>

            {loading && <div>Cargando…</div>}
            {error && <div className="text-red-600">{error}</div>}


            <div className="overflow-x-auto">
                <table className="min-w-full bg-transparent border rounded-lg">
                    <thead className="bg-transparent">
                        <tr>
                            <th className="text-left p-2">SKU</th>
                            <th className="text-left p-2">Nombre</th>
                            <th className="text-right p-2">Cantidad</th>
                            <th className="text-right p-2">Costo (unitario)</th>
                            <th className="text-right p-2">IVA %</th>
                            <th className="text-right p-2">Precio</th>
                            <th className="text-center p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="p-2 font-mono">{p.sku}</td>
                                <td className="p-2">{p.name}</td>
                                <td className="p-2 text-right">{Number(p.qtyOnHand ?? 0).toLocaleString()}</td>
                                <td className="p-2 text-right">{Number(p.cost ?? 0).toLocaleString()}</td>
                                <td className="p-2 text-right">{Number(p.taxRate).toLocaleString()}</td>
                                <td className="p-2 text-right">{Number(p.price).toLocaleString()}</td>
                                <td className="p-2 flex gap-1 justify-center">
                                    <button onClick={() => handleDelete(p.id)} className="px-3 py-2 bg-red-700 text-white rounded-lg cursor-pointer hover:bg-red-600">
                                        <Trash size={16} />
                                    </button>
                                    <button onClick={() => nav(`/products/${p.id}/edit`)} className="px-3 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-700">
                                        <SquarePen size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}