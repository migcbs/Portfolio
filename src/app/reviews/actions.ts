"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { reviewPublicSchema } from "@/lib/validations/review";
import { sendReviewNotification } from "@/lib/resend";
import { getSiteSettings } from "@/lib/site-settings";

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

  const review = await prisma.review.create({
    data: { ...parsed.data, approved: false },
  });

  const settings = await getSiteSettings();
  const toEmail = settings?.contactEmail || process.env.ADMIN_EMAIL || "";
  await sendReviewNotification(review, toEmail);

  revalidatePath("/admin/reviews");
  return { success: true };
}
