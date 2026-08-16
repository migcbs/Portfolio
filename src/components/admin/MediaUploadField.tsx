"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

type Kind = "image" | "video";

export function MediaUploadField({
  name,
  label,
  defaultValue,
  errors,
  kind = "image",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  errors?: string[];
  kind?: Kind;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setValue(blob.url);
    } catch {
      setError("No se pudo subir el archivo. Verifica que BLOB_READ_WRITE_TOKEN esté configurado.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Pega una URL o sube un archivo"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="liquid-glass shrink-0 px-3 rounded-xl flex items-center gap-1.5 text-xs disabled:opacity-50"
        >
          <UploadCloud size={14} />
          {uploading ? "Subiendo..." : "Subir"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Quitar"
            className="liquid-glass shrink-0 w-9 rounded-xl flex items-center justify-center"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={kind === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {value && (
        <div className="mt-2 h-24 w-full max-w-[200px] rounded-lg overflow-hidden border border-white/10 bg-black/40">
          {kind === "video" ? (
            <video src={value} className="h-full w-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {errors?.map((err) => (
        <p key={err} className="text-red-400 text-xs mt-1">
          {err}
        </p>
      ))}
    </div>
  );
}
