'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode: string;
}

interface SavedAddressesContextType {
  addresses: SavedAddress[];
  saveAddress: (a: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
}

const SavedAddressesContext = createContext<SavedAddressesContextType | undefined>(undefined);
const STORAGE_KEY = 'foody-addresses-v1';

export function SavedAddressesProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAddresses(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const saveAddress = (a: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = { ...a, id: Date.now().toString() };
    setAddresses((prev) => [newAddr, ...prev.slice(0, 4)]); // keep max 5
  };

  const deleteAddress = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <SavedAddressesContext.Provider value={{ addresses, saveAddress, deleteAddress }}>
      {children}
    </SavedAddressesContext.Provider>
  );
}

export function useSavedAddresses() {
  const ctx = useContext(SavedAddressesContext);
  if (!ctx) throw new Error('useSavedAddresses must be used within SavedAddressesProvider');
  return ctx;
}
