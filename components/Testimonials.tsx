import { GoogleReview, getFeaturedReviews, getAverageRating, getTotalReviewCount } from '@/lib/data/reviews';

/**
 * Testimonials Component (Server Component)
 *
 * Displays customer reviews from Google.
 * Educational: Shows how to display testimonial/review data.
 *
 * In a real application, this would fetch reviews from:
 * - Google Business Profile API
 * - Review aggregation service
 * - Your own database
 */

/**
 * Star Rating Display Component
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Individual Review Card
 */
function ReviewCard({ review }: { review: GoogleReview }) {
  const formattedDate = review.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Author Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {review.authorInitials}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{review.author}</h3>
            {review.verified && (
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                title="Verified"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <StarRating rating={review.rating} />
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-4 flex-1">{review.text}</p>

      {/* Date */}
      <p className="text-sm text-gray-500">{formattedDate}</p>
    </div>
  );
}

/**
 * Main Testimonials Section
 */
export function Testimonials() {
  const featuredReviews = getFeaturedReviews(3);
  const averageRating = getAverageRating();
  const totalReviews = getTotalReviewCount();

  return (
    <section className="bg-gray-50 rounded-lg p-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 272 92'%3E%3Cpath fill='%234285F4' d='M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z'/%3E%3Cpath fill='%23EA4335' d='M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z'/%3E%3Cpath fill='%23FBBC05' d='M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z'/%3E%3Cpath fill='%234285F4' d='M225 3v65h-9.5V3h9.5z'/%3E%3Cpath fill='%2334A853' d='M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z'/%3E%3Cpath fill='%23EA4335' d='M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z'/%3E%3C/svg%3E"
            alt="Google"
            className="h-6"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <StarRating rating={5} />
          <span className="text-lg font-semibold text-gray-900">
            {averageRating} out of 5
          </span>
        </div>
        <p className="text-gray-600">Based on {totalReviews} Google reviews</p>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {featuredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* View All Reviews Link */}
      <div className="text-center">
        <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          View all reviews on Google
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

/**
 * Educational Notes:
 *
 * 1. Review Data Structure:
 *    - Author information (name, initials for avatar)
 *    - Rating (1-5 stars)
 *    - Review text
 *    - Date and verification status
 *
 * 2. Component Composition:
 *    - StarRating: Reusable star display
 *    - ReviewCard: Individual review card
 *    - Testimonials: Main container component
 *
 * 3. Real-World Integration:
 *    - Google Business Profile API
 *    - Review widgets (Trustpilot, Reviews.io)
 *    - Custom review collection system
 *
 * 4. UX Features:
 *    - Visual trust indicators (verified badges)
 *    - Average rating display
 *    - Google logo for brand recognition
 *    - Link to see all reviews
 *
 * 5. Data Fetching:
 *    - Currently using static data
 *    - Could fetch from API endpoint
 *    - Could implement caching/revalidation
 */
