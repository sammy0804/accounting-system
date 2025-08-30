import { useState } from "react";
import { http } from "../../lib/http";

export default function NewAccount() {
  const [form, setForm] = useState({ code: "", name: "", nature: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setError(null);
    try {
      const result = await http.post("/accounts", form);
      setMsg("Cuenta creada ✔");
      setForm({ code: "", name: "", nature: "" });
    } catch (err: any) {
      setError(err.message || "Error al crear cuenta");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md bg-white p-6 rounded-lg border border-black">
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
        <label className="block text-sm text-black">Naturaleza</label>
        <input type="text" className="border border-black rounded-lg px-3 py-2 w-full bg-white text-black" value={form.nature} onChange={e => setForm({ ...form, nature: e.target.value })} required />
      </div>
      <button type="submit" className="btn mt-4 p-2 border rounded-2xl bg-black font-bold">Crear cuenta</button>
    </form>
  );
}
