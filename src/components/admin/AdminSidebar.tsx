"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/admin/logout-button";

const GROUPS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "",
    links: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Sitio",
    links: [
      { href: "/admin/settings", label: "General" },
      { href: "/admin/settings/hero", label: "Inicio" },
      { href: "/admin/settings/about", label: "Sobre mí" },
      { href: "/admin/settings/atenu", label: "ATENU" },
      { href: "/admin/settings/legal", label: "Legal" },
    ],
  },
  {
    label: "Contenido",
    links: [
      { href: "/admin/portfolio", label: "Proyectos" },
      { href: "/admin/packages", label: "Paquetes" },
      { href: "/admin/reviews", label: "Reviews" },
      { href: "/admin/social-links", label: "Redes sociales" },
    ],
  },
  {
    label: "Actividad",
    links: [
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/requests", label: "Solicitudes" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 liquid-glass rounded-2xl m-4 p-4 flex flex-col gap-4 h-fit">
      {GROUPS.map((group) => (
        <div key={group.label || "root"} className="flex flex-col gap-1">
          {group.label && (
            <p className="label-mono text-gray-500 px-3 pt-2 pb-1">{group.label}</p>
          )}
          {group.links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      ))}
      <LogoutButton />
    </aside>
  );
}
