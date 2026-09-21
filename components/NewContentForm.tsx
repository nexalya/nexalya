"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLATFORMS, PLATFORM_LABELS, MEDIA_TYPES } from "@/lib/types";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewContentForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    caption: "",
    platform: "INSTAGRAM",
    mediaType: "IMAGE",
    scheduledAt: "",
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setMediaPreview(dataUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mediaPreview) {
      alert("Sube una imagen o vídeo para el contenido.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientId, mediaUrl: mediaPreview }),
      });
      if (!res.ok) throw new Error("No se pudo programar el contenido.");
      setForm({ title: "", caption: "", platform: "INSTAGRAM", mediaType: "IMAGE", scheduledAt: "" });
      setMediaPreview("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + Programar contenido
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-3 max-w-lg">
      <div>
        <label className="label">Título interno</label>
        <input
          className="input"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Reel promoción de otoño"
        />
      </div>
      <div>
        <label className="label">Caption / copy</label>
        <textarea
          className="input"
          required
          rows={3}
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          placeholder="Texto que acompaña la publicación…"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Plataforma</label>
          <select
            className="input"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tipo</label>
          <select
            className="input"
            value={form.mediaType}
            onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
          >
            {MEDIA_TYPES.map((m) => (
              <option key={m} value={m}>
                {m === "IMAGE" ? "Imagen" : "Vídeo"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Fecha y hora de publicación</label>
        <input
          type="datetime-local"
          className="input"
          required
          value={form.scheduledAt}
          onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Archivo (imagen o vídeo ya creado por el equipo)</label>
        <input type="file" accept="image/*,video/*" onChange={handleFile} className="input" />
        {mediaPreview && form.mediaType === "IMAGE" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaPreview} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Programando…" : "Programar"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
