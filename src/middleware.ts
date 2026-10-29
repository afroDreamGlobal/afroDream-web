import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. If accessing the login page
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);
    // If already authenticated, redirect to /admin dashboard
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 2. If accessing any other /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSessionToken(token);

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
