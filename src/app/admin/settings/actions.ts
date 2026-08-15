"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SettingsFormState = { errors?: Record<string, string[] | undefined> } | undefined;

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    portfolioBrand: formData.get("portfolioBrand"),
    agencyBrand: formData.get("agencyBrand"),
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    heroVideoUrl: formData.get("heroVideoUrl"),
    heroImageUrl: formData.get("heroImageUrl"),
    aboutText: formData.get("aboutText"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/sobre-mi");
  revalidatePath("/agencia");
  redirect("/admin/settings?success=1");
}
