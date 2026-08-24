"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ServiceForm } from "./service-form";
import { createService, updateService, deleteService } from "./actions";

type Service = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  features: string[];
  scope: "PERSONAL" | "AGENCY";
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
        <h1 className="text-2xl font-medium">Paquetes</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo paquete
        </button>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Sección</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Activo</th>
              <th className="p-4">Favorito</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{service.name}</td>
                <td className="p-4 text-gray-400">{service.scope === "AGENCY" ? "Agencia" : "Desarrollo Web"}</td>
                <td className="p-4 text-gray-400">{service.price ? `$${service.price}` : "—"}</td>
                <td className="p-4 text-gray-400">{service.active ? "Sí" : "No"}</td>
                <td className="p-4 text-gray-400">{service.isFavorite ? "⭐" : "—"}</td>
                <td className="p-4 text-right space-x-4">
                  <button type="button" onClick={() => setEditing(service)} className="text-sm hover:text-gray-300">
                    Editar
                  </button>
                  <DeleteButton id={service.id} action={deleteService} itemLabel={service.name} />
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-gray-500">
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
              price: editing.price ?? "",
              features: editing.features.join(", "),
              scope: editing.scope,
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
