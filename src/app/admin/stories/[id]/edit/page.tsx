import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoryForm } from "../../story-form";
import { updateStory } from "../../actions";

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [story, clients] = await Promise.all([
    prisma.story.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!story) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar story</h1>
      <StoryForm
        action={updateStory.bind(null, id)}
        clients={clients}
        defaultValues={{
          clientId: story.clientId,
          category: story.category,
          type: story.type,
          mediaUrl: story.mediaUrl,
          order: story.order,
          active: story.active,
        }}
      />
    </div>
  );
}
