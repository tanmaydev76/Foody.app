import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

  try {
    const body = await req.json();
    const { items, subtotal, discount, coupon, deliveryFee, taxes, total, address, phone, paymentMethod, orderId } = body;

    if (!items?.length || !orderId || !address || !phone || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required order fields.' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.create({
      userId: user.userId,
      items, subtotal, discount: discount ?? 0, coupon: coupon ?? '',
      deliveryFee, taxes, total, address, phone, paymentMethod, orderId,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('[orders POST]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

  await connectDB();
  const orders = await Order.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}
