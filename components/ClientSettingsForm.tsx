"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandAnalyzeButton, { type BrandAnalysisResult, type ContentPillarResult } from "@/components/BrandAnalyzeButton";
import ContentPillarsEditor from "@/components/ContentPillarsEditor";

function parsePillars(raw: string): ContentPillarResult[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ClientSettingsForm({
  clientId,
  initialName,
  initialSector,
  initialIgHandle,
  initialWebsite,
  initialBrief,
  initialPeriodDays,
  initialTargetAudience,
  initialCompetitors,
  initialToneOfVoice,
  initialAvoidTopics,
  initialVisualIdentity,
  initialContentPillars,
}: {
  clientId: string;
  initialName: string;
  initialSector: string;
  initialIgHandle: string;
  initialWebsite: string;
  initialBrief: string;
  initialPeriodDays: number;
  initialTargetAudience: string;
  initialCompetitors: string;
  initialToneOfVoice: string;
  initialAvoidTopics: string;
  initialVisualIdentity: string;
  initialContentPillars: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [website, setWebsite] = useState(initialWebsite);
  const [brandBrief, setBrandBrief] = useState(initialBrief);
  const [planPeriodDays, setPlanPeriodDays] = useState(initialPeriodDays);
  const [targetAudience, setTargetAudience] = useState(initialTargetAudience);
  const [competitors, setCompetitors] = useState(initialCompetitors);
  const [toneOfVoice, setToneOfVoice] = useState(initialToneOfVoice);
  const [avoidTopics, setAvoidTopics] = useState(initialAvoidTopics);
  const [visualIdentity, setVisualIdentity] = useState(initialVisualIdentity);
  const [contentPillars, setContentPillars] = useState<ContentPillarResult[]>(() =>
    parsePillars(initialContentPillars)
  );

  function applyAnalysis(a: BrandAnalysisResult) {
    setTargetAudience(a.targetAudience || targetAudience);
    setCompetitors(a.competitors || competitors);
    setToneOfVoice(a.toneOfVoice || toneOfVoice);
    setAvoidTopics(a.avoidTopics || avoidTopics);
    setVisualIdentity(a.visualIdentity || visualIdentity);
    if (a.contentPillars?.length) setContentPillars(a.contentPillars);
    setAnalysisSummary(a.summary);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanPillars = contentPillars.filter((p) => p.name.trim());
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website,
          brandBrief,
          planPeriodDays,
          targetAudience,
          competitors,
          toneOfVoice,
          avoidTopics,
          visualIdentity,
          contentPillars: cleanPillars.length ? JSON.stringify(cleanPillars) : null,
        }),
      });
      if (!res.ok) throw new Error("No se pudo guardar.");
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
      <button className="btn-secondary text-xs" onClick={() => setOpen(true)}>
        Editar brief de marca y frecuencia
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-4 max-w-xl">
      <div>
        <label className="label">Web (opcional)</label>
        <input
          className="input"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://clinicasonrisa.com"
        />
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <BrandAnalyzeButton
          name={initialName}
          sector={initialSector}
          igHandle={initialIgHandle}
          website={website}
          onResult={applyAnalysis}
        />
        {analysisSummary && (
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
            {analysisSummary}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="label">Público objetivo</label>
          <textarea
            className="input"
            rows={2}
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Competencia / referencias</label>
          <textarea
            className="input"
            rows={2}
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Tono de voz</label>
          <textarea
            className="input"
            rows={2}
            value={toneOfVoice}
            onChange={(e) => setToneOfVoice(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Qué evitar / límites no negociables</label>
          <textarea
            className="input"
            rows={2}
            value={avoidTopics}
            onChange={(e) => setAvoidTopics(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Identidad visual</label>
          <textarea
            className="input"
            rows={2}
            value={visualIdentity}
            onChange={(e) => setVisualIdentity(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Notas adicionales del brief</label>
          <textarea
            className="input"
            rows={3}
            value={brandBrief}
            onChange={(e) => setBrandBrief(e.target.value)}
            placeholder="Cualquier cosa que no encaje arriba…"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div>
          <label className="label">Universo de marca (series de contenido recurrentes)</label>
          <p className="text-xs text-slate-500 mb-1.5">
            Líneas fijas con nombre propio y su % de la mezcla de contenido — el generador de
            plan las respeta entre lotes en vez de improvisar líneas nuevas cada vez.
          </p>
        </div>
        <ContentPillarsEditor pillars={contentPillars} onChange={setContentPillars} />
      </div>

      <div>
        <label className="label">Actualizar el plan cada</label>
        <select
          className="input"
          value={planPeriodDays}
          onChange={(e) => setPlanPeriodDays(Number(e.target.value))}
        >
          <option value={15}>15 días</option>
          <option value={30}>30 días</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
