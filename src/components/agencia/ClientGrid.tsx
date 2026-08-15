"use client";

import { useState } from "react";
import { ClientStoryModal } from "./ClientStoryModal";

type Story = { id: string; type: "IMAGE" | "VIDEO"; mediaUrl: string };
type Client = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  stories: Story[];
};

export function ClientGrid({ clients }: { clients: Client[] }) {
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  if (clients.length === 0) {
    return <p className="text-gray-500">Aún no hay clientes publicados.</p>;
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, i) => {
          const hasStories = client.stories.length > 0;
          const hasDetails = hasStories || Boolean(client.description);
          return (
            <button
              key={client.id}
              type="button"
              disabled={!hasDetails}
              onClick={() => setActiveClient(client)}
              className="liquid-glass rounded-2xl overflow-hidden text-left animate-blur-fade-up disabled:cursor-default"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {client.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={client.logoUrl} alt="" className="w-full h-32 object-cover" />
              )}
              <div className="p-6">
                <h3 className="font-medium mb-1">{client.name}</h3>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-gray-400 hover:text-gray-300"
                  >
                    {client.website}
                  </a>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {hasDetails ? "Click para ver el proyecto" : "Sin detalles aún"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {activeClient && (
        <ClientStoryModal
          clientName={activeClient.name}
          description={activeClient.description}
          stories={activeClient.stories}
          onClose={() => setActiveClient(null)}
        />
      )}
    </>
  );
}
