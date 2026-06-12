'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CheckCircle2, Clock, ChefHat, Package, Bike, Home, Phone, ArrowLeft } from 'lucide-react';
import { RESTAURANT_LOCATION } from '@/lib/constants';
import { haversineKm } from '@/lib/haversine';

const OrderTrackingMap = dynamic(() => import('@/components/OrderTrackingMap'), { ssr: false });

/* ── Status config ── */
const STATUSES = [
  { key: 'placed',           icon: CheckCircle2, label: 'Order Placed',      sub: 'We received your order',          color: 'text-blue-500',   bg: 'bg-blue-500' },
  { key: 'confirmed',        icon: CheckCircle2, label: 'Order Confirmed',   sub: 'Restaurant accepted your order',  color: 'text-indigo-500', bg: 'bg-indigo-500' },
  { key: 'preparing',        icon: ChefHat,      label: 'Preparing',         sub: 'Kitchen is preparing your food',  color: 'text-yellow-500', bg: 'bg-yellow-500' },
  { key: 'out_for_delivery', icon: Bike,         label: 'Out for Delivery',  sub: 'Rider is on the way',             color: 'text-orange-500', bg: 'bg-orange-500' },
  { key: 'delivered',        icon: Package,      label: 'Delivered',         sub: 'Enjoy your meal! 🎉',              color: 'text-green-500',  bg: 'bg-green-500' },
];

/* Time each status takes (ms) — simulated progression */
const STATUS_DURATIONS: Record<string, number> = {
  placed:           8000,
  confirmed:        15000,
  preparing:        25000,
  out_for_delivery: 35000,
  delivered:        0,
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

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId  = searchParams.get('orderId') ?? '';
  const addrLat  = parseFloat(searchParams.get('lat')  ?? '19.0176');
  const addrLng  = parseFloat(searchParams.get('lng')  ?? '72.8562');
  const etaMins  = parseInt(searchParams.get('eta')    ?? '30');

  const [statusIdx, setStatusIdx] = useState(0);
  const [riderProgress, setRiderProgress] = useState(0);
  const progressRef = useRef(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStatus = STATUSES[statusIdx];
  const isDelivered = statusIdx === STATUSES.length - 1;
  const countdown = useCountdown(etaMins * 60 * 1000);

  /* Auto-advance statuses */
  useEffect(() => {
    let idx = 0;
    const advance = () => {
      idx++;
      if (idx < STATUSES.length) {
        setStatusIdx(idx);
        if (idx < STATUSES.length - 1) {
          setTimeout(advance, STATUS_DURATIONS[STATUSES[idx].key]);
        }
      }
    };
    const t = setTimeout(advance, STATUS_DURATIONS[STATUSES[0].key]);
    return () => clearTimeout(t);
  }, []);

  /* Animate rider when out for delivery */
  useEffect(() => {
    if (STATUSES[statusIdx].key === 'out_for_delivery') {
      progressRef.current = 0;
      animRef.current = setInterval(() => {
        progressRef.current = Math.min(1, progressRef.current + 0.004);
        setRiderProgress(progressRef.current);
        if (progressRef.current >= 1 && animRef.current) clearInterval(animRef.current);
      }, 300);
    }
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [statusIdx]);

  const distKm = Math.round(haversineKm(RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng, addrLat, addrLng) * 10) / 10;

  return (
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
        {!isDelivered && (
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
        isDelivered ? 'bg-green-50 dark:bg-green-900/20' : 'bg-primary/10'
      }`}>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
          isDelivered ? 'bg-green-500' : 'bg-primary'
        }`}>
          <currentStatus.icon size={22} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-base">{currentStatus.label}</p>
          <p className="text-xs text-muted">{currentStatus.sub}</p>
        </div>
        {!isDelivered && (
          <div className="ml-auto">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {/* Map */}
      <div className="mb-6">
        <OrderTrackingMap
          deliveryLat={addrLat}
          deliveryLng={addrLng}
          status={currentStatus.key}
          riderProgress={riderProgress}
        />
        <p className="text-xs text-muted text-center mt-2">
          Distance: {distKm} km from kitchen
        </p>
      </div>

      {/* Status timeline */}
      <div className="bg-card border border-base rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-sm mb-4">Order Status</h2>
        <div className="space-y-0">
          {STATUSES.map((s, i) => {
            const done    = i < statusIdx;
            const active  = i === statusIdx;
            const pending = i > statusIdx;
            return (
              <div key={s.key} className="flex items-start gap-3">
                {/* dot + line */}
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
      <div className="bg-card border border-base rounded-2xl p-5 mb-6 space-y-3 text-sm">
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

      {isDelivered && (
        <div className="text-center space-y-3">
          <div className="text-5xl">🎉</div>
          <p className="font-bold text-lg">Your order has been delivered!</p>
          <p className="text-muted text-sm">We hope you enjoyed your meal.</p>
          <div className="flex gap-3 justify-center mt-4">
            <Link href="/" className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors text-sm">
              Order Again
            </Link>
            <Link href="/orders" className="border border-base font-semibold px-6 py-3 rounded-full hover:bg-base-secondary transition-colors text-sm">
              View History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
