"use client";

import { useTransition } from "react";
import { toggleReviewApproved } from "./actions";

export function ApproveToggle({ id, approved }: { id: string; approved: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleReviewApproved(id, !approved))}
      className={`text-xs px-3 py-1 rounded-full transition-colors disabled:opacity-50 ${
        approved ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-400"
      }`}
    >
      {pending ? "..." : approved ? "Aprobada" : "Pendiente"}
    </button>
  );
}
