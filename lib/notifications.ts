export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: '/favicon.ico' });
}

const STATUS_TIMELINE: { delay: number; title: string; body: string }[] = [
  { delay: 10000,  title: '✅ Order Confirmed',       body: 'Your order has been confirmed by the restaurant.' },
  { delay: 60000,  title: '👨‍🍳 Preparing Your Food',  body: 'The kitchen is preparing your order now.' },
  { delay: 180000, title: '🛵 Out for Delivery',      body: 'Your delivery partner is on the way!' },
  { delay: 300000, title: '🎉 Order Delivered!',      body: 'Enjoy your meal! Rate your experience in the app.' },
];

export function scheduleOrderNotifications(orderId: string) {
  STATUS_TIMELINE.forEach(({ delay, title, body }) => {
    setTimeout(() => showNotification(title, `${body} (Order: ${orderId})`), delay);
  });
}
