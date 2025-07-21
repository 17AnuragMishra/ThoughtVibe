import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the cookie by setting it to empty and expired
  const cookieStore = await cookies();
  cookieStore.set('thoughtvibe_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return NextResponse.json({ success: true, message: 'Logged out' });
} 