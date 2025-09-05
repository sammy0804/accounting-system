import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Products } from "../../services/products";
import type { Product } from "../../types/types";
import { Trash } from "lucide-react";


export default function ProductsList() {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await Products.list();
            setItems(data);
        } catch (e: unknown) {
            setError((e as Error).message);
        } finally { setLoading(false); }
    }, [ setLoading, setError, setItems]);

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
                            <th className="text-right p-2">Acciones</th>
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
                                <td className="p-2 flex gap-1">
                                    <button className="px-3 py-2 bg-red-700 text-white rounded-lg"><Trash size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}