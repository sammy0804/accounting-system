import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LucideChevronLeft } from "lucide-react";
import { Accounts } from "../../services/accounts";
import type { Account, nature } from "../../types/types";

export default function NewAccount() {
  const nav = useNavigate();

  const [form, setForm] = useState<Partial<Account>>({ code: "", name: "", nature: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true); setError(null);
      await Accounts.create(form);
      setMsg("Cuenta creada ✔");
      nav("/accounts");
    } catch (e: unknown) { setError((e as Error).message); } finally { setSaving(false); }
  }

  return (
    <div>
      <NavLink to="/accounts" className="flex gap-1.5 mb-4"><LucideChevronLeft />Volver</NavLink>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md p-6 rounded-lg border border-black">
        <h2 className="text-2xl font-bold text-black mb-2">Nueva cuenta</h2>
        {msg && <div className="text-green-700">{msg}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block text-sm text-black">Código</label>
          <input type="text" className="border border-black rounded-lg px-3 py-2 w-full bg-white text-black" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm text-black">Nombre</label>
          <input type="text" className="border border-black rounded-lg px-3 py-2 w-full bg-white text-black" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm text-black">Tipo de cuenta</label>
          <select
            className="border border-black rounded-lg px-3 py-2 w-full bg-white text-black"
            value={form.nature}
            onChange={e => setForm({ ...form, nature: e.target.value as nature })}
            required
          >
            <option value="">— Seleccionar —</option>
            <option value="DEBIT">Débito</option>
            <option value="CREDIT">Crédito</option>
          </select>
        </div>
        <button disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
