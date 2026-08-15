import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteLead } from "./actions";
import { MarkReadButton } from "./mark-read-button";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Leads</h1>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Mensaje</th>
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
                <td className="p-4 text-gray-400 max-w-xs">{lead.message}</td>
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
                <td colSpan={5} className="p-4 text-gray-500">
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
