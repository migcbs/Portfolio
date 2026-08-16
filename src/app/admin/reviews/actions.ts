"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { reviewAdminSchema } from "@/lib/validations/review";

export type ReviewFormState = { errors?: Record<string, string[] | undefined>; success?: boolean } | undefined;

function parseForm(formData: FormData) {
  return reviewAdminSchema.safeParse({
    authorName: formData.get("authorName"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    approved: formData.get("approved") === "on",
  });
}

function revalidateAll() {
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.review.create({ data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function updateReview(
  id: string,
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.review.update({ where: { id }, data: parsed.data });
  revalidateAll();
  return { success: true };
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidateAll();
}

export async function toggleReviewApproved(id: string, approved: boolean): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidateAll();
}
