"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PortfolioForm } from "./portfolio-form";
import { createPortfolioProject, updatePortfolioProject, deletePortfolioProject } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  WEB_DEV: "Desarrollo Web",
  DIGITAL_MARKETING: "Marketing Digital",
  PHOTO: "Fotografía",
  VIDEO: "Video",
  GRAPHIC_DESIGN: "Diseño Gráfico",
};

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Procesando",
  IN_PROGRESS: "En desarrollo",
  COMPLETED: "Terminado",
};

type Task = { id: string; phase: string; label: string; done: boolean };
type Media = { id: string; category: "PHOTO" | "VIDEO" | "MERCH"; type: "IMAGE" | "VIDEO"; mediaUrl: string };
type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectUrl: string | null;
  tags: string[];
  category: string;
  projectType: string | null;
  status: string;
  progress: number;
  devTime: string | null;
  internalNotes: string | null;
  active: boolean;
  order: number;
  tasks: Task[];
  media: Media[];
};

export function PortfolioManager({ projects }: { projects: Project[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Derived (not copied) so live edits from the checklist/progress slider —
  // which persist via their own server actions and revalidatePath — show up
  // immediately in the open modal instead of a stale snapshot.
  const editingProject = editingId ? (projects.find((p) => p.id === editingId) ?? null) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tu portafolio público y tu herramienta de seguimiento de proyectos en un solo lugar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo proyecto
        </button>
      </div>
      <div className="liquid-glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Título</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Avance</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{project.title}</td>
                <td className="p-4 text-gray-400">{CATEGORY_LABELS[project.category] ?? project.category}</td>
                <td className="p-4 text-gray-400">{STATUS_LABELS[project.status] ?? project.status}</td>
                <td className="p-4 text-gray-400">{project.progress}%</td>
                <td className="p-4 text-gray-400">{project.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <button type="button" onClick={() => setEditingId(project.id)} className="text-sm hover:text-gray-300">
                    Editar
                  </button>
                  <DeleteButton id={project.id} action={deletePortfolioProject} itemLabel={project.title} />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-gray-500">
                  Aún no hay proyectos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <PortfolioForm action={createPortfolioProject} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editingProject !== null} onClose={() => setEditingId(null)}>
        {editingProject && (
          <PortfolioForm
            action={updatePortfolioProject.bind(null, editingProject.id)}
            defaultValues={{
              title: editingProject.title,
              description: editingProject.description,
              imageUrl: editingProject.imageUrl ?? "",
              projectUrl: editingProject.projectUrl ?? "",
              tags: editingProject.tags.join(", "),
              category: editingProject.category,
              projectType: editingProject.projectType ?? "",
              status: editingProject.status,
              devTime: editingProject.devTime ?? "",
              internalNotes: editingProject.internalNotes ?? "",
              active: editingProject.active,
              order: editingProject.order,
            }}
            editing={{
              id: editingProject.id,
              progress: editingProject.progress,
              tasks: editingProject.tasks,
              media: editingProject.media,
            }}
            onSuccess={() => setEditingId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
