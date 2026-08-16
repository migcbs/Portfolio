"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { updateHeroSettings, type SettingsFormState } from "../actions";

type Values = {
  heroTitle: string;
  heroDescription: string;
  heroVideoUrl: string;
  heroImageUrl: string;
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

export function HeroForm({ defaultValues }: { defaultValues: Values }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateHeroSettings, undefined);
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === "1";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <Field
        name="heroTitle"
        label="Título del hero"
        defaultValue={defaultValues.heroTitle}
        errors={state?.errors?.heroTitle}
      />
      <Field
        name="heroDescription"
        label="Descripción del hero"
        defaultValue={defaultValues.heroDescription}
        errors={state?.errors?.heroDescription}
        textarea
      />
      <MediaUploadField
        name="heroVideoUrl"
        label="Video de fondo del hero (opcional)"
        defaultValue={defaultValues.heroVideoUrl}
        errors={state?.errors?.heroVideoUrl}
        kind="video"
      />
      <MediaUploadField
        name="heroImageUrl"
        label="Imagen de fondo del hero (opcional, se usa si no hay video)"
        defaultValue={defaultValues.heroImageUrl}
        errors={state?.errors?.heroImageUrl}
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
