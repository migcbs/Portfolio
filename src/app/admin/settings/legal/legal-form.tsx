"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import type { LegalFormState } from "./actions";

type Values = { title: string; content: string };

export function LegalForm({
  id,
  label,
  action,
  defaultValues,
}: {
  id: "terms" | "privacy";
  label: string;
  action: (prevState: LegalFormState, formData: FormData) => Promise<LegalFormState>;
  defaultValues: Values;
}) {
  const [state, formAction, pending] = useActionState<LegalFormState, FormData>(action, undefined);
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === id;
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-2xl mb-8">
      <h2 className="text-lg font-medium mb-4">{label}</h2>
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor={`${label}-title`}>
          Título
        </label>
        <input id={`${label}-title`} name="title" defaultValue={defaultValues.title} className={inputClass} required />
        {state?.errors?.title?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor={`${label}-content`}>
          Contenido (separa párrafos con una línea en blanco)
        </label>
        <textarea
          id={`${label}-content`}
          name="content"
          defaultValue={defaultValues.content}
          rows={16}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          required
        />
        {state?.errors?.content?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
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
