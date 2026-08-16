"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ReviewForm } from "./review-form";
import { createReview, updateReview, deleteReview } from "./actions";
import { ApproveToggle } from "./approve-toggle";

type Review = { id: string; authorName: string; text: string; rating: number; approved: boolean };

export function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const [editing, setEditing] = useState<Review | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Reviews</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-white text-black rounded-full font-medium px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          Nueva review
        </button>
      </div>
      <div className="liquid-glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="p-4">Autor</th>
              <th className="p-4">Calificación</th>
              <th className="p-4">Aprobada</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">{review.authorName}</td>
                <td className="p-4 text-gray-400">{review.rating}/5</td>
                <td className="p-4">
                  <ApproveToggle id={review.id} approved={review.approved} />
                </td>
                <td className="p-4 text-right space-x-4">
                  <button type="button" onClick={() => setEditing(review)} className="text-sm hover:text-gray-300">
                    Editar
                  </button>
                  <DeleteButton id={review.id} action={deleteReview} itemLabel={review.authorName} />
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  Aún no hay reviews.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)}>
        <ReviewForm action={createReview} onSuccess={() => setCreating(false)} />
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <ReviewForm
            action={updateReview.bind(null, editing.id)}
            defaultValues={{
              authorName: editing.authorName,
              text: editing.text,
              rating: editing.rating,
              approved: editing.approved,
            }}
            onSuccess={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
