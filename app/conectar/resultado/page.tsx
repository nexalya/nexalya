// Mensaje final para el cliente después de conectar (o no) su Instagram
// desde el enlace de invitación.
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  cancelado: "Has cancelado la conexión en Instagram. Si fue sin querer, vuelve a abrir el enlace.",
  caducado: "La conexión ha tardado demasiado. Vuelve a abrir el enlace e inténtalo de nuevo.",
  enlace: "Este enlace ya no es válido o ha caducado. Pide a tu agencia uno nuevo.",
  instagram:
    "Instagram no ha permitido la conexión. Comprueba que la cuenta es profesional (de empresa o creador) e inténtalo otra vez.",
};

export default async function ConnectResultPage({ searchParams }: { searchParams: Promise<{ ok?: string; u?: string; error?: string }> }) {
  const sp = await searchParams;
  const ok = sp.ok === "1";
  return (
    <div className="max-w-md mx-auto card p-6 text-center space-y-2 mt-6">
      <div className="text-3xl" aria-hidden>{ok ? "✓" : "!"}</div>
      <h1 className="text-lg font-semibold">{ok ? "¡Instagram conectado!" : "No se ha podido conectar"}</h1>
      <p className="text-sm text-slate-500">
        {ok
          ? `${sp.u ? `La cuenta @${sp.u} ya está conectada. ` : ""}Ya puedes cerrar esta página: tu agencia verá tus métricas actualizadas automáticamente.`
          : ERRORS[sp.error ?? ""] ?? "Ha ocurrido un error. Inténtalo de nuevo o avisa a tu agencia."}
      </p>
    </div>
  );
}
