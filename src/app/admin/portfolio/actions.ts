"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { portfolioProjectSchema } from "@/lib/validations/portfolio-project";
import { parseCommaList } from "@/lib/validations/shared";
import { PROJECT_TEMPLATES, TASK_PHASES } from "@/lib/project-templates";

export type PortfolioFormState = { errors?: Record<string, string[] | undefined>; success?: boolean } | undefined;

function parseForm(formData: FormData) {
  return portfolioProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    projectUrl: formData.get("projectUrl"),
    tags: parseCommaList(String(formData.get("tags") ?? "")),
    category: formData.get("category"),
    projectType: formData.get("projectType"),
    status: formData.get("status"),
    devTime: formData.get("devTime"),
    internalNotes: formData.get("internalNotes"),
    active: formData.get("active") === "on",
    order: formData.get("order"),
  });
}

function revalidateAll() {
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
}

export async function createPortfolioProject(
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.portfolioProject.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
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
  revalidateAll();
  return { success: true };
}

export async function deletePortfolioProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.portfolioProject.delete({ where: { id } });
  revalidateAll();
}

export async function updateProjectProgress(id: string, progress: number): Promise<void> {
  await requireAdmin();
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  await prisma.portfolioProject.update({ where: { id }, data: { progress: clamped } });
  revalidatePath("/admin/portfolio");
}

export async function applyProjectTemplate(id: string, projectType: string): Promise<void> {
  await requireAdmin();
  const items = PROJECT_TEMPLATES[projectType] ?? [];
  const existingCount = await prisma.projectTask.count({ where: { projectId: id } });

  await prisma.$transaction([
    prisma.portfolioProject.update({ where: { id }, data: { projectType: projectType as never } }),
    ...items.map((item, i) =>
      prisma.projectTask.create({
        data: { projectId: id, phase: item.phase, label: item.label, order: existingCount + i },
      })
    ),
  ]);

  revalidatePath("/admin/portfolio");
}

export async function addProjectTask(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  const phase = String(formData.get("phase") ?? "DEVELOPMENT");
  if (!label || !TASK_PHASES.includes(phase as (typeof TASK_PHASES)[number])) return;

  const count = await prisma.projectTask.count({ where: { projectId: id } });
  await prisma.projectTask.create({
    data: { projectId: id, phase: phase as never, label, order: count },
  });
  revalidatePath("/admin/portfolio");
}

export async function toggleProjectTask(taskId: string, done: boolean): Promise<void> {
  await requireAdmin();
  await prisma.projectTask.update({ where: { id: taskId }, data: { done } });
  revalidatePath("/admin/portfolio");
}

export async function deleteProjectTask(taskId: string): Promise<void> {
  await requireAdmin();
  await prisma.projectTask.delete({ where: { id: taskId } });
  revalidatePath("/admin/portfolio");
}

const MEDIA_CATEGORIES = ["PHOTO", "VIDEO", "MERCH"] as const;
const MEDIA_TYPES = ["IMAGE", "VIDEO"] as const;

export async function addProjectMedia(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const category = String(formData.get("category") ?? "PHOTO");
  const type = String(formData.get("type") ?? "IMAGE");
  const mediaUrl = String(formData.get("mediaUrl") ?? "").trim();
  if (
    !mediaUrl ||
    !MEDIA_CATEGORIES.includes(category as (typeof MEDIA_CATEGORIES)[number]) ||
    !MEDIA_TYPES.includes(type as (typeof MEDIA_TYPES)[number])
  ) {
    return;
  }

  const count = await prisma.projectMedia.count({ where: { projectId: id } });
  await prisma.projectMedia.create({
    data: { projectId: id, category: category as never, type: type as never, mediaUrl, order: count },
  });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
}

export async function deleteProjectMedia(mediaId: string): Promise<void> {
  await requireAdmin();
  await prisma.projectMedia.delete({ where: { id: mediaId } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
}

export async function addProjectSocialLink(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!label || !url) return;
  try {
    new URL(url);
  } catch {
    return;
  }

  const count = await prisma.socialLink.count({ where: { projectId: id } });
  await prisma.socialLink.create({
    data: { projectId: id, label, url, order: count },
  });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
}

export async function deleteProjectSocialLink(linkId: string): Promise<void> {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id: linkId } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
}
