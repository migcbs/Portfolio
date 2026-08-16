import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TerminosPage() {
  const page = await prisma.legalPage.findUnique({ where: { id: "terms" } });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-8 animate-blur-fade-up">
        {page?.title ?? "Términos y Condiciones"}
      </h1>
      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        {page?.content ?? "Aún no se ha publicado este contenido."}
      </div>
    </div>
  );
}
