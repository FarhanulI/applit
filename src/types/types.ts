/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserStatsType } from "@/lib/file/types";


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
  buttonStyle: "outline" | "gradient" | "single";
  popular: boolean;
  features: string[];
  type: "one-time" | "subscription";
  stripeProductId?: string;
  stripePriceId?: string;
  typeNumber: number;
  paypalProductId?: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface CheckoutRequest {
  planId: string;
  stripeCustomerId?: string;
  user?: UserStatsType;
}

export interface SubscriptionRequest {
  planId: string;
  customerId: string;
}

export type CardDescriptionType = {
  brand: string;         // Card brand (e.g. "visa", "mastercard")
  last4: string;         // Last 4 digits of the card number
  exp_month: number;     // Expiration month (1–12)
  exp_year: number;      // Expiration year (YYYY)
  description: string;   // Readable string e.g. "VISA •••• 4242"
  cardholderName?: string | null; // Name of the cardholder, if available
};

export interface ProcessInvoiceParams {
  captureData: any;
  plan: PricingPlan;
  merchantInfo: {
    email: string;
    businessName: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      countryCode: string;
    };
  };
}

export interface InvoiceRecord {
  creationDate: string; // ISO string
  paymentType: 'paypal' | 'stripe' | 'card';
  price: number;
  downloadLink: string;
  // Optional additional fields
  invoiceId?: string;
  orderId?: string;
  customerEmail?: string;
  status?: string;
}

export interface InvoiceData {
  merchantInfo: {
    email: string;
    businessName: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      countryCode: string;
    };
  };
  billTo: {
    email: string;
    businessName?: string;
    firstName?: string;
    lastName?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      countryCode: string;
    };
  };
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  invoiceNumber?: string;
  dueDate?: string;
  note?: string;
  terms?: string;
}