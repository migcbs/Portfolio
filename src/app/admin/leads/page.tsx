import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StageSelect } from "@/components/admin/StageSelect";
import { ActivityDetailsButton } from "@/components/admin/ActivityDetailsButton";
import { deleteLead, updateLeadStage, setLeadFollowUp, addLeadNote, deleteLeadNote } from "./actions";
import { MarkReadButton } from "./mark-read-button";

const PROJECT_TYPE_LABEL: Record<string, string> = {
  WEB_DEV: "Desarrollo Web",
  DIGITAL_MARKETING: "Marketing Digital",
};
const MARKETING_FOCUS_LABEL: Record<string, string> = {
  DESIGN: "Diseño",
  PHOTO_VIDEO: "Foto/Video",
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Leads</h1>
      <div className="liquid-glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Proyecto</th>
              <th className="p-4">Mensaje</th>
              <th className="p-4">Etapa</th>
              <th className="p-4">Seguimiento</th>
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/5 last:border-0 align-top">
                <td className="p-4">{lead.name}</td>
                <td className="p-4 text-gray-400">
                  <a href={`mailto:${lead.email}`} className="hover:text-gray-300">
                    {lead.email}
                  </a>
                </td>
                <td className="p-4 text-gray-400">
                  {lead.projectType ? (
                    <div className="flex flex-col gap-1">
                      <span>{PROJECT_TYPE_LABEL[lead.projectType] ?? lead.projectType}</span>
                      {lead.marketingFocus && (
                        <span className="label-mono text-xs text-gray-500">
                          {MARKETING_FOCUS_LABEL[lead.marketingFocus] ?? lead.marketingFocus}
                        </span>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4 text-gray-400 max-w-xs">{lead.message}</td>
                <td className="p-4">
                  <StageSelect id={lead.id} stage={lead.stage} action={updateLeadStage} />
                </td>
                <td className="p-4">
                  <ActivityDetailsButton
                    id={lead.id}
                    followUpAt={lead.followUpAt}
                    notes={lead.notes}
                    setFollowUpAt={setLeadFollowUp}
                    addNote={addLeadNote}
                    deleteNote={deleteLeadNote}
                  />
                </td>
                <td className="p-4">
                  {lead.read ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">Leído</span>
                  ) : (
                    <MarkReadButton id={lead.id} />
                  )}
                </td>
                <td className="p-4 text-right">
                  <DeleteButton id={lead.id} action={deleteLead} itemLabel={`el mensaje de ${lead.name}`} />
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-gray-500">
                  Aún no hay mensajes de contacto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
