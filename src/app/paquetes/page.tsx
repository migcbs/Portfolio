import { prisma } from "@/lib/prisma";
import { PricingGrid } from "@/components/pricing/PricingGrid";

export const dynamic = "force-dynamic";

export default async function PaquetesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-2 animate-blur-fade-up">Paquetes</h1>
      <p className="text-gray-400 mb-10 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        Elige el paquete que mejor se adapte a tu proyecto.
      </p>
      <PricingGrid
        services={services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price ? Number(service.price) : null,
          features: service.features,
        }))}
      />
    </div>
  );
}
