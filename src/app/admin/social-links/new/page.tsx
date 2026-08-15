import { prisma } from "@/lib/prisma";
import { SocialLinkForm } from "../social-link-form";
import { createSocialLink } from "../actions";

export default async function NewSocialLinkPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo enlace</h1>
      <SocialLinkForm action={createSocialLink} clients={clients} />
    </div>
  );
}
