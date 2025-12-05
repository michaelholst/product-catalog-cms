'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/lib/types/product';

/**
 * AddToCartButton Component (Client Component)
 *
 * Button to add products to shopping cart.
 * This is a Client Component because it needs interactivity.
 *
 * Educational Note: This demonstrates state management across components
 * using Context API. When you click "Add to Cart", the global cart state updates.
 */

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'full';
}

export function AddToCartButton({ product, variant = 'default' }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);

    // Reset button after animation
    setTimeout(() => setAdded(false), 2000);
  };

  // Check if product is available
  const isAvailable = product.inventory.inStock && product.inventory.quantity > 0;

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {added ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {added ? '✓ Added' : 'Add to Cart'}
    </button>
  );
}

/**
 * Educational Notes:
 *
 * 1. Context Hook:
 *    - useCart() accesses global cart state
 *    - addToCart() updates state across app
 *    - No prop drilling needed
 *
 * 2. Local State:
 *    - useState for button feedback
 *    - Shows "Added!" temporarily
 *    - Resets after 2 seconds
 *
 * 3. Conditional Rendering:
 *    - Different button for out of stock
 *    - Different styles for states
 *    - Variant prop for different sizes
 *
 * 4. User Feedback:
 *    - Visual change on success
 *    - Temporary confirmation
 *    - Clear button states
 */
