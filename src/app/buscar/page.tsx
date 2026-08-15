import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [projects, services] = query
    ? await Promise.all([
        prisma.portfolioProject.findMany({
          where: {
            active: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
        prisma.service.findMany({
          where: {
            active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          orderBy: { order: "asc" },
        }),
      ])
    : [[], []];

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-8 animate-blur-fade-up">Buscar</h1>
      <form className="mb-10 max-w-xl" action="/buscar">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar proyectos o paquetes..."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
      </form>

      {query && projects.length === 0 && services.length === 0 && (
        <p className="text-gray-500">No se encontraron resultados para &ldquo;{query}&rdquo;.</p>
      )}

      {projects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Proyectos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href="/portafolio" className="liquid-glass rounded-2xl p-6 block">
                <h3 className="font-medium mb-1">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {services.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Paquetes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.id} href="/paquetes" className="liquid-glass rounded-2xl p-6 block">
                <h3 className="font-medium mb-1">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
