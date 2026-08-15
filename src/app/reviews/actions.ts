"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { reviewPublicSchema } from "@/lib/validations/review";

export type PublicReviewFormState =
  | { errors?: Record<string, string[] | undefined>; success?: boolean }
  | undefined;

export async function submitPublicReview(
  _prevState: PublicReviewFormState,
  formData: FormData
): Promise<PublicReviewFormState> {
  const parsed = reviewPublicSchema.safeParse({
    authorName: formData.get("authorName"),
    text: formData.get("text"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.review.create({
    data: { ...parsed.data, approved: false },
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}
