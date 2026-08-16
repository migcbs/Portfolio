"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StoryForm } from "./story-form";
import { createStory, updateStory, deleteStory } from "./actions";

const CATEGORY_LABEL: Record<string, string> = {
  PHOTO: "Fotos",
  VIDEO: "Videos",
  MERCH: "Merch",
};

type Story = {
  id: string;
  clientId: string;
  category: "PHOTO" | "VIDEO" | "MERCH";
  type: "IMAGE" | "VIDEO";
  mediaUrl: string;
  order: number;
  active: boolean;
  client: { name: string };
};
type ClientOption = { id: string; name: string };

export function StoriesManager({ stories, clients }: { stories: Story[]; clients: ClientOption[] }) {
  const [editing, setEditing] = useState<Story | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Stories</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nueva story
        </button>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Cliente</th>
              <th className="p-4">Carpeta</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{story.client.name}</td>
                <td className="p-4 text-gray-400">{CATEGORY_LABEL[story.category]}</td>
                <td className="p-4 text-gray-400">{story.type === "VIDEO" ? "Video" : "Imagen"}</td>
                <td className="p-4 text-gray-400">{story.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <button type="button" onClick={() => setEditing(story)} className="text-sm hover:text-gray-300">
                    Editar
                  </button>
                  <DeleteButton id={story.id} action={deleteStory} itemLabel={`story de ${story.client.name}`} />
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  Aún no hay stories.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <StoryForm action={createStory} clients={clients} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <StoryForm
            action={updateStory.bind(null, editing.id)}
            clients={clients}
            defaultValues={{
              clientId: editing.clientId,
              category: editing.category,
              type: editing.type,
              mediaUrl: editing.mediaUrl,
              order: editing.order,
              active: editing.active,
            }}
            onSuccess={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
