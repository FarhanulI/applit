/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment successful:', session);
        
        // Handle successful payment
        await handleSuccessfulPayment(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent);
        
        // Handle one-time payment completion
        await handlePaymentIntentSucceeded(paymentIntent);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Invoice payment succeeded:', invoice);
        
        // Handle subscription payment
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log('Subscription created:', subscription);
        
        // Handle new subscription
        await handleSubscriptionCreated(subscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log('Subscription updated:', updatedSubscription);
        
        // Handle subscription updates
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        console.log('Subscription canceled:', canceledSubscription);
        
        // Handle subscription cancellation
        await handleSubscriptionCanceled(canceledSubscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: any) {
  // Implement your business logic here
  // Example: Update user's plan in database, send confirmation email, etc.
  
  const planId = session.metadata?.planId;
  const customerId = session.customer;
  const customerEmail = session.customer_details?.email;
  
  console.log(`User ${customerEmail} successfully purchased plan ${planId}`);
  
  // TODO: Update your database
  // await updateUserPlan(customerId, planId);
  // await sendConfirmationEmail(customerEmail, planId);
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  // Handle one-time payment completion
  const planId = paymentIntent.metadata?.planId;
  const customerId = paymentIntent.customer;
  
  console.log(`One-time payment completed for plan ${planId}`);
  
  // TODO: Grant access to the purchased plan
  // await grantPlanAccess(customerId, planId);
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Handle recurring subscription payment
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  console.log(`Subscription payment succeeded for customer ${customerId}`);
  
  // TODO: Update subscription status
  // await updateSubscriptionStatus(subscriptionId, 'active');
}

async function handleSubscriptionCreated(subscription: any) {
  // Handle new subscription creation
  const customerId = subscription.customer;
  const planId = subscription.metadata?.planId;
  
  console.log(`New subscription created for customer ${customerId}`);
  
  // TODO: Set up user's subscription in your database
  // await createUserSubscription(customerId, subscription.id, planId);
}

async function handleSubscriptionUpdated(subscription: any) {
  // Handle subscription updates (plan changes, etc.)
  const customerId = subscription.customer;
  const status = subscription.status;
  
  console.log(`Subscription updated for customer ${customerId}, status: ${status}`);
  
  // TODO: Update subscription in your database
  // await updateSubscription(subscription.id, { status });
}

async function handleSubscriptionCanceled(subscription: any) {
  // Handle subscription cancellation
  const customerId = subscription.customer;
  
  console.log(`Subscription canceled for customer ${customerId}`);
  
  // TODO: Update user's access
  // await revokeSubscriptionAccess(customerId);
}