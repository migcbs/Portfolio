import { prisma } from "@/lib/prisma";
import { SocialLinksManager } from "./social-links-manager";

export default async function AdminSocialLinksPage() {
  const links = await prisma.socialLink.findMany({
    where: { projectId: null },
    orderBy: { order: "asc" },
  });

  return <SocialLinksManager links={links} />;
}
