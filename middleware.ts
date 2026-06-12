import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED = ['/checkout', '/orders', '/profile'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('foody_token')?.value;
  if (!token || !verifyToken(token)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/checkout', '/orders/:path*', '/profile/:path*'] };
