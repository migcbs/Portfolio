import { prisma } from "@/lib/prisma";
import { PackagesManager } from "./packages-manager";

export default async function AdminPackagesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const plainServices = services.map((service) => ({
    ...service,
    price: service.price ? service.price.toString() : null,
  }));

  return <PackagesManager services={plainServices} />;
}
