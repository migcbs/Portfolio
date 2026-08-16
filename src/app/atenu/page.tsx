import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { ClientGrid } from "@/components/agencia/ClientGrid";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function AtenuPage() {
  const settings = await getSiteSettings();
  const [clients, packages] = await Promise.all([
    prisma.client.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: { stories: { where: { active: true }, orderBy: { order: "asc" } } },
    }),
    prisma.service.findMany({
      where: { active: true, scope: "AGENCY" },
      orderBy: { order: "asc" },
    }),
  ]);

  const services = settings?.agencyServices?.length
    ? settings.agencyServices
    : ["Fotografía", "Video", "Diseño gráfico", "Impresiones", "Merch"];

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-normal mb-2 animate-blur-fade-up">
        {settings?.agencyBrand ?? "ATENU BrandHouse"}
      </h1>
      <p className="text-gray-400 mb-4 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        {settings?.agencyTagline ?? "Agencia de marketing digital."}
      </p>
      <p
        className="text-base md:text-lg text-gray-300 max-w-2xl mb-8 animate-blur-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        {settings?.atenuIntro}
      </p>
      <div className="mb-12 animate-blur-fade-up" style={{ animationDelay: "200ms" }}>
        <BookingButton source="atenu-header" />
      </div>

      {/* Services strip */}
      <div className="flex flex-wrap gap-3 mb-16">
        {services.map((service, i) => (
          <span
            key={service}
            className="label-mono liquid-glass rounded-full px-5 py-2 animate-blur-fade-up"
            style={{ animationDelay: `${250 + i * 50}ms` }}
          >
            {service}
          </span>
        ))}
      </div>

      {/* Packages */}
      {packages.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-medium mb-6">Paquetes</h2>
          <PricingGrid
            services={packages.map((service) => ({
              id: service.id,
              name: service.name,
              description: service.description,
              price: service.price ? Number(service.price) : null,
              features: service.features,
            }))}
            bookingSource="atenu-paquete"
          />
        </div>
      )}

      {/* Custom-work banner — the signature element: breaks the fixed-price
          grid pattern on purpose, to make the "not just fixed packages"
          point structurally, not just in copy. */}
      <div className="liquid-glass rounded-2xl p-8 md:p-10 mb-16 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-2">A tu medida</h2>
          <p className="text-gray-300">{settings?.atenuCustomText}</p>
        </div>
        <BookingButton source="atenu-custom" variant="glass" label="Cuéntanos qué necesitas" />
      </div>

      {/* Clients */}
      <h2 className="text-xl font-medium mb-6">Clientes</h2>
      <ClientGrid clients={clients} />
    </div>
  );
}
