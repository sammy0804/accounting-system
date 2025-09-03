import { useEffect, useState } from "react";
import { Journal } from "../../services/journal";
import type { JournalEntry } from "../../types/types";

export default function JournalEntriesList() {
    const [items, setItems] = useState<JournalEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Journal.list().then(setItems).catch(e => setError(String(e)));
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Libro Diario</h2>
            {error && <div className="text-red-600">{error}</div>}

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
            </div>
        </div>
    );
}
