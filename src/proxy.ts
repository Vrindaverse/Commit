import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/config';
import { verifySessionToken } from '@/lib/auth/token';

const PUBLIC_ROUTES = new Set([
  '/login',
  '/signup',
  '/verify',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
]);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(token);
  const isAuthenticated = Boolean(payload?.uid);

  if (PUBLIC_ROUTES.has(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const url = new URL('/login', req.nextUrl);
    if (pathname !== '/') {
      url.searchParams.set('next', pathname);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
