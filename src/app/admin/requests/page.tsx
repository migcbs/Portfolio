import { Mail, Phone, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StageSelect } from "@/components/admin/StageSelect";
import { ActivityDetailsButton } from "@/components/admin/ActivityDetailsButton";
import {
  deleteRequest,
  updateRequestStage,
  setRequestFollowUp,
  addRequestNote,
  deleteRequestNote,
} from "./actions";
import { MarkReadButton } from "./mark-read-button";

const CONTACT_ICON: Record<string, typeof Mail> = {
  EMAIL: Mail,
  PHONE: Phone,
  WHATSAPP: MessageCircle,
};

function waLink(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}`;
}

export default async function AdminRequestsPage() {
  const requests = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Solicitudes</h1>
      <div className="liquid-glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre / Empresa</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Prefiere</th>
              <th className="p-4">Origen</th>
              <th className="p-4">Cita</th>
              <th className="p-4">Mensaje</th>
              <th className="p-4">Etapa</th>
              <th className="p-4">Seguimiento</th>
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const Icon = CONTACT_ICON[request.preferredContact] ?? Mail;
              return (
                <tr key={request.id} className="border-b border-white/5 last:border-0 align-top">
                  <td className="p-4">
                    <p>{request.name}</p>
                    {request.company && <p className="text-gray-500 text-xs">{request.company}</p>}
                  </td>
                  <td className="p-4 text-gray-400">
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${request.email}`} className="hover:text-gray-300">
                        {request.email}
                      </a>
                      {request.phone && (
                        <div className="flex items-center gap-2">
                          <a href={`tel:${request.phone}`} className="hover:text-gray-300">
                            {request.phone}
                          </a>
                          <a
                            href={waLink(request.phone)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-400 hover:text-green-300"
                            aria-label="Escribir por WhatsApp"
                          >
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon size={14} />
                      {request.preferredContact === "EMAIL"
                        ? "Email"
                        : request.preferredContact === "PHONE"
                          ? "Teléfono"
                          : "WhatsApp"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{request.source}</td>
                  <td className="p-4 text-gray-400">
                    {request.scheduledAt
                      ? new Date(request.scheduledAt).toLocaleString("es-MX", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "America/Mexico_City",
                        })
                      : "—"}
                  </td>
                  <td className="p-4 text-gray-400 max-w-xs">{request.message ?? "—"}</td>
                  <td className="p-4">
                    <StageSelect id={request.id} stage={request.stage} action={updateRequestStage} />
                  </td>
                  <td className="p-4">
                    <ActivityDetailsButton
                      id={request.id}
                      followUpAt={request.followUpAt}
                      notes={request.notes}
                      setFollowUpAt={setRequestFollowUp}
                      addNote={addRequestNote}
                      deleteNote={deleteRequestNote}
                    />
                  </td>
                  <td className="p-4">
                    {request.read ? (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">Leído</span>
                    ) : (
                      <MarkReadButton id={request.id} />
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <DeleteButton id={request.id} action={deleteRequest} itemLabel={`la solicitud de ${request.name}`} />
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={10} className="p-4 text-gray-500">
                  Aún no hay solicitudes de agenda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
