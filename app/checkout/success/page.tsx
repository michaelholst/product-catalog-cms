import Link from 'next/link';

/**
 * Checkout Success Page (Server Component)
 *
 * Confirmation page after successful checkout.
 * Simple, static page - can be a Server Component.
 */

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. This is a demo project, so no real order was placed.
          In a production app, you would receive a confirmation email with your order details.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/products"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
          <p className="text-sm text-gray-700">
            <strong>Educational Note:</strong> In a real e-commerce application, this page would:
          </p>
          <ul className="text-sm text-gray-700 mt-2 space-y-1 list-disc list-inside">
            <li>Display an order confirmation number</li>
            <li>Send a confirmation email</li>
            <li>Reduce product inventory in the database</li>
            <li>Create an order record</li>
            <li>Charge the payment method</li>
            <li>Show shipping estimate</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
