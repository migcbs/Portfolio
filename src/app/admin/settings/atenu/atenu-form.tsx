"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { updateAtenuSettings, type SettingsFormState } from "../actions";

type Values = {
  agencyTagline: string;
  agencyServices: string;
  atenuIntro: string;
  atenuCustomText: string;
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

export function AtenuForm({ defaultValues }: { defaultValues: Values }) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateAtenuSettings, undefined);
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("success") === "1";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      {justSaved && <p className="text-green-400 text-sm mb-4">Guardado correctamente.</p>}
      <p className="text-xs text-gray-500 mb-4">
        Esto controla el texto de la página pública /atenu. Los paquetes (desarrollo web y agencia) se gestionan
        aparte, en la pestaña Paquetes.
      </p>
      <Field
        name="agencyTagline"
        label="Subtítulo de JXRXNX"
        defaultValue={defaultValues.agencyTagline}
        errors={state?.errors?.agencyTagline}
      />
      <Field
        name="agencyServices"
        label="Servicios de JXRXNX (separados por coma)"
        defaultValue={defaultValues.agencyServices}
        errors={state?.errors?.agencyServices}
      />
      <Field
        name="atenuIntro"
        label="Introducción del landing de JXRXNX"
        defaultValue={defaultValues.atenuIntro}
        errors={state?.errors?.atenuIntro}
        textarea
      />
      <Field
        name="atenuCustomText"
        label="Texto de 'A tu medida' (trabajo personalizado)"
        defaultValue={defaultValues.atenuCustomText}
        errors={state?.errors?.atenuCustomText}
        textarea
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
