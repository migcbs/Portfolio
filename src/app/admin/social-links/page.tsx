import { prisma } from "@/lib/prisma";
import { SocialLinksManager } from "./social-links-manager";

export default async function AdminSocialLinksPage() {
  const [links, clients] = await Promise.all([
    prisma.socialLink.findMany({ orderBy: { order: "asc" }, include: { client: true } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return <SocialLinksManager links={links} clients={clients} />;
}
