"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    href: "/sobre-mi",
    label: "Sobre mí",
    description: "Quién soy y cómo trabajo.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/portafolio",
    label: "Portafolio",
    description: "Proyectos de desarrollo web.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/agencia",
    label: "Agencia",
    description: "ATENU BrandHouse: foto, video, diseño.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/paquetes",
    label: "Paquetes",
    description: "Planes y precios.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/reviews",
    label: "Reviews",
    description: "Lo que dicen mis clientes.",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/contacto",
    label: "Contacto",
    description: "Hablemos de tu proyecto.",
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HorizontalShowcase() {
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
    <section className="relative z-10 py-16 md:py-24">
      <div className="px-4 sm:px-6 md:px-12 mb-8">
        <h2 className="text-2xl md:text-4xl font-normal animate-blur-fade-up">Explora</h2>
        <p className="text-gray-400 mt-2 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
          Desliza horizontalmente para recorrer el sitio.
        </p>
      </div>

      <div
        ref={stripRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto pb-4 px-4 sm:px-6 md:px-12 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="relative shrink-0 w-[75vw] sm:w-[45vw] lg:w-[30vw] h-64 sm:h-80 rounded-2xl overflow-hidden liquid-glass snap-start animate-blur-fade-up"
            style={{ animationDelay: `${150 + i * 80}ms` }}
          >
            <div
              className="absolute inset-y-0 -left-1/3 w-[166%] bg-cover bg-center"
              style={{
                backgroundImage: `url(${section.image})`,
                transform: `translateX(${scrollX * 0.25}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 flex flex-col justify-end h-full p-6">
              <h3 className="text-xl font-medium mb-1">{section.label}</h3>
              <p className="text-sm text-gray-300">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
