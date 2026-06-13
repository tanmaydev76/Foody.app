'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, MapPin, ArrowLeft, ChevronRight } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import { allRestaurants, type Restaurant } from '@/data/restaurants';
import { haversineKm } from '@/lib/haversine';
import { calculateETA } from '@/lib/distance';
import { useLocation } from '@/context/LocationContext';
import { RESTAURANT_LOCATION } from '@/lib/constants';

function BrandLogoBox({ restaurant }: { restaurant: Restaurant }) {
  const [failed, setFailed] = useState(false);
  if (restaurant.logoUrl && !failed) {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-base bg-white shrink-0 shadow-md -mt-8 sm:-mt-10 z-10 overflow-hidden p-1.5 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-contain" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div
      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-base flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shrink-0 shadow-md -mt-8 sm:-mt-10 z-10"
      style={{ background: restaurant.brandColor }}
    >
      {restaurant.brandInitials ?? restaurant.name.charAt(0)}
    </div>
  );
}

export default function RestaurantPage() {
  const params  = useParams();
  const router  = useRouter();
  const { location } = useLocation();

  const id = parseInt(params.id as string, 10);
  const restaurant = allRestaurants.find((r) => r.id === id);

  useEffect(() => {
    if (!restaurant) router.replace('/restaurants');
  }, [restaurant, router]);

  const userLat = location?.lat ?? RESTAURANT_LOCATION.lat;
  const userLng = location?.lng ?? RESTAURANT_LOCATION.lng;

  const distKm = restaurant
    ? Math.round(haversineKm(userLat, userLng, restaurant.lat, restaurant.lng) * 10) / 10
    : 0;
  const eta = restaurant ? calculateETA(
    haversineKm(userLat, userLng, restaurant.lat, restaurant.lng)
  ) : 30;

  const categories = useMemo(() => {
    if (!restaurant?.menu) return [];
    return Array.from(new Set(restaurant.menu.map((i) => i.category)));
  }, [restaurant]);

  const [activeTab, setActiveTab] = useState('');
  useEffect(() => { if (categories.length) setActiveTab(categories[0]); }, [categories]);

  const tabsRef    = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* Intersection observer — highlight tab as section scrolls into view */
  useEffect(() => {
    if (!categories.length) return;
    const observers: IntersectionObserver[] = categories.map((cat) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(cat); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      const el = sectionRefs.current[cat];
      if (el) obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  const scrollToCategory = (cat: string) => {
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [imgLoaded, setImgLoaded] = useState(false);

  if (!restaurant) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
      {/* Back link */}
      <div className="pt-6 pb-4">
        <Link href="/restaurants" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
          <ArrowLeft size={15} /> All Restaurants
        </Link>
      </div>

      {/* ── Restaurant header ── */}
      <div className="bg-card border border-base rounded-2xl overflow-hidden mb-6">
        {/* Banner image */}
        <div className="relative w-full h-44 sm:h-56 md:h-64 bg-base-secondary">
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            unoptimized
            priority
            className={`object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Offer badge */}
          {restaurant.offer && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
              {restaurant.offer}
            </span>
          )}
        </div>

        {/* Info row */}
        <div className="p-4 sm:p-6 flex items-start gap-4">
          {/* Brand logo circle */}
          {restaurant.brandColor && (
            <BrandLogoBox restaurant={restaurant} />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold">{restaurant.name}</h1>
            <p className="text-muted text-sm mt-0.5 truncate">{restaurant.cuisines.join(' · ')}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className={`flex items-center gap-1 font-bold text-white px-2 py-1 rounded-lg text-xs ${restaurant.rating >= 4.5 ? 'bg-green-600' : 'bg-green-500'}`}>
                <Star size={11} fill="currentColor" /> {restaurant.rating}
              </span>
              <span className="flex items-center gap-1 text-muted">
                <Clock size={14} /> {eta} min
              </span>
              <span className="flex items-center gap-1 text-muted">
                <MapPin size={14} /> {distKm} km · {restaurant.area}
              </span>
              <span className="text-muted">₹{restaurant.costForTwo ?? restaurant.priceForOne * 2} for two</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── No menu fallback ── */}
      {!restaurant.menu?.length && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg font-bold">Menu coming soon</p>
          <p className="text-muted text-sm mt-2">Browse our full menu in the meantime</p>
          <Link href="/menu" className="inline-flex items-center gap-1.5 mt-5 bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-primary-dark transition-colors">
            Browse Full Menu <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* ── Menu with sticky category tabs ── */}
      {restaurant.menu && restaurant.menu.length > 0 && (
        <div className="flex gap-6">
          {/* Category sidebar — desktop only */}
          <aside className="hidden lg:block w-44 shrink-0">
            <div className="sticky top-20 space-y-1">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3 px-3">Menu</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === cat
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted hover:bg-base-secondary hover:text-fg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Sticky horizontal tabs — mobile + tablet */}
            <div
              ref={tabsRef}
              className="lg:hidden sticky top-16 z-20 bg-base/95 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 mb-6 flex gap-2 overflow-x-auto scrollbar-hide border-b border-base"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
                    activeTab === cat
                      ? 'bg-primary text-white border-primary'
                      : 'border-base bg-card hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu sections */}
            {categories.map((cat) => {
              const items = restaurant.menu!.filter((i) => i.category === cat);
              return (
                <div
                  key={cat}
                  id={`cat-${cat}`}
                  ref={(el) => { sectionRefs.current[cat] = el; }}
                  className="mb-10 scroll-mt-32"
                >
                  <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                    {cat}
                    <span className="text-xs font-normal text-muted">({items.length} items)</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                    {items.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
