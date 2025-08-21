/* eslint-disable @typescript-eslint/ban-ts-comment */
// components/pricing/CheckoutButton.tsx
"use client";

import PaymentModal from "@/app/dashboard/pricing/_component/paymentMethodModal";
import { useAuthContext } from "@/contexts/auth";
import { PaymentMethodEnum, PlanValdityEnum } from "@/enums";
import { updateUserPlan } from "@/lib/file/apis";
import { UserStatsType, UserPurchaseListType } from "@/lib/file/types";
import { getRemainingDays } from "@/lib/file/utils";
import { getStripe } from "@/lib/stripe/stripe";
import { CheckoutRequest, PricingPlan } from "@/types/types";
import { useMemo, useState } from "react";

interface CheckoutButtonProps {
  planId: string;
  buttonText: string;
  buttonStyle: "outline" | "gradient" | "single";
  disabled?: boolean;
  className?: string;
  plan?: PricingPlan;
}

export default function CheckoutButton({
  planId,
  buttonText,
  buttonStyle,
  disabled = false,
  className = "",
  plan,
}: CheckoutButtonProps) {
  // @ts-ignore
  const { user, userStats, setUserStats } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [isOpenPaymentModal, setisOpenPaymentModal] = useState<boolean>(false);

  const getButtonStyles = (style: "outline" | "gradient" | "single") => {
    const baseStyles =
      "w-full py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const styles = {
      outline: `${baseStyles}  border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white`,
      gradient: `${baseStyles} bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl`,
      single: `bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`,
    };

    return `${styles[style]} ${className}`;
  };

  const handleCheckout = async () => {
    if (loading || disabled) return;

    setLoading(true);

    try {
      // Create checkout session
      const checkoutData: CheckoutRequest = {
        planId,
        successUrl: `${window.location.origin}/payment/success?plan=${planId}`,
        cancelUrl: `${window.location.origin}/payment/cancel?plan=${planId}`,
        user: user,
      };

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const { sessionId, url, error } = await response.json();

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Something went wrong. Please try again.");
        return;
      }

      sessionStorage.setItem("checkoutSessionId", sessionId);
      sessionStorage.setItem("currentPlan", JSON.stringify(plan)!);

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
          console.error("Stripe redirect error:", stripeError);
          alert("Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutPaypal = async () => {
    setLoading(true);

    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: plan!.priceAmount / 100 }),
    });

    console.log({ response });
  };

  const handlePayment = (paymentMethod: string) => {
    if (PaymentMethodEnum.stripe === paymentMethod) {
      handleCheckout();
      return;
    }

    if (PaymentMethodEnum.paypal === paymentMethod) {
      handleCheckoutPaypal();
      return;
    }
  };

  const handleCancelPlan = async () => {
    setLoading(true);
    const response = await updateUserPlan(user?.uid as string, {
      currentPlan: null,
      ...(userStats?.stats.remainingCoverLetter
        ? {
            stats: {
              ...userStats?.stats,
              remainingCoverLetter: null,
            },
          }
        : {}),
    });

    setLoading(false);

    setUserStats(response as UserStatsType);
  };

  if (userStats && userStats?.currentPlan?.type === plan?.id) {
    return (
      <button
        onClick={handleCancelPlan}
        disabled={loading || disabled}
        className={`cursor-pointer ${getButtonStyles(buttonStyle)}`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          "Cancel"
        )}
      </button>
    );
  };

  const handleDisable = () =>  loading || disabled || !!userStats?.currentPlan?.type;

  return (
    <>
      <button
        onClick={() => setisOpenPaymentModal((prev) => !prev)}
        disabled={handleDisable()}
        className={`cursor-pointer ${getButtonStyles(buttonStyle)}`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
            Processing...
          </div>
        ) : (
          buttonText
        )}
      </button>

      <PaymentModal
        isOpen={isOpenPaymentModal}
        onClose={() => setisOpenPaymentModal(false)}
        plan={plan!}
        handlePayment={handlePayment}
      />
    </>
  );
}
