"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "./actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(
    changePassword,
    undefined
  );
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  return (
    <form
      action={formAction}
      key={state?.success ? "reset" : "form"}
      className="liquid-glass rounded-2xl p-6 max-w-xl"
    >
      <h2 className="text-lg font-medium mb-1">Cambiar contraseña</h2>
      <p className="text-xs text-gray-500 mb-4">
        Cámbiala en cuanto termines de revisar el sitio, sobre todo si alguna vez compartiste la actual por chat.
      </p>
      {state?.success && <p className="text-green-400 text-sm mb-4">Contraseña actualizada correctamente.</p>}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="currentPassword">
          Contraseña actual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className={inputClass}
          required
        />
        {state?.errors?.currentPassword?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="newPassword">
          Nueva contraseña
        </label>
        <input id="newPassword" name="newPassword" type="password" className={inputClass} required />
        {state?.errors?.newPassword?.map((e) => (
          <p key={e} className="text-red-400 text-xs mt-1">
            {e}
          </p>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="confirmPassword">
          Confirmar nueva contraseña
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" className={inputClass} required />
        {state?.errors?.confirmPassword?.map((e) => (
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
        {pending ? "Guardando..." : "Actualizar contraseña"}
      </button>
    </form>
  );
}
