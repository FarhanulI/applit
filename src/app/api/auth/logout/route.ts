// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear session cookie
  cookieStore.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return NextResponse.json({ success: true });
}
