/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    const encoded = Buffer.from(JSON.stringify(token)).toString('base64');

    // 🍪 Set the cookie using next/headers
    (await cookies()).set({
      name: 'token',
      value: encoded,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 5,
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({ message: 'Session cookie set' }, { status: 200 });
  } catch (err) {
    console.error('Error in login route:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
