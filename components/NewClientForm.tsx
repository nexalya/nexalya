"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandAnalyzeButton, { type BrandAnalysisResult, type ContentPillarResult } from "@/components/BrandAnalyzeButton";
import ContentPillarsEditor from "@/components/ContentPillarsEditor";

const EMPTY_FORM = {
  name: "",
  sector: "",
  igHandle: "",
  website: "",
  targetAudience: "",
  competitors: "",
  toneOfVoice: "",
  avoidTopics: "",
  visualIdentity: "",
  contentPillars: [] as ContentPillarResult[],
};

export default function NewClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  function applyAnalysis(a: BrandAnalysisResult) {
    setForm((f) => ({
      ...f,
      targetAudience: a.targetAudience || f.targetAudience,
      competitors: a.competitors || f.competitors,
      toneOfVoice: a.toneOfVoice || f.toneOfVoice,
      avoidTopics: a.avoidTopics || f.avoidTopics,
      visualIdentity: a.visualIdentity || f.visualIdentity,
      contentPillars: a.contentPillars?.length ? a.contentPillars : f.contentPillars,
    }));
    setAnalysisSummary(a.summary);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanPillars = form.contentPillars.filter((p) => p.name.trim());
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          contentPillars: cleanPillars.length ? JSON.stringify(cleanPillars) : null,
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear el cliente.");
      setForm(EMPTY_FORM);
      setAnalysisSummary("");
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
        + Nuevo cliente
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-4 max-w-xl">
      <div className="space-y-3">
        <div>
          <label className="label">Nombre del cliente</label>
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Clínica Dental Sonrisa"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Sector</label>
            <input
              className="input"
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
              placeholder="Clínica estética, retail, hostelería…"
            />
          </div>
          <div>
            <label className="label">@usuario de Instagram</label>
            <input
              className="input"
              value={form.igHandle}
              onChange={(e) => setForm({ ...form, igHandle: e.target.value })}
              placeholder="@clinicasonrisa"
            />
          </div>
        </div>
        <div>
          <label className="label">Web (opcional)</label>
          <input
            className="input"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://clinicasonrisa.com"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <p className="text-xs text-slate-500">
          Si ya tiene Instagram o web, Claude puede analizarlos y proponer un borrador para
          los campos de abajo — revísalo y ajusta lo que haga falta antes de guardar.
        </p>
        <BrandAnalyzeButton
          name={form.name}
          sector={form.sector}
          igHandle={form.igHandle}
          website={form.website}
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
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
            placeholder="Quién los sigue o a quién queremos llegar: edad, intereses, qué necesidad cubrimos…"
          />
        </div>
        <div>
          <label className="label">Competencia / referencias</label>
          <textarea
            className="input"
            rows={2}
            value={form.competitors}
            onChange={(e) => setForm({ ...form, competitors: e.target.value })}
            placeholder="Cuentas o marcas de referencia en el sector…"
          />
        </div>
        <div>
          <label className="label">Tono de voz</label>
          <textarea
            className="input"
            rows={2}
            value={form.toneOfVoice}
            onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
            placeholder="Cercano y experto, con humor, formal, tuteo o usted…"
          />
        </div>
        <div>
          <label className="label">Qué evitar / límites no negociables</label>
          <textarea
            className="input"
            rows={2}
            value={form.avoidTopics}
            onChange={(e) => setForm({ ...form, avoidTopics: e.target.value })}
            placeholder="Reclamos sin evidencia, menores, mencionar competidores por nombre, normativa del sector…"
          />
        </div>
        <div>
          <label className="label">Identidad visual</label>
          <textarea
            className="input"
            rows={2}
            value={form.visualIdentity}
            onChange={(e) => setForm({ ...form, visualIdentity: e.target.value })}
            placeholder="Colores, estética, qué NO usar visualmente…"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div>
          <label className="label">Universo de marca (series de contenido recurrentes)</label>
          <p className="text-xs text-slate-500 mb-1.5">
            Líneas fijas con nombre propio y su % de la mezcla de contenido, para que el plan no
            improvise líneas editoriales distintas cada vez que se genera.
          </p>
        </div>
        <ContentPillarsEditor
          pillars={form.contentPillars}
          onChange={(contentPillars) => setForm({ ...form, contentPillars })}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando…" : "Guardar cliente"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setForm(EMPTY_FORM);
            setAnalysisSummary("");
            setOpen(false);
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
