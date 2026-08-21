"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    undefined
  );
  const [projectType, setProjectType] = useState<"WEB_DEV" | "DIGITAL_MARKETING" | "">("");
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
        <label className="block text-sm text-gray-400 mb-1.5">¿Qué tipo de proyecto es?</label>
        <select
          name="projectType"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value as typeof projectType)}
          className={`${inputClass} w-full`}
          required
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="WEB_DEV">Desarrollo Web</option>
          <option value="DIGITAL_MARKETING">Marketing Digital</option>
        </select>
        {state?.errors?.projectType?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>

      {projectType === "DIGITAL_MARKETING" && (
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">¿Diseño, o fotografía y video?</label>
          <select name="marketingFocus" defaultValue="" className={`${inputClass} w-full`} required>
            <option value="" disabled>
              Selecciona una opción
            </option>
            <option value="DESIGN">Diseño</option>
            <option value="PHOTO_VIDEO">Fotografía y Video</option>
          </select>
          {state?.errors?.marketingFocus?.map((e) => (
            <p key={e} className="text-red-400 text-xs mt-1">
              {e}
            </p>
          ))}
        </div>
      )}

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
