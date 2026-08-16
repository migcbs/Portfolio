"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { updateGeneralSettings, type SettingsFormState } from "./actions";

type Values = {
  portfolioBrand: string;
  agencyBrand: string;
  logoUrl: string;
  backgroundUrl: string;
  contactEmail: string;
};

function Field({
  name,
  label,
  defaultValue,
  errors,
  textarea,
}: {
  name: string;
  label: string;
  defaultValue: string;
  errors?: string[];
  textarea?: boolean;
}) {
  const className =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-1.5" htmlFor={name}>
        {label}
      </label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={defaultValue} rows={4} className={className} />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} className={className} />
      )}
      {errors?.map((err) => (
        <p key={err} className="text-red-400 text-xs mt-1">
          {err}
        </p>
      ))}
    </div>
  );
}

export function GeneralForm({ defaultValues }: { defaultValues: Values }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(
    updateGeneralSettings,
    undefined
  );
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === "1";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <MediaUploadField
        name="logoUrl"
        label="Logo (opcional — si lo dejas vacío se muestra el nombre como texto)"
        defaultValue={defaultValues.logoUrl}
        errors={state?.errors?.logoUrl}
        kind="image"
      />
      <Field
        name="portfolioBrand"
        label="Nombre del portafolio"
        defaultValue={defaultValues.portfolioBrand}
        errors={state?.errors?.portfolioBrand}
      />
      <Field
        name="agencyBrand"
        label="Nombre de la agencia"
        defaultValue={defaultValues.agencyBrand}
        errors={state?.errors?.agencyBrand}
      />
      <Field
        name="contactEmail"
        label="Email de contacto (recibe leads, solicitudes de agenda y reseñas nuevas)"
        defaultValue={defaultValues.contactEmail}
        errors={state?.errors?.contactEmail}
      />
      <MediaUploadField
        name="backgroundUrl"
        label="Fondo de la interfaz (opcional — si lo dejas vacío se usa el fondo de estrellas por defecto)"
        defaultValue={defaultValues.backgroundUrl}
        errors={state?.errors?.backgroundUrl}
        kind="image"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
