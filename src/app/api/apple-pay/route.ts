// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;
const PAYPAL_BASE_URL = process.env.NEXT_PUBLIC_PAYPAL_BASE_URL!;

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
  console.log({data})
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { amount, description } = await request.json();

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
            },
            description: description,
          },
        ],
        payment_source: {
          apple_pay: {
            attributes: {
              vault: {
                store_in_vault: 'ON_SUCCESS',
              },
            },
          },
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return NextResponse.json(order, { status: response.status });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// // app/api/orders/[id]/capture/route.ts
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const body = await request.json();

//     const accessToken = await getAccessToken();

//     const capturePayload: any = {
//       payment_source: {
//         apple_pay: {
//           id: body.paymentSource?.apple_pay?.id,
//         },
//       },
//     };

//     const response = await fetch(
//       `${BASE_URL}/v2/checkout/orders/${id}/capture`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(capturePayload),
//       }
//     );

//     const order = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(order, { status: response.status });
//     }

//     return NextResponse.json(order);
//   } catch (error) {
//     console.error('Error capturing order:', error);
//     return NextResponse.json(
//       { error: 'Failed to capture order' },
//       { status: 500 }
//     );
//   }
// }