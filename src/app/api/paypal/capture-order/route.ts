// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;
const PAYPAL_BASE_URL =process.env.NODE_ENV === 'production' ? 'https://api.paypal.com' :  process.env.NEXT_PUBLIC_PAYPAL_BASE_URL!;

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

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log({captureData: data});

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to capture order' }, { status: 500 });
  }
}
