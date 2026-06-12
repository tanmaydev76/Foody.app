import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-base-secondary border-t border-base mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand — full width on mobile */}
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="text-muted text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed max-w-xs">
            Foody brings your favourite restaurants and dishes right to your doorstep.
            Fresh, fast and full of flavour.
          </p>
          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-card border border-base flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-sm mb-3 sm:mb-4">Company</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Partner with us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Ride with us</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-sm mb-3 sm:mb-4">Explore</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted">
            <li><Link href="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
            <li><Link href="/menu" className="hover:text-primary transition-colors">Full Menu</Link></li>
            <li><Link href="/offers" className="hover:text-primary transition-colors">Offers & Deals</Link></li>
            <li><Link href="/cart" className="hover:text-primary transition-colors">Your Cart</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 sm:col-span-1">
          <h4 className="font-semibold text-sm mb-3 sm:mb-4">Contact</h4>
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted">
            <li className="flex items-start gap-2"><MapPin size={14} className="text-primary shrink-0 mt-0.5" /> Bandra Kurla Complex, Mumbai</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-primary shrink-0" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-primary shrink-0" /> support@foody.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-muted">
          <p>© {new Date().getFullYear()} Foody. All rights reserved.</p>
          <p>Made with ❤️ for food lovers across India.</p>
        </div>
      </div>
    </footer>
  );
}
