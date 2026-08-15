"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Project = { id: string; title: string; description: string };
type Service = { id: string; name: string; description: string };

export default function SpotlightSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setProjects([]);
      setServices([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setProjects([]);
      setServices([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProjects(data.projects ?? []);
      setServices(data.services ?? []);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!open) return null;

  const hasResults = projects.length > 0 || services.length > 0;

  function goTo(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32 px-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl liquid-glass rounded-2xl overflow-hidden bg-gray-900/95">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyectos o paquetes..."
            className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-500"
          />
          <kbd className="text-[10px] text-gray-500 border border-white/10 rounded px-1.5 py-0.5 shrink-0">
            ESC
          </kbd>
        </div>

        {query.trim() && (
          <div className="max-h-80 overflow-y-auto py-2">
            {!hasResults && (
              <p className="px-5 py-4 text-sm text-gray-500">Sin resultados para &ldquo;{query}&rdquo;.</p>
            )}
            {projects.length > 0 && (
              <div className="px-2">
                <p className="px-3 py-1 text-xs uppercase tracking-wide text-gray-500">Proyectos</p>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => goTo("/portafolio")}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className="text-xs text-gray-500 truncate">{project.description}</p>
                  </button>
                ))}
              </div>
            )}
            {services.length > 0 && (
              <div className="px-2">
                <p className="px-3 py-1 text-xs uppercase tracking-wide text-gray-500">Paquetes</p>
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => goTo("/paquetes")}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-gray-500 truncate">{service.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
