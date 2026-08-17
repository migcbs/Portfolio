import { prisma } from "@/lib/prisma";
import { PortfolioManager } from "./portfolio-manager";

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { order: "asc" },
    include: {
      tasks: { orderBy: { order: "asc" } },
      media: { orderBy: { order: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
    },
  });

  return <PortfolioManager projects={projects} />;
}
