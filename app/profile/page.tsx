'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, ClipboardList, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login?redirect=/profile');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-4">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  const joined = new Date(user.id ? parseInt((user.id as string).substring(0, 8), 16) * 1000 : Date.now())
    .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Avatar card */}
      <div className="bg-card border border-base rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-extrabold text-3xl shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold">{user.name}</h1>
          <p className="text-muted text-sm mt-1">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-card border border-base rounded-2xl p-6 space-y-4 mb-6">
        <h2 className="font-bold text-lg">Account Details</h2>
        {[
          { icon: User,      label: 'Full Name',     value: user.name },
          { icon: Mail,      label: 'Email',         value: user.email },
          { icon: Calendar,  label: 'Member Since',  value: joined },
          { icon: ShieldCheck, label: 'Account Status', value: 'Active' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-muted text-xs">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/orders" className="bg-card border border-base rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors text-center">
          <ClipboardList size={22} className="text-primary" />
          <p className="font-semibold text-sm">Order History</p>
          <p className="text-xs text-muted">View past orders</p>
        </Link>
        <Link href="/menu" className="bg-card border border-base rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors text-center">
          <span className="text-2xl">🍽️</span>
          <p className="font-semibold text-sm">Browse Menu</p>
          <p className="text-xs text-muted">Order something new</p>
        </Link>
      </div>
    </div>
  );
}
