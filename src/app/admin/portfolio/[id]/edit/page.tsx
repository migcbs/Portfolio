import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortfolioForm } from "../../portfolio-form";
import { updatePortfolioProject } from "../../actions";

export default async function EditPortfolioProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar proyecto</h1>
      <PortfolioForm
        action={updatePortfolioProject.bind(null, id)}
        defaultValues={{
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl ?? "",
          projectUrl: project.projectUrl ?? "",
          tags: project.tags.join(", "),
          active: project.active,
          order: project.order,
        }}
      />
    </div>
  );
}
