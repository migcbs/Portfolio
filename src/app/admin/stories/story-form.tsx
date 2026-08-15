"use client";

import { useActionState } from "react";
import type { StoryFormState } from "./actions";

type Values = {
  clientId: string;
  category: "PHOTO" | "VIDEO" | "MERCH";
  type: "IMAGE" | "VIDEO";
  mediaUrl: string;
  order: number;
  active: boolean;
};
type ClientOption = { id: string; name: string };

export function StoryForm({
  action,
  defaultValues,
  clients,
}: {
  action: (prevState: StoryFormState, formData: FormData) => Promise<StoryFormState>;
  defaultValues?: Values;
  clients: ClientOption[];
}) {
  const [state, formAction, pending] = useActionState<StoryFormState, FormData>(action, undefined);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="clientId">
          Cliente
        </label>
        <select id="clientId" name="clientId" defaultValue={defaultValues?.clientId ?? ""} className={inputClass} required>
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {state?.errors?.clientId?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="category">
          Carpeta
        </label>
        <select id="category" name="category" defaultValue={defaultValues?.category ?? "PHOTO"} className={inputClass}>
          <option value="PHOTO">Fotos</option>
          <option value="VIDEO">Videos</option>
          <option value="MERCH">Merch (mockups)</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="type">
          Tipo de archivo
        </label>
        <select id="type" name="type" defaultValue={defaultValues?.type ?? "IMAGE"} className={inputClass}>
          <option value="IMAGE">Imagen</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="mediaUrl">
          URL del archivo
        </label>
        <input id="mediaUrl" name="mediaUrl" defaultValue={defaultValues?.mediaUrl} className={inputClass} required />
        {state?.errors?.mediaUrl?.map((e) => (
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
