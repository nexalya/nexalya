import Link from "next/link";
import { redirect } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const serif = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"] });

const FEATURES = [
  {
    title: "Calendario de contenido",
    description:
      "Todas las publicaciones de cada cliente en un único calendario visual, con estados de borrador, programado, publicado y fallido.",
  },
  {
    title: "Planes generados con IA",
    description:
      "Lotes de ideas y publicaciones a partir del histórico de cada cliente, listos para revisar y ajustar antes de programarlos.",
  },
  {
    title: "Publicación en Instagram",
    description:
      "Conecta la cuenta de Instagram de cada cliente y publica directamente desde Nexalya, sin salir de la herramienta.",
  },
  {
    title: "Métricas de seguidores",
    description:
      "La evolución de seguidores de cada cliente a lo largo del tiempo, con capturas periódicas automáticas.",
  },
  {
    title: "Multi-cliente",
    description:
      "Pensado para agencias: cada cliente tiene su propio espacio, calendario, banco de ideas y métricas independientes.",
  },
  {
    title: "Acceso en equipo",
    description:
      "Todo el equipo trabaja sobre la misma base de datos en la nube, desde cualquier dispositivo.",
  },
];

const TRUSTED_LOGOS = [
  { src: "/logos/tania-pastor.png", alt: "Tania Pastor" },
  { src: "/logos/masa-international.png", alt: "MASA International" },
  { src: "/logos/superplus.png", alt: "Superplus" },
  { src: "/logos/vertigo-marketing.png", alt: "Vértigo Marketing" },
  { src: "/logos/tulaser-clinic.png", alt: "Tulaser Clinic" },
  { src: "/logos/kisslaser.png", alt: "Kisslaser" },
  { src: "/logos/capelino-spritz.png", alt: "Capelino Spritz" },
  { src: "/logos/innovapro.png", alt: "Innovapro" },
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-center px-6 sm:px-12 py-16 sm:py-24">
        <div className="absolute inset-0 bg-stars opacity-40" aria-hidden="true" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-accent-400 font-medium">
            Nexalya · Calendario de contenido con IA
          </p>
          <h1
            className={`${serif.className} mt-5 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl text-white leading-tight`}
          >
            Planifica y publica el contenido{" "}
            <span className="italic text-accent-400">de todos tus clientes</span>{" "}
            desde un solo sitio.
          </h1>
          <p className="mt-5 sm:mt-6 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Nexalya centraliza el calendario, la generación de ideas con IA y la publicación en
            Instagram de cada cliente de tu agencia.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-accent-500 text-brand-900 font-semibold hover:bg-accent-400 text-sm sm:text-base"
            >
              Iniciar sesión
            </Link>
            <a
              href="mailto:infosemdesign@gmail.com"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/25 text-white font-medium hover:border-white/50 text-sm sm:text-base"
            >
              Contacto
            </a>
          </div>
        </div>
      </section>

      {/* Qué es Nexalya */}
      <section className="mt-16 sm:mt-24 px-1 sm:px-2 text-center">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-500 font-medium">
          Qué es
        </p>
        <h2 className={`${serif.className} mt-3 text-2xl sm:text-4xl text-brand-700 leading-snug max-w-3xl mx-auto`}>
          Una herramienta interna para gestionar redes sociales.{" "}
          <span className="italic text-accent-600">Sin hojas de cálculo sueltas.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Nada de procesos dispersos entre WhatsApp, calendarios y carpetas de imágenes: Nexalya
          reúne la planificación, el contenido y las métricas de cada cliente en un mismo lugar,
          pensado para el día a día de la agencia.
        </p>
        <div className="mt-8 h-px bg-slate-200" />
      </section>

      {/* Features */}
      <section className="mt-8 sm:mt-10">
        <div className="text-center">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-500 font-medium">
            Qué incluye
          </p>
          <h2 className={`${serif.className} mt-3 text-2xl sm:text-4xl text-brand-700 leading-snug max-w-3xl mx-auto`}>
            Todo lo que necesita tu equipo,{" "}
            <span className="italic text-accent-600">en un solo panel.</span>
          </h2>
        </div>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {FEATURES.map((feature, i) => (
            <div key={feature.title} className="pt-4 border-t border-slate-200">
              <span className="text-xs font-medium text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-semibold text-brand-700 text-sm sm:text-base">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Empresas que confían en Nexalya */}
      <section className="mt-16 sm:mt-24">
        <p className="text-center text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-500 font-medium">
          Empresas que ya han confiado en Nexalya
        </p>
        <div className="mt-8 relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex items-center w-max animate-marquee">
            {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${logo.alt}-${i}`}
                src={logo.src}
                alt={logo.alt}
                className="h-10 sm:h-12 w-auto object-contain mx-6 sm:mx-10 flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mt-16 sm:mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-center px-6 sm:px-12 py-14 sm:py-20">
        <div className="absolute inset-0 bg-stars opacity-40" aria-hidden="true" />
        <div className="relative">
          <h2 className={`${serif.className} text-2xl sm:text-4xl text-white leading-snug`}>
            ¿Gestionas redes de varios clientes?{" "}
            <span className="italic text-accent-400">Hablemos.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Escríbenos y te damos acceso a Nexalya para tu equipo.
          </p>
          <div className="mt-7">
            <a
              href="mailto:infosemdesign@gmail.com"
              className="inline-block px-6 py-3 rounded-full bg-accent-500 text-brand-900 font-semibold hover:bg-accent-400 text-sm sm:text-base"
            >
              Contacto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
