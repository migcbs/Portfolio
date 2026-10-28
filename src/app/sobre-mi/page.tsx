import { getSiteSettings } from "@/lib/site-settings";
import { BookingButton } from "@/components/booking/BookingButton";
import { BRAND_BYLINE, BRAND_NAME, BRAND_PORTRAIT } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function SobreMiPage() {
  const settings = await getSiteSettings();

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-5xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">BIO</h1>
      <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
        {/* Portrait as a die-cut sticker: paper card, black ink outline, slight tilt
            that straightens on hover, echoing the logo's sticker look. */}
        <figure
          className="group shrink-0 animate-blur-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-[2.25rem] bg-[#fff] p-2 -rotate-3 shadow-[0_0_0_5px_#0C0C0C,0_0_0_8px_#F5F3EE,0_20px_50px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.03]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND_PORTRAIT}
              alt="Retrato ilustrado de Miguel Ceballos (MCBS)"
              width={512}
              height={512}
              className="w-full h-full object-contain"
            />
          </div>
          <figcaption className="label-mono text-gray-500 mt-6 text-center">
            MCBS · {BRAND_NAME}
          </figcaption>
        </figure>
        <div className="animate-blur-fade-up" style={{ animationDelay: "150ms" }}>
          <p className="label-mono text-gray-500 mb-4">{BRAND_BYLINE}</p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl whitespace-pre-line">
            {settings?.aboutText ||
              `Desarrollador web freelance y fundador de ${BRAND_NAME}, ayudando a marcas a construir su presencia digital.`}
          </p>
          <div className="mt-10">
            <BookingButton source="sobre-mi" />
          </div>
        </div>
      </div>
    </div>
  );
}
