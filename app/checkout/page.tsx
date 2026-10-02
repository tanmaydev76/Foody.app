'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Wallet, Banknote, Smartphone, ArrowRight, Home, LogIn, Loader2, XCircle, BookMarked, Clock, Star, Gift, Coins } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSavedAddresses } from '@/context/SavedAddressesContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { useReferral } from '@/context/ReferralContext';
import { requestNotificationPermission, scheduleOrderNotifications } from '@/lib/notifications';

export default function CheckoutPage() {
  const { cart, subtotal, deliveryFee, discount, taxes, total, clearCart, itemCount, coupon } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { points, addPoints, redeemPoints, pointsToDiscount, maxRedeemable } = useLoyalty();
  const { generateCode, applyReferral, appliedReferral, referralDiscount, clearReferral } = useReferral();
  const router = useRouter();

  const [form, setForm]           = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [tip, setTip]             = useState(0);
  const [scheduleDelivery, setScheduleDelivery] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [redeemPts, setRedeemPts]       = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralMsg, setReferralMsg]   = useState('');
  const [saveAddr, setSaveAddr]   = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const { addresses, saveAddress } = useSavedAddresses();
  const [payment, setPayment]     = useState<'cod' | 'upi' | 'card'>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId]     = useState('');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [placing, setPlacing]     = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [snapshot, setSnapshot]   = useState({ subtotal: 0, deliveryFee: 0, discount: 0, taxes: 0, total: 0, coupon: '', scheduledFor: '' });
  const [deliveryEta, setDeliveryEta]           = useState<number | null>(null);
  const [deliveryCheckRunning, setDeliveryCheckRunning] = useState(false);
  const [deliveryBlocked, setDeliveryBlocked]   = useState(false);
  const [deliveryMsg, setDeliveryMsg]           = useState('');
  const [deliveryCoords, setDeliveryCoords]     = useState<{ lat: number; lng: number } | null>(null);
  const deliveryDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Pre-fill name from auth user and generate referral code */
  useEffect(() => {
    if (user) {
      if (!form.name) setForm((f) => ({ ...f, name: user.name }));
      generateCode(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!orderPlaced && cart.length === 0) router.replace('/menu');
  }, [cart, orderPlaced]);

  /* ── Auto-run delivery check when address+pincode+city are filled ── */
  const runDeliveryCheck = useCallback(async (address: string, city: string, pincode: string) => {
    if (!address.trim() || !city.trim() || !/^\d{6}$/.test(pincode)) return;
    setDeliveryCheckRunning(true);
    setDeliveryBlocked(false);
    setDeliveryMsg('');
    try {
      const res = await fetch('/api/delivery/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: `${address}, ${city} ${pincode}` }),
      });
      const data = await res.json();
      if (res.ok) {
        setDeliveryEta(data.durationMinutes);
        setDeliveryBlocked(!data.deliverable);
        setDeliveryMsg(data.message);
        if (data.userLat && data.userLng) setDeliveryCoords({ lat: data.userLat, lng: data.userLng });
      }
    } catch { /* non-fatal */ }
    finally { setDeliveryCheckRunning(false); }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    /* debounce delivery check */
    if (['address', 'city', 'pincode'].includes(e.target.name)) {
      if (deliveryDebounce.current) clearTimeout(deliveryDebounce.current);
      deliveryDebounce.current = setTimeout(() => {
        runDeliveryCheck(updated.address, updated.city, updated.pincode);
      }, 800);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())                errs.name    = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone   = 'Valid 10-digit mobile number required';
    if (!form.address.trim())             errs.address = 'Address is required';
    if (!form.city.trim())                errs.city    = 'City is required';
    if (!/^\d{6}$/.test(form.pincode))    errs.pincode = 'Valid 6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placing || cart.length === 0 || deliveryBlocked || !validate()) return;

    const scheduledLabel = scheduleDelivery && scheduleDate && scheduleTime
      ? new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : '';
    const snap = { subtotal, deliveryFee, discount, taxes, total, coupon, scheduledFor: scheduledLabel };
    const newOrderId = 'FOODY' + Math.floor(100000 + Math.random() * 900000);

    setPlacing(true);
    setPlaceError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image ?? '' })),
          subtotal, discount, coupon, deliveryFee, taxes, total,
          address: `${form.address}, ${form.city} – ${form.pincode}`,
          phone: form.phone,
          paymentMethod: payment === 'cod' ? 'Cash on Delivery' : payment.toUpperCase(),
          orderId: newOrderId,
          deliveryInstructions,
          tip,
          scheduledFor: scheduleDelivery && scheduleDate && scheduleTime
            ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save order.');
    } catch (err: any) {
      setPlaceError(err.message);
      setPlacing(false);
      return;
    }

    if (saveAddr && form.address.trim() && form.city.trim() && form.pincode.trim()) {
      saveAddress({ label: addrLabel, address: form.address, city: form.city, pincode: form.pincode });
    }
    // Award loyalty points (1 per ₹10 spent)
    addPoints(total + tip);
    // Deduct redeemed points
    if (redeemPts > 0) redeemPoints(redeemPts);
    // Request notification permission and schedule status updates
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleOrderNotifications(newOrderId);
    });
    setSnapshot(snap);
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
    setPlacing(false);
  };

  /* ── Auth guard ── */
  if (!authLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <LogIn size={28} className="text-primary" />
        </div>
        <h2 className="text-xl font-extrabold mb-2">Login to place your order</h2>
        <p className="text-muted text-sm mb-6">You need to be logged in to complete checkout and track your orders.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login?redirect=/checkout" className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
            Log In
          </Link>
          <Link href="/signup?redirect=/checkout" className="border border-base font-semibold px-6 py-3 rounded-full hover:bg-base-secondary transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">Order Placed! 🎉</h1>
        <p className="text-muted mt-3 text-sm">
          Thank you, {form.name}!{' '}
          {snapshot.scheduledFor
            ? `Your order is scheduled for ${snapshot.scheduledFor}.`
            : `Your meal is being prepared and arrives in ~${deliveryEta ?? 30} minutes.`}
        </p>
        <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8 text-left space-y-3">
          {[['Order ID', orderId], ['Address', `${form.address}, ${form.city} – ${form.pincode}`], ['Payment', payment === 'cod' ? 'Cash on Delivery' : payment.toUpperCase()]].map(([l, v]) => (
            <div key={l} className="flex justify-between text-sm gap-2">
              <span className="text-muted shrink-0">{l}</span>
              <span className="font-medium text-right">{v}</span>
            </div>
          ))}
          <div className="border-t border-base pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted"><span>Item Total</span><span>₹{snapshot.subtotal}</span></div>
            {snapshot.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({snapshot.coupon})</span><span>- ₹{snapshot.discount}</span></div>}
            <div className="flex justify-between text-muted"><span>Delivery</span><span>{snapshot.deliveryFee === 0 ? 'FREE' : `₹${snapshot.deliveryFee}`}</span></div>
            <div className="flex justify-between text-muted"><span>Taxes</span><span>₹{snapshot.taxes}</span></div>
            <div className="flex justify-between font-bold border-t border-base pt-2 mt-1"><span>Total Paid</span><span>₹{snapshot.total}</span></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 sm:mt-8">
          <Link
            href={`/orders/track?orderId=${orderId}&lat=${deliveryCoords?.lat ?? 19.0176}&lng=${deliveryCoords?.lng ?? 72.8562}&eta=${deliveryEta ?? 30}`}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            🛵 Track Order Live
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 border border-base font-semibold px-6 py-3 rounded-full hover:bg-base-secondary transition-colors">
            <Home size={18} /> Back to Home
          </Link>
          <Link href="/orders" className="inline-flex items-center gap-2 border border-base font-semibold px-6 py-3 rounded-full hover:bg-base-secondary transition-colors text-sm">
            View History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-32 sm:pb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8">Checkout</h1>

      {placeError && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {placeError}
        </div>
      )}

      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Delivery Details
            </h2>

            {/* Saved address picker */}
            {addresses.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted mb-2 flex items-center gap-1"><BookMarked size={12} /> Saved Addresses</p>
                <div className="flex gap-2 flex-wrap">
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, address: a.address, city: a.city, pincode: a.pincode }))}
                      className="px-3 py-1.5 rounded-xl border border-base bg-base-secondary hover:border-primary hover:text-primary text-xs font-medium transition-colors"
                    >
                      {a.label} — {a.address.substring(0, 20)}{a.address.length > 20 ? '…' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium block mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-base'}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium block mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10}
                  onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-base'}`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium block mb-1.5">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" maxLength={6}
                  onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.pincode ? 'border-red-500' : 'border-base'}`} />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium block mb-1.5">Full Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="House no., Street, Landmark" rows={3} maxLength={300}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${errors.address ? 'border-red-500' : 'border-base'}`} />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium block mb-1.5">City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? 'border-red-500' : 'border-base'}`} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              {/* Save address toggle */}
              <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                <input
                  id="save-addr"
                  type="checkbox"
                  checked={saveAddr}
                  onChange={(e) => setSaveAddr(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="save-addr" className="text-sm font-medium cursor-pointer">Save this address</label>
                {saveAddr && (
                  <select
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    className="ml-auto px-3 py-1.5 rounded-xl border border-base bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Delivery check result */}
          {deliveryCheckRunning && (
            <div className="flex items-center gap-2 text-sm text-muted bg-card border border-base rounded-xl px-4 py-3">
              <Loader2 size={15} className="animate-spin text-primary" /> Checking delivery availability…
            </div>
          )}
          {!deliveryCheckRunning && deliveryMsg && (
            <div className={`flex items-start gap-2 text-sm rounded-xl px-4 py-3 border ${
              deliveryBlocked
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
            }`}>
              {deliveryBlocked
                ? <XCircle size={16} className="shrink-0 mt-0.5" />
                : <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              }
              <span>{deliveryMsg}</span>
            </div>
          )}

          <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="font-bold text-base sm:text-lg mb-3">🚴 Delivery Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium block mb-1.5">Delivery Instructions <span className="text-muted font-normal">(optional)</span></label>
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Ring the bell twice, leave at door, don't call..."
                  rows={2}
                  maxLength={200}
                  className="w-full px-3 sm:px-4 py-2.5 rounded-xl border border-base bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium block mb-2">Tip for delivery partner</label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTip(amount)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${tip === amount ? 'bg-primary text-white border-primary' : 'border-base hover:border-primary hover:text-primary'}`}
                    >
                      {amount === 0 ? 'No tip' : `₹${amount}`}
                    </button>
                  ))}
                </div>
                {tip > 0 && <p className="text-xs text-green-600 mt-1.5">100% of the tip goes to your delivery partner.</p>}
              </div>

              {/* Scheduled delivery */}
              <div>
                <div className="flex items-center gap-3">
                  <input
                    id="schedule-toggle"
                    type="checkbox"
                    checked={scheduleDelivery}
                    onChange={(e) => setScheduleDelivery(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="schedule-toggle" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" /> Schedule Delivery
                  </label>
                </div>
                {scheduleDelivery && (
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1 text-muted">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-base bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1 text-muted">Time slot</label>
                      <select
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-base bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select time</option>
                        {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    {scheduleDelivery && scheduleDate && scheduleTime && (
                      <p className="sm:col-span-2 text-xs text-primary font-medium">
                        Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loyalty Points */}
          {points > 0 && (
            <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                <Coins size={18} className="text-yellow-500" /> Loyalty Points
              </h2>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold">{points} points available</p>
                  <p className="text-xs text-muted">= ₹{pointsToDiscount(points)} discount</p>
                </div>
                <div className="text-xs text-muted text-right">Max redeemable<br />
                  <span className="font-semibold text-primary">{maxRedeemable(total)} pts = ₹{pointsToDiscount(maxRedeemable(total))}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[0, Math.floor(maxRedeemable(total) * 0.5), maxRedeemable(total)].filter((v, i, a) => a.indexOf(v) === i && v <= points).map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setRedeemPts(pts)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${redeemPts === pts ? 'bg-yellow-500 text-white border-yellow-500' : 'border-base hover:border-yellow-500 hover:text-yellow-600'}`}
                  >
                    {pts === 0 ? 'None' : `${pts} pts (₹${pointsToDiscount(pts)} off)`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Referral Code */}
          <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
              <Gift size={18} className="text-green-500" /> Referral Code
            </h2>
            {appliedReferral ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">Code: {appliedReferral}</p>
                  <p className="text-xs text-green-600 dark:text-green-500">₹{referralDiscount} discount applied!</p>
                </div>
                <button type="button" onClick={() => { clearReferral(); setReferralCode(''); setReferralMsg(''); }} className="text-xs text-muted hover:text-red-500 transition-colors">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => { setReferralCode(e.target.value.toUpperCase()); setReferralMsg(''); }}
                  placeholder="Enter referral code"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-base bg-base text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  maxLength={10}
                />
                <button
                  type="button"
                  onClick={() => {
                    const result = applyReferral(referralCode);
                    setReferralMsg(result.message);
                    if (result.success) setReferralCode('');
                  }}
                  className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {referralMsg && !appliedReferral && (
              <p className={`text-xs mt-2 ${referralMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{referralMsg}</p>
            )}
          </div>

          <div className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
              <Wallet size={18} className="text-primary" /> Payment Method
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {([
                { id: 'upi',  label: 'UPI',  Icon: Smartphone },
                { id: 'card', label: 'Card', Icon: Wallet },
                { id: 'cod',  label: 'COD',  Icon: Banknote },
              ] as const).map(({ id, label, Icon }) => (
                <button key={id} type="button" onClick={() => setPayment(id)}
                  className={`border rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-colors ${payment === id ? 'border-primary bg-primary/10 text-primary' : 'border-base'}`}>
                  <Icon size={20} />
                  <span className="hidden sm:inline">{id === 'cod' ? 'Cash on Delivery' : label}</span>
                  <span className="sm:hidden">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-card border border-base rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-medium shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-base pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted"><span>Item Total</span><span className="text-fg font-medium">₹{subtotal}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({coupon})</span><span>- ₹{discount}</span></div>}
              <div className="flex justify-between text-muted"><span>Delivery</span><span className="text-fg font-medium">{deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryFee}`}</span></div>
              <div className="flex justify-between text-muted"><span>Taxes</span><span className="text-fg font-medium">₹{taxes}</span></div>
              {tip > 0 && <div className="flex justify-between text-muted"><span>Tip</span><span className="text-fg font-medium">₹{tip}</span></div>}
              {redeemPts > 0 && <div className="flex justify-between text-yellow-600"><span>Points Discount</span><span>-₹{pointsToDiscount(redeemPts)}</span></div>}
              {referralDiscount > 0 && <div className="flex justify-between text-green-600"><span>Referral Discount</span><span>-₹{referralDiscount}</span></div>}
              <div className="border-t border-base pt-3 flex justify-between font-bold text-base"><span>To Pay</span><span>₹{Math.max(0, total + tip - pointsToDiscount(redeemPts) - referralDiscount)}</span></div>
            </div>
            <button type="submit" disabled={placing || deliveryBlocked}
              className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {placing ? 'Placing…' : `Place Order · ₹${Math.max(0, total + tip - pointsToDiscount(redeemPts) - referralDiscount)}`} {!placing && <ArrowRight size={18} />}
            </button>
            {deliveryBlocked && <p className="text-xs text-red-500 text-center mt-2">Delivery not available at this address</p>}
            <p className="text-xs text-muted text-center mt-2">
              {itemCount} item{itemCount > 1 ? 's' : ''} · ~{deliveryEta ?? '25–35'} min
            </p>
          </div>
        </div>
      </form>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-base px-4 py-3 shadow-xl">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted text-xs">
            {itemCount} item{itemCount > 1 ? 's' : ''} · ~{deliveryEta ?? '25–35'} min
            {discount > 0 && <span className="text-green-600 ml-1">· Saved ₹{discount}</span>}
          </span>
          <span className="font-bold">₹{Math.max(0, total + tip - pointsToDiscount(redeemPts) - referralDiscount)}</span>
        </div>
        <button
          type="button"
          onClick={(e) => placeOrder(e as React.FormEvent)}
          disabled={placing || deliveryBlocked}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-60"
        >
          {placing ? 'Placing…' : `Place Order · ₹${Math.max(0, total + tip - pointsToDiscount(redeemPts) - referralDiscount)}`} {!placing && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
