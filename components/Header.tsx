'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Menu, X, MapPin } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { name: 'Home',        href: '/' },
  { name: 'Restaurants', href: '/restaurants' },
  { name: 'Menu',        href: '/menu' },
  { name: 'Offers',      href: '/offers' },
  { name: 'About',       href: '/about' },
];

export default function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  /* close mobile menu on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* close mobile menu on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-md border-b border-base" ref={mobileMenuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm text-muted bg-base-secondary px-3 py-1.5 rounded-full border border-base">
            <MapPin size={16} className="text-primary" />
            <span>Deliver to: <span className="text-fg font-medium">Mumbai, 400001</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-0.5 ${
                  isActive(link.href)
                    ? 'text-primary border-b-2 border-primary'
                    : 'hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/cart"
              className="relative w-11 h-11 rounded-full flex items-center justify-center border border-base bg-base-secondary hover:scale-105 active:scale-95 transition-transform"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden w-11 h-11 rounded-full flex items-center justify-center border border-base bg-base-secondary"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 font-medium text-sm border-t border-base pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`transition-colors ${isActive(link.href) ? 'text-primary font-semibold' : 'hover:text-primary'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
