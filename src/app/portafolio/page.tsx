import { prisma } from "@/lib/prisma";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ClientGrid } from "@/components/agencia/ClientGrid";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function PortafolioPage() {
  const [projects, clients] = await Promise.all([
    prisma.portfolioProject.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        projectUrl: true,
        tags: true,
        category: true,
        status: true,
      },
    }),
    prisma.client.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: { stories: { where: { active: true }, orderBy: { order: "asc" } } },
    }),
  ]);

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-normal animate-blur-fade-up">Portafolio</h1>
        <div className="animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
          <BookingButton source="portafolio" variant="glass" />
        </div>
      </div>
      <ProjectGrid projects={projects} />

      <h2 className="text-xl font-medium mt-20 mb-6">Clientes</h2>
      <ClientGrid clients={clients} />
    </div>
  );
}
