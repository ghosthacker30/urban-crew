'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization: {
    size: 'Regular' | 'Large' | 'Grande';
    milk: 'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Soy Milk';
    sweetness: 'None' | 'Less' | 'Standard' | 'Extra';
  };
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // list of product IDs
  deliveryMethod: 'DELIVERY' | 'PICKUP';
  coupon: Coupon | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: string, customizationKey: string) => void;
  updateQuantity: (itemId: string, customizationKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setDeliveryMethod: (method: 'DELIVERY' | 'PICKUP') => void;
  applyCoupon: (coupon: Coupon | null) => boolean; // returns true if applied successfully
  getCartSubtotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getDeliveryCharge: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to generate a key for comparing customizations
const getCustomizationKey = (cust: CartItem['customization']) => {
  return `${cust.size}-${cust.milk}-${cust.sweetness}`;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethodState] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ub_cart');
    const savedWishlist = localStorage.getItem('ub_wishlist');
    const savedMethod = localStorage.getItem('ub_delivery_method');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedMethod) setDeliveryMethodState(savedMethod as 'DELIVERY' | 'PICKUP');
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ub_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ub_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart((prevCart) => {
      const newKey = getCustomizationKey(newItem.customization);
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && getCustomizationKey(item.customization) === newKey
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }

      return [...prevCart, { ...newItem, quantity }];
    });
  };

  const removeFromCart = (itemId: string, customizationKey: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === itemId && getCustomizationKey(item.customization) === customizationKey)
      )
    );
  };

  const updateQuantity = (itemId: string, customizationKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, customizationKey);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && getCustomizationKey(item.customization) === customizationKey
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      }
      return [...prevWishlist, productId];
    });
  };

  const setDeliveryMethod = (method: 'DELIVERY' | 'PICKUP') => {
    setDeliveryMethodState(method);
    localStorage.setItem('ub_delivery_method', method);
  };

  const applyCoupon = (newCoupon: Coupon | null): boolean => {
    if (!newCoupon) {
      setCoupon(null);
      return true;
    }
    const subtotal = getCartSubtotal();
    if (subtotal >= newCoupon.minPurchase) {
      setCoupon(newCoupon);
      return true;
    }
    return false;
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    const subtotal = getCartSubtotal();
    if (subtotal < coupon.minPurchase) return 0; // double safety check

    if (coupon.discountType === 'PERCENTAGE') {
      return (subtotal * coupon.value) / 100;
    } else {
      return Math.min(coupon.value, subtotal);
    }
  };

  const getTaxAmount = () => {
    const taxableAmount = Math.max(0, getCartSubtotal() - getDiscountAmount());
    return taxableAmount * 0.08; // 8% standard VAT/Tax
  };

  const getDeliveryCharge = () => {
    if (deliveryMethod === 'PICKUP') return 0;
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 20.0) return 0; // Free delivery for orders above $20
    return 3.99; // Standard delivery fee
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    const tax = getTaxAmount();
    const delivery = getDeliveryCharge();
    return Math.max(0, subtotal - discount + tax + delivery);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        deliveryMethod,
        coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        setDeliveryMethod,
        applyCoupon,
        getCartSubtotal,
        getDiscountAmount,
        getTaxAmount,
        getDeliveryCharge,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
