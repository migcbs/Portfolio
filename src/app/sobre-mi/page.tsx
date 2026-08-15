import { prisma } from "@/lib/prisma";

export default async function SobreMiPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-6 animate-blur-fade-up">Sobre mí</h1>
      <p className="text-gray-400 text-base md:text-lg animate-blur-fade-up" style={{ animationDelay: "150ms" }}>
        {settings?.aboutText ||
          "Desarrollador web freelance y fundador de ATENU BrandHouse, ayudando a marcas a construir su presencia digital."}
      </p>
    </div>
  );
}
