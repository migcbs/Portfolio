import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReviewFab } from "./review-fab";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-normal mb-10 animate-blur-fade-up">Reviews</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="liquid-glass rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, idx) => (
                <Star key={idx} size={16} className="fill-white" />
              ))}
            </div>
            <p className="text-gray-300 text-sm mb-3">&ldquo;{review.text}&rdquo;</p>
            <p className="text-gray-500 text-xs">{review.authorName}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">Aún no hay reviews publicadas.</p>}
      </div>
      <ReviewFab />
    </div>
  );
}
