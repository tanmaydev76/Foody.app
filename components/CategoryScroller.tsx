'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* Curated Unsplash photo IDs — same CDN source as food/restaurant data */
const CATEGORY_PHOTOS: Record<string, string> = {
  Pizza:          'photo-1565299624946-b28f40a0ae38',
  Burgers:        'photo-1568901346375-23c9450c58cd',
  Biryani:        'photo-1563379091339-03b21ab4a4f8',
  Chinese:        'photo-1569718212165-3a8278d5f624',
  'South Indian': 'photo-1589301760014-d929f3979dbc',
  'North Indian': 'photo-1585937421612-70a008356fbe',
  Rolls:          'photo-1626700051175-6818013e1d4f',
  Snacks:         'photo-1576107232684-1279f390859f',
  Desserts:       'photo-1567620905732-2d1ec7ab7445',
  Beverages:      'photo-1544145945-f90425340c7e',
};

function categoryImg(cat: string) {
  const id = CATEGORY_PHOTOS[cat] ?? 'photo-1504674900247-0877df9cc836';
  return `https://images.unsplash.com/${id}?w=200&h=200&fit=crop&auto=format&q=70`;
}

function CategoryItem({ cat }: { cat: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Link
      href={`/menu?category=${encodeURIComponent(cat)}`}
      className="flex flex-col items-center gap-2 sm:gap-3 flex-shrink-0 group"
    >
      <div className="w-20 h-20 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md relative bg-base-secondary">
        {!loaded && <div className="absolute inset-0 skeleton rounded-full" />}
        <Image
          src={categoryImg(cat)}
          alt={cat}
          fill
          sizes="128px"
          className={`object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-center group-hover:text-primary transition-colors leading-tight">
        {cat}
      </span>
    </Link>
  );
}

export default function CategoryScroller({ categories }: { categories: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') =>
    ref.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex absolute -left-4 top-12 md:top-14 z-10 w-9 h-9 rounded-full bg-card border border-base shadow-md items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex absolute -right-4 top-12 md:top-14 z-10 w-9 h-9 rounded-full bg-card border border-base shadow-md items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>

      <div ref={ref} className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 scroll-smooth px-1">
        {categories.map((cat) => (
          <CategoryItem key={cat} cat={cat} />
        ))}
      </div>
    </div>
  );
}
