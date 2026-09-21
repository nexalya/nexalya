"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

type NavUser = { id: string; name: string };
type NavClient = { id: string; name: string };

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function TopNav({
  userName,
  currentUserId,
  users,
  clients,
}: {
  userName: string;
  currentUserId: string;
  users: NavUser[];
  clients: NavClient[];
}) {
  const pathname = usePathname();

  // Desplegables de escritorio (con cierre al clicar fuera)
  const [clientsOpen, setClientsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const clientsRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);

  // Menú y desplegables de móvil (estado aparte: viven dentro del propio
  // panel deslizante, así que no necesitan el cierre por clic fuera)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClientsOpen, setMobileClientsOpen] = useState(false);
  const [mobileUsersOpen, setMobileUsersOpen] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (clientsRef.current && !clientsRef.current.contains(e.target as Node)) setClientsOpen(false);
      if (usersRef.current && !usersRef.current.contains(e.target as Node)) setUsersOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cerrar todo al navegar a otra página
  useEffect(() => {
    setClientsOpen(false);
    setUsersOpen(false);
    setMobileOpen(false);
    setMobileClientsOpen(false);
    setMobileUsersOpen(false);
  }, [pathname]);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <header className="border-b border-slate-200 bg-white relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nexalya-logo.png" alt="Nexalya" className="h-6 sm:h-7 w-auto" />
        </Link>

        {/* Nav + usuario agrupados a la derecha, en vez de centrados */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/dashboard") ? "bg-brand-50 text-brand-700" : "hover:bg-slate-50 hover:text-brand-700"
            }`}
          >
            Dashboard
          </Link>

          <div className="relative" ref={clientsRef}>
            <button
              onClick={() => setClientsOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/clients") ? "bg-brand-50 text-brand-700" : "hover:bg-slate-50 hover:text-brand-700"
              }`}
            >
              Clientes
              <ChevronIcon open={clientsOpen} />
            </button>
            {clientsOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 max-h-80 overflow-y-auto z-30">
                <Link href="/clients" className="block px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-brand-700">
                  Ver todos
                </Link>
                {clients.length === 0 ? (
                  <p className="px-3 py-1.5 text-xs text-slate-400">Sin clientes todavía.</p>
                ) : (
                  clients.map((c) => (
                    <Link
                      key={c.id}
                      href={`/clients/${c.id}`}
                      className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-700 truncate"
                    >
                      {c.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={usersRef}>
            <button
              onClick={() => setUsersOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                isActive("/users") ? "bg-brand-50 text-brand-700" : "hover:bg-slate-50 hover:text-brand-700"
              }`}
            >
              Usuarios
              <ChevronIcon open={usersOpen} />
            </button>
            {usersOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 max-h-80 overflow-y-auto z-30">
                <Link href="/users" className="block px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-brand-700">
                  Gestionar cuentas
                </Link>
                {users.map((u) => {
                  const href = u.id === currentUserId ? "/dashboard" : `/users/${u.id}`;
                  return (
                    <Link
                      key={u.id}
                      href={href}
                      className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-700 truncate"
                    >
                      {u.name}
                      {u.id === currentUserId && <span className="text-slate-400"> (tú)</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-slate-400 text-xs">{userName}</span>
            <LogoutButton />
          </div>
        </div>

        {/* Botón hamburguesa en móvil */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
          className="sm:hidden p-2 -mr-2 text-slate-500 hover:text-brand-700"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú de móvil */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-100 px-4 py-3 space-y-1">
          <Link
            href="/dashboard"
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/dashboard") ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Dashboard
          </Link>

          <div>
            <button
              onClick={() => setMobileClientsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Clientes
              <ChevronIcon open={mobileClientsOpen} />
            </button>
            {mobileClientsOpen && (
              <div className="ml-3 pl-3 border-l border-slate-100 space-y-0.5 mt-0.5">
                <Link href="/clients" className="block px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-50">
                  Ver todos
                </Link>
                {clients.map((c) => (
                  <Link
                    key={c.id}
                    href={`/clients/${c.id}`}
                    className="block px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-50 truncate"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMobileUsersOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Usuarios
              <ChevronIcon open={mobileUsersOpen} />
            </button>
            {mobileUsersOpen && (
              <div className="ml-3 pl-3 border-l border-slate-100 space-y-0.5 mt-0.5">
                <Link href="/users" className="block px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-50">
                  Gestionar cuentas
                </Link>
                {users.map((u) => {
                  const href = u.id === currentUserId ? "/dashboard" : `/users/${u.id}`;
                  return (
                    <Link
                      key={u.id}
                      href={href}
                      className="block px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-50 truncate"
                    >
                      {u.name}
                      {u.id === currentUserId && <span className="text-slate-400"> (tú)</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between px-3">
            <span className="text-xs text-slate-400">{userName}</span>
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}
