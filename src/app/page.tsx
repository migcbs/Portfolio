import { BookingButton } from "@/components/booking/BookingButton";
import { BrandIntro } from "@/components/brand/BrandIntro";
import { BRAND_BYLINE, BRAND_NAME } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative flex-1 flex flex-col min-h-[calc(100vh-88px)]">
      <h1 className="sr-only">
        {BRAND_NAME} — {BRAND_BYLINE}
      </h1>
      {/* The animated Jarana Studios intro is the hero: the logo spins in, melts,
          and the drips pool into the "by mcbs" lockup, on a loop. */}
      <div className="fixed inset-0 z-0 bg-[#070709]" aria-hidden="true" />
      <BrandIntro className="fixed inset-0 w-full h-full z-0" />
      {/* The bottom fades to near-black (with a soft blur) so the buttons don't
          blend into the drips running past them. */}
      <div className="fixed inset-0 z-[1] backdrop-blur-[2px] bottom-blur-mask pointer-events-none" />
      <div className="fixed inset-x-0 bottom-0 h-[26%] z-[1] bg-gradient-to-t from-[#070709]/95 via-[#070709]/60 to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16">
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <BookingButton
            source="home-hero"
            className="animate-blur-fade-up shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: "1600ms" }}
          />
          <a
            href="/portafolio"
            className="liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 animate-blur-fade-up bg-black/70 backdrop-blur-md border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: "1700ms" }}
          >
            Ver portafolio
          </a>
        </div>
      </div>
    </div>
  );
}
