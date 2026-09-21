import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listUsers, listClients } from "@/lib/db-turso";
import TopNav from "@/components/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexalya",
  description: "Calendario y publicación multi-cliente para agencias.",
  openGraph: {
    title: "Nexalya",
    description: "Calendario y publicación multi-cliente para agencias.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    // Sesión iniciada: cabecera superior con desplegables para Clientes y
    // Usuarios (saltar directo a cada uno) en vez de un menú lateral.
    // Usuarios y Clientes se cargan aquí (server) para que el menú pueda
    // desplegar la lista de cada uno sin tirar de una API aparte.
    const [navUsers, navClients] = await Promise.all([listUsers(), listClients(user.id)]);
    return (
      <html lang="es">
        <body>
          <div className="min-h-screen flex flex-col">
            <TopNav
              userName={user.name}
              currentUserId={user.id}
              users={navUsers.map((u) => ({ id: u.id, name: u.name }))}
              clients={navClients.map((c) => ({ id: c.id, name: c.name }))}
            />
            <main className="flex-1">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">{children}</div>
            </main>
            <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Nexalya · Powered by Fiero
            </footer>
          </div>
        </body>
      </html>
    );
  }

  // Sin sesión: cabecera pública horizontal (landing y login).
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/nexalya-logo.png" alt="Nexalya" className="h-6 sm:h-7 w-auto" />
              </Link>
              <nav className="flex items-center gap-2 sm:gap-3 text-sm font-medium flex-shrink-0">
                <a
                  href="mailto:infosemdesign@gmail.com"
                  className="px-3 sm:px-4 py-2 rounded-md text-slate-600 hover:text-brand-700"
                >
                  Contacto
                </a>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                >
                  Iniciar sesión
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">{children}</div>
          </main>
          <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Nexalya · Powered by Fiero
          </footer>
        </div>
      </body>
    </html>
  );
}
