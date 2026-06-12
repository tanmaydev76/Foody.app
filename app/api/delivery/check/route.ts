import { NextRequest, NextResponse } from 'next/server';
import { RESTAURANT_LOCATION, MAX_DELIVERY_RADIUS_KM, AVG_DELIVERY_SPEED_KMPH } from '@/lib/constants';
import { haversineKm } from '@/lib/haversine';

export interface DeliveryCheckResult {
  deliverable: boolean;
  distanceKm: number;
  durationMinutes: number;
  message: string;
  userLat?: number;
  userLng?: number;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=in`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FoodyApp/1.0 (food-delivery-app)' },
    });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

async function getOrsRoute(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number
): Promise<{ distanceKm: number; durationMinutes: number } | null> {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        coordinates: [[fromLng, fromLat], [toLng, toLat]],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const summary = data?.routes?.[0]?.summary;
    if (!summary) return null;
    return {
      distanceKm: Math.round((summary.distance / 1000) * 10) / 10,
      durationMinutes: Math.ceil(summary.duration / 60),
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, lat, lng } = body;

    let userLat: number | null = lat ?? null;
    let userLng: number | null = lng ?? null;

    if ((!userLat || !userLng) && address) {
      const coords = await geocodeAddress(address);
      if (!coords) {
        return NextResponse.json({ error: 'Could not find this address. Please try a different one.' }, { status: 400 });
      }
      userLat = coords.lat;
      userLng = coords.lng;
    }

    if (!userLat || !userLng) {
      return NextResponse.json({ error: 'Address or coordinates required.' }, { status: 400 });
    }

    const { lat: rLat, lng: rLng } = RESTAURANT_LOCATION;

    /* Try ORS first, fall back to haversine */
    let distanceKm: number;
    let durationMinutes: number;

    const ors = await getOrsRoute(rLat, rLng, userLat, userLng);
    if (ors) {
      distanceKm = ors.distanceKm;
      durationMinutes = ors.durationMinutes;
    } else {
      distanceKm = Math.round(haversineKm(rLat, rLng, userLat, userLng) * 10) / 10;
      durationMinutes = Math.ceil((distanceKm / AVG_DELIVERY_SPEED_KMPH) * 60) + 10;
    }

    const deliverable = distanceKm <= MAX_DELIVERY_RADIUS_KM;
    const message = deliverable
      ? `Delivery available — estimated ${durationMinutes} min (${distanceKm} km away)`
      : `Sorry, we don't deliver to this location yet. You are ${distanceKm} km away (max ${MAX_DELIVERY_RADIUS_KM} km).`;

    return NextResponse.json({
      deliverable,
      distanceKm,
      durationMinutes,
      message,
      userLat,
      userLng,
    } satisfies DeliveryCheckResult);
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
