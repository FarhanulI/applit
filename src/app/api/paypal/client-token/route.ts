/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/paypal/client-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;
const PAYPAL_BASE_URL = process.env.NEXT_PUBLIC_PAYPAL_BASE_URL!; // e.g., https://api-m.sandbox.paypal.com

// Step 1: Get PayPal access token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    console.error('Failed to get access token');
    throw new Error('Unable to fetch access token from PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

// Step 2: Use access token to generate client token
export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/identity/generate-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to generate client token');
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ clientToken: data.client_token });
  } catch (error: any) {
    console.error('Error generating client token:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
