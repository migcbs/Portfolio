"use client";

import NumberFlow from "@number-flow/react";
import { Check } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  features: string[];
};

export function PricingGrid({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <p className="text-gray-500">Aún no hay paquetes publicados.</p>;
  }

  const popularIndex = services.length >= 2 ? 1 : -1;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, i) => {
        const isPopular = i === popularIndex;
        return (
          <div
            key={service.id}
            className={`liquid-glass rounded-2xl p-6 flex flex-col animate-blur-fade-up ${
              isPopular ? "ring-1 ring-white/30" : ""
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {isPopular && (
              <span className="label-mono self-start mb-3 px-3 py-1 rounded-full bg-white text-black">
                Más popular
              </span>
            )}
            <h2 className="text-xl mb-2">{service.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            <div className="mb-6 text-3xl font-semibold">
              {service.price !== null ? (
                <NumberFlow
                  value={service.price}
                  format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
                />
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
            <a
              href="/contacto"
              className="bg-white text-black rounded-full font-medium px-6 py-2.5 text-center hover:bg-gray-200 transition-colors"
            >
              Contáctame
            </a>
          </div>
        );
      })}
    </div>
  );
}
