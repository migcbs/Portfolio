"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  generalSettingsSchema,
  heroSettingsSchema,
  aboutSettingsSchema,
  jxrxnxSettingsSchema,
} from "@/lib/validations/site-settings";
import { parseCommaList } from "@/lib/validations/shared";

export type SettingsFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/sobre-mi");
  revalidatePath("/jxrxnx");
  revalidatePath("/portafolio");
  revalidatePath("/paquetes");
}

export async function updateGeneralSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = generalSettingsSchema.safeParse({
    portfolioBrand: formData.get("portfolioBrand"),
    agencyBrand: formData.get("agencyBrand"),
    logoUrl: formData.get("logoUrl"),
    backgroundUrl: formData.get("backgroundUrl"),
    contactEmail: formData.get("contactEmail"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings");
  revalidateSite();
  redirect("/admin/settings?success=1");
}

export async function updateHeroSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = heroSettingsSchema.safeParse({
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    heroVideoUrl: formData.get("heroVideoUrl"),
    heroImageUrl: formData.get("heroImageUrl"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings/hero");
  revalidateSite();
  redirect("/admin/settings/hero?success=1");
}

export async function updateAboutSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = aboutSettingsSchema.safeParse({
    aboutText: formData.get("aboutText"),
    aboutImageUrl: formData.get("aboutImageUrl"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings/about");
  revalidateSite();
  redirect("/admin/settings/about?success=1");
}

export async function updateJxrxnxSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = jxrxnxSettingsSchema.safeParse({
    agencyTagline: formData.get("agencyTagline"),
    agencyServices: parseCommaList(String(formData.get("agencyServices") ?? "")),
    jxrxnxIntro: formData.get("jxrxnxIntro"),
    jxrxnxCustomText: formData.get("jxrxnxCustomText"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/admin/settings/jxrxnx");
  revalidateSite();
  redirect("/admin/settings/jxrxnx?success=1");
}
