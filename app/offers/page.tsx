import Link from 'next/link';
import { Tag, Percent, Gift, Truck } from 'lucide-react';

const offers = [
  { code: 'WELCOME50', title: 'Flat 50% OFF',            desc: 'On your first order above ₹199', icon: Gift,    color: 'bg-pink-500' },
  { code: 'FREESHIP',  title: 'Free Delivery',           desc: 'On orders above ₹499',           icon: Truck,   color: 'bg-blue-500' },
  { code: 'BIRYANI20', title: '20% OFF',                 desc: 'On all biryani items',           icon: Percent, color: 'bg-amber-500' },
  { code: 'FOODY100',  title: 'Flat ₹100 OFF',           desc: 'On orders above ₹599',           icon: Tag,     color: 'bg-green-600' },
  { code: 'SWEET10',   title: '10% OFF Desserts',        desc: 'Treat yourself this week',       icon: Gift,    color: 'bg-purple-500' },
  { code: 'WEEKEND25', title: '25% OFF Weekend Special', desc: 'Valid Fridays to Sundays',       icon: Percent, color: 'bg-red-500' },
];

export default function OffersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">Offers & Deals</h1>
      <p className="text-muted text-sm mb-6 sm:mb-8">Grab these exciting offers before they expire!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {offers.map((o) => (
          <div key={o.code} className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${o.color} flex items-center justify-center text-white mb-3 sm:mb-4`}>
              <o.icon size={20} />
            </div>
            <h3 className="font-bold text-base sm:text-lg">{o.title}</h3>
            <p className="text-xs sm:text-sm text-muted mt-1 flex-1">{o.desc}</p>
            <div className="flex items-center justify-between mt-4 sm:mt-5 border-t border-dashed border-base pt-3 sm:pt-4">
              <span className="font-mono font-bold text-primary text-sm">{o.code}</span>
              <Link
                href={`/menu`}
                className="text-xs font-semibold bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-primary-dark transition-colors"
              >
                Order Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
