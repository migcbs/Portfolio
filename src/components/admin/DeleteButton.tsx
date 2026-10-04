"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/admin/IconButton";
import { Modal } from "@/components/admin/Modal";

type Props = {
  id: string;
  action: (id: string) => Promise<void>;
  itemLabel: string;
  onDeleted?: () => void;
};

// Uses an in-app confirmation instead of window.confirm(), which embedded
// browsers and some popup blockers suppress — that silently cancelled deletes.
export function DeleteButton({ id, action, itemLabel, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await action(id);
        setOpen(false);
        onDeleted?.();
      } catch {
        setError("No se pudo eliminar. Intenta de nuevo.");
      }
    });
  }

  return (
    <>
      <IconButton icon={X} label={`Eliminar ${itemLabel}`} onClick={() => setOpen(true)} variant="danger" disabled={pending} />

      <Modal open={open} onClose={() => !pending && setOpen(false)} size="sm">
        <div className="liquid-glass rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-2">¿Eliminar {itemLabel}?</h2>
          <p className="text-sm text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="liquid-glass rounded-full px-5 py-2 text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pending}
              className="bg-red-500 text-white rounded-full px-5 py-2 text-sm hover:bg-red-400 transition-colors disabled:opacity-50"
            >
              {pending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
