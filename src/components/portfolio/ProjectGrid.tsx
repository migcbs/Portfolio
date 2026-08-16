"use client";

import { useMemo, useState } from "react";
import { ProjectModal } from "./ProjectModal";

export type ProjectMediaItem = { id: string; category: "PHOTO" | "VIDEO" | "MERCH"; type: "IMAGE" | "VIDEO"; mediaUrl: string };

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectUrl: string | null;
  tags: string[];
  category: string;
  status: string;
  media: ProjectMediaItem[];
};

const CATEGORY_LABELS: Record<string, string> = {
  WEB_DEV: "Desarrollo Web",
  DIGITAL_MARKETING: "Marketing Digital",
  PHOTO: "Fotografía",
  VIDEO: "Video",
  GRAPHIC_DESIGN: "Diseño Gráfico",
};

const STATUS_BADGE: Record<string, string> = {
  PLANNING: "Procesando",
  IN_PROGRESS: "En desarrollo",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  PLANNING: "bg-black/70 border-white/20",
  IN_PROGRESS: "bg-yellow-500/90 border-yellow-400/60 text-black",
};

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const categories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return Object.keys(CATEGORY_LABELS).filter((cat) => present.has(cat));
  }, [projects]);

  const filtered = filter === "ALL" ? projects : projects.filter((p) => p.category === filter);

  if (projects.length === 0) {
    return <p className="text-gray-500">Aún no hay proyectos publicados.</p>;
  }

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`label-mono px-4 py-2 rounded-full transition-colors ${
              filter === "ALL" ? "bg-white text-black" : "liquid-glass hover:bg-white/10"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`label-mono px-4 py-2 rounded-full transition-colors ${
                filter === cat ? "bg-white text-black" : "liquid-glass hover:bg-white/10"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setActiveProject(project)}
            className="liquid-glass rounded-2xl overflow-hidden text-left animate-blur-fade-up relative"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {STATUS_BADGE[project.status] && (
              <span
                className={`label-mono absolute top-3 right-3 z-10 px-3 py-1 rounded-full backdrop-blur-sm border ${STATUS_BADGE_CLASS[project.status]}`}
              >
                {STATUS_BADGE[project.status]}
              </span>
            )}
            {project.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.imageUrl} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-6">
              <span className="label-mono text-gray-500 mb-2 block">{CATEGORY_LABELS[project.category]}</span>
              <h2 className="text-xl font-medium mb-2">{project.title}</h2>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="label-mono px-2 py-1 rounded-full bg-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
    </>
  );
}
