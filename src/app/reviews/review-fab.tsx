"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { submitPublicReview, type PublicReviewFormState } from "./actions";
import { StarRatingInput } from "@/components/ui/StarRatingInput";

export function ReviewFab() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<PublicReviewFormState, FormData>(
    submitPublicReview,
    undefined
  );
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setOpen(true)}
          aria-label="Dejar una reseña"
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black hover:bg-gray-200 transition-colors shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md md:max-w-lg liquid-glass rounded-2xl p-6 sm:p-8 bg-gray-950"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 liquid-glass w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X size={16} />
            </button>

            {state?.success ? (
              <p className="text-green-400 text-sm py-4">
                ¡Gracias por tu reseña! Se publicará después de ser revisada.
              </p>
            ) : (
              <form action={formAction}>
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
                  <label className="block text-sm text-gray-400 mb-1.5">Calificación</label>
                  <StarRatingInput name="rating" defaultValue={5} />
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
                  className="w-full bg-white text-black rounded-full font-medium px-6 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {pending ? "Enviando..." : "Enviar reseña"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
