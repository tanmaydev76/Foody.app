'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChefHat, Package, Bike, Home, Phone, ArrowLeft, X } from 'lucide-react';

const STATUSES = [
  { key: 'placed',           icon: CheckCircle2, label: 'Order Placed',      sub: 'We received your order',          color: 'text-blue-500',   bg: 'bg-blue-500' },
  { key: 'confirmed',        icon: CheckCircle2, label: 'Order Confirmed',   sub: 'Restaurant accepted your order',  color: 'text-indigo-500', bg: 'bg-indigo-500' },
  { key: 'preparing',        icon: ChefHat,      label: 'Preparing',         sub: 'Kitchen is preparing your food',  color: 'text-yellow-500', bg: 'bg-yellow-500' },
  { key: 'out_for_delivery', icon: Bike,         label: 'Out for Delivery',  sub: 'Rider is on the way',             color: 'text-orange-500', bg: 'bg-orange-500' },
  { key: 'delivered',        icon: Package,      label: 'Delivered',         sub: 'Enjoy your meal! 🎉',             color: 'text-green-500',  bg: 'bg-green-500' },
];

const STATUS_DURATIONS: Record<string, number> = {
  placed:            8000,
  confirmed:         15000,
  preparing:         25000,
  out_for_delivery:  20000, // advances to delivered after 20s
};

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(targetMs);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return { mins, secs, done: remaining <= 0 };
}

function DeliveredModal({ expired, onClose }: { expired: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-base rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-fg transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="text-4xl">🎉</span>
        </div>

        <div>
          <h2 className="text-xl font-extrabold mb-1">
            {expired ? 'Order Cannot Be Tracked' : 'Order Delivered!'}
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            {expired
              ? 'This order has already been delivered. Live tracking is no longer available.'
              : 'Your order has been delivered successfully. We hope you enjoyed your meal!'}
          </p>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <Link
            href="/"
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl text-sm transition-colors text-center"
          >
            Order Again
          </Link>
          <Link
            href="/orders"
            className="flex-1 border border-base font-semibold py-3 rounded-xl text-sm hover:bg-base-secondary transition-colors text-center"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();

  const orderId  = searchParams.get('orderId') ?? '';
  const addrLat  = parseFloat(searchParams.get('lat') ?? '19.0176');
  const addrLng  = parseFloat(searchParams.get('lng') ?? '72.8562');
  const etaMins  = parseInt(searchParams.get('eta')   ?? '30');
  const placedAt = parseInt(searchParams.get('t')     ?? '0');

  const trackingExpired = placedAt > 0 && (
    Date.now() - placedAt > etaMins * 60 * 1000 ||
    Date.now() - placedAt > 2 * 60 * 60 * 1000
  );

  const [statusIdx, setStatusIdx]     = useState(0);
  const [showModal, setShowModal]     = useState(trackingExpired);
  const advancedRef                   = useRef(false);

  const currentStatus = STATUSES[statusIdx];
  const isDelivered   = statusIdx === STATUSES.length - 1;
  const countdown     = useCountdown(etaMins * 60 * 1000);

  /* Auto-advance through all statuses via timers */
  useEffect(() => {
    if (trackingExpired) return;
    let idx = 0;
    const advance = () => {
      idx++;
      if (idx >= STATUSES.length) return;
      setStatusIdx(idx);
      if (idx === STATUSES.length - 1) {
        // reached delivered — show popup
        setShowModal(true);
        return;
      }
      const nextKey = STATUSES[idx].key;
      if (STATUS_DURATIONS[nextKey]) setTimeout(advance, STATUS_DURATIONS[nextKey]);
    };
    const t = setTimeout(advance, STATUS_DURATIONS[STATUSES[0].key]);
    return () => clearTimeout(t);
  }, [trackingExpired]);

  return (
    <>
      {showModal && (
        <DeliveredModal expired={trackingExpired} onClose={() => setShowModal(false)} />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Back */}
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft size={15} /> Order History
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">Track Order</h1>
            <p className="text-muted text-sm mt-0.5 font-mono">{orderId}</p>
          </div>
          {!isDelivered && !trackingExpired && (
            <div className="text-right">
              <p className="text-xs text-muted">Estimated arrival</p>
              <p className="text-xl font-extrabold text-primary tabular-nums">
                {countdown.done ? '🎉 Arrived!' : `${countdown.mins}:${String(countdown.secs).padStart(2, '0')}`}
              </p>
            </div>
          )}
        </div>

        {/* Status banner */}
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 mb-6 ${
          isDelivered || trackingExpired ? 'bg-green-50 dark:bg-green-900/20' : 'bg-primary/10'
        }`}>
          <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
            isDelivered || trackingExpired ? 'bg-green-500' : 'bg-primary'
          }`}>
            <currentStatus.icon size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base">
              {trackingExpired ? 'Order Delivered' : currentStatus.label}
            </p>
            <p className="text-xs text-muted">
              {trackingExpired ? 'Tracking is no longer available' : currentStatus.sub}
            </p>
          </div>
          {!isDelivered && !trackingExpired && (
            <div className="ml-auto">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        {/* Status timeline */}
        <div className="bg-card border border-base rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-sm mb-4">Order Status</h2>
          <div className="space-y-0">
            {STATUSES.map((s, i) => {
              const done    = trackingExpired ? true : i < statusIdx;
              const active  = !trackingExpired && i === statusIdx;
              const pending = !trackingExpired && i > statusIdx;
              return (
                <div key={s.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                      done   ? `${s.bg} border-transparent` :
                      active ? `${s.bg} border-transparent ring-4 ring-offset-2 ring-offset-card ${s.bg}/40` :
                               'border-base bg-base-secondary'
                    }`}>
                      <s.icon size={15} className={done || active ? 'text-white' : 'text-muted'} />
                    </div>
                    {i < STATUSES.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 rounded transition-all duration-700 ${done ? s.bg : 'bg-base'}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`font-semibold text-sm ${pending ? 'text-muted' : ''} ${active ? s.color : ''}`}>
                      {s.label}
                      {active && <span className="ml-2 text-xs font-normal text-muted animate-pulse">In progress…</span>}
                    </p>
                    {(done || active) && <p className="text-xs text-muted">{s.sub}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-card border border-base rounded-2xl p-5 space-y-3 text-sm">
          <h2 className="font-bold">Delivery Info</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Bike size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Ravi Kumar</p>
              <p className="text-xs text-muted">Your delivery partner</p>
            </div>
            <a href="tel:+919876543210" className="ml-auto flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors">
              <Phone size={12} /> Call
            </a>
          </div>
          <div className="flex items-center gap-3 border-t border-base pt-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Home size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-xs">Delivering to</p>
              <p className="text-xs text-muted">{addrLat.toFixed(4)}, {addrLng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
