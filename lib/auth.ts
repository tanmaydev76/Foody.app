import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
}

export function signToken(payload: JwtPayload) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set. Add it to your Vercel environment variables.');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get('foody_token')?.value;
  if (cookie) return cookie;
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function getUserFromRequest(req: NextRequest): JwtPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
