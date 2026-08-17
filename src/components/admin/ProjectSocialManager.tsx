"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { SocialIcon, detectPlatform } from "@/components/ui/SocialIcon";
import { addProjectSocialLink, deleteProjectSocialLink } from "@/app/admin/portfolio/actions";

type SocialLink = { id: string; label: string; url: string };

const PRIMARY_PLATFORMS = ["Instagram", "Facebook", "TikTok"];
const OTHER = "Otro";

export function ProjectSocialManager({ projectId, links }: { projectId: string; links: SocialLink[] }) {
  const [, startTransition] = useTransition();
  const [platform, setPlatform] = useState(PRIMARY_PLATFORMS[0]);
  const [customLabel, setCustomLabel] = useState("");
  const [url, setUrl] = useState("");
  const inputClass =
    "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  function handleAdd() {
    const label = platform === OTHER ? customLabel.trim() : platform;
    if (!label || !url.trim()) return;
    const fd = new FormData();
    fd.set("label", label);
    fd.set("url", url);
    startTransition(() => addProjectSocialLink(projectId, fd));
    setCustomLabel("");
    setUrl("");
  }

  return (
    <div className="mb-6 pt-4 border-t border-white/10">
      <p className="text-sm font-medium mb-1">Redes sociales del cliente</p>
      <p className="text-xs text-gray-500 mb-4">
        Se muestran como iconos en la tarjeta pública de este proyecto.
      </p>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {links.map((link) => (
            <div key={link.id} className="liquid-glass flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full">
              <SocialIcon platform={detectPlatform(link.label)} size={14} />
              <span className="text-xs">{link.label}</span>
              <button
                type="button"
                onClick={() => startTransition(() => deleteProjectSocialLink(link.id))}
                aria-label="Quitar"
                className="text-gray-500 hover:text-red-400"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClass}>
          {PRIMARY_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value={OTHER}>Otro...</option>
        </select>
        {platform === OTHER && (
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Nombre de la red"
            className={inputClass}
          />
        )}
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="https://instagram.com/..."
          className={`${inputClass} flex-1`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-white text-black rounded-xl font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors shrink-0"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
