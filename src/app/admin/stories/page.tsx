import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteStory } from "./actions";

const CATEGORY_LABEL: Record<string, string> = {
  PHOTO: "Fotos",
  VIDEO: "Videos",
  MERCH: "Merch",
};

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: [{ clientId: "asc" }, { order: "asc" }],
    include: { client: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Stories</h1>
        <Link
          href="/admin/stories/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nueva story
        </Link>
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
                  <Link href={`/admin/stories/${story.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
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
    </div>
  );
}
