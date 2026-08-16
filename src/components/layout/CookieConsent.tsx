"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export type CookieConsent = "accepted" | "rejected";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin && !getCookieConsent()) setVisible(true);
  }, [isAdmin]);

  function choose(value: CookieConsent) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible || isAdmin) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[95] p-4 sm:p-6 flex justify-center">
      <div className="liquid-glass rounded-2xl p-5 sm:p-6 max-w-xl w-full flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-gray-300 flex-1">
          Usamos únicamente cookies técnicas necesarias para el funcionamiento del sitio (como la sesión del panel
          de administración) y una cookie propia para recordar esta elección. No usamos cookies de analítica ni
          publicidad.{" "}
          <Link href="/privacidad" className="underline hover:text-white transition-colors">
            Ver política de privacidad
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="liquid-glass px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
