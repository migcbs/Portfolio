import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../../service-form";
import { updateService } from "../../actions";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar paquete</h1>
      <ServiceForm
        action={updateService.bind(null, id)}
        defaultValues={{
          name: service.name,
          description: service.description,
          price: service.price?.toString() ?? "",
          features: service.features.join(", "),
          active: service.active,
          order: service.order,
        }}
      />
    </div>
  );
}
