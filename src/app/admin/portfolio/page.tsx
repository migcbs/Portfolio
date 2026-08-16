import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePortfolioProject } from "./actions";

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

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tu portafolio público y tu herramienta de seguimiento de proyectos en un solo lugar.
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo proyecto
        </Link>
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
                  <Link href={`/admin/portfolio/${project.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
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
    </div>
  );
}
