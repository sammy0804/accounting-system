import { useEffect, useState } from "react";
import { Accounts } from "../../services/accounts";
import type { Account } from "../../types/types";


export default function AccountsList() {
    const [items, setItems] = useState<Account[]>([]);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        Accounts.list().then(setItems).catch(e => setError(String(e)));
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Cuentas contables</h2>
            {error && <div className="text-red-600">{error}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-2">Código</th>
                            <th className="text-left p-2">Nombre</th>
                            <th className="text-left p-2">Naturaleza</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(a => (
                            <tr key={a.id} className="border-t">
                                <td className="p-2 font-mono">{a.code}</td>
                                <td className="p-2">{a.name}</td>
                                <td className="p-2">{a.nature}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}