"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { PipelineStage } from "@/lib/pipeline";

function revalidateAll() {
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function markLeadRead(id: string): Promise<void> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { read: true } });
  revalidateAll();
}

export async function deleteLead(id: string): Promise<void> {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidateAll();
}

export async function updateLeadStage(id: string, stage: PipelineStage): Promise<void> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { stage } });
  revalidateAll();
}

export async function setLeadFollowUp(id: string, date: string): Promise<void> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { followUpAt: date ? new Date(date) : null } });
  revalidateAll();
}

export async function addLeadNote(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  await prisma.leadNote.create({ data: { leadId: id, text } });
  revalidateAll();
}

export async function deleteLeadNote(noteId: string): Promise<void> {
  await requireAdmin();
  await prisma.leadNote.delete({ where: { id: noteId } });
  revalidateAll();
}
