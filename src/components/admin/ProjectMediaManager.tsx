"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { addProjectMedia, deleteProjectMedia } from "@/app/admin/portfolio/actions";

type Media = { id: string; category: "PHOTO" | "VIDEO" | "MERCH"; type: "IMAGE" | "VIDEO"; mediaUrl: string };

const CATEGORY_LABELS: Record<Media["category"], string> = {
  PHOTO: "Fotos",
  VIDEO: "Videos",
  MERCH: "Merch",
};
const CATEGORY_ORDER: Media["category"][] = ["PHOTO", "VIDEO", "MERCH"];

export function ProjectMediaManager({ projectId, media }: { projectId: string; media: Media[] }) {
  const [, startTransition] = useTransition();
  const [category, setCategory] = useState<Media["category"]>("PHOTO");
  const [type, setType] = useState<Media["type"]>("IMAGE");
  const [mediaUrl, setMediaUrl] = useState("");
  const [fieldKey, setFieldKey] = useState(0);

  function handleAdd() {
    if (!mediaUrl.trim()) return;
    const fd = new FormData();
    fd.set("category", category);
    fd.set("type", type);
    fd.set("mediaUrl", mediaUrl);
    startTransition(() => addProjectMedia(projectId, fd));
    setMediaUrl("");
    setFieldKey((k) => k + 1);
  }

  return (
    <div className="mb-6 pt-4 border-t border-white/10">
      <p className="text-sm font-medium mb-1">Galería (foto / video / merch)</p>
      <p className="text-xs text-gray-500 mb-4">
        Se muestra como galería estilo stories en la tarjeta pública de este proyecto, organizada por carpeta.
      </p>

      {CATEGORY_ORDER.map((cat) => {
        const items = media.filter((m) => m.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-4">
            <p className="label-mono text-gray-500 mb-2">{CATEGORY_LABELS[cat]}</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {items.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group">
                  {item.type === "VIDEO" ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.mediaUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => startTransition(() => deleteProjectMedia(item.id))}
                    aria-label="Quitar"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex gap-2 mb-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Media["category"])}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        >
          {CATEGORY_ORDER.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Media["type"])}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        >
          <option value="IMAGE">Imagen</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>
      <MediaUploadField
        key={fieldKey}
        name="newProjectMedia"
        label="Archivo"
        kind={type === "VIDEO" ? "video" : "image"}
        onValueChange={setMediaUrl}
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!mediaUrl.trim()}
        className="bg-white text-black rounded-xl font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        Agregar a la galería
      </button>
    </div>
  );
}
