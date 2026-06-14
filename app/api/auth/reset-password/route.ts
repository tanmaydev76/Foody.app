import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { isPasswordStrong } from '@/lib/passwordRules';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email?.trim() || !otp?.trim() || !newPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!isPasswordStrong(newPassword)) {
      return NextResponse.json({
        error: 'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.',
      }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return NextResponse.json({ error: 'Invalid or expired reset code.' }, { status: 400 });
    }
    if (user.resetOtpExpiry < new Date()) {
      return NextResponse.json({ error: 'Reset code has expired. Please request a new one.' }, { status: 400 });
    }

    const valid = await bcrypt.compare(otp, user.resetOtp);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect reset code.' }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
