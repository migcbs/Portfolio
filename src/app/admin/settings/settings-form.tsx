"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { updateSiteSettings, type SettingsFormState } from "./actions";

type Values = {
  portfolioBrand: string;
  agencyBrand: string;
  heroTitle: string;
  heroDescription: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  aboutText: string;
  aboutImageUrl: string;
  contactEmail: string;
  agencyTagline: string;
  agencyServices: string;
  logoUrl: string;
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

export function SettingsForm({ defaultValues }: { defaultValues: Values }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(
    updateSiteSettings,
    undefined
  );
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === "1";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <Field
        name="logoUrl"
        label="Logo (URL, opcional — si lo dejas vacío se muestra el nombre como texto)"
        defaultValue={defaultValues.logoUrl}
        errors={state?.errors?.logoUrl}
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
      <Field
        name="heroVideoUrl"
        label="URL de video de fondo (opcional)"
        defaultValue={defaultValues.heroVideoUrl}
        errors={state?.errors?.heroVideoUrl}
      />
      <Field
        name="heroImageUrl"
        label="URL de imagen de fondo (opcional, se usa si no hay video)"
        defaultValue={defaultValues.heroImageUrl}
        errors={state?.errors?.heroImageUrl}
      />
      <Field
        name="aboutText"
        label="Texto de 'Sobre mí' (opcional)"
        defaultValue={defaultValues.aboutText}
        errors={state?.errors?.aboutText}
        textarea
      />
      <Field
        name="aboutImageUrl"
        label="Foto para 'Sobre mí' (URL, opcional)"
        defaultValue={defaultValues.aboutImageUrl}
        errors={state?.errors?.aboutImageUrl}
      />
      <Field
        name="contactEmail"
        label="Email de contacto (opcional)"
        defaultValue={defaultValues.contactEmail}
        errors={state?.errors?.contactEmail}
      />
      <Field
        name="agencyTagline"
        label="Subtítulo de la agencia"
        defaultValue={defaultValues.agencyTagline}
        errors={state?.errors?.agencyTagline}
      />
      <Field
        name="agencyServices"
        label="Servicios de la agencia (separados por coma)"
        defaultValue={defaultValues.agencyServices}
        errors={state?.errors?.agencyServices}
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
