import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
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

  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
              <Link href={user ? "/dashboard" : "/"} className="flex items-center flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/nexalya-logo.png" alt="Nexalya" className="h-6 sm:h-7 w-auto" />
              </Link>
              {user ? (
                // overflow-x-auto en vez de flex-wrap: en móvil/tablet estrecho
                // el menú se desliza horizontalmente en una sola línea en vez
                // de partirse en varias filas o desbordar la pantalla.
                <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-600 overflow-x-auto whitespace-nowrap">
                  <Link href="/dashboard" className="hover:text-brand-700 flex-shrink-0">
                    Dashboard
                  </Link>
                  <Link href="/clients" className="hover:text-brand-700 flex-shrink-0">
                    Clientes
                  </Link>
                  <Link href="/users" className="hover:text-brand-700 flex-shrink-0 hidden sm:inline">
                    Usuarios
                  </Link>
                  <span className="h-4 w-px bg-slate-200 hidden sm:inline-block flex-shrink-0" />
                  <span className="text-slate-400 text-xs hidden sm:inline flex-shrink-0">{user.name}</span>
                  <span className="flex-shrink-0">
                    <LogoutButton />
                  </span>
                </nav>
              ) : (
                // Cabecera pública (landing): quien todavía no tiene sesión ve
                // estos dos botones en vez del menú interno de la app.
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
              )}
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
