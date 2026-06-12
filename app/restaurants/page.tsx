'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import { restaurants } from '@/data/restaurants';

const cuisineFilters = ['All', 'Pizza', 'Burgers', 'Biryani', 'Chinese', 'South Indian', 'North Indian', 'Snacks', 'Desserts', 'Beverages'];

const sortOptions = [
  { label: 'Relevance',     value: 'default' },
  { label: 'Top Rated',     value: 'rating' },
  { label: 'Fastest',       value: 'time' },
  { label: 'Price: Low',    value: 'price_asc' },
  { label: 'Price: High',   value: 'price_desc' },
];

export default function RestaurantsPage() {
  const [search, setSearch]       = useState('');
  const [cuisine, setCuisine]     = useState('All');
  const [sort, setSort]           = useState('default');
  const [promoOnly, setPromoOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.cuisines.some((c) => c.toLowerCase().includes(q)));
    }
    if (cuisine !== 'All') list = list.filter((r) => r.cuisines.includes(cuisine));
    if (promoOnly)         list = list.filter((r) => r.promoted);
    if (sort === 'rating')      list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'time')   list.sort((a, b) => a.deliveryTime - b.deliveryTime);
    else if (sort === 'price_asc')  list.sort((a, b) => a.priceForOne - b.priceForOne);
    else if (sort === 'price_desc') list.sort((a, b) => b.priceForOne - a.priceForOne);
    return list;
  }, [search, cuisine, sort, promoOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Restaurants Near You</h1>
        <p className="text-muted text-sm mt-1">{filtered.length} restaurants in Mumbai</p>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants…"
            className="w-full pl-9 sm:pl-11 pr-8 py-2.5 sm:py-3 rounded-xl border border-base bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <SlidersHorizontal size={15} className="text-muted hidden sm:block" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="py-2.5 sm:py-3 pl-2 sm:pl-3 pr-2 rounded-xl border border-base bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Cuisine filter pills + Offers toggle — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4 sm:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {cuisineFilters.map((c) => (
          <button
            key={c}
            onClick={() => setCuisine(c)}
            className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
              cuisine === c ? 'bg-primary text-white border-primary' : 'border-base bg-card hover:border-primary hover:text-primary'
            }`}
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => setPromoOnly(!promoOnly)}
          className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
            promoOnly ? 'bg-blue-600 text-white border-blue-600' : 'border-base bg-card hover:border-blue-600 hover:text-blue-600'
          }`}
        >
          🏷 Offers
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg font-semibold">No restaurants found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      )}
    </div>
  );
}
