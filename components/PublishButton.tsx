"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublishButton({ contentId }: { contentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${contentId}/publish`, { method: "POST" });
      if (!res.ok) throw new Error("No se pudo publicar.");
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handlePublish} disabled={loading} className="btn-secondary text-xs px-3 py-1.5">
      {loading ? "Publicando…" : "Publicar ahora"}
    </button>
  );
}
