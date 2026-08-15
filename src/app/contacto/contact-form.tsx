"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    undefined
  );
  const inputClass =
    "px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500 outline-none focus:border-white/30";

  if (state?.success) {
    return (
      <div className="liquid-glass rounded-2xl p-6 mb-10">
        <p className="text-green-400 text-sm">
          ¡Gracias por escribirme! Te responderé a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 animate-blur-fade-up mb-10" style={{ animationDelay: "200ms" }}>
      <div>
        <input type="text" name="name" placeholder="Nombre" className={`${inputClass} w-full`} required />
        {state?.errors?.name?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div>
        <input type="email" name="email" placeholder="Email" className={`${inputClass} w-full`} required />
        {state?.errors?.email?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div>
        <textarea name="message" placeholder="Mensaje" rows={5} className={`${inputClass} w-full`} required />
        {state?.errors?.message?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-white text-black rounded-full font-medium py-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
