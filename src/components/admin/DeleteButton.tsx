"use client";

import { useTransition } from "react";

type Props = {
  id: string;
  action: (id: string) => Promise<void>;
  itemLabel: string;
};

export function DeleteButton({ id, action, itemLabel }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`¿Eliminar "${itemLabel}"? Esta acción no se puede deshacer.`)) {
          startTransition(() => action(id));
        }
      }}
      className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
    >
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
