import Link from "next/link";
import LogoutButton from "@/app/admin/logout-button";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Ajustes del sitio" },
  { href: "/admin/clients", label: "Clientes" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/portfolio", label: "Portafolio" },
  { href: "/admin/packages", label: "Paquetes" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/social-links", label: "Redes sociales" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/requests", label: "Solicitudes" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 liquid-glass rounded-2xl m-4 p-4 flex flex-col gap-1 h-fit">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
          {link.label}
        </Link>
      ))}
      <LogoutButton />
    </aside>
  );
}
