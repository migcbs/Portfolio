import { prisma } from "@/lib/prisma";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function PortafolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-normal animate-blur-fade-up">Portafolio</h1>
        <div className="animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
          <BookingButton source="portafolio" variant="glass" />
        </div>
      </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
