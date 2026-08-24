"use client";

import { useActionState, useEffect } from "react";
import type { ServiceFormState } from "./actions";

type Values = {
  name: string;
  description: string;
  price: string;
  features: string;
  scope: "PERSONAL" | "AGENCY";
  active: boolean;
  isFavorite: boolean;
  order: number;
};

export function ServiceForm({
  action,
  defaultValues,
  onSuccess,
}: {
  action: (prevState: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  defaultValues?: Values;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState<ServiceFormState, FormData>(action, undefined);

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
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="price">
          Precio (opcional)
        </label>
        <input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues?.price} className={inputClass} />
        {state?.errors?.price?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="features">
          Características (separadas por coma)
        </label>
        <input
          id="features"
          name="features"
          defaultValue={defaultValues?.features}
          className={inputClass}
          placeholder="Diseño a medida, Hosting incluido"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="scope">
          Para qué sección
        </label>
        <select id="scope" name="scope" defaultValue={defaultValues?.scope ?? "PERSONAL"} className={inputClass}>
          <option value="PERSONAL">Desarrollo Web (JARANA)</option>
          <option value="AGENCY">Agencia — foto/video/diseño (JARANA)</option>
        </select>
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
      <div className="mb-6 flex items-center gap-2">
        <input
          id="isFavorite"
          name="isFavorite"
          type="checkbox"
          defaultChecked={defaultValues?.isFavorite ?? false}
          className="w-4 h-4"
        />
        <label htmlFor="isFavorite" className="text-sm text-gray-400">
          Favorito entre los clientes (se resalta en el sitio)
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
