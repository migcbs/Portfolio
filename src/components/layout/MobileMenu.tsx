"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";

type Props = {
  open: boolean;
  links: { href: string; label: string }[];
  onNavigate: () => void;
};

export default function MobileMenu({ open, links, onNavigate }: Props) {
  return (
    <div
      className={`absolute top-[72px] left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-b border-gray-800 shadow-2xl transition-all duration-500 ease-out ${
        open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col px-4 py-4">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="py-3 px-3 rounded-lg hover:bg-gray-800/50 transition-all"
            style={{
              transitionDelay: `${i * 50}ms`,
              transform: open ? "translateX(0)" : "translateX(-16px)",
            }}
          >
            {link.label}
          </Link>
        ))}
        <div className="sm:hidden flex gap-3 mt-3 pt-3 border-t border-gray-800">
          <Link
            href="/buscar"
            onClick={onNavigate}
            className="liquid-glass flex-1 rounded-full px-4 py-2 flex items-center justify-center gap-2 text-sm"
          >
            <Search size={16} /> Buscar
          </Link>
          <Link
            href="/admin/login"
            onClick={onNavigate}
            aria-label="Ingresar"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center"
          >
            <User size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
