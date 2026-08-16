"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { serviceSchema } from "@/lib/validations/service";
import { parseCommaList } from "@/lib/validations/shared";

export type ServiceFormState = { errors?: Record<string, string[] | undefined>; success?: boolean } | undefined;

function parseForm(formData: FormData) {
  const rawPrice = String(formData.get("price") ?? "").trim();
  return serviceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: rawPrice === "" ? null : rawPrice,
    features: parseCommaList(String(formData.get("features") ?? "")),
    scope: formData.get("scope"),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

function revalidateAll() {
  revalidatePath("/admin/packages");
  revalidatePath("/paquetes");
  revalidatePath("/atenu");
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.service.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
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
  revalidateAll();
  return { success: true };
}

export async function deleteService(id: string): Promise<void> {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidateAll();
}
