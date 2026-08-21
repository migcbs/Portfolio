"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function revalidateAll() {
  revalidatePath("/admin/settings/agenda");
}

export async function addAvailability(formData: FormData): Promise<void> {
  await requireAdmin();
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  if (Number.isNaN(dayOfWeek) || !startTime || !endTime || startTime >= endTime) return;

  await prisma.availability.create({ data: { dayOfWeek, startTime, endTime } });
  revalidateAll();
}

export async function deleteAvailability(id: string): Promise<void> {
  await requireAdmin();
  await prisma.availability.delete({ where: { id } });
  revalidateAll();
}

export async function toggleAvailability(id: string, active: boolean): Promise<void> {
  await requireAdmin();
  await prisma.availability.update({ where: { id }, data: { active } });
  revalidateAll();
}

export async function updateMeetingDuration(minutes: number): Promise<void> {
  await requireAdmin();
  const clamped = Math.max(15, Math.min(180, Math.round(minutes)));
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { meetingDurationMinutes: clamped },
    create: { id: "singleton", meetingDurationMinutes: clamped },
  });
  revalidateAll();
}
