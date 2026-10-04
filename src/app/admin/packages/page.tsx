import { prisma } from "@/lib/prisma";
import { PackagesManager } from "./packages-manager";

export default async function AdminPackagesPage() {
  const services = await prisma.service.findMany({
    where: { scope: "PERSONAL" },
    orderBy: { order: "asc" },
    select: { id: true, name: true, description: true, features: true, active: true, isFavorite: true, order: true },
  });

  return <PackagesManager services={services} />;
}
