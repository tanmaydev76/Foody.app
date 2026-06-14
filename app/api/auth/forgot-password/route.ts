import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    /* Always return success to prevent email enumeration */
    if (!user) {
      return NextResponse.json({ message: 'If that email exists, a code has been sent.' });
    }

    const otp = generateOtp();
    const hashed = await bcrypt.hash(otp, 10);

    user.resetOtp = hashed;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    /* In production, send otp via email/SMS. For demo we return it in the response. */
    return NextResponse.json({
      message: 'Reset code generated.',
      otp, // ← shown in UI; remove in production and email it instead
    });
  } catch (err) {
    console.error('[forgot-password]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
