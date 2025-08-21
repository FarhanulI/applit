import { UserProfileType } from "@/lib/auth/type";

// lib/types.ts
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceAmount: number; // in cents
  period: string;
  subtitle: string;
  subtitleStyle?: string;
  buttonText: string;
  buttonStyle: 'outline' | 'gradient' | 'single';
  popular: boolean;
  features: string[];
  type: 'one-time' | 'subscription';
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface CheckoutRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
  user?: UserProfileType
}

export interface SubscriptionRequest {
  planId: string;
  customerId?: string;
}