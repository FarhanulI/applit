/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/stripe/payment-details/route.ts
import { stripe } from "@/lib/stripe/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" }, 
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'payment_intent.payment_method']
    });

    let cardDescription = null;
    let paymentMethod = null;

    if (session.payment_intent && 
        typeof session.payment_intent === 'object' && 
        session.payment_intent.payment_method &&
        typeof session.payment_intent.payment_method === 'object') {
      
      const pm = session.payment_intent.payment_method;
      
      if (pm.card) {
        cardDescription = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
          funding: pm.card.funding,
          description: `${pm.card.brand.toUpperCase()} •••• ${pm.card.last4}`,
          fullDescription: `${pm.card.brand.toUpperCase()} •••• ${pm.card.last4} (${pm.card.exp_month}/${pm.card.exp_year})`
        };
      }
    }

    // For subscriptions, get payment method from subscription
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ['default_payment_method'] }
      );
      
      if (subscription.default_payment_method && 
          typeof subscription.default_payment_method === 'object' &&
          subscription.default_payment_method.card) {
        
        const card = subscription.default_payment_method.card;
        cardDescription = {
          brand: card.brand,
          last4: card.last4,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          funding: card.funding,
          description: `${card.brand.toUpperCase()} •••• ${card.last4}`,
          fullDescription: `${card.brand.toUpperCase()} •••• ${card.last4} (${card.exp_month}/${card.exp_year})`
        };
      }
    }

    return NextResponse.json({
      sessionId,
      paymentStatus: session.payment_status,
      cardDescription,
      metadata: session.metadata,
    });

  } catch (error: unknown) {
    console.error("Error retrieving payment details:", error);
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}