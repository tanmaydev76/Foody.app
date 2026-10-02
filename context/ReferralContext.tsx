'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReferralContextType {
  myCode: string;
  generateCode: (name: string) => void;
  applyReferral: (code: string) => { success: boolean; message: string; discount: number };
  appliedReferral: string;
  referralDiscount: number;
  clearReferral: () => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);
const STORAGE_KEY   = 'foody-referral-v1';
const USED_KEY      = 'foody-used-referrals-v1';
const REFERRAL_OFF  = 50; // ₹50 off

function makeCode(name: string): string {
  const base = name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
  const num  = Math.floor(100 + Math.abs(name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 900);
  return `${base}${num}`;
}

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [myCode, setMyCode]               = useState('');
  const [appliedReferral, setApplied]     = useState('');
  const [referralDiscount, setDiscount]   = useState(0);
  const [usedCodes, setUsedCodes]         = useState<string[]>([]);
  const [hydrated, setHydrated]           = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { code, applied, discount } = JSON.parse(stored);
        if (code)     setMyCode(code);
        if (applied)  setApplied(applied);
        if (discount) setDiscount(discount);
      }
      const usedStored = localStorage.getItem(USED_KEY);
      if (usedStored) setUsedCodes(JSON.parse(usedStored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: myCode, applied: appliedReferral, discount: referralDiscount }));
    localStorage.setItem(USED_KEY, JSON.stringify(usedCodes));
  }, [myCode, appliedReferral, referralDiscount, usedCodes, hydrated]);

  const generateCode = (name: string) => {
    if (myCode) return;
    setMyCode(makeCode(name));
  };

  const applyReferral = (code: string): { success: boolean; message: string; discount: number } => {
    const upper = code.trim().toUpperCase();
    if (!upper) return { success: false, message: 'Enter a referral code', discount: 0 };
    if (upper === myCode) return { success: false, message: "You can't use your own code", discount: 0 };
    if (usedCodes.includes(upper)) return { success: false, message: 'This code has already been used', discount: 0 };
    // any valid-looking code works (6-9 chars alphanumeric)
    if (!/^[A-Z0-9]{6,9}$/.test(upper)) return { success: false, message: 'Invalid referral code', discount: 0 };
    setApplied(upper);
    setDiscount(REFERRAL_OFF);
    setUsedCodes((prev) => [...prev, upper]);
    return { success: true, message: `₹${REFERRAL_OFF} referral discount applied!`, discount: REFERRAL_OFF };
  };

  const clearReferral = () => { setApplied(''); setDiscount(0); };

  return (
    <ReferralContext.Provider value={{ myCode, generateCode, applyReferral, appliedReferral, referralDiscount, clearReferral }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const ctx = useContext(ReferralContext);
  if (!ctx) throw new Error('useReferral must be used within ReferralProvider');
  return ctx;
}
