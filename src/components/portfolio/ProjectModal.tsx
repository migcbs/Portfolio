"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectUrl: string | null;
  tags: string[];
};

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-2xl liquid-glass rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {project.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="w-full h-56 md:h-72 object-cover" />
        )}

        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-medium mb-3">{project.title}</h2>
          <p className="text-gray-400 text-sm mb-4">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="label-mono px-2 py-1 rounded-full bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors"
            >
              Ver sitio <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
