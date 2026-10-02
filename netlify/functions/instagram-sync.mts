// Función programada de Netlify: cada hora llama a la ruta de la app que
// sincroniza Instagram (ver app/api/cron/instagram-sync/route.ts). Se hace
// así, con una llamada HTTP, para que toda la lógica viva dentro de la app
// de Next.js y se pueda lanzar igual a mano o desde otro programador.
// Requiere la variable de entorno CRON_SECRET en Netlify (la misma que
// comprueba la ruta). URL la pone Netlify sola con la dirección del sitio.
export default async () => {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    console.error("instagram-sync: faltan URL o CRON_SECRET");
    return;
  }
  const res = await fetch(`${base}/api/cron/instagram-sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
  console.log("instagram-sync", res.status, (await res.text()).slice(0, 2000));
};

export const config = {
  schedule: "@hourly",
};
