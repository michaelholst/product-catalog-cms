'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './types/product';

/**
 * Shopping Cart Context
 *
 * Manages cart state across the application using React Context.
 * This is a Client Component pattern for global state management.
 *
 * Educational Note: Context API is React's built-in solution for sharing
 * state across components without prop drilling.
 */

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  // Educational: Persist cart across page refreshes
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Restore Date objects
        const restored = parsed.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            createdAt: new Date(item.product.createdAt),
            updatedAt: new Date(item.product.updatedAt),
            publishedAt: item.product.publishedAt ? new Date(item.product.publishedAt) : undefined,
          }
        }));
        setItems(restored);
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      // Check if product already in cart
      const existingItem = currentItems.find(item => item.product.id === product.id);

      if (existingItem) {
        // Update quantity
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...currentItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

/**
 * Educational Notes:
 *
 * 1. Context API Pattern:
 *    - Provider wraps the app
 *    - useCart hook accesses the context
 *    - State shared across all components
 *
 * 2. localStorage Persistence:
 *    - Cart survives page refreshes
 *    - Saved as JSON string
 *    - Loaded on mount
 *
 * 3. Cart Operations:
 *    - Add: Create new or increment existing
 *    - Remove: Filter out item
 *    - Update: Change quantity
 *    - Clear: Empty cart
 *
 * 4. Derived State:
 *    - totalItems: Sum of quantities
 *    - totalPrice: Sum of price × quantity
 *    - Calculated on every render
 */
