'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  veg: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export const COUPONS: Record<string, { type: 'flat' | 'percent'; value: number; minOrder: number; description: string }> = {
  WELCOME50: { type: 'percent', value: 50,  minOrder: 199, description: '50% OFF on first order' },
  FREESHIP:  { type: 'flat',    value: 40,  minOrder: 0,   description: 'Free delivery (waives delivery fee)' },
  BIRYANI20: { type: 'percent', value: 20,  minOrder: 0,   description: '20% OFF on your order' },
  FOODY100:  { type: 'flat',    value: 100, minOrder: 599, description: '₹100 OFF on orders above ₹599' },
  SWEET10:   { type: 'percent', value: 10,  minOrder: 0,   description: '10% OFF on your order' },
  WEEKEND25: { type: 'percent', value: 25,  minOrder: 0,   description: '25% OFF weekend special' },
};

const MAX_QTY = 20;

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxes: number;
  total: number;
  coupon: string;
  couponError: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 499;
const GST_RATE = 0.05;
const STORAGE_KEY = 'foody-cart-v2';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setCart(JSON.parse(stored)); } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        if (existing.quantity >= MAX_QTY) return prev;
        return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const increaseQty = (id: number) => {
    setCart((prev) => prev.map((c) =>
      c.id === id && c.quantity < MAX_QTY ? { ...c, quantity: c.quantity + 1 } : c
    ));
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, quantity: c.quantity - 1 } : c)
          .filter((c) => c.quantity > 0)
    );
  };

  const clearCart = () => { setCart([]); setCoupon(''); };

  const applyCoupon = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    const found = COUPONS[upper];
    if (!found) { setCouponError('Invalid coupon code'); return false; }
    const rawSubtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    if (rawSubtotal < found.minOrder) {
      setCouponError(`Minimum order ₹${found.minOrder} required for this coupon`);
      return false;
    }
    setCoupon(upper);
    setCouponError('');
    return true;
  };

  const removeCoupon = () => { setCoupon(''); setCouponError(''); };

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal  = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const rawDelivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  let discount = 0;
  if (coupon && COUPONS[coupon]) {
    const c = COUPONS[coupon];
    if (c.type === 'percent') discount = Math.round(subtotal * c.value / 100);
    else if (c.type === 'flat' && c.description.includes('delivery')) discount = rawDelivery;
    else discount = c.value;
    discount = Math.min(discount, subtotal);
  }

  const deliveryFee = coupon === 'FREESHIP' ? 0 : rawDelivery;
  const taxableAmount = Math.max(0, subtotal - discount) + deliveryFee;
  const taxes = Math.round(taxableAmount * GST_RATE);
  const total = Math.max(0, subtotal - discount) + deliveryFee + taxes;

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart,
      itemCount, subtotal, deliveryFee, discount, taxes, total,
      coupon, couponError, applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
