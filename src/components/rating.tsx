"use client"

import { Star } from "lucide-react"

export function ProductRating({ rating }: { rating: number }) {
  const stars = [];
  
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<Star key={i} data-testid="star-filled" fill="currentColor" className="h-4 w-4 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} data-testid="star-empty" className="h-4 w-4 text-yellow-400" />);
    }
  }
  
  return (
    <div role="img" aria-label={`Rated ${rating} out of 5`} className="flex">
      {stars}
    </div>
  )
}