"use client";

import { useState } from "react";
import { ProjectModal } from "./ProjectModal";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectUrl: string | null;
  tags: string[];
};

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (projects.length === 0) {
    return <p className="text-gray-500">Aún no hay proyectos publicados.</p>;
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setActiveProject(project)}
            className="liquid-glass rounded-2xl overflow-hidden text-left animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {project.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.imageUrl} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-6">
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
