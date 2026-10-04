"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AddButton, EditButton } from "@/components/admin/IconButton";
import { SocialLinkForm } from "./social-link-form";
import { createSocialLink, updateSocialLink, deleteSocialLink } from "./actions";

type SocialLink = {
  id: string;
  label: string;
  url: string;
  scope: "PERSONAL" | "AGENCY";
  order: number;
};

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Redes sociales</h1>
        <AddButton onClick={() => setCreating(true)} label="Nuevo enlace" />
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Enlaces globales del sitio (footer y contacto).
      </p>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Etiqueta</th>
              <th className="p-4">Alcance</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{link.label}</td>
                <td className="p-4 text-gray-400">{link.scope === "AGENCY" ? "Agencia" : "Personal"}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <EditButton onClick={() => setEditing(link)} />
                    <DeleteButton id={link.id} action={deleteSocialLink} itemLabel={link.label} />
                  </div>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-gray-500">
                  Aún no hay enlaces.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <SocialLinkForm action={createSocialLink} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <SocialLinkForm
            action={updateSocialLink.bind(null, editing.id)}
            defaultValues={{
              label: editing.label,
              url: editing.url,
              scope: editing.scope,
              order: editing.order,
            }}
            onSuccess={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
