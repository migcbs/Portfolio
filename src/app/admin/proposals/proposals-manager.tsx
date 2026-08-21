"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ProposalForm } from "./proposal-form";
import { createProposal, updateProposal, deleteProposal } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  ACCEPTED: "Aceptada",
  DECLINED: "Rechazada",
};
const STATUS_CLASS: Record<string, string> = {
  DRAFT: "bg-white/10 text-gray-300",
  SENT: "bg-blue-500/20 text-blue-300",
  ACCEPTED: "bg-green-500/20 text-green-400",
  DECLINED: "bg-red-500/20 text-red-400",
};

type Item = { id: string; label: string; price: string };
type Proposal = {
  id: string;
  token: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string | null;
  depositPercent: number;
  validUntil: string | Date | null;
  status: string;
  signedByName: string | null;
  signedAt: string | Date | null;
  depositPaidAt: string | Date | null;
  items: Item[];
};

export function ProposalsManager({ proposals }: { proposals: Proposal[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const editingProposal = editingId ? (proposals.find((p) => p.id === editingId) ?? null) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Propuestas</h1>
          <p className="text-sm text-gray-500 mt-1">Cotizaciones con firma y anticipo, listas para compartir.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nueva propuesta
        </button>
      </div>
      <div className="liquid-glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Cliente</th>
              <th className="p-4">Título</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => {
              const total = proposal.items.reduce((sum, item) => sum + Number(item.price), 0);
              return (
                <tr key={proposal.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4">
                    <p>{proposal.clientName}</p>
                    <p className="text-gray-500 text-xs">{proposal.clientEmail}</p>
                  </td>
                  <td className="p-4 text-gray-400">{proposal.title}</td>
                  <td className="p-4 text-gray-400">${total.toLocaleString("es-MX")}</td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${STATUS_CLASS[proposal.status]}`}>
                      {STATUS_LABEL[proposal.status]}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <button type="button" onClick={() => setEditingId(proposal.id)} className="text-sm hover:text-gray-300">
                      Editar
                    </button>
                    <DeleteButton id={proposal.id} action={deleteProposal} itemLabel={`la propuesta "${proposal.title}"`} />
                  </td>
                </tr>
              );
            })}
            {proposals.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  Aún no hay propuestas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <ProposalForm action={createProposal} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editingProposal !== null} onClose={() => setEditingId(null)}>
        {editingProposal && (
          <ProposalForm
            action={updateProposal.bind(null, editingProposal.id)}
            defaultValues={{
              clientName: editingProposal.clientName,
              clientEmail: editingProposal.clientEmail,
              title: editingProposal.title,
              description: editingProposal.description ?? "",
              depositPercent: editingProposal.depositPercent,
              validUntil: editingProposal.validUntil
                ? new Date(editingProposal.validUntil).toISOString().slice(0, 10)
                : "",
            }}
            editing={{
              id: editingProposal.id,
              token: editingProposal.token,
              status: editingProposal.status,
              items: editingProposal.items,
              signedByName: editingProposal.signedByName,
              signedAt: editingProposal.signedAt,
              depositPaidAt: editingProposal.depositPaidAt,
            }}
          />
        )}
      </Modal>
    </div>
  );
}
