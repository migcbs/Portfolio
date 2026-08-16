"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ClientForm } from "./client-form";
import { createClient, updateClient, deleteClient } from "./actions";

type Client = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  active: boolean;
  order: number;
};

export function ClientsManager({ clients }: { clients: Client[] }) {
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Clientes</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo cliente
        </button>
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
                  <button type="button" onClick={() => setEditing(client)} className="text-sm hover:text-gray-300">
                    Editar
                  </button>
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

      <Modal open={creating} onClose={() => setCreating(false)}>
        <ClientForm action={createClient} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <ClientForm
            action={updateClient.bind(null, editing.id)}
            defaultValues={{
              name: editing.name,
              description: editing.description ?? "",
              logoUrl: editing.logoUrl ?? "",
              website: editing.website ?? "",
              active: editing.active,
              order: editing.order,
            }}
            onSuccess={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
