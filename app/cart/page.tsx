'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCart, COUPONS } from '@/context/CartContext';

export default function CartPage() {
  const {
    cart, increaseQty, decreaseQty, removeFromCart,
    subtotal, deliveryFee, discount, taxes, total, itemCount,
    coupon, couponError, applyCoupon, removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-base-secondary flex items-center justify-center mb-5">
          <ShoppingBag size={36} className="text-muted" />
        </div>
        <h1 className="text-2xl font-extrabold">Your cart is empty</h1>
        <p className="text-muted mt-2 text-sm">Looks like you haven't added anything yet.</p>
        <Link href="/menu" className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors">
          Browse Menu <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  /* Group items by restaurantName (default: "Foody Kitchen") */
  const groups = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    const key = item.restaurantName ?? 'Foody Kitchen';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const restaurantNames = Object.keys(groups);
  const multiRestaurant = restaurantNames.length > 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-32 sm:pb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">Your Cart</h1>
      <p className="text-muted text-xs sm:text-sm mb-5 sm:mb-8">{itemCount} item{itemCount > 1 ? 's' : ''} in your cart</p>

      {/* Multi-restaurant notice */}
      {multiRestaurant && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 text-sm">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-700 dark:text-amber-400">
            <span className="font-semibold">Items from {restaurantNames.length} restaurants.</span>{' '}
            Combining items from multiple restaurants may affect delivery time.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Items + coupon */}
        <div className="lg:col-span-2 space-y-5">
          {restaurantNames.map((restName) => (
            <div key={restName}>
              {/* Restaurant group header */}
              {multiRestaurant && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-xs font-bold text-muted uppercase tracking-wide">From</span>
                  <span className="text-sm font-bold text-primary">{restName}</span>
                </div>
              )}
              <div className="space-y-3 sm:space-y-4">
                {groups[restName].map((item) => (
                  <div key={item.id} className="bg-card border border-base rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-base-secondary">
                      <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">{item.name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted mt-0.5">{item.category}</p>
                      <p className="font-bold text-sm sm:text-base mt-1 sm:mt-2">
                        ₹{item.price}
                        <span className="text-[10px] sm:text-xs text-muted font-normal ml-1">
                          ×{item.quantity} = <span className="text-fg font-semibold">₹{item.price * item.quantity}</span>
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:gap-3">
                      <button onClick={() => removeFromCart(item.id)} className="text-muted hover:text-red-500 transition-colors" aria-label="Remove">
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2 sm:gap-3 bg-primary/10 rounded-full px-1.5 sm:px-2 py-1 sm:py-1.5">
                        <button onClick={() => decreaseQty(item.id)} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white flex items-center justify-center">
                          <Minus size={11} />
                        </button>
                        <span className="text-xs sm:text-sm font-semibold w-3 sm:w-4 text-center">{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40" disabled={item.quantity >= 20}>
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Coupon */}
          <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Tag size={15} className="text-primary" /> Apply Coupon
            </h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-green-700 dark:text-green-400">{coupon}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">{COUPONS[coupon]?.description}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-muted hover:text-red-500 ml-2" aria-label="Remove coupon"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-base bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono uppercase"
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponInput)}
                />
                <button
                  onClick={() => applyCoupon(couponInput)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
            {!coupon && (
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.keys(COUPONS).map((code) => (
                  <button
                    key={code}
                    onClick={() => { setCouponInput(code); applyCoupon(code); }}
                    className="font-mono text-[10px] sm:text-xs border border-dashed border-primary text-primary px-2 sm:px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bill summary — desktop sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-card border border-base rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Bill Summary</h2>
            <BillRows subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} taxes={taxes} total={total} coupon={coupon} />
            <Link href="/checkout" className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-base px-4 py-3 shadow-xl">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted">
            {itemCount} item{itemCount > 1 ? 's' : ''}
            {discount > 0 && <span className="text-green-600 ml-2">• Saved ₹{discount}</span>}
          </span>
          <span className="font-bold text-base">₹{total}</span>
        </div>
        <Link
          href="/checkout"
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors text-sm"
        >
          Proceed to Checkout <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function BillRows({ subtotal, deliveryFee, discount, taxes, total, coupon }: {
  subtotal: number; deliveryFee: number; discount: number; taxes: number; total: number; coupon: string;
}) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-muted"><span>Item Total</span><span className="text-fg font-medium">₹{subtotal}</span></div>
      <div className="flex justify-between text-muted">
        <span>Delivery Fee</span>
        <span className="text-fg font-medium">{deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600"><span>Discount ({coupon})</span><span className="font-semibold">- ₹{discount}</span></div>
      )}
      <div className="flex justify-between text-muted"><span>Taxes (GST 5%)</span><span className="text-fg font-medium">₹{taxes}</span></div>
      {subtotal > 0 && subtotal < 499 && !coupon && (
        <p className="text-xs text-primary bg-primary/10 rounded-lg p-2">Add ₹{499 - subtotal} more for FREE delivery!</p>
      )}
      <div className="border-t border-base pt-3 flex justify-between font-bold text-base"><span>To Pay</span><span>₹{total}</span></div>
    </div>
  );
}
