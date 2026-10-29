import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_CLIENT_FLAG_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Authentication service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password);

    // Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: inputPassword,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { success: false, message: error?.message || 'Invalid administrator credentials. Access denied.' },
        { status: 401 }
      );
    }

    // Generate cryptographically signed HMAC-SHA256 session token
    const tokenValue = await createAdminSessionToken(data.user.email || normalizedEmail);

    const response = NextResponse.json({
      success: true,
      message: 'Administrator authentication successful',
    });

    // Set cryptographically verified HttpOnly session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: tokenValue,
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Set client-accessible flag cookie (boolean presence indicator only)
    response.cookies.set({
      name: ADMIN_CLIENT_FLAG_COOKIE,
      value: 'true',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication processing failed.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
