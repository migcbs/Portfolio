import { prisma } from "@/lib/prisma";
import { StoriesManager } from "./stories-manager";

export default async function AdminStoriesPage() {
  const [stories, clients] = await Promise.all([
    prisma.story.findMany({
      orderBy: [{ clientId: "asc" }, { order: "asc" }],
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return <StoriesManager stories={stories} clients={clients} />;
}
