"use client";

import { useActionState, useEffect } from "react";
import type { ReviewFormState } from "./actions";
import { StarRatingInput } from "@/components/ui/StarRatingInput";

type Values = { authorName: string; text: string; rating: number; approved: boolean };

export function ReviewForm({
  action,
  defaultValues,
  onSuccess,
}: {
  action: (prevState: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
  defaultValues?: Values;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="authorName">
          Nombre del autor
        </label>
        <input
          id="authorName"
          name="authorName"
          defaultValue={defaultValues?.authorName}
          className={inputClass}
          required
        />
        {state?.errors?.authorName?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="text">
          Texto
        </label>
        <textarea id="text" name="text" defaultValue={defaultValues?.text} rows={4} className={inputClass} required />
        {state?.errors?.text?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5">Calificación</label>
        <StarRatingInput name="rating" defaultValue={defaultValues?.rating ?? 5} />
        {state?.errors?.rating?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-6 flex items-center gap-2">
        <input
          id="approved"
          name="approved"
          type="checkbox"
          defaultChecked={defaultValues?.approved ?? false}
          className="w-4 h-4"
        />
        <label htmlFor="approved" className="text-sm text-gray-400">
          Aprobada (visible en el sitio público)
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
