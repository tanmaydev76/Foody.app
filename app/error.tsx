'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl mb-6">😕</p>
      <h1 className="text-2xl font-extrabold">Something went wrong</h1>
      <p className="text-muted mt-2 text-sm">{error.message || 'An unexpected error occurred.'}</p>
      <div className="flex gap-3 justify-center mt-8">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Try again
        </button>
        <Link href="/" className="border border-base font-semibold px-6 py-3 rounded-full hover:bg-base-secondary transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
