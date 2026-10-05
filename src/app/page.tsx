import { Star, Clock, Calendar } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { BookingButton } from "@/components/booking/BookingButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const title = settings?.heroTitle ?? "Step Through. Work Smarter.";
  const description =
    settings?.heroDescription ?? "Desarrollo web y soluciones digitales para tu marca.";
  const videoUrl = settings?.heroVideoUrl;
  const mobileVideoUrl = settings?.heroVideoMobileUrl;
  const imageUrl = settings?.heroImageUrl;
  // A background video carries the hero on its own, so the copy is hidden.
  const showText = !videoUrl;

  return (
    <div className="relative flex-1 flex flex-col min-h-[calc(100vh-88px)]">
      {videoUrl ? (
        // Portrait screens get the vertical cut when there is one. Either way they use
        // "contain": phones are taller than 9:16 (and far from 16:9), so "cover" would
        // crop the text in the footage. The letterbox matches its background (#070709).
        // The vertical cut gets a slight zoom biased right: its code is clipped ~8% before
        // the right edge, so this pushes that clip off-screen while keeping the start of
        // each code line (~5% in) and the "BUILT DIFFERENT" title fully visible. The zoom
        // grows from the top edge (not the center) so the first typed line never leaves
        // the screen, even on phones whose browser chrome makes the viewport wider than 9:16.
        <video
          className={`fixed inset-0 w-full h-full object-cover portrait:object-contain bg-[#070709] z-0 ${
            mobileVideoUrl ? "portrait:scale-[1.12] portrait:origin-[36%_0%] portrait:translate-y-[12px]" : ""
          }`}
          autoPlay
          muted
          loop
          playsInline
        >
          {mobileVideoUrl && <source src={mobileVideoUrl} media="(orientation: portrait)" />}
          <source src={videoUrl} />
        </video>
      ) : imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="fixed inset-0 w-full h-full object-cover z-0" />
      ) : null}
      {showText ? (
        <>
          <div className="fixed inset-0 z-[1] bg-black/55 pointer-events-none" />
          <div className="fixed inset-0 z-[1] backdrop-blur-xl bottom-blur-mask pointer-events-none" />
          <div className="fixed inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />
        </>
      ) : (
        // Video-only hero: footage stays clear up top; the bottom fades to near-black
        // (with a soft blur) so the buttons don't blend into busy frames.
        <>
          <div
            className="hidden md:block fixed inset-x-0 top-0 h-44 z-[1] bg-[#070709]/90 backdrop-blur-md pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, black 55%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent)",
            }}
          />
          <div className="fixed inset-0 z-[1] backdrop-blur-sm bottom-blur-mask pointer-events-none" />
          <div className="fixed inset-x-0 bottom-0 h-[45%] z-[1] bg-gradient-to-t from-[#070709]/95 via-[#070709]/70 to-transparent pointer-events-none" />
        </>
      )}

      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16">
        <div className="flex flex-col">
          <div className="flex-1">
            {showText && (
              <>
                <div
                  className="label-mono flex flex-wrap gap-3 sm:gap-6 mb-6 md:mb-8 animate-blur-fade-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <span className="flex items-center gap-1.5">
                    <Star size={16} className="fill-white sm:w-5 sm:h-5" /> 5.0 Clientes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} /> Entregas ágiles
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} /> Disponible ahora
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mb-4 md:mb-6 animate-blur-fade-up"
                  style={{ letterSpacing: "-0.04em", animationDelay: "400ms" }}
                >
                  {title}
                </h1>

                <p
                  className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 md:mb-12 max-w-2xl animate-blur-fade-up"
                  style={{ animationDelay: "500ms" }}
                >
                  {description}
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <BookingButton
                source="home-hero"
                className={`animate-blur-fade-up ${showText ? "" : "shadow-[0_8px_30px_rgba(0,0,0,0.6)]"}`}
                style={{ animationDelay: "600ms" }}
              />
              <a
                href="/portafolio"
                className={`liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 animate-blur-fade-up ${
                  showText ? "" : "bg-black/70 backdrop-blur-md border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                }`}
                style={{ animationDelay: "700ms" }}
              >
                Ver portafolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
