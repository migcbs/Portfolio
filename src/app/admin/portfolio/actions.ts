"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { portfolioProjectSchema } from "@/lib/validations/portfolio-project";
import { parseCommaList } from "@/lib/validations/shared";
import { PROJECT_TEMPLATES, TASK_PHASES } from "@/lib/project-templates";

export type PortfolioFormState = { errors?: Record<string, string[] | undefined> } | undefined;

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
  redirect("/admin/portfolio?success=updated");
}

export async function deletePortfolioProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.portfolioProject.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portafolio");
}

export async function updateProjectProgress(id: string, progress: number): Promise<void> {
  await requireAdmin();
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  await prisma.portfolioProject.update({ where: { id }, data: { progress: clamped } });
  revalidatePath(`/admin/portfolio/${id}/edit`);
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

  revalidatePath(`/admin/portfolio/${id}/edit`);
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
  revalidatePath(`/admin/portfolio/${id}/edit`);
}

export async function toggleProjectTask(taskId: string, done: boolean): Promise<void> {
  await requireAdmin();
  const task = await prisma.projectTask.update({ where: { id: taskId }, data: { done }, select: { projectId: true } });
  revalidatePath(`/admin/portfolio/${task.projectId}/edit`);
}

export async function deleteProjectTask(taskId: string): Promise<void> {
  await requireAdmin();
  const task = await prisma.projectTask.delete({ where: { id: taskId }, select: { projectId: true } });
  revalidatePath(`/admin/portfolio/${task.projectId}/edit`);
}
