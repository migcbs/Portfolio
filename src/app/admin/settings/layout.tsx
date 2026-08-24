import Link from "next/link";

const TABS = [
  { href: "/admin/settings", label: "General" },
  { href: "/admin/settings/hero", label: "Inicio" },
  { href: "/admin/settings/about", label: "BIO" },
  { href: "/admin/settings/jxrxnx", label: "JARANA" },
  { href: "/admin/settings/legal", label: "Legal" },
  { href: "/admin/settings/agenda", label: "Agenda" },
  { href: "/admin/settings/account", label: "Cuenta" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Ajustes del sitio</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="label-mono liquid-glass px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
