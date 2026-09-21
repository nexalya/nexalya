"use client";

import { useState } from "react";

export type ContentPillarResult = {
  name: string;
  description: string;
  mixPercent: number;
};

export type BrandAnalysisResult = {
  summary: string;
  targetAudience: string;
  competitors: string;
  avoidTopics: string;
  toneOfVoice: string;
  visualIdentity: string;
  contentPillars: ContentPillarResult[];
};

// Botón reutilizable: le pasas los datos que ya hay en el formulario
// (nombre, sector, Instagram, web) y, si hay algo público que analizar,
// Claude propone un borrador para el resto de campos del brief. Se usa
// tanto al crear un cliente nuevo como para "re-analizar" uno existente.
export default function BrandAnalyzeButton({
  name,
  sector,
  igHandle,
  website,
  onResult,
}: {
  name: string;
  sector: string;
  igHandle: string;
  website: string;
  onResult: (analysis: BrandAnalysisResult) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    if (!igHandle.trim() && !website.trim()) {
      setError("Añade el @ de Instagram o la web para poder analizarla.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/clients/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sector, igHandle, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo analizar la marca.");
      onResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading} className="btn-secondary text-xs">
        {loading ? "Analizando…" : "✨ Analizar con IA (rellena el resto a partir de Instagram/web)"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
