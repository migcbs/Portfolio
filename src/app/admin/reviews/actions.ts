"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { reviewAdminSchema } from "@/lib/validations/review";

export type ReviewFormState = { errors?: Record<string, string[] | undefined> } | undefined;

function parseForm(formData: FormData) {
  return reviewAdminSchema.safeParse({
    authorName: formData.get("authorName"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    approved: formData.get("approved") === "on",
  });
}

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  await prisma.review.create({ data: parsed.data });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect("/admin/reviews?success=created");
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
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect("/admin/reviews?success=updated");
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function toggleReviewApproved(id: string, approved: boolean): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}
