"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/admin/login" })}
      className="mt-2 px-3 py-2 rounded-lg text-sm text-left text-red-400 hover:bg-white/5 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
