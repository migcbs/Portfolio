"use client";

import NumberFlow from "@number-flow/react";
import { Check } from "lucide-react";
import { BookingButton } from "@/components/booking/BookingButton";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  features: string[];
  isFavorite?: boolean;
};

export function PricingGrid({
  services,
  bookingSource,
  showHostingBadge,
}: {
  services: Service[];
  /** When set, each card's CTA opens the booking modal (tagged with this source) instead of linking to /contacto. */
  bookingSource?: string;
  /** Shows a "Hosting + Dominio gratis por un año" badge on every card — for Desarrollo Web packages. */
  showHostingBadge?: boolean;
}) {
  if (services.length === 0) {
    return <p className="text-gray-500">Aún no hay paquetes publicados.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, i) => {
        const isFavorite = service.isFavorite ?? false;
        return (
          <div
            key={service.id}
            className={`liquid-glass rounded-2xl p-6 flex flex-col animate-blur-fade-up ${
              isFavorite ? "ring-2 ring-yellow-400/60 scale-[1.02]" : ""
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {showHostingBadge && (
                <span className="label-mono px-3 py-1 rounded-full bg-yellow-400 text-black">
                  Hosting + Dominio gratis por un año
                </span>
              )}
              {isFavorite && (
                <span className="label-mono px-3 py-1 rounded-full bg-yellow-400 text-black">
                  Favorito entre los clientes
                </span>
              )}
            </div>
            <h2 className="text-xl mb-2">{service.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            <div className="mb-6 text-3xl font-semibold">
              {service.price !== null ? (
                <span className="inline-flex items-baseline">
                  $
                  <NumberFlow
                    value={service.price}
                    format={{ style: "decimal", trailingZeroDisplay: "stripIfInteger" }}
                  />
                </span>
              ) : (
                "A cotizar"
              )}
            </div>
            <ul className="text-sm text-gray-400 space-y-2 flex-1 mb-6">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check size={16} className="shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            {bookingSource ? (
              <BookingButton
                source={`${bookingSource}:${service.name}`}
                label="Agenda ya"
                className="w-full justify-center"
              />
            ) : (
              <a
                href="/contacto"
                className="bg-white text-black rounded-full font-medium px-6 py-2.5 text-center hover:bg-gray-200 transition-colors"
              >
                Contáctame
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
