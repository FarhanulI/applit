/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCheckout.ts
'use client';

import { getStripe } from '@/lib/stripe/stripe';
import { CheckoutRequest } from '@/types/types';
import { useState } from 'react';

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = async (
    planId: string,
    options?: {
      successUrl?: string;
      cancelUrl?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const checkoutData: CheckoutRequest = {
        planId,
      };

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const { sessionId, url, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js to redirect
        const stripe = await getStripe();
        const { error: stripeError } = await stripe!.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    redirectToCheckout,
    loading,
    error,
    clearError: () => setError(null)
  };
};