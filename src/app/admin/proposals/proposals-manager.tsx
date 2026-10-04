"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AddButton, EditButton } from "@/components/admin/IconButton";
import { CardGrid, DetailField, RecordCard, formatDate } from "@/components/admin/RecordCard";
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

function totalOf(proposal: Proposal) {
  return proposal.items.reduce((sum, item) => sum + Number(item.price), 0);
}

function formatMoney(value: number) {
  return `$${value.toLocaleString("es-MX")}`;
}

export function ProposalsManager({ proposals }: { proposals: Proposal[] }) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const viewing = viewingId ? (proposals.find((p) => p.id === viewingId) ?? null) : null;
  const editingProposal = editingId ? (proposals.find((p) => p.id === editingId) ?? null) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Propuestas</h1>
          <p className="text-sm text-gray-500 mt-1">Cotizaciones con firma y anticipo, listas para compartir.</p>
        </div>
        <AddButton onClick={() => setCreating(true)} label="Nueva propuesta" />
      </div>

      <CardGrid isEmpty={proposals.length === 0} empty="Aún no hay propuestas.">
        {proposals.map((proposal) => (
          <RecordCard
            key={proposal.id}
            onClick={() => setViewingId(proposal.id)}
            title={proposal.title}
            subtitle={proposal.clientName}
            badge={
              <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${STATUS_CLASS[proposal.status]}`}>
                {STATUS_LABEL[proposal.status]}
              </span>
            }
            body={proposal.description}
            footer={
              <>
                <span className="text-gray-300">{formatMoney(totalOf(proposal))}</span>
                <span>{proposal.items.length} conceptos</span>
                {proposal.validUntil && <span>Vence {formatDate(proposal.validUntil)}</span>}
              </>
            }
          />
        ))}
      </CardGrid>

      <Modal open={viewing !== null} onClose={() => setViewingId(null)} size="lg">
        {viewing && (
          <div className="liquid-glass rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className={`text-xs px-3 py-1 rounded-full ${STATUS_CLASS[viewing.status]}`}>
                  {STATUS_LABEL[viewing.status]}
                </span>
                <h2 className="text-xl font-medium mt-3">{viewing.title}</h2>
              </div>
              <div className="flex gap-2">
                <EditButton
                  onClick={() => {
                    setEditingId(viewing.id);
                    setViewingId(null);
                  }}
                />
                <DeleteButton
                  id={viewing.id}
                  action={deleteProposal}
                  itemLabel={`la propuesta "${viewing.title}"`}
                  onDeleted={() => setViewingId(null)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <DetailField label="Cliente">{viewing.clientName}</DetailField>
              <DetailField label="Email">
                <a href={`mailto:${viewing.clientEmail}`} className="hover:text-gray-300 break-all">
                  {viewing.clientEmail}
                </a>
              </DetailField>
              <DetailField label="Anticipo">
                {viewing.depositPercent}% · {formatMoney((totalOf(viewing) * viewing.depositPercent) / 100)}
                {viewing.depositPaidAt && <span className="text-green-400"> · pagado</span>}
              </DetailField>
              <DetailField label="Vigencia">{viewing.validUntil ? formatDate(viewing.validUntil) : "—"}</DetailField>
              {viewing.signedAt && (
                <DetailField label="Firmada">
                  {viewing.signedByName} · {formatDate(viewing.signedAt, true)}
                </DetailField>
              )}
              <DetailField label="Enlace para el cliente">
                <a href={`/propuesta/${viewing.token}`} target="_blank" rel="noreferrer" className="hover:text-gray-300 break-all">
                  /propuesta/{viewing.token}
                </a>
              </DetailField>
            </div>

            {viewing.description && (
              <div className="mb-5">
                <DetailField label="Descripción">
                  <p className="whitespace-pre-line text-gray-300">{viewing.description}</p>
                </DetailField>
              </div>
            )}

            <DetailField label="Conceptos">
              <div className="space-y-1.5 mt-1">
                {viewing.items.map((item) => (
                  <div key={item.id} className="flex justify-between liquid-glass rounded-xl px-3 py-2">
                    <span>{item.label}</span>
                    <span className="text-gray-400">{formatMoney(Number(item.price))}</span>
                  </div>
                ))}
                {viewing.items.length === 0 && <p className="text-xs text-gray-500">Aún no hay conceptos.</p>}
              </div>
              <p className="font-medium mt-3 text-right">Total: {formatMoney(totalOf(viewing))}</p>
            </DetailField>
          </div>
        )}
      </Modal>

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
