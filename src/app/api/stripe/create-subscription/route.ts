/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/stripe/create-subscription/route.ts
import { pricingPlans } from '@/config/stripe-config';
import { stripe } from '@/lib/stripe/stripe';
import { SubscriptionRequest } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionRequest = await request.json();
    const { planId, customerId } = body;

    // Find the plan
    const plan = pricingPlans.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    if (plan.type !== 'subscription') {
      return NextResponse.json(
        { error: 'This plan is not a subscription plan' },
        { status: 400 }
      );
    }

    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 400 }
      );
    }

    let customer;
    
    // Create or retrieve customer
    if (customerId) {
      try {
        customer = await stripe.customers.retrieve(customerId);
      } catch (error) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
    } else {
      // You might want to create a customer here or require customer info
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: plan.stripePriceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        planId: plan.id,
        planName: plan.name,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      subscription,
    });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}