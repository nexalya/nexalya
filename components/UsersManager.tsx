"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso)
  );
}

export default function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: PublicUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ email: string; tempPassword: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la cuenta.");
      setUsers((prev) => [...prev, data.user]);
      setCreated({ email: data.user.email, tempPassword: data.tempPassword });
      setForm({ name: "", email: "" });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta cuenta? Dejará de poder acceder.")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      {created && (
        <div className="text-sm bg-accent-50 border border-accent-200 rounded-md px-4 py-3 space-y-1">
          <p className="font-medium text-brand-800">
            Cuenta creada para {created.email}. Pásale esta contraseña temporal (solo se muestra una vez):
          </p>
          <p className="font-mono text-sm bg-white border border-slate-200 rounded px-2 py-1 inline-block">
            {created.tempPassword}
          </p>
          <button
            className="block text-xs text-slate-500 hover:text-slate-700 mt-1"
            onClick={() => setCreated(null)}
          >
            Ocultar
          </button>
        </div>
      )}

      <div className="card divide-y divide-slate-100">
        {users.map((u) => (
          <div key={u.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">
                {u.name}
                {u.id === currentUserId && <span className="text-xs text-slate-400 ml-2">(tú)</span>}
              </p>
              <p className="text-xs text-slate-500">{u.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Desde {formatDate(u.createdAt)}</span>
              {u.id !== currentUserId && (
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-brand-600 text-white text-sm font-medium px-4 py-2 hover:bg-brand-700"
        >
          + Añadir persona
        </button>
      ) : (
        <form onSubmit={handleCreate} className="card p-4 space-y-3 max-w-sm">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-brand-600 text-white text-sm font-medium px-4 py-2 hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Creando…" : "Crear cuenta"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-500 hover:text-slate-700 px-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
