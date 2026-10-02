import { getClient } from "@/lib/db-turso";
import { isInstagramOAuthConfigured, readInviteToken } from "@/lib/instagram-oauth";
import Link from "next/link";

// Página pública del enlace de invitación: la abre el cliente (sin cuenta
// en Nexalya) para conectar su Instagram con un solo botón.
export const dynamic = "force-dynamic";

export default async function ConnectInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const parsed = isInstagramOAuthConfigured() ? readInviteToken(token) : null;
  const client = parsed ? await getClient(parsed.clientId) : null;

  if (!client) {
    return (
      <div className="max-w-md mx-auto card p-6 text-center space-y-2 mt-6">
        <h1 className="text-lg font-semibold">Este enlace ya no es válido</h1>
        <p className="text-sm text-slate-500">Puede que haya caducado. Pide a tu agencia que te envíe uno nuevo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto card p-6 space-y-5 mt-6">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold">Conecta el Instagram de {client.name}</h1>
        <p className="text-sm text-slate-600">
          Tu agencia usa Nexalya para analizar los resultados de tus redes. Al conectar tu cuenta podremos ver tus
          métricas (alcance, interacciones, seguidores) sin que tengas que enviarnos capturas.
        </p>
      </div>

      <ul className="text-sm text-slate-600 space-y-1.5">
        <li className="flex gap-2"><span aria-hidden className="text-emerald-600">✓</span> Solo lectura: no publicamos nada ni cambiamos tu cuenta.</li>
        <li className="flex gap-2"><span aria-hidden className="text-emerald-600">✓</span> No vemos tu contraseña: inicias sesión en la propia web de Instagram.</li>
        <li className="flex gap-2"><span aria-hidden className="text-emerald-600">✓</span> Puedes quitar el acceso cuando quieras desde los ajustes de Instagram.</li>
      </ul>

      <a href={`/api/instagram/oauth/start?invite=${encodeURIComponent(token)}`} className="btn-primary w-full justify-center py-3 text-base">
        Conectar con Instagram
      </a>

      <p className="text-xs text-slate-400">
        Necesitas una cuenta profesional (de empresa o creador). Si la tuya es personal, se cambia gratis en Instagram:
        Configuración → Tipo de cuenta y herramientas → Cambiar a cuenta profesional. Más información en la{" "}
        <Link href="/privacidad" className="underline hover:text-slate-600">política de privacidad</Link>.
      </p>
    </div>
  );
}
