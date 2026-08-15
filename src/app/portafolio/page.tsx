import { prisma } from "@/lib/prisma";

export default async function PortafolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Portafolio</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <a
            key={project.id}
            href={project.projectUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <h2 className="text-xl font-medium mb-2">{project.title}</h2>
            <p className="text-gray-400 text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
        {projects.length === 0 && <p className="text-gray-500">Aún no hay proyectos publicados.</p>}
      </div>
    </div>
  );
}
