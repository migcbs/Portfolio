import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSocialLink } from "./actions";

export default async function AdminSocialLinksPage() {
  const links = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
    include: { client: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Redes sociales</h1>
        <Link
          href="/admin/social-links/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo enlace
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Etiqueta</th>
              <th className="p-4">Alcance</th>
              <th className="p-4">Cliente</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{link.label}</td>
                <td className="p-4 text-gray-400">{link.scope === "AGENCY" ? "Agencia" : "Personal"}</td>
                <td className="p-4 text-gray-400">{link.client?.name ?? "—"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/social-links/${link.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={link.id} action={deleteSocialLink} itemLabel={link.label} />
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay enlaces.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
