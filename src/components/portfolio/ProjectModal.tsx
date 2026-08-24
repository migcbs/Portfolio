"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { MediaGallery } from "@/components/ui/MediaGallery";
import { SocialIcon, detectPlatform } from "@/components/ui/SocialIcon";
import { BookingButton } from "@/components/booking/BookingButton";
import type { Project } from "./ProjectGrid";

const CATEGORY_LABELS: Record<string, string> = {
  WEB_DEV: "Desarrollo Web",
  DIGITAL_MARKETING: "Marketing Digital",
  PHOTO: "Fotografía",
  VIDEO: "Video",
  GRAPHIC_DESIGN: "Diseño Gráfico",
};

const STATUS_BADGE: Record<string, string> = {
  PLANNING: "Procesando",
  IN_PROGRESS: "En desarrollo",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  PLANNING: "bg-white/10 border-white/20",
  IN_PROGRESS: "bg-yellow-500/90 border-yellow-400/60 text-black",
};

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const isMarketing = project.category === "DIGITAL_MARKETING";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-2xl liquid-glass rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {!isMarketing && project.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="w-full h-56 md:h-72 object-cover" />
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="label-mono text-gray-500">{CATEGORY_LABELS[project.category]}</span>
            {STATUS_BADGE[project.status] && (
              <span
                className={`label-mono px-3 py-1 rounded-full border ${STATUS_BADGE_CLASS[project.status]}`}
              >
                {STATUS_BADGE[project.status]}
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-medium mb-3">{project.title}</h2>
          <p className="text-gray-400 text-sm mb-4">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="label-mono px-2 py-1 rounded-full bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isMarketing ? (
            <>
              {project.socialLinks.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  {project.socialLinks.map((link) => (
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
              <MediaGallery title={project.title} items={project.media} />
            </>
          ) : (
            project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors mb-6"
              >
                Ver sitio <ExternalLink size={16} />
              </a>
            )
          )}

          <div className="mt-6">
            <BookingButton source={`project-modal:${project.title}`} variant="glass" />
          </div>
        </div>
      </div>
    </div>
  );
}
