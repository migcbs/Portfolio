"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/atenu", label: "JXRXNX" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar({ brand, logoUrl }: { brand: string; logoUrl: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 md:py-6">
        <Link href="/" className="animate-blur-fade-up" style={{ animationDelay: "0ms" }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brand} className="h-8 md:h-10 w-auto brightness-0 invert" />
          ) : (
            <span className="font-display uppercase text-xl md:text-2xl tracking-wide">{brand}</span>
          )}
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display uppercase text-lg tracking-wide hover:text-gray-300 transition-colors animate-blur-fade-up"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden liquid-glass w-10 h-10 rounded-full flex items-center justify-center animate-blur-fade-up"
          style={{ animationDelay: "350ms" }}
          aria-label="Abrir menú"
        >
          <span className="relative w-[18px] h-[18px] block">
            <Menu
              size={18}
              className={`absolute inset-0 transition-all duration-500 ease-out ${open ? "rotate-180 opacity-0 scale-50" : "opacity-100"}`}
            />
            <X
              size={18}
              className={`absolute inset-0 transition-all duration-500 ease-out ${open ? "opacity-100" : "rotate-180 opacity-0 scale-50"}`}
            />
          </span>
        </button>
      </nav>

      <MobileMenu open={open} links={NAV_LINKS} onNavigate={() => setOpen(false)} />
    </>
  );
}
