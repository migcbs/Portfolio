import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SocialLinkForm } from "../../social-link-form";
import { updateSocialLink } from "../../actions";

export default async function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [link, clients] = await Promise.all([
    prisma.socialLink.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!link) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar enlace</h1>
      <SocialLinkForm
        action={updateSocialLink.bind(null, id)}
        clients={clients}
        defaultValues={{
          label: link.label,
          url: link.url,
          scope: link.scope,
          clientId: link.clientId ?? "",
          order: link.order,
        }}
      />
    </div>
  );
}
