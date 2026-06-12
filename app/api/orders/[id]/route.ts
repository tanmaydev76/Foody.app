import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

  await connectDB();
  const order = await Order.findOne({ _id: params.id, userId: user.userId });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  return NextResponse.json({ order });
}
