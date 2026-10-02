'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Store, UtensilsCrossed } from 'lucide-react';
import { allRestaurants } from '@/data/restaurants';

interface SearchResult {
  type: 'restaurant' | 'dish';
  id: number;
  name: string;
  sub: string;
  href: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const r of allRestaurants) {
    results.push({
      type: 'restaurant',
      id: r.id,
      name: r.name,
      sub: r.cuisines.join(', '),
      href: r.menu ? `/restaurants/${r.id}` : `/menu?category=${encodeURIComponent(r.category)}`,
    });
    if (r.menu) {
      for (const item of r.menu) {
        results.push({
          type: 'dish',
          id: item.id,
          name: item.name,
          sub: `${r.name} · ₹${item.price}`,
          href: `/restaurants/${r.id}`,
        });
      }
    }
  }
  return results;
}

const INDEX = buildIndex();

interface Props { onClose: () => void }

export default function GlobalSearch({ onClose }: Props) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef              = useRef<HTMLInputElement>(null);
  const router                = useRouter();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    const matched = INDEX.filter((r) =>
      r.name.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)
    ).slice(0, 20);
    setResults(matched);
  }, [query]);

  const go = (href: string) => { router.push(href); onClose(); };

  const restaurants = results.filter((r) => r.type === 'restaurant');
  const dishes      = results.filter((r) => r.type === 'dish');

  return (
    <div className="fixed inset-0 z-[300] flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl mx-auto mt-16 sm:mt-24 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 bg-card border border-base rounded-2xl px-4 py-3 shadow-2xl">
          <Search size={20} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, dishes, cuisines…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-muted hover:text-fg shrink-0"><X size={18} /></button>
          ) : (
            <button onClick={onClose} className="text-muted hover:text-fg shrink-0 text-xs font-semibold border border-base rounded-md px-2 py-1">ESC</button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-card border border-base rounded-2xl mt-2 overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
            {restaurants.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider px-4 pt-3 pb-1">Restaurants</p>
                {restaurants.map((r) => (
                  <button
                    key={`r-${r.id}`}
                    onClick={() => go(r.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-secondary transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Store size={15} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{r.name}</p>
                      <p className="text-xs text-muted truncate">{r.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {dishes.length > 0 && (
              <div className={restaurants.length > 0 ? 'border-t border-base' : ''}>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider px-4 pt-3 pb-1">Dishes</p>
                {dishes.map((r) => (
                  <button
                    key={`d-${r.id}`}
                    onClick={() => go(r.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-secondary transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <UtensilsCrossed size={15} className="text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{r.name}</p>
                      <p className="text-xs text-muted truncate">{r.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="bg-card border border-base rounded-2xl mt-2 p-8 text-center shadow-2xl">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-semibold">No results for &quot;{query}&quot;</p>
            <p className="text-muted text-sm mt-1">Try a different restaurant or dish name</p>
          </div>
        )}
      </div>
    </div>
  );
}
