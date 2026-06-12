import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/checkout', '/orders', '/profile'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname.startsWith(p))) return NextResponse.next();

  /* Edge Runtime cannot run jsonwebtoken (Node.js-only).
     We check cookie presence here; actual JWT verification happens
     in each API route and in AuthContext on the client. */
  const token = req.cookies.get('foody_token')?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/checkout', '/orders/:path*', '/profile/:path*'] };
