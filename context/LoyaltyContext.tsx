'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoyaltyContextType {
  points: number;
  addPoints: (orderTotal: number) => void;
  redeemPoints: (pts: number) => void;
  pointsToDiscount: (pts: number) => number;
  maxRedeemable: (total: number) => number;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);
const STORAGE_KEY = 'foody-loyalty-v1';

// 1 point per ₹10 spent; 100 points = ₹10 off
const EARN_RATE  = 0.1;   // points per rupee
const REDEEM_RATE = 10;   // points per rupee discount

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPoints(Number(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, String(points));
  }, [points, hydrated]);

  const addPoints = (orderTotal: number) => {
    const earned = Math.floor(orderTotal * EARN_RATE);
    setPoints((p) => p + earned);
  };

  const redeemPoints = (pts: number) => {
    setPoints((p) => Math.max(0, p - pts));
  };

  const pointsToDiscount = (pts: number) => Math.floor(pts / REDEEM_RATE);

  const maxRedeemable = (total: number) => {
    const maxByTotal = Math.floor(total * 0.2 * REDEEM_RATE); // max 20% of total
    return Math.min(points, maxByTotal);
  };

  return (
    <LoyaltyContext.Provider value={{ points, addPoints, redeemPoints, pointsToDiscount, maxRedeemable }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error('useLoyalty must be used within LoyaltyProvider');
  return ctx;
}
