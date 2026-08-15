"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { portfolioProjectSchema } from "@/lib/validations/portfolio-project";
import { parseCommaList } from "@/lib/validations/shared";

export type PortfolioFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return portfolioProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    projectUrl: formData.get("projectUrl"),
    tags: parseCommaList(String(formData.get("tags") ?? "")),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

export async function createPortfolioProject(
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.portfolioProject.create({ data: parsed.data });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
  revalidatePath("/buscar");
  redirect("/admin/portfolio?success=created");
}

export async function updatePortfolioProject(
  id: string,
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.portfolioProject.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
  revalidatePath("/buscar");
  redirect("/admin/portfolio?success=updated");
}

export async function deletePortfolioProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.portfolioProject.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
  revalidatePath("/buscar");
}
