"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";

type SidebarUser = { id: string; name: string };
type SidebarClient = { id: string; name: string };

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
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

export default function Sidebar({
  userName,
  currentUserId,
  users,
  clients,
}: {
  userName: string;
  currentUserId: string;
  users: SidebarUser[];
  clients: SidebarClient[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(pathname.startsWith("/users"));
  const [clientsOpen, setClientsOpen] = useState(pathname.startsWith("/clients"));

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      {/* Barra superior solo en móvil/tablet: logo + botón para abrir el menú lateral */}
      <div className="lg:hidden sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nexalya-logo.png" alt="Nexalya" className="h-6 w-auto" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="p-2 -mr-2 text-slate-500 hover:text-brand-700"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Fondo oscuro tras el menú al abrirlo en móvil */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-52 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <Link href="/dashboard" className="flex items-center" onClick={close}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nexalya-logo.png" alt="Nexalya" className="h-6 w-auto" />
          </Link>
          <button
            onClick={close}
            aria-label="Cerrar menú"
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          <Link
            href="/dashboard"
            onClick={close}
            className={`block px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              isActive("/dashboard") ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
            }`}
          >
            Dashboard
          </Link>

          {/* Clientes: enlace a la lista + desplegable para saltar directo a cada cliente */}
          <div>
            <div
              className={`flex items-center rounded-md transition-colors ${
                isActive("/clients") ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
              }`}
            >
              <Link href="/clients" onClick={close} className="flex-1 px-2.5 py-1.5 text-[13px] font-medium">
                Clientes
              </Link>
              <button
                onClick={() => setClientsOpen((v) => !v)}
                aria-label="Desplegar clientes"
                className="pr-2.5 pl-1 py-1.5"
              >
                <ChevronIcon open={clientsOpen} />
              </button>
            </div>

            {clientsOpen && (
              <div className="mt-0.5 ml-2.5 pl-2.5 border-l border-slate-100 space-y-0.5">
                {clients.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-slate-400">Sin clientes todavía.</p>
                ) : (
                  clients.map((c) => {
                    const href = `/clients/${c.id}`;
                    const active = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                      <Link
                        key={c.id}
                        href={href}
                        onClick={close}
                        className={`block px-2 py-1.5 rounded-md text-xs font-medium truncate transition-colors ${
                          active ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50 hover:text-brand-700"
                        }`}
                      >
                        {c.name}
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Usuarios: enlace a la gestión de cuentas + desplegable para ver el panel de cada persona */}
          <div>
            <div
              className={`flex items-center rounded-md transition-colors ${
                isActive("/users") ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
              }`}
            >
              <Link href="/users" onClick={close} className="flex-1 px-2.5 py-1.5 text-[13px] font-medium">
                Usuarios
              </Link>
              <button
                onClick={() => setUsersOpen((v) => !v)}
                aria-label="Desplegar usuarios"
                className="pr-2.5 pl-1 py-1.5"
              >
                <ChevronIcon open={usersOpen} />
              </button>
            </div>

            {usersOpen && (
              <div className="mt-0.5 ml-2.5 pl-2.5 border-l border-slate-100 space-y-0.5">
                {users.map((u) => {
                  const href = u.id === currentUserId ? "/dashboard" : `/users/${u.id}`;
                  const active = u.id === currentUserId ? pathname === "/dashboard" : pathname === `/users/${u.id}`;
                  return (
                    <Link
                      key={u.id}
                      href={href}
                      onClick={close}
                      className={`block px-2 py-1.5 rounded-md text-xs font-medium truncate transition-colors ${
                        active ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50 hover:text-brand-700"
                      }`}
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

        <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400 truncate">{userName}</span>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
