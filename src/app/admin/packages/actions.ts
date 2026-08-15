"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { serviceSchema } from "@/lib/validations/service";
import { parseCommaList } from "@/lib/validations/shared";

export type ServiceFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  const rawPrice = String(formData.get("price") ?? "").trim();
  return serviceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: rawPrice === "" ? null : rawPrice,
    features: parseCommaList(String(formData.get("features") ?? "")),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.service.create({ data: parsed.data });
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/buscar");
  redirect("/admin/packages?success=created");
}

export async function updateService(
  id: string,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.service.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/buscar");
  redirect("/admin/packages?success=updated");
}

export async function deleteService(id: string): Promise<void> {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/buscar");
}
