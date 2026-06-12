'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Menu, X, MapPin, User, ChevronDown, LogOut, ClipboardList } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import dynamic from 'next/dynamic';

const LocationPickerModal = dynamic(() => import('./LocationPickerModal'), { ssr: false });

const navLinks = [
  { name: 'Home',        href: '/' },
  { name: 'Restaurants', href: '/restaurants' },
  { name: 'Menu',        href: '/menu' },
  { name: 'Offers',      href: '/offers' },
  { name: 'About',       href: '/about' },
];

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { location } = useLocation();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  useEffect(() => { setOpen(false); setUserMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-md border-b border-base" ref={mobileMenuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/">
            <Logo />
          </Link>

          <button
            onClick={() => setLocationModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 text-sm text-muted bg-base-secondary px-3 py-1.5 rounded-full border border-base hover:border-primary hover:text-primary transition-colors group max-w-[220px]"
          >
            <MapPin size={15} className="text-primary shrink-0" />
            <span className="truncate">
              Deliver to:{' '}
              <span className={`font-medium ${location ? 'text-primary' : 'text-fg'}`}>
                {location ? location.label : 'Mumbai, 400001'}
              </span>
            </span>
            <ChevronDown size={13} className="shrink-0 ml-0.5 opacity-60 group-hover:opacity-100" />
          </button>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-0.5 ${
                  isActive(link.href) ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'
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

            {/* Auth section */}
            {user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-base bg-base-secondary hover:border-primary transition-colors text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-base rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-base">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-base-secondary transition-colors">
                      <User size={15} className="text-muted" /> My Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-base-secondary transition-colors">
                      <ClipboardList size={15} className="text-muted" /> Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-base-secondary transition-colors text-red-500"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                <Link href="/signup" className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary-dark transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

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
            <div className="border-t border-base pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <User size={15} /> My Profile
                  </Link>
                  <Link href="/orders" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <ClipboardList size={15} /> Order History
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors">
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="hover:text-primary transition-colors">Login</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="text-primary font-semibold hover:underline">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>

    <LocationPickerModal open={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
}
