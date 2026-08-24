import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function JxrxnxPage() {
  const settings = await getSiteSettings();
  const [webDevPackages, agencyPackages] = await Promise.all([
    prisma.service.findMany({
      where: { active: true, scope: "PERSONAL" },
      orderBy: { order: "asc" },
    }),
    prisma.service.findMany({
      where: { active: true, scope: "AGENCY" },
      orderBy: { order: "asc" },
    }),
  ]);

  const services = settings?.agencyServices?.length
    ? settings.agencyServices
    : ["Fotografía", "Video", "Diseño gráfico", "Impresiones", "Merch"];

  const toGridService = (service: (typeof webDevPackages)[number]) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price ? Number(service.price) : null,
    features: service.features,
    isFavorite: service.isFavorite,
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-normal mb-2 animate-blur-fade-up">
        {settings?.agencyBrand ?? "JARANA BrandHouse"}
      </h1>
      <p className="text-gray-400 mb-4 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        {settings?.agencyTagline ?? "Agencia de marketing digital."}
      </p>
      <p
        className="text-base md:text-lg text-gray-300 max-w-2xl mb-8 animate-blur-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        {settings?.jxrxnxIntro}
      </p>
      <div className="mb-12 animate-blur-fade-up" style={{ animationDelay: "200ms" }}>
        <BookingButton source="jxrxnx-header" />
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

      {/* Desarrollo Web */}
      {webDevPackages.length > 0 && (
        <div id="desarrollo-web" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-medium mb-1">Desarrollo Web</h2>
          <p className="text-gray-400 text-sm mb-6">
            Todos los paquetes incluyen 1 año gratis de hosting y dominio.
          </p>
          <PricingGrid
            services={webDevPackages.map(toGridService)}
            bookingSource="jxrxnx-webdev"
            showHostingBadge
          />
        </div>
      )}

      {/* Agencia */}
      {agencyPackages.length > 0 && (
        <div id="agencia" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-medium mb-1">Agencia — Foto, Video, Diseño</h2>
          <p className="text-gray-400 text-sm mb-6">Contenido y producción para tu marca.</p>
          <PricingGrid services={agencyPackages.map(toGridService)} bookingSource="jxrxnx-agencia" />
        </div>
      )}

      {/* Custom-work banner — the signature element: breaks the fixed-price
          grid pattern on purpose, to make the "not just fixed packages"
          point structurally, not just in copy. */}
      <div className="liquid-glass rounded-2xl p-8 md:p-10 mb-16 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex-1">
          <h2 className="text-xl font-medium mb-2">A tu medida</h2>
          <p className="text-gray-300">{settings?.jxrxnxCustomText}</p>
        </div>
        <BookingButton source="jxrxnx-custom" variant="glass" />
      </div>
    </div>
  );
}
