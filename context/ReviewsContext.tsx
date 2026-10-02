'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Review {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (orderId: string, rating: number, comment: string) => void;
  getReview: (orderId: string) => Review | undefined;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);
const STORAGE_KEY = 'foody-reviews-v1';

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReviews(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews, hydrated]);

  const addReview = (orderId: string, rating: number, comment: string) => {
    const review: Review = { id: Date.now().toString(), orderId, rating, comment, createdAt: new Date().toISOString() };
    setReviews((prev) => [review, ...prev.filter((r) => r.orderId !== orderId)]);
  };

  const getReview = (orderId: string) => reviews.find((r) => r.orderId === orderId);

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
