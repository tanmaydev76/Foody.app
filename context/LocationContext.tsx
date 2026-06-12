'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;       // short display name e.g. "Andheri West, Mumbai"
  deliverable: boolean;
  etaMinutes: number | null;
}

interface LocationContextValue {
  location: UserLocation | null;
  setLocation: (loc: UserLocation | null) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const STORAGE_KEY = 'foody-location-v1';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<UserLocation | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLocationState(JSON.parse(stored));
    } catch {}
  }, []);

  const setLocation = (loc: UserLocation | null) => {
    setLocationState(loc);
    try {
      if (loc) localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
