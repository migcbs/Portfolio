import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteService } from "./actions";

export default async function AdminPackagesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Paquetes</h1>
        <Link
          href="/admin/packages/new"
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nuevo paquete
        </Link>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Nombre</th>
              <th className="p-4">Sección</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Activo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{service.name}</td>
                <td className="p-4 text-gray-400">{service.scope === "AGENCY" ? "ATENU" : "Paquetes"}</td>
                <td className="p-4 text-gray-400">{service.price ? `$${service.price.toString()}` : "—"}</td>
                <td className="p-4 text-gray-400">{service.active ? "Sí" : "No"}</td>
                <td className="p-4 text-right space-x-4">
                  <Link href={`/admin/packages/${service.id}/edit`} className="text-sm hover:text-gray-300">
                    Editar
                  </Link>
                  <DeleteButton id={service.id} action={deleteService} itemLabel={service.name} />
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  Aún no hay paquetes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
