'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Crosshair, Search, Loader2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { RESTAURANT_LOCATION } from '@/lib/constants';
import type { DeliveryCheckResult } from '@/app/api/delivery/check/route';

/* Leaflet is browser-only — dynamic import */
let L: typeof import('leaflet') | null = null;

interface Props {
  onResult?: (result: DeliveryCheckResult) => void;
  initialAddress?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function DeliveryMap({ onResult, initialAddress = '' }: Props) {
  const { theme } = useTheme();
  const mapRef     = useRef<HTMLDivElement>(null);
  const mapObj     = useRef<import('leaflet').Map | null>(null);
  const userMarker = useRef<import('leaflet').Marker | null>(null);
  const routeLine  = useRef<import('leaflet').Polyline | null>(null);

  const [addressInput, setAddressInput]   = useState(initialAddress);
  const [suggestions, setSuggestions]     = useState<NominatimResult[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [checking, setChecking]           = useState(false);
  const [result, setResult]               = useState<DeliveryCheckResult | null>(null);
  const [error, setError]                 = useState('');
  const [mapReady, setMapReady]           = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Init Leaflet map ── */
  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;
    let cancelled = false;

    (async () => {
      const leaflet = await import('leaflet');
      /* @ts-expect-error — no type declarations for CSS module */
      await import('leaflet/dist/leaflet.css');
      L = leaflet.default ?? leaflet;

      /* Fix default marker icon paths broken by webpack */
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        [RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], 13
      );

      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const attribution = theme === 'dark'
        ? '&copy; <a href="https://carto.com/">CARTO</a>'
        : '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>';

      L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

      /* Restaurant marker */
      const restaurantIcon = L.divIcon({
        html: `<div style="background:#FF5A1F;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: '',
      });
      L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(`<b>${RESTAURANT_LOCATION.name}</b><br/>${RESTAURANT_LOCATION.address}`)
        .openPopup();

      /* Click to drop user pin */
      map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        placeUserPin(e.latlng.lat, e.latlng.lng, map);
        runDeliveryCheck({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapObj.current = map;
      setMapReady(true);
    })();

    return () => { cancelled = true; };
  }, []);

  /* ── Swap tile layer when theme changes ── */
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

  /* ── Place user pin helper ── */
  const placeUserPin = useCallback((lat: number, lng: number, map?: import('leaflet').Map) => {
    if (!L) return;
    const m = map ?? mapObj.current;
    if (!m) return;
    if (userMarker.current) userMarker.current.remove();
    const userIcon = L.divIcon({
      html: `<div style="background:#3B82F6;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      className: '',
    });
    userMarker.current = L.marker([lat, lng], { icon: userIcon })
      .addTo(m)
      .bindPopup('Your delivery location');
    m.setView([lat, lng], 14);
  }, []);

  /* ── Draw route line ── */
  const drawRouteLine = useCallback((userLat: number, userLng: number) => {
    if (!mapObj.current || !L) return;
    if (routeLine.current) routeLine.current.remove();
    routeLine.current = L.polyline(
      [[RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], [userLat, userLng]],
      { color: '#FF5A1F', weight: 3, dashArray: '8 6', opacity: 0.8 }
    ).addTo(mapObj.current);
    mapObj.current.fitBounds(routeLine.current.getBounds(), { padding: [40, 40] });
  }, []);

  /* ── Call delivery check API ── */
  const runDeliveryCheck = useCallback(async (params: { address?: string; lat?: number; lng?: number }) => {
    setChecking(true);
    setError('');
    try {
      const res = await fetch('/api/delivery/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to check delivery.'); return; }
      setResult(data);
      onResult?.(data);
      if (data.userLat && data.userLng) {
        placeUserPin(data.userLat, data.userLng);
        drawRouteLine(data.userLat, data.userLng);
      }
    } catch {
      setError('Failed to check delivery. Please try again.');
    } finally {
      setChecking(false);
    }
  }, [onResult, placeUserPin, drawRouteLine]);

  /* ── Address search with debounce ── */
  const handleAddressChange = (val: string) => {
    setAddressInput(val);
    setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) return;
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=in`,
          { headers: { 'User-Agent': 'FoodyApp/1.0' } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
      } catch {
        /* ignore suggestion errors */
      } finally {
        setLoadingSuggest(false);
      }
    }, 500);
  };

  const selectSuggestion = (s: NominatimResult) => {
    setAddressInput(s.display_name);
    setSuggestions([]);
    runDeliveryCheck({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
  };

  /* ── GPS geolocation ── */
  const useMyLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported by your browser.'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        runDeliveryCheck({ lat, lng });
        setAddressInput('');
      },
      () => setError('Could not get your location. Please allow location access.'),
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => handleAddressChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && addressInput.trim()) {
                  setSuggestions([]);
                  runDeliveryCheck({ address: addressInput.trim() });
                }
              }}
              placeholder="Enter your delivery address or pincode…"
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-base bg-base-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {addressInput && (
              <button onClick={() => { setAddressInput(''); setSuggestions([]); setResult(null); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-fg">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => addressInput.trim() && runDeliveryCheck({ address: addressInput.trim() })}
            disabled={checking || !addressInput.trim()}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {checking ? <Loader2 size={16} className="animate-spin" /> : 'Check'}
          </button>
          <button
            onClick={useMyLocation}
            title="Use my current location"
            className="w-10 h-10 rounded-xl border border-base bg-base-secondary flex items-center justify-center hover:border-primary hover:text-primary transition-colors shrink-0"
          >
            <Crosshair size={16} />
          </button>
        </div>

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-[1000] mt-1 bg-card border border-base rounded-xl shadow-xl overflow-hidden">
            {loadingSuggest && <p className="text-xs text-muted px-4 py-2">Searching…</p>}
            {suggestions.map((s) => (
              <button
                key={s.place_id}
                onClick={() => selectSuggestion(s)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-secondary transition-colors border-b border-base last:border-0 flex items-start gap-2"
              >
                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="truncate">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border"
        style={{ borderColor: 'var(--border)' }}
      />

      {!mapReady && (
        <div className="flex items-center justify-center gap-2 text-muted text-sm py-4">
          <Loader2 size={16} className="animate-spin" /> Loading map…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 text-sm ${
          result.deliverable
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          {result.deliverable
            ? <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
            : <XCircle     size={18} className="text-red-500 shrink-0 mt-0.5" />
          }
          <div>
            <p className={`font-semibold ${result.deliverable ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.deliverable ? '✅ Delivery Available' : '❌ Out of Delivery Zone'}
            </p>
            <p className={`text-xs mt-0.5 ${result.deliverable ? 'text-green-600 dark:text-green-500' : 'text-red-500'}`}>
              {result.message}
            </p>
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted text-center">
        Map data © <a href="https://openstreetmap.org" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> contributors
      </p>
    </div>
  );
}
