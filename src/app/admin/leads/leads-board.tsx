"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StageSelect } from "@/components/admin/StageSelect";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { CardGrid, DetailField, RecordCard, StageBadge, formatDate, isOverdue } from "@/components/admin/RecordCard";
import type { PipelineStage } from "@/lib/pipeline";
import { deleteLead, updateLeadStage, setLeadFollowUp, addLeadNote, deleteLeadNote } from "./actions";
import { MarkReadButton } from "./mark-read-button";

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  stage: PipelineStage;
  followUpAt: Date | null;
  createdAt: Date;
  notes: { id: string; text: string; createdAt: Date }[];
};

export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  // Look up by id so the pop-up reflects fresh server data after each action.
  const lead = openId ? (leads.find((l) => l.id === openId) ?? null) : null;

  return (
    <div>
      <h1 className="text-2xl font-medium mb-1">Leads</h1>
      <p className="text-sm text-gray-500 mb-6">Mensajes del formulario de contacto.</p>

      <CardGrid isEmpty={leads.length === 0} empty="Aún no hay mensajes de contacto.">
        {leads.map((l) => (
          <RecordCard
            key={l.id}
            onClick={() => setOpenId(l.id)}
            unread={!l.read}
            title={l.name}
            subtitle={l.email}
            badge={<StageBadge stage={l.stage} />}
            body={l.message}
            footer={
              <>
                <span>{formatDate(l.createdAt)}</span>
                {l.notes.length > 0 && <span>{l.notes.length} notas</span>}
                {isOverdue(l.followUpAt) && <span className="text-yellow-400">Seguimiento vencido</span>}
              </>
            }
          />
        ))}
      </CardGrid>

      <Modal open={lead !== null} onClose={() => setOpenId(null)} size="lg">
        {lead && (
          <div className="liquid-glass rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium">{lead.name}</h2>
                <p className="label-mono text-gray-500 mt-1">{formatDate(lead.createdAt, true)}</p>
              </div>
              <DeleteButton
                id={lead.id}
                action={deleteLead}
                itemLabel={`el mensaje de ${lead.name}`}
                onDeleted={() => setOpenId(null)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <DetailField label="Email">
                <a href={`mailto:${lead.email}`} className="hover:text-gray-300 break-all">
                  {lead.email}
                </a>
              </DetailField>
              <DetailField label="Etapa">
                <StageSelect id={lead.id} stage={lead.stage} action={updateLeadStage} />
              </DetailField>
              <DetailField label="Estado">
                {lead.read ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">Leído</span>
                ) : (
                  <MarkReadButton id={lead.id} />
                )}
              </DetailField>
            </div>

            <DetailField label="Mensaje">
              <p className="whitespace-pre-line text-gray-300">{lead.message}</p>
            </DetailField>

            <ActivityPanel
              key={lead.id}
              id={lead.id}
              followUpAt={lead.followUpAt}
              notes={lead.notes}
              setFollowUpAt={setLeadFollowUp}
              addNote={addLeadNote}
              deleteNote={deleteLeadNote}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
