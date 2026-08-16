"use client";

import { useActionState } from "react";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import type { PortfolioFormState } from "./actions";

type Values = {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string;
  category: string;
  status: string;
  progress: number;
  devTime: string;
  internalNotes: string;
  active: boolean;
  order: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  WEB_DEV: "Desarrollo Web",
  DIGITAL_MARKETING: "Marketing Digital",
  PHOTO: "Fotografía",
  VIDEO: "Video",
  GRAPHIC_DESIGN: "Diseño Gráfico",
};

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Procesando (aún no inicia)",
  IN_PROGRESS: "En desarrollo",
  COMPLETED: "Terminado",
};

export function PortfolioForm({
  action,
  defaultValues,
}: {
  action: (prevState: PortfolioFormState, formData: FormData) => Promise<PortfolioFormState>;
  defaultValues?: Values;
}) {
  const [state, formAction, pending] = useActionState<PortfolioFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="title">
          Título
        </label>
        <input id="title" name="title" defaultValue={defaultValues?.title} className={inputClass} required />
        {state?.errors?.title?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
          className={inputClass}
          required
        />
        {state?.errors?.description?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="category">
          Categoría
        </label>
        <select id="category" name="category" defaultValue={defaultValues?.category ?? "WEB_DEV"} className={inputClass}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <MediaUploadField
        name="imageUrl"
        label="Imagen (opcional)"
        defaultValue={defaultValues?.imageUrl}
        errors={state?.errors?.imageUrl}
        kind="image"
      />
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="projectUrl">
          URL del proyecto (opcional)
        </label>
        <input id="projectUrl" name="projectUrl" defaultValue={defaultValues?.projectUrl} className={inputClass} />
        {state?.errors?.projectUrl?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="tags">
          Tags (separados por coma)
        </label>
        <input id="tags" name="tags" defaultValue={defaultValues?.tags} className={inputClass} placeholder="Next.js, Diseño Web" />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="order">
          Orden
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
      </div>
      <div className="mb-6 flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="w-4 h-4"
        />
        <label htmlFor="active" className="text-sm text-gray-400">
          Activo (visible en el sitio público)
        </label>
      </div>

      <div className="mb-2 pt-4 border-t border-white/10">
        <p className="text-sm font-medium mb-1">Seguimiento interno</p>
        <p className="text-xs text-gray-500 mb-4">
          Solo para ti — el estado sí se refleja como etiqueta pública (&quot;En desarrollo&quot; / &quot;Procesando&quot;)
          cuando el proyecto no está terminado. El progreso y las notas nunca se muestran al público.
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="status">
          Estado del proyecto
        </label>
        <select id="status" name="status" defaultValue={defaultValues?.status ?? "COMPLETED"} className={inputClass}>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="progress">
          Avance (%)
        </label>
        <input
          id="progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          defaultValue={defaultValues?.progress ?? 100}
          className={inputClass}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="devTime">
          Tiempo de desarrollo (opcional)
        </label>
        <input
          id="devTime"
          name="devTime"
          defaultValue={defaultValues?.devTime}
          className={inputClass}
          placeholder="3 semanas, 48 horas..."
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="internalNotes">
          Notas internas (opcional)
        </label>
        <textarea
          id="internalNotes"
          name="internalNotes"
          defaultValue={defaultValues?.internalNotes}
          rows={3}
          className={inputClass}
          placeholder="Pendientes, bloqueos, próximos pasos..."
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
