'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { RESTAURANT_LOCATION } from '@/lib/constants';

let L: typeof import('leaflet') | null = null;

interface Props {
  deliveryLat: number;
  deliveryLng: number;
  status: string;
  riderProgress: number; // 0–1
}

// Fetch road route from OSRM (free, no API key)
async function fetchRoadRoute(
  fromLat: number, fromLng: number,
  toLat: number,   toLng: number
): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const res  = await fetch(url);
    const data = await res.json();
    const coords: [number, number][] = data.routes?.[0]?.geometry?.coordinates ?? [];
    // OSRM returns [lng, lat] — flip to [lat, lng] for Leaflet
    return coords.map(([lng, lat]) => [lat, lng]);
  } catch {
    // straight-line fallback
    return [[fromLat, fromLng], [toLat, toLng]];
  }
}

// Given route coords and progress 0-1, return interpolated position
function interpolateAlongRoute(coords: [number, number][], progress: number): [number, number] {
  if (!coords.length) return [coords[0]?.[0] ?? 0, coords[0]?.[1] ?? 0];
  if (progress <= 0) return coords[0];
  if (progress >= 1) return coords[coords.length - 1];
  const targetIdx = progress * (coords.length - 1);
  const i = Math.floor(targetIdx);
  const t = targetIdx - i;
  const a = coords[Math.min(i,     coords.length - 1)];
  const b = coords[Math.min(i + 1, coords.length - 1)];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export default function OrderTrackingMap({ deliveryLat, deliveryLng, status, riderProgress }: Props) {
  const { theme } = useTheme();
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapObj      = useRef<import('leaflet').Map | null>(null);
  const riderMarker = useRef<import('leaflet').Marker | null>(null);
  const routeLine   = useRef<import('leaflet').Polyline | null>(null);
  const routeCoords = useRef<[number, number][]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;
    let cancelled = false;

    (async () => {
      const leaflet = await import('leaflet');
      /* @ts-expect-error */
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

      const midLat = (RESTAURANT_LOCATION.lat + deliveryLat) / 2;
      const midLng = (RESTAURANT_LOCATION.lng + deliveryLng) / 2;
      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false })
        .setView([midLat, midLng], 13);

      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      /* Fetch road route from OSRM */
      const roadCoords = await fetchRoadRoute(
        RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng,
        deliveryLat, deliveryLng
      );
      if (cancelled) return;
      routeCoords.current = roadCoords;

      /* Restaurant marker */
      const restaurantIcon = L.divIcon({
        html: `<div style="background:#FF5A1F;width:38px;height:38px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px">🏠</div>`,
        iconSize: [38, 38], iconAnchor: [19, 19], className: '',
      });
      L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup('<b>Foody Kitchen</b><br/>Your order is being prepared here');

      /* Delivery location marker */
      const destIcon = L.divIcon({
        html: `<div style="background:#10B981;width:38px;height:38px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:18px">📍</div>`,
        iconSize: [38, 38], iconAnchor: [19, 38], className: '',
      });
      L.marker([deliveryLat, deliveryLng], { icon: destIcon })
        .addTo(map)
        .bindPopup('<b>Delivery Location</b><br/>Your order will be delivered here');

      /* Road route polyline */
      routeLine.current = L.polyline(roadCoords, {
        color: '#FF5A1F', weight: 4, opacity: 0.8,
      }).addTo(map);

      /* Faint dashed underlay for the full path */
      L.polyline(roadCoords, {
        color: '#FF5A1F', weight: 6, opacity: 0.15,
      }).addTo(map);

      map.fitBounds(routeLine.current.getBounds(), { padding: [50, 50] });

      /* Rider marker at current position along road */
      const riderPos = interpolateAlongRoute(roadCoords, riderProgress);
      const riderIcon = L.divIcon({
        html: `<div style="background:#3B82F6;width:42px;height:42px;border-radius:50%;border:3px solid white;box-shadow:0 3px 12px rgba(59,130,246,0.5);display:flex;align-items:center;justify-content:center;font-size:20px;animation:pulse 1.5s infinite">🛵</div>
               <style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}</style>`,
        iconSize: [42, 42], iconAnchor: [21, 21], className: '',
      });
      riderMarker.current = L.marker(riderPos, { icon: riderIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<b>Your Delivery Partner</b><br/>On the way to you!');

      mapObj.current = map;
      setReady(true);
    })();

    return () => { cancelled = true; };
  }, []);

  /* Move rider along road when riderProgress changes */
  useEffect(() => {
    if (!riderMarker.current || !L || !routeCoords.current.length) return;
    const pos = interpolateAlongRoute(routeCoords.current, riderProgress);
    riderMarker.current.setLatLng(pos);
    if (riderProgress > 0.05 && riderProgress < 0.98) {
      mapObj.current?.panTo(pos, { animate: true, duration: 0.8 });
    }
  }, [riderProgress]);

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

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-secondary z-10">
          <Loader2 size={22} className="animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[500] flex flex-col gap-1 pointer-events-none">
        {[['🏠', 'Foody Kitchen'], ['🛵', 'Delivery Partner'], ['📍', 'Your Location']].map(([icon, label]) => (
          <span key={label} className="bg-white/90 dark:bg-black/70 text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
            {icon} <span className="font-medium">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
