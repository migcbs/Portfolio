import { Star, Clock, Calendar } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const title = settings?.heroTitle ?? "Step Through. Work Smarter.";
  const description =
    settings?.heroDescription ?? "Desarrollo web y soluciones digitales para tu marca.";
  const videoUrl = settings?.heroVideoUrl;
  const imageUrl = settings?.heroImageUrl;

  return (
    <div className="relative flex-1 flex flex-col min-h-[calc(100vh-88px)]">
      {videoUrl ? (
        <video
          className="fixed inset-0 w-full h-full object-cover z-0"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="fixed inset-0 w-full h-full object-cover z-0" />
      ) : null}
      <div className="fixed inset-0 z-[1] bg-black/55 pointer-events-none" />
      <div className="fixed inset-0 z-[1] backdrop-blur-xl bottom-blur-mask pointer-events-none" />
      <div className="fixed inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16">
        <div className="flex flex-col">
          <div className="flex-1">
            <div
              className="flex flex-wrap gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm animate-blur-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <span className="flex items-center gap-1.5 font-medium">
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

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href="/contacto"
                className="bg-white text-black rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 flex items-center gap-2 hover:bg-gray-200 transition-colors animate-blur-fade-up"
                style={{ animationDelay: "600ms" }}
              >
                Contáctame
              </a>
              <a
                href="/portafolio"
                className="liquid-glass rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 animate-blur-fade-up"
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
