"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRatingInput({
  name,
  defaultValue = 5,
}: {
  name: string;
  defaultValue?: number;
}) {
  const [rating, setRating] = useState(defaultValue);
  const [hovered, setHovered] = useState<number | null>(null);

  const displayed = hovered ?? rating;

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={rating} />
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setRating(value)}
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`${value} estrella${value > 1 ? "s" : ""}`}
          className="p-0.5"
        >
          <Star
            size={24}
            className={displayed >= value ? "fill-white text-white" : "text-gray-600"}
          />
        </button>
      ))}
    </div>
  );
}
