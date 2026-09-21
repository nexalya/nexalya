"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  url,
  confirmText,
  redirectTo,
}: {
  url: string;
  confirmText: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-xs text-red-600 hover:text-red-800">
      {loading ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
