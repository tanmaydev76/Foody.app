'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Wallet, Banknote, Smartphone, ArrowRight, Home, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const { cart, subtotal, deliveryFee, discount, taxes, total, clearCart, itemCount, coupon } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm]           = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [payment, setPayment]     = useState<'cod' | 'upi' | 'card'>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId]     = useState('');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [placing, setPlacing]     = useState(false);
  const [placeError, setPlaceError] = useState('');
  const [snapshot, setSnapshot]   = useState({ subtotal: 0, deliveryFee: 0, discount: 0, taxes: 0, total: 0, coupon: '' });

  /* Pre-fill name from auth user */
  useEffect(() => {
    if (user && !form.name) setForm((f) => ({ ...f, name: user.name }));
  }, [user]);

  useEffect(() => {
    if (!orderPlaced && cart.length === 0) router.replace('/menu');
  }, [cart, orderPlaced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
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
    if (placing || cart.length === 0 || !validate()) return;

    const snap = { subtotal, deliveryFee, discount, taxes, total, coupon };
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save order.');
    } catch (err: any) {
      setPlaceError(err.message);
      setPlacing(false);
      return;
    }

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
          Thank you, {form.name}! Your meal is being prepared and arrives in ~30 minutes.
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
          <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors">
            <Home size={18} /> Back to Home
          </Link>
          <Link href="/orders" className="inline-flex items-center gap-2 border border-base font-semibold px-6 py-3 rounded-full hover:bg-base-secondary transition-colors">
            View Order History
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
            </div>
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
              <div className="border-t border-base pt-3 flex justify-between font-bold text-base"><span>To Pay</span><span>₹{total}</span></div>
            </div>
            <button type="submit" disabled={placing}
              className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {placing ? 'Placing…' : `Place Order · ₹${total}`} {!placing && <ArrowRight size={18} />}
            </button>
            <p className="text-xs text-muted text-center mt-3">{itemCount} item{itemCount > 1 ? 's' : ''} · ~25–35 min</p>
          </div>
        </div>
      </form>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-base px-4 py-3 shadow-xl">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted text-xs">
            {itemCount} item{itemCount > 1 ? 's' : ''} · ~25–35 min
            {discount > 0 && <span className="text-green-600 ml-1">· Saved ₹{discount}</span>}
          </span>
          <span className="font-bold">₹{total}</span>
        </div>
        <button
          type="button"
          onClick={(e) => placeOrder(e as React.FormEvent)}
          disabled={placing}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-60"
        >
          {placing ? 'Placing…' : `Place Order · ₹${total}`} {!placing && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
