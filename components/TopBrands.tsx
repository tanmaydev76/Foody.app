'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { brandRestaurants } from '@/data/restaurants';
import { haversineKm } from '@/lib/haversine';
import { calculateETA } from '@/lib/distance';
import { RESTAURANT_LOCATION } from '@/lib/constants';

export default function TopBrands() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { location } = useLocation();

  const userLat = location?.lat ?? RESTAURANT_LOCATION.lat;
  const userLng = location?.lng ?? RESTAURANT_LOCATION.lng;

  const sorted = [...brandRestaurants]
    .map((r) => {
      const dist = haversineKm(userLat, userLng, r.lat, r.lng);
      return { ...r, eta: calculateETA(dist) };
    })
    .sort((a, b) => a.eta - b.eta);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-end justify-between mb-5 sm:mb-7">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Top Brands Near You</h2>
          <p className="text-muted text-sm mt-1">Popular chains sorted by delivery time</p>
        </div>
        <Link href="/restaurants" className="text-primary text-sm font-semibold hover:underline hidden sm:block">
          See all →
        </Link>
      </div>

      <div className="relative group/scroll">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-card border border-base rounded-full shadow-md flex items-center justify-center hover:bg-base-secondary transition-colors opacity-0 group-hover/scroll:opacity-100 hidden sm:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-7 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-3"
        >
          {sorted.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="flex flex-col items-center gap-2.5 shrink-0 snap-start group"
            >
              {/* Logo circle */}
              <div
                className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full border-2 border-white/20 flex items-center justify-center text-white font-extrabold text-base sm:text-xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-200"
                style={{ background: r.brandColor ?? '#FF5A1F' }}
              >
                {r.brandInitials ?? r.name.charAt(0)}
              </div>
              {/* Name */}
              <p className="text-[11px] sm:text-xs font-semibold text-center leading-tight max-w-[72px] sm:max-w-[88px] truncate group-hover:text-primary transition-colors">
                {r.name}
              </p>
              {/* ETA pill */}
              <span className="text-[10px] sm:text-[11px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                {r.eta} min
              </span>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-card border border-base rounded-full shadow-md flex items-center justify-center hover:bg-base-secondary transition-colors opacity-0 group-hover/scroll:opacity-100 hidden sm:flex"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mobile "See all" link */}
      <div className="text-center mt-4 sm:hidden">
        <Link href="/restaurants" className="text-primary text-sm font-semibold hover:underline">
          See all restaurants →
        </Link>
      </div>
    </section>
  );
}
