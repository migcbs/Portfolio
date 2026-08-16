"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  links: { href: string; label: string }[];
  onNavigate: () => void;
};

export default function MobileMenu({ open, links, onNavigate }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onNavigate();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onNavigate]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[90] lg:hidden liquid-glass transition-all duration-500 ease-out ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "rgba(12, 12, 12, 0.7)" }}
    >
      <div className="flex justify-end px-4 sm:px-6 py-4">
        <button
          onClick={onNavigate}
          aria-label="Cerrar menú"
          className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col px-6 sm:px-10 pt-4 gap-1">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="font-display uppercase text-4xl sm:text-5xl tracking-wide py-3 border-b border-white/10 transition-all duration-300 ease-out"
            style={{
              transitionDelay: open ? `${i * 40}ms` : "0ms",
              transform: open ? "translateY(0)" : "translateY(12px)",
              opacity: open ? 1 : 0,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>,
    document.body
  );
}
