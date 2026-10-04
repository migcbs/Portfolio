import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function JxrxnxPage() {
  const settings = await getSiteSettings();
  const webDevPackages = await prisma.service.findMany({
    where: { active: true, scope: "PERSONAL" },
    orderBy: { order: "asc" },
  });

  const toGridService = (service: (typeof webDevPackages)[number]) => ({
    id: service.id,
    name: service.name,
    description: service.description,
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
        {settings?.agencyTagline ?? "Desarrollo web a la medida."}
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

      {/* Desarrollo Web */}
      {webDevPackages.length > 0 && (
        <div id="desarrollo-web" className="mb-16 scroll-mt-24">
          <h2 className="text-xl font-medium mb-1">Desarrollo Web</h2>
          <p className="text-gray-400 text-sm mb-6">
            Todos los paquetes incluyen 1 año gratis de hosting y dominio. El precio se cotiza según las
            necesidades de tu proyecto.
          </p>
          <PricingGrid
            services={webDevPackages.map(toGridService)}
            bookingSource="jxrxnx-webdev"
            showHostingBadge
          />
        </div>
      )}

      {/* Custom-work banner — the signature element: breaks the package
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
