"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { clientSchema } from "@/lib/validations/client";

export type ClientFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return clientSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    logoUrl: formData.get("logoUrl"),
    website: formData.get("website"),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.client.create({ data: parsed.data });
  revalidatePath("/admin/clients");
  revalidatePath("/atenu");
  redirect("/admin/clients?success=created");
}

export async function updateClient(
  id: string,
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.client.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/clients");
  revalidatePath("/atenu");
  redirect("/admin/clients?success=updated");
}

export async function deleteClient(id: string): Promise<void> {
  await requireAdmin();
  await prisma.client.delete({ where: { id } });
  revalidatePath("/admin/clients");
  revalidatePath("/atenu");
}
