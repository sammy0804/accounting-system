import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { LucideChevronLeft } from "lucide-react";
import { Accounts } from "../../services/accounts";
import type { Account, nature } from "../../types/types";

export default function NewAccount() {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Partial<Account>>({ code: "", name: "", nature: "", isActive: true });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar la cuenta si es edición
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const acc = await Accounts.get(id);
        setForm({
          code: acc.code,
          name: acc.name,
          nature: acc.nature,
          isActive: acc.isActive,
        });
      } catch (e: unknown) {
        setError((e as Error).message || "Error al cargar la cuenta");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true); setError(null); setMsg(null);

      if (!form.code || !form.name || !form.nature) {
        throw new Error("Código, nombre y tipo de cuenta son requeridos");
      }

      if (isEdit && id) {
        await Accounts.update(id, {
          code: form.code,
          name: form.name,
          nature: form.nature as "DEBIT" | "CREDIT",
          isActive: form.isActive ?? true,
        });
        setMsg("Cuenta actualizada ✔");
      } else {
        await Accounts.create({
          code: form.code,
          name: form.name,
          nature: form.nature as "DEBIT" | "CREDIT",
          isActive: form.isActive ?? true,
        });
        setMsg("Cuenta creada ✔");
      }

      // navega después de un pequeño feedback
      setTimeout(() => nav("/accounts"), 600);
    } catch (e: unknown) {
      const msg =
        typeof (e as Error)?.message === "string" ? (e as Error).message :
          String(e) || "Error al guardar";
      setError(
        msg.includes("Unique") ? "El código ya existe" : msg
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Cargando…</div>;

  const title = isEdit ? "Editar cuenta" : "Nueva cuenta";
  const submitText = saving ? "Guardando…" : (isEdit ? "Guardar cambios" : "Guardar");

  return (
    <div>
      <NavLink to="/accounts" className="flex gap-1.5 mb-4"><LucideChevronLeft />Volver</NavLink>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md p-6 rounded-lg border border-black">
        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
        {msg && <div className="text-green-700">{msg}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block text-sm text-black">Código</label>
          <input
            type="text"
            className="border border-black rounded-lg px-3 py-2 w-full bg-white text-black"
            value={form.code ?? ""}
            onChange={e => setForm({ ...form, code: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-black">Nombre</label>
          <input
            type="text"
            className="border border-black rounded-lg px-3 py-2 w-full bg-white text-black"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
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
        <div className="flex items-center gap-2">
          <label className="text-sm text-black">Cuenta activa</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!!form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transform transition-transform"></div>
          </label>
        </div>
        <button disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
          {submitText}
        </button>
      </form>
    </div>
  );
}
