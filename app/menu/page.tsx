'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import { foodItems, categories } from '@/data/foods';

function MenuContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const pathname      = usePathname();

  const [search, setSearch]                 = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [vegOnly, setVegOnly]               = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (search.trim())            params.set('search', search.trim());
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [activeCategory, search]);

  const filtered = useMemo(() => foodItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) &&
      (activeCategory === 'All' || item.category === activeCategory) &&
      (!vegOnly || item.veg)
    );
  }), [search, activeCategory, vegOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Our Menu</h1>
        <p className="text-muted text-sm mt-1">Choose from {foodItems.length}+ delicious dishes</p>
      </div>

      {/* Search + veg filter */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes…"
            className="w-full pl-9 sm:pl-11 pr-8 py-2.5 sm:py-3 rounded-full border border-base bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold border transition-colors flex items-center gap-1.5 ${vegOnly ? 'bg-green-600 text-white border-green-600' : 'border-base bg-card'}`}
        >
          <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${vegOnly ? 'border-white' : 'border-green-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${vegOnly ? 'bg-white' : 'bg-green-600'}`} />
          </span>
          <span className="hidden sm:inline">Pure </span>Veg
        </button>
      </div>

      {/* Category pills — horizontal scroll on all screen sizes */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-colors shrink-0 ${
              activeCategory === cat ? 'bg-primary text-white border-primary' : 'border-base bg-card hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-muted">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg font-semibold">No dishes found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All'); setVegOnly(false); }} className="mt-4 text-primary text-sm font-semibold hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm text-muted mb-3 sm:mb-4">{filtered.length} dish{filtered.length !== 1 ? 'es' : ''} found</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((item) => <FoodCard key={item.id} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl sm:rounded-2xl overflow-hidden border border-base">
            <div className="h-32 sm:h-44 skeleton" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-3 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
