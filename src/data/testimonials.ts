// Shared testimonial ratings data
// Default testimonials used by pages that don't define their own

export const DEFAULT_TESTIMONIALS = [{ rating: 5 }, { rating: 5 }, { rating: 5 }];

export function getAggregateRating(testimonials: { rating: number }[] = DEFAULT_TESTIMONIALS) {
  const count = testimonials.length;
  const sum = testimonials.reduce((s, t) => s + t.rating, 0);
  const avgRating = (sum / count).toFixed(1);

  return {
    "@type": "AggregateRating" as const,
    ratingValue: avgRating,
    bestRating: "5",
    ratingCount: count,
    reviewCount: count,
  };
}
