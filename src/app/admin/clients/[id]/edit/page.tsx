import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientForm } from "../../client-form";
import { updateClient } from "../../actions";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar cliente</h1>
      <ClientForm
        action={updateClient.bind(null, id)}
        defaultValues={{
          name: client.name,
          description: client.description ?? "",
          logoUrl: client.logoUrl ?? "",
          website: client.website ?? "",
          active: client.active,
          order: client.order,
        }}
      />
    </div>
  );
}
