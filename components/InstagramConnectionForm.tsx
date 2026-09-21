"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Conexión con la Instagram Graph API por cliente. El access token NUNCA
// se manda al cliente (ni se vuelve a mostrar una vez guardado) — solo
// sabemos si hay uno guardado o no (hasAccessToken). El ID de cuenta de
// Instagram (igUserId) sí es seguro de mostrar, no es un secreto.
export default function InstagramConnectionForm({
  clientId,
  hasAccessToken,
  igUserId,
}: {
  clientId: string;
  hasAccessToken: boolean;
  igUserId: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [igUserIdInput, setIgUserIdInput] = useState(igUserId || "");
  const [tokenInput, setTokenInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<
    { ok: true; username: string } | { ok: false; error: string } | null
  >(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!igUserIdInput.trim()) {
      setError("Falta el ID de cuenta de Instagram.");
      return;
    }
    if (!hasAccessToken && !tokenInput.trim()) {
      setError("Falta el access token.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const body: { igUserId: string; accessToken?: string } = { igUserId: igUserIdInput.trim() };
      // Si ya había un token guardado y no se escribe uno nuevo, no lo
      // tocamos (se omite del body en vez de mandar vacío, que lo borraría).
      if (tokenInput.trim()) body.accessToken = tokenInput.trim();

      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("No se pudo guardar la conexión.");
      setTokenInput("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Comprobación de solo lectura: pide el username de la cuenta a la API
  // real de Instagram usando el token guardado. No publica ni cambia nada,
  // solo confirma que el token + ID funcionan de verdad.
  async function handleVerify() {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/verify-instagram`);
      const data = await res.json();
      if (data.ok) {
        setVerifyResult({ ok: true, username: data.username });
      } else {
        setVerifyResult({ ok: false, error: data.error ?? "No se pudo verificar la conexión." });
      }
    } catch (err) {
      setVerifyResult({ ok: false, error: (err as Error).message });
    } finally {
      setVerifying(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm("¿Desconectar Instagram? La publicación volverá a modo simulado para este cliente.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: null, igUserId: null }),
      });
      if (!res.ok) throw new Error("No se pudo desconectar.");
      setIgUserIdInput("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const connected = hasAccessToken && !!igUserId;

  if (!open) {
    return connected ? (
      <div className="card p-3 text-sm bg-emerald-50 border-emerald-200 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-emerald-700">
            ✓ Instagram conectado <span className="text-emerald-600/70">(cuenta {igUserId})</span> — la publicación
            usa la API real.
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? "Probando…" : "Probar conexión"}
            </button>
            <button className="btn-secondary text-xs" onClick={() => setOpen(true)}>
              Editar conexión
            </button>
          </div>
        </div>
        {verifyResult && (
          <p className={`text-xs ${verifyResult.ok ? "text-emerald-700" : "text-red-600"}`}>
            {verifyResult.ok
              ? `✓ Token válido — la API confirma la cuenta @${verifyResult.username}.`
              : `✗ ${verifyResult.error}`}
          </p>
        )}
      </div>
    ) : (
      <div className="card p-4 text-sm text-slate-600 bg-amber-50 border-amber-200 flex flex-wrap items-center justify-between gap-3">
        <span>
          Este cliente todavía no tiene Instagram conectado, así que la publicación funciona en modo
          simulado (los posts se marcan como publicados pero no salen a Instagram real).
        </span>
        <button className="btn-primary text-xs flex-shrink-0" onClick={() => setOpen(true)}>
          Conectar Instagram
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="card p-4 space-y-3 max-w-lg">
      <p className="text-xs text-slate-500">
        Se consiguen desde Meta Business Suite tras vincular la cuenta de Instagram Business a vuestra
        Página de Facebook (ver README, sección &quot;Cómo conectar Instagram/Facebook de verdad&quot;).
      </p>
      <div>
        <label className="label">ID de cuenta de Instagram Business</label>
        <input
          className="input"
          value={igUserIdInput}
          onChange={(e) => setIgUserIdInput(e.target.value)}
          placeholder="17841400123456789"
        />
        <p className="text-xs text-slate-400 mt-1">El ID numérico, no el @usuario.</p>
      </div>
      <div>
        <label className="label">Access token{hasAccessToken ? " (déjalo en blanco para no cambiarlo)" : ""}</label>
        <input
          type="password"
          className="input"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder={hasAccessToken ? "•••••••• (ya configurado)" : "EAAG..."}
          autoComplete="off"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando…" : "Guardar conexión"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancelar
        </button>
        {connected && (
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={loading}
            className="text-xs text-red-600 hover:underline ml-auto"
          >
            Desconectar
          </button>
        )}
      </div>
    </form>
  );
}
