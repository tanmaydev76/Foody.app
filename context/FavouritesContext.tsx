'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavouritesContextType {
  favourites: number[];
  toggleFavourite: (id: number) => void;
  isFavourite: (id: number) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);
const STORAGE_KEY = 'foody-favourites-v1';

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavourites(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites, hydrated]);

  const toggleFavourite = (id: number) =>
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const isFavourite = (id: number) => favourites.includes(id);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
