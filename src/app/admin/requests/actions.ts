"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { PipelineStage } from "@/lib/pipeline";

function revalidateAll() {
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

export async function markRequestRead(id: string): Promise<void> {
  await requireAdmin();
  await prisma.bookingRequest.update({ where: { id }, data: { read: true } });
  revalidateAll();
}

export async function deleteRequest(id: string): Promise<void> {
  await requireAdmin();
  await prisma.bookingRequest.delete({ where: { id } });
  revalidateAll();
}

export async function updateRequestStage(id: string, stage: PipelineStage): Promise<void> {
  await requireAdmin();
  await prisma.bookingRequest.update({ where: { id }, data: { stage } });
  revalidateAll();
}

export async function setRequestFollowUp(id: string, date: string): Promise<void> {
  await requireAdmin();
  await prisma.bookingRequest.update({ where: { id }, data: { followUpAt: date ? new Date(date) : null } });
  revalidateAll();
}

export async function addRequestNote(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  await prisma.bookingNote.create({ data: { bookingRequestId: id, text } });
  revalidateAll();
}

export async function deleteRequestNote(noteId: string): Promise<void> {
  await requireAdmin();
  await prisma.bookingNote.delete({ where: { id: noteId } });
  revalidateAll();
}
