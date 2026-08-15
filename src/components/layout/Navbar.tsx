"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/sobre-mi",
    label: "Sobre mí",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/portafolio",
    label: "Portafolio",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/agencia",
    label: "Agencia",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/paquetes",
    label: "Paquetes",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/reviews",
    label: "Reviews",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/contacto",
    label: "Contacto",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Navbar({ brand }: { brand: string }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [scrollX, setScrollX] = useState(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (stripRef.current) setScrollX(stripRef.current.scrollLeft);
    });
  }, []);

  return (
    <nav className="relative z-50 px-4 sm:px-6 md:px-12 py-4 md:py-6">
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/"
          className="text-base md:text-lg font-semibold tracking-tight animate-blur-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          {brand}
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/buscar"
            className="liquid-glass rounded-full px-4 md:px-6 py-2 flex items-center gap-2 text-sm animate-blur-fade-up"
            style={{ animationDelay: "350ms" }}
          >
            <Search size={18} />
            <span className="hidden sm:inline">Buscar</span>
          </Link>
          <Link
            href="/admin/login"
            aria-label="Ingresar"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center animate-blur-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <User size={18} />
          </Link>
        </div>
      </div>

      <div
        ref={stripRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {NAV_ITEMS.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative shrink-0 w-36 sm:w-44 h-20 sm:h-24 rounded-2xl overflow-hidden liquid-glass snap-start animate-blur-fade-up"
            style={{ animationDelay: `${100 + i * 50}ms` }}
          >
            <div
              className="absolute inset-y-0 -left-1/4 w-[150%] bg-cover bg-center opacity-60"
              style={{
                backgroundImage: `url(${item.image})`,
                transform: `translateX(${scrollX * 0.3}px)`,
              }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <span className="relative z-10 flex items-end h-full p-3 sm:p-4 text-sm font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
