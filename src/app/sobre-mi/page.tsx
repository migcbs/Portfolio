import { getSiteSettings } from "@/lib/site-settings";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function SobreMiPage() {
  const settings = await getSiteSettings();

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-6 animate-blur-fade-up">Sobre mí</h1>
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {settings?.aboutImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.aboutImageUrl}
            alt="Miguel Ceballos"
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover liquid-glass shrink-0 animate-blur-fade-up"
            style={{ animationDelay: "100ms" }}
          />
        )}
        <p
          className="text-gray-400 text-base md:text-lg animate-blur-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          {settings?.aboutText ||
            "Desarrollador web freelance y fundador de JARANA BrandHouse, ayudando a marcas a construir su presencia digital."}
        </p>
      </div>
      <div className="mt-10 animate-blur-fade-up" style={{ animationDelay: "200ms" }}>
        <BookingButton source="sobre-mi" />
      </div>
    </div>
  );
}
