'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Crosshair, Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLocation } from '@/context/LocationContext';
import type { DeliveryCheckResult } from '@/app/api/delivery/check/route';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LocationPickerModal({ open, onClose }: Props) {
  const { location, setLocation } = useLocation();
  const [pendingResult, setPendingResult] = useState<DeliveryCheckResult | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Reset pending result when modal opens */
  useEffect(() => { if (open) setPendingResult(null); }, [open]);

  const handleResult = (result: DeliveryCheckResult) => {
    setPendingResult(result);
  };

  const confirmLocation = async () => {
    if (!pendingResult?.userLat || !pendingResult?.userLng) return;

    /* Reverse-geocode to get a short label */
    let label = `${pendingResult.userLat.toFixed(4)}, ${pendingResult.userLng.toFixed(4)}`;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${pendingResult.userLat}&lon=${pendingResult.userLng}&format=json`,
        { headers: { 'User-Agent': 'FoodyApp/1.0' } }
      );
      const data = await res.json();
      const addr = data.address;
      const parts = [
        addr.neighbourhood || addr.suburb || addr.village,
        addr.city || addr.town || addr.county,
      ].filter(Boolean);
      label = parts.join(', ') || data.display_name?.split(',').slice(0, 2).join(',') || label;
    } catch {}

    setLocation({
      lat: pendingResult.userLat,
      lng: pendingResult.userLng,
      label,
      deliverable: pendingResult.deliverable,
      etaMinutes: pendingResult.durationMinutes,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-card border border-base rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            <div>
              <h2 className="font-bold text-base leading-tight">Set Delivery Location</h2>
              <p className="text-xs text-muted">Search, click map, or use GPS</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-base-secondary transition-colors text-muted hover:text-fg">
            <X size={16} />
          </button>
        </div>

        {/* Current location chip */}
        {location && (
          <div className="mx-5 mt-4 flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-3 py-2 text-sm">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="text-primary font-medium truncate">Current: {location.label}</span>
            <button
              onClick={() => { setLocation(null); }}
              className="ml-auto text-primary/60 hover:text-primary shrink-0"
              title="Clear location"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Map */}
        <div className="p-5">
          <DeliveryMap onResult={handleResult} />
        </div>

        {/* Confirm button */}
        {pendingResult && (
          <div className="px-5 pb-5 space-y-3">
            <div className={`flex items-start gap-2 text-sm rounded-xl px-4 py-3 border ${
              pendingResult.deliverable
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              {pendingResult.deliverable
                ? <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                : <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              }
              <span className={`text-xs font-medium ${pendingResult.deliverable ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {pendingResult.message}
              </span>
            </div>

            <button
              onClick={confirmLocation}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <MapPin size={16} />
              {pendingResult.deliverable
                ? `Deliver here · ~${pendingResult.durationMinutes} min`
                : 'Set this location anyway'
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
