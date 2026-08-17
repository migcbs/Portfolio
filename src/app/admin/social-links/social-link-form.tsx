"use client";

import { useActionState, useEffect, useState } from "react";
import type { SocialLinkFormState } from "./actions";

type Values = { label: string; url: string; scope: "PERSONAL" | "AGENCY"; order: number };

const PRIMARY_PLATFORMS = ["Instagram", "Facebook", "TikTok"];
const OTHER = "Otro";

export function SocialLinkForm({
  action,
  defaultValues,
  onSuccess,
}: {
  action: (prevState: SocialLinkFormState, formData: FormData) => Promise<SocialLinkFormState>;
  defaultValues?: Values;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState<SocialLinkFormState, FormData>(action, undefined);
  const isPrimary = defaultValues ? PRIMARY_PLATFORMS.includes(defaultValues.label) : true;
  const [platform, setPlatform] = useState(isPrimary ? (defaultValues?.label ?? PRIMARY_PLATFORMS[0]) : OTHER);
  const [customLabel, setCustomLabel] = useState(isPrimary ? "" : (defaultValues?.label ?? ""));

  useEffect(() => {
    if (state?.success) onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form action={formAction} className="liquid-glass rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="platform">
          Red social
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className={inputClass}
        >
          {PRIMARY_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value={OTHER}>Otro...</option>
        </select>
        {platform === OTHER && (
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Nombre de la red"
            className={`${inputClass} mt-2`}
          />
        )}
        <input type="hidden" name="label" value={platform === OTHER ? customLabel : platform} />
        {state?.errors?.label?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="url">
          URL
        </label>
        <input id="url" name="url" defaultValue={defaultValues?.url} className={inputClass} required />
        {state?.errors?.url?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="scope">
          Alcance
        </label>
        <select id="scope" name="scope" defaultValue={defaultValues?.scope ?? "PERSONAL"} className={inputClass}>
          <option value="PERSONAL">Personal</option>
          <option value="AGENCY">Agencia</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="order">
          Orden
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className={inputClass}
        />
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
