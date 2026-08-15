import { prisma } from "@/lib/prisma";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";

export const dynamic = "force-dynamic";

export default async function PortafolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Portafolio</h1>
      <ProjectGrid projects={projects} />
    </div>
  );
}
