import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

  await connectDB();
  const user = await User.findById(payload.userId).select('-password');
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt } });
}
