/**
 * Mock Google Reviews Data
 *
 * Simulates reviews that would come from Google Business Profile API.
 * Educational: Shows how to structure review/testimonial data.
 */

export interface GoogleReview {
  id: string;
  author: string;
  authorInitials: string;
  rating: number; // 1-5
  text: string;
  date: Date;
  verified: boolean;
}

/**
 * Mock Google Reviews
 * In a real app, these would come from Google Business Profile API
 */
export const googleReviews: GoogleReview[] = [
  {
    id: 'review-1',
    author: 'Sarah Johnson',
    authorInitials: 'SJ',
    rating: 5,
    text: 'Amazing selection and fast shipping! I ordered a laptop and it arrived in perfect condition. Customer service was incredibly helpful when I had questions about specifications.',
    date: new Date('2024-11-15'),
    verified: true,
  },
  {
    id: 'review-2',
    author: 'Michael Chen',
    authorInitials: 'MC',
    rating: 5,
    text: 'Best online shopping experience I\'ve had. The product descriptions are detailed and accurate. My wireless headphones sound fantastic and the price was unbeatable.',
    date: new Date('2024-11-20'),
    verified: true,
  },
  {
    id: 'review-3',
    author: 'Emily Rodriguez',
    authorInitials: 'ER',
    rating: 4,
    text: 'Great variety of products across all categories. I\'ve bought electronics, home goods, and beauty products - all high quality. Shipping could be slightly faster, but overall excellent service.',
    date: new Date('2024-11-28'),
    verified: true,
  },
  {
    id: 'review-4',
    author: 'James Wilson',
    authorInitials: 'JW',
    rating: 5,
    text: 'The quality of products is outstanding. I was skeptical about ordering a yoga mat online, but it exceeded my expectations. The customer reviews on each product really helped me make the right choice.',
    date: new Date('2024-12-01'),
    verified: true,
  },
  {
    id: 'review-5',
    author: 'Lisa Thompson',
    authorInitials: 'LT',
    rating: 5,
    text: 'I love how easy it is to find what I need. The search and filtering options are excellent. Bought a coffee maker and some kitchen accessories - everything arrived well-packaged and works perfectly!',
    date: new Date('2024-12-02'),
    verified: true,
  },
  {
    id: 'review-6',
    author: 'David Martinez',
    authorInitials: 'DM',
    rating: 4,
    text: 'Solid e-commerce platform with competitive prices. The product images could be more detailed, but the descriptions are thorough. Happy with my running shoes purchase!',
    date: new Date('2024-12-03'),
    verified: true,
  },
];

/**
 * Get featured reviews (highest rated, most recent)
 */
export function getFeaturedReviews(count = 3): GoogleReview[] {
  return googleReviews
    .filter(review => review.rating >= 4)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, count);
}

/**
 * Calculate average rating
 */
export function getAverageRating(): number {
  const sum = googleReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / googleReviews.length) * 10) / 10;
}

/**
 * Get total review count
 */
export function getTotalReviewCount(): number {
  return googleReviews.length;
}
