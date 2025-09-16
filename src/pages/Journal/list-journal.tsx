import { useEffect, useState } from "react";
import { Journal } from "../../services/journal";
import type { JournalEntry } from "../../types/types";
import { Trash2Icon } from "lucide-react";

export default function JournalEntriesList() {
    const [items, setItems] = useState<JournalEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        Journal.list().then(setItems).catch(e => setError(String(e)));
    }, []);

    const deleteJournal = (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar este registro contable?")) return;
        try {
            Journal.delete(id).then(() => setItems(items.filter(i => i.id !== id))).catch(e => setError(String(e)))
            setMessage("Registro contable eliminado exitosamente!");
            // limpiar el mensaje después de 3 segundos
            setTimeout(() => setMessage(null), 3000);
        } catch (err: unknown) {
            if ((err as Error).message && (err as Error).message.includes("Foreign key constraint")) {
                alert("No se puede eliminar esta cuenta porque está siendo utilizada en otros registros.");
            } else {
                alert("Error al eliminar la cuenta.");
            }
        }

    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Libro Diario</h2>
            {error && <div className="text-red-600">{error}</div>}
            {message && <div className="text-green-600">{message}</div>}

            <div className="space-y-6">
                {items.length > 0 && items.map(entry => (
                    <div key={entry.id} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between mb-2">
                            <div>
                                <div className="font-semibold">
                                    {new Date(entry.date).toLocaleDateString()} — {entry.memo}
                                </div>
                                {entry.reference && <div className="text-sm text-gray-500">Ref: {entry.reference}</div>}
                            </div>
                            <button
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded flex items-center gap-1.5 h-fit"
                                onClick={() => deleteJournal(entry.id)}>
                                <Trash2Icon size={16} />Eliminar
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Cuenta</th>
                                        <th className="p-2 text-right">Débito</th>
                                        <th className="p-2 text-right">Crédito</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entry.lines.map(line => (
                                        <tr key={line.id} className="border-t">
                                            <td className="p-2">
                                                {line.account.code} — {line.account.name}
                                            </td>
                                            <td className="p-2 text-right">
                                                {Number(line.debit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-2 text-right">
                                                {Number(line.credit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div>No hay registros contables.</div>}
            </div>
        </div>
    );
}
