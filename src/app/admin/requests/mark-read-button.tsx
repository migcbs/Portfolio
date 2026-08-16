"use client";

import { useTransition } from "react";
import { markRequestRead } from "./actions";

export function MarkReadButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => markRequestRead(id))}
      className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      {pending ? "..." : "Marcar leído"}
    </button>
  );
}
