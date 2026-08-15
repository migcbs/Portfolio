import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteClient } from "./actions";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Clientes</h1>
        <Link
          href="/admin/clients/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo cliente
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Sitio web</th>
              <th className="p-4">Orden</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{client.name}</td>
                <td className="p-4 text-gray-400">{client.website ?? "—"}</td>
                <td className="p-4 text-gray-400">{client.order}</td>
                <td className="p-4 text-gray-400">{client.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/clients/${client.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={client.id} action={deleteClient} itemLabel={client.name} />
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  Aún no hay clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
