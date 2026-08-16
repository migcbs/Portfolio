"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function markRequestRead(id: string): Promise<void> {
  await requireAdmin();
  await prisma.bookingRequest.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

export async function deleteRequest(id: string): Promise<void> {
  await requireAdmin();
  await prisma.bookingRequest.delete({ where: { id } });
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}
