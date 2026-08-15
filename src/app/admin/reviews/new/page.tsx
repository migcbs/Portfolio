import { ReviewForm } from "../review-form";
import { createReview } from "../actions";

export default function NewReviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nueva review</h1>
      <ReviewForm action={createReview} />
    </div>
  );
}
