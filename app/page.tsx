'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, ShieldCheck, Truck, Star, MapPin } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import CategoryScroller from '@/components/CategoryScroller';
import RestaurantCard from '@/components/RestaurantCard';
import TopBrands from '@/components/TopBrands';
import DeliveryCheckModal from '@/components/DeliveryCheckModal';
import { foodItems, categories } from '@/data/foods';
import { restaurants } from '@/data/restaurants';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);

  const featured       = foodItems.filter((f) => f.rating >= 4.5).slice(0, 8);
  const topRestaurants = restaurants.filter((r) => r.rating >= 4.3).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/menu?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#1a1410] dark:to-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              🔥 India's #1 Food Delivery
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Craving something <span className="text-primary">delicious?</span>
            </h1>
            <p className="text-muted mt-4 text-sm sm:text-base lg:text-lg max-w-md">
              Order from 50+ mouth-watering dishes, freshly prepared and delivered hot to your doorstep in under 30 minutes.
            </p>

            {/* Search — inline on mobile too */}
            <form onSubmit={handleSearch} className="mt-6 sm:mt-8 flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search biryani, pizza…"
                  className="w-full pl-9 sm:pl-12 pr-3 py-3 sm:py-4 rounded-full border border-base bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 sm:px-8 py-3 sm:py-4 rounded-full whitespace-nowrap transition-colors text-sm sm:text-base"
              >
                Search
              </button>
            </form>

            {/* Delivery check CTA */}
            <button
              onClick={() => setDeliveryModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
            >
              <MapPin size={15} /> Check if we deliver to you →
            </button>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-4 mt-8">
              {[['500+','Restaurants'],['50+','Dishes on menu'],['30 min','Avg. delivery time'],['4.8 ★','App rating']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-xl sm:text-2xl font-extrabold">{val}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image — hidden on smallest screens, shown md+ */}
          <div className="relative hidden md:block h-72 sm:h-96 lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl bg-base-secondary">
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop&auto=format&q=80"
              alt="Delicious food"
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:-mt-8 relative z-10">
        <div className="bg-card border border-base rounded-2xl shadow-lg p-4 sm:p-6 flex flex-row overflow-x-auto scrollbar-hide gap-4 sm:grid sm:grid-cols-3">
          {[
            { Icon: Truck,       title: 'Fast Delivery',      sub: 'Hot food in 30 mins' },
            { Icon: ShieldCheck, title: '100% Hygienic',      sub: 'Safety-checked kitchens' },
            { Icon: Clock,       title: 'Live Tracking',      sub: 'Know when it arrives' },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 min-w-[180px] sm:min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm">{title}</p>
                <p className="text-[11px] sm:text-xs text-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Order our best food options</h2>
          <p className="text-muted text-sm mt-1">Find your favourite cuisine in seconds</p>
        </div>
        <CategoryScroller categories={categories} />
      </section>

      {/* ── Top Brands ── */}
      <TopBrands />

      {/* ── Popular Restaurants ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Popular Restaurants</h2>
            <p className="text-muted text-sm mt-1">Top-rated spots delivering near you</p>
          </div>
          <Link href="/restaurants" className="text-primary text-sm font-semibold hover:underline hidden sm:block">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {topRestaurants.map((r) => (
            <RestaurantCard key={r.id} r={r} />
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link href="/restaurants" className="text-primary text-sm font-semibold hover:underline">See all restaurants →</Link>
        </div>
      </section>

      {/* ── Most Popular dishes ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Most Popular</h2>
            <p className="text-muted text-sm mt-1">Hand-picked favourites loved by everyone</p>
          </div>
          <Link href="/menu" className="text-primary text-sm font-semibold hover:underline hidden sm:block">
            View full menu →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {featured.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link href="/menu" className="text-primary text-sm font-semibold hover:underline">View full menu →</Link>
        </div>
      </section>

      <DeliveryCheckModal open={deliveryModalOpen} onClose={() => setDeliveryModalOpen(false)} />

      {/* ── App Promo ── */}
      <section className="bg-secondary text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              Get the Foody app for the best experience
            </h2>
            <p className="text-gray-300 mt-3 text-sm sm:text-base max-w-md">
              Track your orders live, get exclusive app-only offers and reorder in just one tap.
            </p>
            <div className="flex gap-3 mt-5">
              <button className="bg-white text-secondary font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm">📱 App Store</button>
              <button className="bg-white text-secondary font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm">▶ Google Play</button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                  <Star className="text-yellow-400 mb-2" size={20} fill="currentColor" />
                  <p className="text-sm font-semibold">Amazing food, delivered hot!</p>
                  <p className="text-xs text-gray-400 mt-1">— Happy Customer</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
