"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

type NavUser = { id: string; name: string };
type NavClient = { id: string; name: string };

function DashboardIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7.5" width="18" height="13" rx="2" />
      <path d="M8 7.5V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

function ChevronIcon({ open, size = 12 }: { open: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Botón del riel: icono arriba, etiqueta debajo (con una flechita en línea
// si tiene lista desplegable — nunca superpuesta al texto). Todo el botón
// es un único objetivo de clic: Dashboard navega directo, Clientes/Usuarios
// abren su panel flotante. Detrás del icono aparece una pastilla en
// degradado verde con una pequeña animación de escala/opacidad al pasar
// el ratón, y fija cuando esa sección está activa — estilo Slack.
function RailButton({
  href,
  active,
  label,
  icon,
  expandable,
  expanded,
  onClick,
}: {
  href?: string;
  active: boolean;
  label: string;
  icon: React.ReactNode;
  expandable?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={`absolute inset-1 rounded-xl bg-gradient-to-br from-accent-300 via-accent-400 to-accent-600 transition-all duration-200 ease-out ${
          active
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-100"
        } group-focus-visible:opacity-100 group-focus-visible:scale-100`}
      />
      <span
        className={`relative z-10 transition-colors ${
          active ? "text-brand-900" : "text-slate-500 group-hover:text-brand-800"
        }`}
      >
        {icon}
      </span>
      <span
        className={`relative z-10 flex items-center justify-center gap-0.5 max-w-full transition-colors ${
          active ? "text-brand-900" : "text-slate-500 group-hover:text-brand-800"
        }`}
      >
        <span className="text-[10px] font-medium leading-none truncate">{label}</span>
        {expandable && <ChevronIcon open={!!expanded} size={9} />}
      </span>
    </>
  );

  const className =
    "group relative flex flex-col items-center justify-center gap-1 w-full min-w-0 py-2 px-1 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export default function IconSidebar({
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

  const [clientsOpen, setClientsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const clientsRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClientsOpen, setMobileClientsOpen] = useState(false);
  const [mobileUsersOpen, setMobileUsersOpen] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (clientsRef.current && !clientsRef.current.contains(e.target as Node)) setClientsOpen(false);
      if (usersRef.current && !usersRef.current.contains(e.target as Node)) setUsersOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setClientsOpen(false);
    setUsersOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
    setMobileClientsOpen(false);
    setMobileUsersOpen(false);
  }, [pathname]);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Barra superior solo en móvil/tablet: logo + botón para abrir el menú */}
      <div className="sm:hidden sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nexalya-logo.png" alt="Nexalya" className="h-6 w-auto" />
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
          className="p-2 -mr-2 text-slate-500 hover:text-brand-700"
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

      {/* Menú desplegable de móvil */}
      {mobileOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1">
          <Link
            href="/dashboard"
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/dashboard") ? "bg-accent-50 text-brand-800" : "text-slate-600 hover:bg-slate-50"
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
                    <Link key={u.id} href={href} className="block px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-50 truncate">
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

      {/* Riel de iconos en escritorio */}
      <aside className="hidden sm:flex fixed inset-y-0 left-0 z-20 w-24 bg-white border-r border-slate-200 flex-col items-center">
        <Link href="/dashboard" className="flex items-center justify-center h-16 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nexalya-icon.png" alt="Nexalya" className="h-8 w-8 object-contain" />
        </Link>

        <nav className="flex-1 w-full px-2 space-y-1.5">
          <RailButton href="/dashboard" active={isActive("/dashboard")} label="Dashboard" icon={<DashboardIcon />} />

          <div className="relative" ref={clientsRef}>
            <RailButton
              active={isActive("/clients")}
              label="Clientes"
              icon={<ClientsIcon />}
              expandable
              expanded={clientsOpen}
              onClick={() => setClientsOpen((v) => !v)}
            />
            {clientsOpen && (
              <div className="absolute left-full top-0 ml-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 max-h-80 overflow-y-auto z-30">
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
            <RailButton
              active={isActive("/users")}
              label="Usuarios"
              icon={<UsersIcon />}
              expandable
              expanded={usersOpen}
              onClick={() => setUsersOpen((v) => !v)}
            />
            {usersOpen && (
              <div className="absolute left-full top-0 ml-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 max-h-80 overflow-y-auto z-30">
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

        <div className="relative w-full px-2 pb-3 flex-shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-full flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-400 to-brand-600 text-white text-xs font-semibold flex items-center justify-center">
              {initials(userName)}
            </span>
          </button>
          {profileOpen && (
            <div className="absolute left-full bottom-0 ml-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 px-3 z-30 space-y-2">
              <p className="text-sm font-medium text-slate-700 truncate">{userName}</p>
              <LogoutButton />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
