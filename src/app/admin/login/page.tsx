"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        action={formAction}
        className="liquid-glass rounded-2xl p-8 w-full max-w-sm animate-blur-fade-up"
      >
        <h1 className="text-2xl font-medium mb-6">Acceso admin</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full mb-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          className="w-full mb-4 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-black rounded-full font-medium py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
