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
  oauthEnabled = false,
  oauthError = null,
  igHandle = null,
  profilePictureUrl = null,
}: {
  clientId: string;
  hasAccessToken: boolean;
  igUserId: string | null;
  // @usuario y foto de perfil: se muestran junto al chip, con enlace al
  // perfil de Instagram, como en Metricool. Con Instagram conectado los
  // pone al día la sincronización; sin conexión vale el @usuario de la
  // ficha (sin foto: sin token no se puede pedir).
  igHandle?: string | null;
  profilePictureUrl?: string | null;
  // true cuando hay INSTAGRAM_APP_ID/SECRET configurados (ver
  // lib/instagram-oauth.ts): entonces se puede conectar con un clic o
  // mandarle al cliente un enlace, en vez de pegar el token a mano.
  oauthEnabled?: boolean;
  // Motivo si una conexión con un clic acaba de fallar (?instagram=error).
  oauthError?: string | null;
}) {
  const router = useRouter();
  // Colapsado por defecto: en vez de mostrar la barra de conexión siempre
  // visible, se esconde detrás de un chip pequeño y solo se despliega al
  // pulsarlo.
  const [sectionOpen, setSectionOpen] = useState(!!oauthError);
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [copied, setCopied] = useState(false);
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
        router.refresh();
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

  async function handleInvite() {
    setInviteLoading(true);
    setInviteError("");
    setCopied(false);
    try {
      const res = await fetch(`/api/clients/${clientId}/instagram-invite`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear el enlace.");
      setInviteUrl(data.url);
      try {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
      } catch {
        // Sin permiso de portapapeles: el enlace queda visible para copiarlo a mano.
      }
    } catch (err) {
      setInviteError((err as Error).message);
    } finally {
      setInviteLoading(false);
    }
  }

  const connected = hasAccessToken && !!igUserId;

  // Conectar con un clic / enlace para el cliente. Si la app de Meta aún
  // no está configurada, se ve desactivado para que se sepa que existe.
  const oneClick = (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {oauthEnabled ? (
          <a href={`/api/instagram/oauth/start?clientId=${clientId}`} className="btn-primary text-xs">
            {connected ? "Reconectar con Instagram" : "Conectar con Instagram"}
          </a>
        ) : (
          <button type="button" className="btn-primary text-xs opacity-50 cursor-not-allowed" disabled>
            Conectar con Instagram
          </button>
        )}
        <button
          type="button"
          className="btn-secondary text-xs"
          onClick={handleInvite}
          disabled={!oauthEnabled || inviteLoading}
          title="Enlace para que el cliente conecte su Instagram desde el móvil, sin cuenta en Nexalya"
        >
          {inviteLoading ? "…" : "Enlace para el cliente"}
        </button>
      </div>
      {!oauthEnabled && (
        <p className="text-[11px] text-slate-400">
          Disponible cuando la app de Meta esté publicada (falta configurar INSTAGRAM_APP_ID e INSTAGRAM_APP_SECRET).
        </p>
      )}
      {inviteUrl && (
        <div className="text-xs space-y-1">
          <input readOnly value={inviteUrl} className="input text-xs py-1.5" onFocus={(e) => e.currentTarget.select()} />
          <p className="text-slate-500">
            {copied ? "✓ Copiado. " : ""}Mándaselo al cliente por WhatsApp o email: caduca en 14 días.
          </p>
        </div>
      )}
      {inviteError && <p className="text-xs text-red-600">{inviteError}</p>}
      {oauthError && (
        <p className="text-xs text-red-600">
          No se pudo conectar ({oauthError}). Comprueba que la cuenta es profesional y que está añadida como tester mientras
          la app de Meta esté en modo desarrollo.
        </p>
      )}
    </div>
  );

  const inner = !open ? (
    connected ? (
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
        {oauthError && oneClick}
        {verifyResult && (
          <p className={`text-xs ${verifyResult.ok ? "text-emerald-700" : "text-red-600"}`}>
            {verifyResult.ok
              ? `✓ Token válido — la API confirma la cuenta @${verifyResult.username}.`
              : `✗ ${verifyResult.error}`}
          </p>
        )}
      </div>
    ) : (
      <div className="card p-4 text-sm text-slate-600 bg-amber-50 border-amber-200 space-y-3">
        <p>
          Este cliente todavía no tiene Instagram conectado: sin conexión no hay métricas automáticas y la publicación
          funciona en modo simulado.
        </p>
        {oneClick}
        <button className="text-xs text-slate-500 underline hover:text-slate-700" onClick={() => setOpen(true)}>
          Conexión manual con token (avanzado)
        </button>
      </div>
    )
  ) : (
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

  const username = igHandle?.replace(/^@/, "").trim() || null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => setSectionOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          connected
            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${connected ? "bg-emerald-500" : "bg-amber-500"}`} />
        {connected ? "Instagram conectado" : "Instagram no conectado"}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-shrink-0 transition-transform ${sectionOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {username && <InstagramProfileLink username={username} pictureUrl={connected ? profilePictureUrl : null} />}
      </div>

      {sectionOpen && <div className="mt-2">{inner}</div>}
    </div>
  );
}

// Foto de perfil con el logo de Instagram encima y el @usuario, enlazando
// al perfil público de la cuenta.
function InstagramProfileLink({ username, pictureUrl }: { username: string; pictureUrl: string | null }) {
  const [broken, setBroken] = useState(false);
  return (
    <a
      href={`https://www.instagram.com/${encodeURIComponent(username)}/`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 group"
      title="Abrir el perfil en Instagram"
    >
      <span className="relative flex-shrink-0">
        {pictureUrl && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pictureUrl}
            alt=""
            onError={() => setBroken(true)}
            className="h-7 w-7 rounded-full object-cover border border-slate-200 bg-white"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-medium text-slate-500 border border-slate-200">
            {username.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="absolute -bottom-1 -right-1 rounded-[5px] bg-white p-[1px]">
          <InstagramGlyph />
        </span>
      </span>
      <span className="group-hover:underline">{username}</span>
    </a>
  );
}

function InstagramGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.3" stopColor="#FA7E1E" />
          <stop offset="0.6" stopColor="#D62976" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#ig-grad)" strokeWidth="2.4" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#ig-grad)" strokeWidth="2.4" />
      <circle cx="17.6" cy="6.4" r="1.4" fill="#D62976" />
    </svg>
  );
}
