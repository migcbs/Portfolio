import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PaquetesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Paquetes</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div
            key={service.id}
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <h2 className="text-xl font-medium mb-2">{service.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            {service.price && (
              <p className="text-2xl font-semibold mb-4">${service.price.toString()}</p>
            )}
            <ul className="text-sm text-gray-400 space-y-1">
              {service.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
        {services.length === 0 && <p className="text-gray-500">Aún no hay paquetes publicados.</p>}
      </div>
    </div>
  );
}
