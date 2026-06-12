'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { RESTAURANT_LOCATION } from '@/lib/constants';
import type { Restaurant } from '@/data/restaurants';

let L: typeof import('leaflet') | null = null;

interface Props {
  restaurants: Restaurant[];
  onSelect?: (r: Restaurant) => void;
}

export default function RestaurantsMap({ restaurants, onSelect }: Props) {
  const { theme } = useTheme();
  const mapRef    = useRef<HTMLDivElement>(null);
  const mapObj    = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;
    let cancelled = false;

    (async () => {
      const leaflet = await import('leaflet');
      /* @ts-expect-error — no CSS type declarations */
      await import('leaflet/dist/leaflet.css');
      L = leaflet.default ?? leaflet;

      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (cancelled || !mapRef.current) return;

      /* Centre on Mumbai */
      const map = L.map(mapRef.current, { zoomControl: true }).setView([19.0760, 72.8777], 11);

      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      /* Kitchen marker */
      const kitchenIcon = L.divIcon({
        html: `<div style="background:#FF5A1F;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:18px">🏠</div>`,
        iconSize: [36, 36], iconAnchor: [18, 18], className: '',
      });
      L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], { icon: kitchenIcon })
        .addTo(map)
        .bindPopup(`<b>Foody Central Kitchen</b><br/>${RESTAURANT_LOCATION.address}`);

      /* Restaurant markers */
      restaurants.forEach((r) => {
        if (!L) return;
        const icon = L.divIcon({
          html: `
            <div style="
              background:white;
              border:2px solid #FF5A1F;
              border-radius:12px;
              padding:4px 8px;
              font-size:11px;
              font-weight:700;
              color:#FF5A1F;
              white-space:nowrap;
              box-shadow:0 2px 8px rgba(0,0,0,0.2);
              cursor:pointer;
              max-width:120px;
              overflow:hidden;
              text-overflow:ellipsis;
            ">${r.name}</div>`,
          iconAnchor: [0, 0],
          className: '',
        });

        const marker = L.marker([r.lat, r.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:160px">
              <img src="${r.image}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px"/>
              <b style="font-size:13px">${r.name}</b>
              <p style="font-size:11px;color:#888;margin:2px 0">${r.area} · ${r.cuisines[0]}</p>
              <p style="font-size:12px;margin:2px 0">⭐ ${r.rating} · ₹${r.priceForOne} for one</p>
              <p style="font-size:11px;color:#FF5A1F">🕐 ${r.deliveryTime} min${r.offer ? ' · ' + r.offer : ''}</p>
            </div>
          `);

        marker.on('click', () => {
          setActive(r.id);
          onSelect?.(r);
        });

        markersRef.current.push(marker);
      });

      mapObj.current = map;
      setReady(true);
    })();

    return () => { cancelled = true; };
  }, []);

  /* Swap tiles on theme change */
  useEffect(() => {
    if (!mapObj.current || !L) return;
    mapObj.current.eachLayer((layer) => {
      // @ts-ignore
      if (layer._url) mapObj.current!.removeLayer(layer);
    });
    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapObj.current);
  }, [theme]);

  /* Fly to restaurant when active changes */
  const flyTo = (r: Restaurant) => {
    mapObj.current?.flyTo([r.lat, r.lng], 15, { duration: 0.8 });
    setActive(r.id);
    onSelect?.(r);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[520px]">
      {/* Sidebar — restaurant list */}
      <div className="w-full lg:w-72 shrink-0 overflow-y-auto space-y-2 pr-1 order-2 lg:order-1 max-h-48 lg:max-h-full">
        {restaurants.map((r) => (
          <button
            key={r.id}
            onClick={() => flyTo(r)}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
              active === r.id
                ? 'border-primary bg-primary/10'
                : 'border-base bg-card hover:border-primary/50 hover:bg-base-secondary'
            }`}
          >
            <img src={r.image} alt={r.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <p className={`font-semibold text-sm truncate ${active === r.id ? 'text-primary' : ''}`}>{r.name}</p>
              <p className="text-xs text-muted truncate">{r.area}</p>
              <p className="text-xs mt-0.5">⭐ {r.rating} · 🕐 {r.deliveryTime} min</p>
            </div>
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative flex-1 order-1 lg:order-2 min-h-[320px]">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-secondary rounded-2xl z-10">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        )}
        <div
          ref={mapRef}
          className="w-full h-full rounded-2xl overflow-hidden border"
          style={{ borderColor: 'var(--border)' }}
        />
        <div className="absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-white/90 dark:bg-black/70 text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
            🏠 <span className="font-medium">Foody Kitchen</span>
          </span>
          <span className="bg-white/90 dark:bg-black/70 text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
            <span className="text-primary font-bold">Label</span> = Restaurant
          </span>
        </div>
      </div>
    </div>
  );
}
