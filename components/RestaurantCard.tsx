'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, MapPin } from 'lucide-react';
import { Restaurant } from '@/data/restaurants';

interface Props {
  r: Restaurant;
  /** Override the link destination. Auto-computed if omitted. */
  href?: string;
  /** Distance in km from user's location */
  distKm?: number;
  /** ETA in minutes */
  eta?: number;
}

export default function RestaurantCard({ r, href: hrefProp, distKm, eta }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const href = hrefProp ?? (
    r.menu ? `/restaurants/${r.id}` : `/menu?category=${encodeURIComponent(r.category)}`
  );

  return (
    <Link href={href} className="group block">
      {/* Image */}
      <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-base-secondary">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <Image
          src={r.image}
          alt={r.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        {r.promoted && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-700 text-[10px] font-semibold px-2 py-1 rounded-md">
            Promoted
          </span>
        )}
        {r.offer && (
          <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
            {r.offer}
          </span>
        )}
        {/* Brand logo circle overlay (brand restaurants) */}
        {r.brandColor && (
          <div
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-extrabold text-xs shadow-md"
            style={{ background: r.brandColor }}
          >
            {r.brandInitials ?? r.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
            {r.name}
          </h3>
          <span className={`flex items-center gap-1 text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${r.rating >= 4.5 ? 'bg-green-600' : r.rating >= 4.0 ? 'bg-green-500' : 'bg-orange-500'}`}>
            <Star size={10} fill="currentColor" /> {r.rating}
          </span>
        </div>
        <p className="text-muted text-sm mt-0.5 truncate">{r.cuisines.join(', ')}</p>
        <div className="flex items-center gap-3 mt-1.5 text-sm text-muted flex-wrap">
          <span>₹{r.costForTwo ?? r.priceForOne * 2} for two</span>
          <span className="w-1 h-1 rounded-full bg-muted/50 shrink-0" />
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {eta != null ? `${eta} min` : `${r.deliveryTime} min`}
          </span>
          {distKm != null && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted/50 shrink-0" />
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {distKm.toFixed(1)} km
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
