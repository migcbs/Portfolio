"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { legalPageSchema } from "@/lib/validations/legal";

export type LegalFormState = { errors?: Record<string, string[] | undefined> } | undefined;

async function saveLegalPage(id: "terms" | "privacy", formData: FormData): Promise<LegalFormState> {
  await requireAdmin();
  const parsed = legalPageSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.legalPage.upsert({
    where: { id },
    update: parsed.data,
    create: { id, ...parsed.data },
  });

  revalidatePath("/admin/settings/legal");
  revalidatePath(id === "terms" ? "/terminos" : "/privacidad");
  redirect(`/admin/settings/legal?success=${id}`);
}

export async function updateTermsPage(_prevState: LegalFormState, formData: FormData): Promise<LegalFormState> {
  return saveLegalPage("terms", formData);
}

export async function updatePrivacyPage(_prevState: LegalFormState, formData: FormData): Promise<LegalFormState> {
  return saveLegalPage("privacy", formData);
}
