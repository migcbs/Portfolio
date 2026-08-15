"use client";

import { useActionState } from "react";
import { submitPublicReview, type PublicReviewFormState } from "./actions";

export function ReviewSubmitForm() {
  const [state, formAction, pending] = useActionState<PublicReviewFormState, FormData>(
    submitPublicReview,
    undefined
  );
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  if (state?.success) {
    return (
      <div className="liquid-glass rounded-2xl p-6 max-w-xl">
        <p className="text-green-400 text-sm">
          ¡Gracias por tu reseña! Se publicará después de ser revisada.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <h2 className="text-lg font-medium mb-4">Deja tu reseña</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="authorName">
          Tu nombre
        </label>
        <input id="authorName" name="authorName" className={inputClass} required />
        {state?.errors?.authorName?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="rating">
          Calificación (1-5)
        </label>
        <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} className={inputClass} />
        {state?.errors?.rating?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="text">
          Tu experiencia
        </label>
        <textarea id="text" name="text" rows={4} className={inputClass} required />
        {state?.errors?.text?.map((e) => (
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
        {pending ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
