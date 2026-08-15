import { prisma } from "@/lib/prisma";
import { StoryForm } from "../story-form";
import { createStory } from "../actions";

export default async function NewStoryPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nueva story</h1>
      <StoryForm action={createStory} clients={clients} />
    </div>
  );
}
