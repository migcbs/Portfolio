"use client";

import { useActionState, useEffect } from "react";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import type { ClientFormState } from "./actions";

type Values = {
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  active: boolean;
  order: number;
};

export function ClientForm({
  action,
  defaultValues,
  onSuccess,
}: {
  action: (prevState: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  defaultValues?: Values;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" defaultValue={defaultValues?.name} className={inputClass} required />
        {state?.errors?.name?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="description">
          Descripción del proyecto/trabajo (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          rows={3}
          className={inputClass}
          placeholder="Qué se hizo para esta marca: foto, video, diseño..."
        />
        {state?.errors?.description?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <MediaUploadField
        name="logoUrl"
        label="Logo (opcional)"
        defaultValue={defaultValues?.logoUrl}
        errors={state?.errors?.logoUrl}
        kind="image"
      />
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="website">
          Sitio web (opcional)
        </label>
        <input id="website" name="website" defaultValue={defaultValues?.website} className={inputClass} />
        {state?.errors?.website?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
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
