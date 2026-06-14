'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, ClipboardList, ShieldCheck, Eye, EyeOff, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPasswordChecks, passwordStrengthScore, isPasswordStrong } from '@/lib/passwordRules';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login?redirect=/profile');
  }, [user, loading, router]);

  const checks = getPasswordChecks(newPw);
  const score = passwordStrengthScore(newPw);
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'][score] ?? 'bg-green-600';
  const strengthLabel = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][score] ?? 'Strong';

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (!isPasswordStrong(newPw)) {
      setPwError('New password does not meet all requirements.');
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error ?? 'Failed to change password.'); return; }
      setPwSuccess('Password changed successfully!');
      setCurrentPw('');
      setNewPw('');
    } catch {
      setPwError('Network error. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

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
          { icon: User,        label: 'Full Name',       value: user.name },
          { icon: Mail,        label: 'Email',           value: user.email },
          { icon: Calendar,    label: 'Member Since',    value: joined },
          { icon: ShieldCheck, label: 'Account Status',  value: 'Active' },
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

      {/* Change password */}
      <div className="bg-card border border-base rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-primary" />
          <h2 className="font-bold text-lg">Change Password</h2>
        </div>

        <form onSubmit={handleChangePw} className="flex flex-col gap-4">
          {pwError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckCircle2 size={15} /> {pwSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-base bg-base-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button type="button" onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg transition-colors">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-base bg-base-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg transition-colors">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newPw.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-base-secondary rounded-full overflow-hidden flex gap-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${i < score ? strengthColor : 'bg-border'}`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${score >= 4 ? 'text-green-600' : score === 3 ? 'text-green-500' : score === 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {strengthLabel}
                  </span>
                </div>
                <ul className="space-y-1">
                  {checks.map((c) => (
                    <li key={c.label} className="flex items-center gap-2 text-xs">
                      {c.pass
                        ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                        : <XCircle size={13} className="text-red-400 shrink-0" />
                      }
                      <span className={c.pass ? 'text-green-600 dark:text-green-400' : 'text-muted'}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={pwLoading}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pwLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
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
