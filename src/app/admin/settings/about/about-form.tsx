"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { updateAboutSettings, type SettingsFormState } from "../actions";

type Values = {
  aboutText: string;
  aboutImageUrl: string;
};

export function AboutForm({ defaultValues }: { defaultValues: Values }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateAboutSettings, undefined);
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === "1";
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="aboutText">
          Texto de &quot;Sobre mí&quot; (opcional)
        </label>
        <textarea
          id="aboutText"
          name="aboutText"
          defaultValue={defaultValues.aboutText}
          rows={6}
          className={inputClass}
        />
        {state?.errors?.aboutText?.map((err) => (
          <p key={err} className="text-red-400 text-xs mt-1">
            {err}
          </p>
        ))}
      </div>
      <MediaUploadField
        name="aboutImageUrl"
        label="Foto para 'Sobre mí' (opcional)"
        defaultValue={defaultValues.aboutImageUrl}
        errors={state?.errors?.aboutImageUrl}
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
