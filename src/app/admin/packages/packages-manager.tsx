"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AddButton, EditButton } from "@/components/admin/IconButton";
import { ServiceForm } from "./service-form";
import { createService, updateService, deleteService } from "./actions";

type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
  active: boolean;
  isFavorite: boolean;
  order: number;
};

export function PackagesManager({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Paquetes</h1>
          <p className="text-sm text-gray-500 mt-1">Sin precios públicos: cada paquete se cotiza con el cliente.</p>
        </div>
        <AddButton onClick={() => setCreating(true)} label="Nuevo paquete" />
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Activo</th>
              <th className="p-4">Favorito</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{service.name}</td>
                <td className="p-4 text-gray-400">{service.active ? "Sí" : "No"}</td>
                <td className="p-4 text-gray-400">{service.isFavorite ? "⭐" : "—"}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <EditButton onClick={() => setEditing(service)} />
                    <DeleteButton id={service.id} action={deleteService} itemLabel={service.name} />
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay paquetes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <ServiceForm action={createService} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <ServiceForm
            action={updateService.bind(null, editing.id)}
            defaultValues={{
              name: editing.name,
              description: editing.description,
              features: editing.features.join(", "),
              active: editing.active,
              isFavorite: editing.isFavorite,
              order: editing.order,
            }}
            onSuccess={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
