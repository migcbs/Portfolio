import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { ClientGrid } from "@/components/agencia/ClientGrid";

export const dynamic = "force-dynamic";

export default async function AgenciaPage() {
  const settings = await getSiteSettings();
  const clients = await prisma.client.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { stories: { where: { active: true }, orderBy: { order: "asc" } } },
  });

  const SERVICES = ["Fotografía", "Video", "Diseño gráfico", "Impresiones", "Merch"];

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-2 animate-blur-fade-up">
        {settings?.agencyBrand ?? "ATENU BrandHouse"}
      </h1>
      <p className="text-gray-400 mb-10 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        Agencia de marketing digital.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        {SERVICES.map((service, i) => (
          <span
            key={service}
            className="liquid-glass rounded-full px-5 py-2 text-sm animate-blur-fade-up"
            style={{ animationDelay: `${150 + i * 50}ms` }}
          >
            {service}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-medium mb-6">Clientes</h2>
      <ClientGrid clients={clients} />
    </div>
  );
}
