import { NextRequest, NextResponse } from 'next/server';
import {
  revokeAdminSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_CLIENT_FLAG_COOKIE,
} from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token) {
    revokeAdminSessionToken(token);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  response.cookies.set({
    name: ADMIN_CLIENT_FLAG_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
