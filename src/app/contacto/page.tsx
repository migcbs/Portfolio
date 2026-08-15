import { prisma } from "@/lib/prisma";
import { SocialIcon, detectPlatform } from "@/components/ui/SocialIcon";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

export default async function ContactoPage() {
  const socialLinks = await prisma.socialLink.findMany({
    where: { clientId: null },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-4 animate-blur-fade-up">Contacto</h1>
      <p className="text-gray-400 mb-10 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        Cuéntame sobre tu proyecto y te responderé a la brevedad.
      </p>

      <ContactForm />

      {socialLinks.length > 0 && (
        <div className="animate-blur-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-gray-400 mb-3">También puedes encontrarme en</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center hover:text-white transition-colors"
              >
                <SocialIcon platform={detectPlatform(link.label)} size={18} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
