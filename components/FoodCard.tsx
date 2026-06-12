'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Plus, Minus } from 'lucide-react';
import { FoodItem, useCart } from '@/context/CartContext';

export default function FoodCard({ item }: { item: FoodItem }) {
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();
  const cartItem = cart.find((c) => c.id === item.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="bg-card border border-base rounded-xl sm:rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-black/5 transition-shadow">
      {/* Image */}
      <div className="relative w-full h-32 sm:h-44 overflow-hidden bg-base-secondary">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, 25vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Rating */}
        <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-base/90 backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 text-yellow-500">
          <Star size={10} fill="currentColor" /> {item.rating}
        </span>
        {/* Veg/Non-veg dot */}
        <span className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-sm border-2 flex items-center justify-center bg-base ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`} />
        </span>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2">{item.name}</h3>
        <p className="text-[10px] sm:text-xs text-muted mt-1 line-clamp-2 flex-1 hidden sm:block">{item.description}</p>

        <div className="flex items-center justify-between mt-2 sm:mt-4 gap-1">
          <div className="min-w-0">
            <span className="font-bold text-sm sm:text-base">₹{item.price}</span>
            {cartItem && (
              <span className="text-[10px] text-muted ml-1 hidden sm:inline">
                ×{cartItem.quantity} = ₹{item.price * cartItem.quantity}
              </span>
            )}
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1.5 sm:gap-3 bg-primary/10 rounded-full px-1.5 sm:px-2 py-1 sm:py-1.5">
              <button
                onClick={() => decreaseQty(item.id)}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white flex items-center justify-center"
                aria-label="Decrease"
              >
                <Minus size={11} />
              </button>
              <span className="text-xs sm:text-sm font-semibold w-3 sm:w-4 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => increaseQty(item.id)}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40"
                aria-label="Increase"
                disabled={cartItem.quantity >= 20}
              >
                <Plus size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="bg-primary hover:bg-primary-dark text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors flex items-center gap-0.5 sm:gap-1 whitespace-nowrap"
            >
              <Plus size={11} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
