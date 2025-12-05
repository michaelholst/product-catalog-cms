'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/api/products-service';

/**
 * Shopping Cart Page (Client Component)
 *
 * Displays cart items with ability to update quantities or remove items.
 * This is a Client Component because it needs cart state and interactivity.
 *
 * Educational Note: This demonstrates CRUD operations on a collection:
 * - Read: Display cart items
 * - Update: Change quantities
 * - Delete: Remove items
 */

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Add some products to get started!</p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-6">
                  {/* Product Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center px-2">
                      {item.product.images[0]?.alt || item.product.name}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.product.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          SKU: {item.product.sku}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove from cart"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                            disabled={item.quantity >= item.product.inventory.quantity}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity, item.product.currency)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.product.price, item.product.currency)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice, 'USD')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (estimated)</span>
                  <span className="font-medium">{formatPrice(Math.round(totalPrice * 0.08), 'USD')}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(Math.round(totalPrice * 1.08), 'USD')}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center py-3 text-blue-600 hover:text-blue-700 font-medium mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Educational Notes:
 *
 * 1. Empty State:
 *    - Always handle empty collections
 *    - Provide clear next action
 *    - Friendly messaging
 *
 * 2. CRUD Operations:
 *    - Update quantity (updateQuantity)
 *    - Delete item (removeFromCart)
 *    - Read items (items array)
 *
 * 3. Calculations:
 *    - Item subtotal: price × quantity
 *    - Tax calculation: total × 0.08
 *    - Grand total: subtotal + tax
 *
 * 4. UX Features:
 *    - Quantity controls (+/- buttons)
 *    - Remove button per item
 *    - Clear cart option
 *    - Order summary always visible (sticky)
 *    - Continue shopping link
 *
 * 5. Business Logic:
 *    - Enforce stock limits (can't exceed inventory)
 *    - Prevent quantity below 1
 *    - Calculate tax and shipping
 *    - Show per-item and total prices
 */
