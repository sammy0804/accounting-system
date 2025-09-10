import { useEffect, useState } from "react";
import { Accounts } from "../../services/accounts";
import { NavLink, useNavigate } from "react-router-dom";
import type { Account } from "../../types/types";
import { SquarePen, Trash } from "lucide-react";


export default function AccountsList() {
    const [items, setItems] = useState<Account[]>([]);
    const [error, setError] = useState<string | null>(null);

    const nav = useNavigate();

    /**
     * Elimina una cuenta contable. Si se produce un error,
     * se muestra un mensaje de error. Si el error es un
     * constraint de foreign key, se muestra un mensaje
     * explicando que la cuenta no se puede eliminar.
     * @param {string} id El id de la cuenta a eliminar.
     */
    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta cuenta?")) return;
        try {
            await Accounts.delete(id);
            setItems(items.filter(a => a.id !== id));
        } catch (err: unknown) {
            if ((err as Error).message && (err as Error).message.includes("Foreign key constraint")) {
                alert("No se puede eliminar esta cuenta porque está siendo utilizada en otros registros.");
            } else {
                alert("Error al eliminar la cuenta.");
            }
        }
    }
    
    useEffect(() => {
        Accounts.list().then(setItems).catch(e => setError(String(e)));
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Cuentas contables</h2>
                <NavLink to="/accounts/new" className="px-4 py-2 bg-gray-900 text-white rounded-lg">Nueva cuenta</NavLink>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-transprent border rounded-lg">
                    <thead className="bg-transparent">
                        <tr>
                            <th className="text-left p-2">Código</th>
                            <th className="text-left p-2">Nombre</th>
                            <th className="text-left p-2">Tipo de cuenta</th>
                            <th className="text-left p-2">Cuenta activa</th>
                            <th className="text-left p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(a => (
                            <tr key={a.id} className="border-t">
                                <td className="p-2 font-mono">{a.code}</td>
                                <td className="p-2">{a.name}</td>
                                <td className="p-2">{a.nature === "CREDIT" ? "Crédito" : "Débito"}</td>
                                <td className="p-2">{a.isActive ? "Si" : "No"}</td>
                                <td className="p-2 flex gap-1">
                                    <button onClick={() => handleDelete(a.id)} className="px-3 py-2 bg-red-700 text-white rounded-lg cursor-pointer hover:bg-red-600"><Trash size={16} /></button>
                                    <button  onClick={() => nav(`/accounts/${a.id}/edit`)} className="px-3 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-700"><SquarePen size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}