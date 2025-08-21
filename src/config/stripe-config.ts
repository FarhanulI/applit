// lib/stripe-config.ts

import { PricingPlan } from "@/types/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "cv-correction",
    name: "Professional CV Correction",
    description:
      "Get your CV professionally corrected to German standards. Pay once, use forever with unlimited updates and revisions.",
    price: "€29.99",
    priceAmount: 2999, // €29.99 in cents
    period: "one-time payment",
    subtitle: "Pay once, unlimited updates forever",
    subtitleStyle: "text-emerald-600 font-medium",
    buttonText: "Get Your CV Corrected Now",
    buttonStyle: "single",
    popular: false,
    features: [
      "German format standards",
      "Professional translation",
      "Unlimited updates",
      "ATS optimization",
      "Pay once, use forever",
    ],
    type: "one-time",
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_CV_PRODUCT_ID, // Add your actual product ID from Stripe
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_CV_PRICE_ID, // Add your actual price ID from Stripe
  },
  {
    id: "pay-as-you-go",
    name: "Pay As You Go",
    description:
      "Perfect for occasional job applications with professional quality and fast delivery.",
    price: "€3.99",
    priceAmount: 399, // €3.99 in cents
    period: "per cover letter",
    subtitle: "Best for occasional job applications",
    subtitleStyle: "text-blue-600",
    buttonText: "Buy Cover Letter",
    buttonStyle: "outline",
    popular: false,
    features: [
      "1 professional cover letter",
      "Free job search & matching",
      "AI-powered customization",
      "German format standards",
      "24-hour delivery",
    ],
    type: "one-time",
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PAYGO_PRODUCT_ID, // Add your actual product ID from Stripe
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PAYGO_PRICE_ID, // Add your actual price ID from Stripe
  },
  {
    id: "standard-pack",
    name: "Standard Pack",
    description:
      "30 professional cover letters with priority processing and comprehensive support.",
    price: "€19.99",
    priceAmount: 1999, // €19.99 in cents
    period: "for 30 letters",
    subtitle: "~€0.67 per cover letter • Most Popular",
    subtitleStyle: "text-purple-600 font-medium",
    buttonText: "Get Standard Pack",
    buttonStyle: "gradient",
    popular: true,
    features: [
      "30 professional cover letters",
      "Free job search & matching",
      "Priority processing",
      "Application tracking",
      "Email support",
      "Valid for 90 days",
    ],
    type: "one-time",
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRODUCT_ID, // Add your actual product ID from Stripe
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID, // Add your actual price ID from Stripe
  },
  {
    id: "unlimited",
    name: "Unlimited",
    description:
      "Unlimited cover letters with instant generation and premium support for serious job hunters.",
    price: "€49.99",
    priceAmount: 4999, // €49.99 in cents
    period: "per month",
    subtitle: "Best for serious job hunters",
    subtitleStyle: "text-orange-600",
    buttonText: "Start Unlimited Plan",
    buttonStyle: "outline",
    popular: false,
    features: [
      "Unlimited cover letters",
      "Free job search & matching",
      "Instant generation",
      "Advanced customization",
      "Priority support 24/7",
      "Interview preparation tips",
      "Cancel anytime",
    ],
    type: "subscription",
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRODUCT_ID, // Add your actual product ID from Stripe
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID, // Add your actual price ID from Stripe
  },
];

export const heroBannerFeatures = [
  { icon: "Check", text: "German format standards" },
  { icon: "Star", text: "Professional translation" },
  { icon: "Zap", text: "Unlimited updates" },
  { icon: "Shield", text: "ATS optimization" },
];

export const trustIndicators = [
  { icon: "Users", value: "50K+", label: "Happy Users" },
  { icon: "Star", value: "4.9/5", label: "Average Rating" },
  { icon: "Clock", value: "24h", label: "Delivery Time" },
  { icon: "Shield", value: "100%", label: "Satisfaction" },
];
