"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GeneratePlanButton({ clientId, label }: { clientId: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/plan`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar el plan.");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading} className="btn-primary">
        {loading ? "Investigando tendencias y escribiendo el plan… (puede tardar 1-2 min)" : label || "Generar / actualizar plan"}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 max-w-xl whitespace-pre-wrap">
          {error}
        </div>
      )}
    </div>
  );
}
