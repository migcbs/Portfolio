import { prisma } from "@/lib/prisma";
import { ReviewsManager } from "./reviews-manager";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });

  return <ReviewsManager reviews={reviews} />;
}
