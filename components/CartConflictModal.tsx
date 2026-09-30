'use client';

import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartConflictModal() {
  const { pendingConflict, confirmClearAndAdd, dismissConflict } = useCart();
  if (!pendingConflict) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismissConflict} />
      <div className="relative bg-card border border-base rounded-2xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={dismissConflict} className="absolute top-4 right-4 text-muted hover:text-fg">
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <ShoppingCart size={26} className="text-orange-500" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold mb-1">Start a new cart?</h2>
          <p className="text-muted text-sm leading-relaxed">
            Your cart has items from{' '}
            <span className="font-semibold text-fg">{pendingConflict.fromRestaurant}</span>.
            Adding from{' '}
            <span className="font-semibold text-fg">{pendingConflict.item.restaurantName}</span>{' '}
            will clear your current cart.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={dismissConflict}
            className="flex-1 border border-base font-semibold py-2.5 rounded-xl text-sm hover:bg-base-secondary transition-colors"
          >
            Keep Current
          </button>
          <button
            onClick={confirmClearAndAdd}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}
