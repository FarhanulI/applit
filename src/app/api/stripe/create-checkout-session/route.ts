// app/api/stripe/create-checkout-session/route.ts
import { pricingPlans } from '@/config/stripe-config';
import { UserProfileType } from '@/lib/auth/type';
import { stripe } from '@/lib/stripe/stripe';
import { CheckoutRequest } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { planId, successUrl, cancelUrl, user } = body;

    // Find the plan
    const plan = pricingPlans.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user!.email!,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: plan.type === 'subscription' ? 'subscription' : 'payment',
      success_url: successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/payment/cancel`,
      metadata: {
        planId: plan.id,
        planName: plan.name,
        planType: plan.type,
      },
      // For subscriptions, add trial period if needed
      ...(plan.type === 'subscription' && {
        subscription_data: {
          metadata: {
            planId: plan.id,
          },
        },
      }),
      // For one-time payments, add product description
      ...(plan.type === 'one-time' && {
        payment_intent_data: {
          metadata: {
            planId: plan.id,
            planName: plan.name,
          },
        },
      }),
    });

    console.log({session})

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: message },
      { status: 500 }
    );
  }
}