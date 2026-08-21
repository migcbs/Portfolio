"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { addProposalItem, deleteProposalItem } from "@/app/admin/proposals/actions";

type Item = { id: string; label: string; price: string };

export function ProposalItemsManager({ proposalId, items }: { proposalId: string; items: Item[] }) {
  const [, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const inputClass =
    "px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30";

  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  function handleAdd() {
    if (!label.trim() || !price.trim()) return;
    const fd = new FormData();
    fd.set("label", label);
    fd.set("price", price);
    startTransition(() => addProposalItem(proposalId, fd));
    setLabel("");
    setPrice("");
  }

  return (
    <div className="mb-6 pt-4 border-t border-white/10">
      <p className="text-sm font-medium mb-3">Conceptos</p>

      <div className="space-y-1.5 mb-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between liquid-glass rounded-xl px-3 py-2">
            <span className="text-sm">{item.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">${Number(item.price).toLocaleString("es-MX")}</span>
              <button
                type="button"
                onClick={() => startTransition(() => deleteProposalItem(item.id))}
                aria-label="Quitar"
                className="text-gray-500 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-500">Aún no hay conceptos.</p>}
      </div>

      {items.length > 0 && (
        <p className="text-sm font-medium mb-3">Total: ${total.toLocaleString("es-MX")}</p>
      )}

      <div className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Diseño de landing page"
          className={`${inputClass} flex-1`}
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          step="0.01"
          placeholder="0.00"
          className={`${inputClass} w-28`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-white text-black rounded-xl font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors shrink-0"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
