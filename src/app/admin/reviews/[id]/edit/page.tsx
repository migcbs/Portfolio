import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "../../review-form";
import { updateReview } from "../../actions";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Editar review</h1>
      <ReviewForm
        action={updateReview.bind(null, id)}
        defaultValues={{
          authorName: review.authorName,
          text: review.text,
          rating: review.rating,
          approved: review.approved,
        }}
      />
    </div>
  );
}
