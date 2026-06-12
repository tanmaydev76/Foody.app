'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { DeliveryCheckResult } from '@/app/api/delivery/check/route';

/* Leaflet must be client-only — no SSR */
const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

interface Props {
  open: boolean;
  onClose: () => void;
  initialAddress?: string;
}

export default function DeliveryCheckModal({ open, onClose, initialAddress }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-card border border-base rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-base">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            <h2 className="font-bold text-base">Check Delivery</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-base-secondary transition-colors text-muted hover:text-fg">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted mb-4">Enter your address or drop a pin to check if we deliver to you.</p>
          <DeliveryMap initialAddress={initialAddress} />
        </div>
      </div>
    </div>
  );
}
