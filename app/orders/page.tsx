'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Package, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface OrderItem { id: number; name: string; price: number; quantity: number; image: string; }
interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon: string;
  deliveryFee: number;
  taxes: number;
  total: number;
  address: string;
  phone: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  placed:           'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  confirmed:        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  preparing:        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  out_for_delivery: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  delivered:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-card border border-base rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-base-secondary/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Package size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm">{order.orderId}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-muted/20 text-muted'}`}>
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">{date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-sm">₹{order.total.toFixed(2)}</p>
          <span className="text-muted">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-base px-5 py-4 space-y-4">
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-muted">{item.name} <span className="font-medium text-fg">×{item.quantity}</span></span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-base pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount {order.coupon && `(${order.coupon})`}</span><span>-₹{order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-muted"><span>Delivery fee</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-muted"><span>GST (5%)</span><span>₹{order.taxes.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-base pt-2 mt-1"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
          </div>

          <div className="text-xs text-muted space-y-1 border-t border-base pt-3">
            <p><span className="font-medium text-fg">Address:</span> {order.address}</p>
            <p><span className="font-medium text-fg">Phone:</span> {order.phone}</p>
            <p><span className="font-medium text-fg">Payment:</span> {order.paymentMethod}</p>
          </div>

          {order.status !== 'delivered' && (
            <Link
              href={`/orders/track?orderId=${order.orderId}&lat=19.0176&lng=72.8562&eta=30`}
              className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              <MapPin size={15} /> 🛵 Track Order Live
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    setError('');
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrders(data.orders);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ClipboardList size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Order History</h1>
          <p className="text-muted text-sm">All your past orders in one place</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={fetchOrders} className="shrink-0 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-20">
          <ClipboardList size={48} className="text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted text-sm mb-6">Your order history will appear here after your first order.</p>
          <Link href="/menu" className="bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
            Browse Menu
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  );
}
