'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, KeyRound, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { getPasswordChecks, passwordStrengthScore, isPasswordStrong } from '@/lib/passwordRules';

type Step = 'email' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');

  const [email, setEmail] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checks = getPasswordChecks(newPassword);
  const score = passwordStrengthScore(newPassword);
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'][score] ?? 'bg-green-600';
  const strengthLabel = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][score] ?? 'Strong';

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
      if (data.otp) setDemoOtp(data.otp);
      setStep('reset');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isPasswordStrong(newPassword)) {
      setError('Password does not meet all requirements.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Reset failed.'); return; }
      setStep('done');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card border border-base rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound size={26} className="text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold">
              {step === 'done' ? 'Password Reset!' : 'Reset Password'}
            </h1>
            <p className="text-muted text-sm mt-1">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'reset' && 'Enter the code and your new password'}
              {step === 'done' && 'You can now log in with your new password'}
            </p>
          </div>

          {step === 'done' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <p className="text-sm text-muted">Your password has been updated successfully.</p>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Go to Login
              </button>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-base bg-base-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {demoOtp && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">Demo mode — your reset code:</p>
                  <p className="text-2xl font-bold tracking-[0.3em] text-amber-800 dark:text-amber-300">{demoOtp}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">In production this would be emailed to you</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Reset Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-base bg-base-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm tracking-widest text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-base bg-base-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg transition-colors"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {newPassword.length > 0 && (
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
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); setDemoOtp(''); }}
                className="flex items-center justify-center gap-1.5 text-sm text-muted hover:text-fg transition-colors"
              >
                <ArrowLeft size={14} /> Use a different email
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
