"use client";

import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StageSelect } from "@/components/admin/StageSelect";
import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { CardGrid, DetailField, RecordCard, StageBadge, formatDate, isOverdue } from "@/components/admin/RecordCard";
import type { PipelineStage } from "@/lib/pipeline";
import {
  deleteRequest,
  updateRequestStage,
  setRequestFollowUp,
  addRequestNote,
  deleteRequestNote,
} from "./actions";
import { MarkReadButton } from "./mark-read-button";

type PreferredContact = "EMAIL" | "PHONE" | "WHATSAPP";

type Request = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  preferredContact: PreferredContact;
  message: string | null;
  source: string;
  read: boolean;
  stage: PipelineStage;
  followUpAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  notes: { id: string; text: string; createdAt: Date }[];
};

const CONTACT: Record<PreferredContact, { label: string; icon: typeof Mail }> = {
  EMAIL: { label: "Email", icon: Mail },
  PHONE: { label: "Teléfono", icon: Phone },
  WHATSAPP: { label: "WhatsApp", icon: MessageCircle },
};

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

export function RequestsBoard({ requests }: { requests: Request[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const request = openId ? (requests.find((r) => r.id === openId) ?? null) : null;

  return (
    <div>
      <h1 className="text-2xl font-medium mb-1">Solicitudes</h1>
      <p className="text-sm text-gray-500 mb-6">Solicitudes enviadas desde los botones de &quot;Contáctanos&quot;.</p>

      <CardGrid isEmpty={requests.length === 0} empty="Aún no hay solicitudes.">
        {requests.map((r) => {
          const Icon = CONTACT[r.preferredContact].icon;
          return (
            <RecordCard
              key={r.id}
              onClick={() => setOpenId(r.id)}
              unread={!r.read}
              title={r.name}
              subtitle={r.company ?? r.email}
              badge={<StageBadge stage={r.stage} />}
              body={r.message}
              footer={
                <>
                  <span>{formatDate(r.createdAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Icon size={12} /> {CONTACT[r.preferredContact].label}
                  </span>
                  {r.notes.length > 0 && <span>{r.notes.length} notas</span>}
                  {isOverdue(r.followUpAt) && <span className="text-yellow-400">Seguimiento vencido</span>}
                </>
              }
            />
          );
        })}
      </CardGrid>

      <Modal open={request !== null} onClose={() => setOpenId(null)} size="lg">
        {request && (
          <div className="liquid-glass rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium">{request.name}</h2>
                {request.company && <p className="text-sm text-gray-400">{request.company}</p>}
                <p className="label-mono text-gray-500 mt-1">{formatDate(request.createdAt, true)}</p>
              </div>
              <DeleteButton
                id={request.id}
                action={deleteRequest}
                itemLabel={`la solicitud de ${request.name}`}
                onDeleted={() => setOpenId(null)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <DetailField label="Email">
                <a href={`mailto:${request.email}`} className="hover:text-gray-300 break-all">
                  {request.email}
                </a>
              </DetailField>
              <DetailField label="Teléfono">
                {request.phone ? (
                  <span className="flex items-center gap-3">
                    <a href={`tel:${request.phone}`} className="hover:text-gray-300">
                      {request.phone}
                    </a>
                    <a
                      href={waLink(request.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-400 hover:text-green-300"
                    >
                      WhatsApp
                    </a>
                  </span>
                ) : (
                  "—"
                )}
              </DetailField>
              <DetailField label="Prefiere">{CONTACT[request.preferredContact].label}</DetailField>
              <DetailField label="Origen">{request.source}</DetailField>
              {request.scheduledAt && (
                <DetailField label="Cita solicitada">{formatDate(request.scheduledAt, true)}</DetailField>
              )}
              <DetailField label="Etapa">
                <StageSelect id={request.id} stage={request.stage} action={updateRequestStage} />
              </DetailField>
              <DetailField label="Estado">
                {request.read ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">Leído</span>
                ) : (
                  <MarkReadButton id={request.id} />
                )}
              </DetailField>
            </div>

            <DetailField label="Mensaje">
              <p className="whitespace-pre-line text-gray-300">{request.message ?? "—"}</p>
            </DetailField>

            <ActivityPanel
              key={request.id}
              id={request.id}
              followUpAt={request.followUpAt}
              notes={request.notes}
              setFollowUpAt={setRequestFollowUp}
              addNote={addRequestNote}
              deleteNote={deleteRequestNote}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
