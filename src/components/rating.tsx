import { Star } from "lucide-react";

export function ProductRating({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        index < rating ? (
          <Star key={index} fill="currentColor" data-testid="star-filled" />
        ) : (
          <Star key={index} data-testid="star-empty" />
        )
      ))}
    </div>
  );
}