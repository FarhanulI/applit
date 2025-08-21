// app/api/stripe/get-subscription-id/route.ts
import { stripe } from '@/lib/stripe/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log({session})

    if (!session.subscription) {
      return NextResponse.json(
        { error: 'No subscription found in this session' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscriptionId: session.subscription,
    });

  } catch (error: unknown) {
    console.error('Error retrieving subscription ID:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
