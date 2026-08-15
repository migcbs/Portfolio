import { prisma } from "@/lib/prisma";
import { SocialIcon, detectPlatform } from "@/components/ui/SocialIcon";

export default async function Footer({ agencyBrand }: { agencyBrand: string }) {
  const socialLinks = await prisma.socialLink.findMany({
    where: { clientId: null },
    orderBy: { order: "asc" },
  });

  return (
    <footer className="label-mono relative z-10 px-4 sm:px-6 md:px-12 py-8 text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
        <span>© {new Date().getFullYear()} Miguel Ceballos — Portafolio</span>
        <span>{agencyBrand}</span>
      </div>
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center hover:text-white transition-colors"
            >
              <SocialIcon platform={detectPlatform(link.label)} size={16} />
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
