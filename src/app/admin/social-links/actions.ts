"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { socialLinkSchema } from "@/lib/validations/social-link";

export type SocialLinkFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return socialLinkSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    scope: formData.get("scope"),
    clientId: formData.get("clientId"),
    order: formData.get("order"),
  });
}

export async function createSocialLink(
  _prevState: SocialLinkFormState,
  formData: FormData
): Promise<SocialLinkFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.socialLink.create({ data: parsed.data });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  revalidatePath("/agencia");
  redirect("/admin/social-links?success=created");
}

export async function updateSocialLink(
  id: string,
  _prevState: SocialLinkFormState,
  formData: FormData
): Promise<SocialLinkFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.socialLink.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  revalidatePath("/agencia");
  redirect("/admin/social-links?success=updated");
}

export async function deleteSocialLink(id: string): Promise<void> {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  revalidatePath("/agencia");
}
