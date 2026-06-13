'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, LayoutGrid, Map } from 'lucide-react';
import dynamic from 'next/dynamic';
import RestaurantCard from '@/components/RestaurantCard';
import { allRestaurants } from '@/data/restaurants';
import type { Restaurant } from '@/data/restaurants';
import { haversineKm } from '@/lib/haversine';
import { calculateETA } from '@/lib/distance';
import { useLocation } from '@/context/LocationContext';
import { RESTAURANT_LOCATION } from '@/lib/constants';

const RestaurantsMap = dynamic(() => import('@/components/RestaurantsMap'), { ssr: false });

const cuisineFilters = ['All', 'Pizza', 'Burgers', 'Biryani', 'Chinese', 'South Indian', 'North Indian', 'Snacks', 'Desserts', 'Beverages', 'Momos', 'Coffee', 'Ice Cream'];

const sortOptions = [
  { label: 'Fastest (ETA)',  value: 'eta' },
  { label: 'Relevance',     value: 'default' },
  { label: 'Top Rated',     value: 'rating' },
  { label: 'Price: Low',    value: 'price_asc' },
  { label: 'Price: High',   value: 'price_desc' },
];

export default function RestaurantsPage() {
  const [search,    setSearch]    = useState('');
  const [cuisine,   setCuisine]   = useState('All');
  const [sort,      setSort]      = useState('eta');
  const [promoOnly, setPromoOnly] = useState(false);
  const [view,      setView]      = useState<'grid' | 'map'>('grid');
  const [mapSelected, setMapSelected] = useState<Restaurant | null>(null);

  const { location } = useLocation();
  const userLat = location?.lat ?? RESTAURANT_LOCATION.lat;
  const userLng = location?.lng ?? RESTAURANT_LOCATION.lng;

  const enriched = useMemo(() =>
    allRestaurants.map((r) => {
      const dist = haversineKm(userLat, userLng, r.lat, r.lng);
      return { ...r, distKm: Math.round(dist * 10) / 10, eta: calculateETA(dist) };
    }),
    [userLat, userLng]
  );

  const filtered = useMemo(() => {
    let list = [...enriched];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) || r.cuisines.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (cuisine !== 'All') list = list.filter((r) => r.cuisines.some((c) => c.toLowerCase().includes(cuisine.toLowerCase())));
    if (promoOnly) list = list.filter((r) => r.promoted);
    if (sort === 'eta')             list.sort((a, b) => a.eta - b.eta);
    else if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'price_asc')  list.sort((a, b) => (a.costForTwo ?? a.priceForOne * 2) - (b.costForTwo ?? b.priceForOne * 2));
    else if (sort === 'price_desc') list.sort((a, b) => (b.costForTwo ?? b.priceForOne * 2) - (a.costForTwo ?? a.priceForOne * 2));
    return list;
  }, [enriched, search, cuisine, sort, promoOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Restaurants Near You</h1>
          <p className="text-muted text-sm mt-1">{filtered.length} restaurants in Mumbai</p>
        </div>
        <div className="flex items-center bg-base-secondary border border-base rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              view === 'grid' ? 'bg-primary text-white shadow' : 'text-muted hover:text-fg'
            }`}
          >
            <LayoutGrid size={14} /> Grid
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              view === 'map' ? 'bg-primary text-white shadow' : 'text-muted hover:text-fg'
            }`}
          >
            <Map size={14} /> Map
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants or cuisines…"
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

      {/* Cuisine filter pills */}
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

      {/* ── Map view ── */}
      {view === 'map' && (
        <div className="space-y-4">
          <RestaurantsMap restaurants={filtered} onSelect={setMapSelected} />
          {mapSelected && (
            <div className="bg-card border border-primary/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              {mapSelected.brandColor ? (
                <div
                  className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-white font-extrabold text-xl"
                  style={{ background: mapSelected.brandColor }}
                >
                  {mapSelected.brandInitials ?? mapSelected.name.charAt(0)}
                </div>
              ) : (
                <img src={mapSelected.image} alt={mapSelected.name} className="w-20 h-16 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base">{mapSelected.name}</h3>
                  {mapSelected.promoted && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Promoted</span>}
                </div>
                <p className="text-xs text-muted mt-0.5">{mapSelected.area} · {mapSelected.cuisines.join(', ')}</p>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span>⭐ {mapSelected.rating}</span>
                  <span>₹{mapSelected.costForTwo ?? mapSelected.priceForOne * 2} for two</span>
                  {mapSelected.offer && <span className="text-green-600 font-semibold">{mapSelected.offer}</span>}
                </div>
              </div>
              <button onClick={() => setMapSelected(null)} className="text-muted hover:text-fg shrink-0">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Grid view ── */}
      {view === 'grid' && (
        filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} r={r} distKm={r.distKm} eta={r.eta} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-lg font-semibold">No restaurants found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        )
      )}
    </div>
  );
}
