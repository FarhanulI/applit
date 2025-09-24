/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaymentMethodEnum, SuccessQueryEnum } from "@/enums";
import { UserStatsType, UserStatsTypes } from "@/lib/file/types";
import { PricingPlan } from "@/types/types";
import { create } from "domain";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

// utils/stripeClient.ts (or anywhere appropriate)
export const cancelStripeSubscription = async (sessionId: string) => {
  try {
    const res = await fetch("/api/stripe/get-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    const data = await res.json();

    console.log(data?.subscription);

    if (!res.ok) {
      throw new Error(data.error || "Failed to get subscription");
    }

    const cancelRes = await fetch("/api/stripe/cancel-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: data?.subscription?.subscription,
      }),
    });

    console.log({ data });

    if (!cancelRes.ok) {
      throw new Error(data.error || "Failed to get subscription");
    }

    const cancelResData = await cancelRes.json();
    console.log({ cancelResData });

    return true; // contains canceled subscription object
  } catch (err) {
    console.error("Cancel subscription error:", err);
    throw err;
  }
};

// utils/paypal/cancelPayPalSubscription.ts

export async function cancelPayPalSubscription(subscriptionId: string) {
  try {
    const response = await fetch("/api/paypal/cancel-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscriptionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error?.message || data?.error || "Failed to cancel subscription"
      );
    }

    return {
      success: true,
      message: data.message || "Subscription cancelled",
    };
  } catch (error: any) {
    console.error("PayPal cancellation error:", error.message || error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

export const createPaypalOrder = async (
  data: any,
  actions: any,
  plan: PricingPlan,
  user: UserStatsType | undefined
) => {
  if(!user) throw new Error("User is required for PayPal order creation");
  return actions.order.create({
    payer: {
      email_address: user.email,
     
    },
    purchase_units: [
      {
        amount: {
          value: `${plan!.priceAmount / 100}`,
          currency_code: "EUR",
        },
        description: plan!.description,
      },
    ],
  });
};

export const createPaypalSubscription = async (
  data: any,
  actions: any,
  plan: PricingPlan,
  user: UserStatsType
) => {
  // Make sure your plan object has a paypalPlanId property
  if (!plan.paypalProductId) {
    console.error("PayPal Plan ID is missing from plan:", plan);
    throw new Error("PayPal Plan ID is not configured for this plan");
  }

  return actions.subscription.create({
    plan_id: plan.paypalProductId, // This should be the PayPal billing plan ID
    custom_id: user?.uid, // Optional: your internal user ID
    application_context: {
      brand_name: plan.name,
      locale: "en-US",
      user_action: "SUBSCRIBE_NOW",
      shipping_preference: "NO_SHIPPING",
    },
  });
};

const createInvoice = async (capture: any) => {
  try {
    const res = await fetch("/api/paypal/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capture), // send the capture response
    });

    const data = await res.json();
    console.log("Invoice created:", data);
    return data;
  } catch (err) {
    console.error("Error creating invoice:", err);
  }
};


export const onApprovePaypal = async (
  data: {
    orderID?: string;
    subscriptionID?: string;
  },
  plan: PricingPlan,
  router: AppRouterInstance,
  setisOpenPaymentModal: Dispatch<SetStateAction<boolean>>
) => {
  console.log({ dataaa: data });

  if (data?.subscriptionID) {
    setisOpenPaymentModal(false);
    router.push(
      `/payment/success?planId=${plan.id}&subscriptionID=${data?.subscriptionID}&${SuccessQueryEnum.paymentMethod}=${PaymentMethodEnum.paypal}`
    );

    return;
  }

  const response = await fetch("/api/paypal/capture-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderID: data.orderID }),
  });

  const captureData = await response.json();

  console.log({ captureDataaaaa: captureData });

  if (!response.ok) {
    console.error("PayPal capture failed:", captureData);
    return;
  }

  if (captureData?.status === "COMPLETED") {
    setisOpenPaymentModal(false);

    await createInvoice(captureData);
    router.push(
      `/payment/success?planId=${plan.id}&${SuccessQueryEnum.paymentMethod}=${PaymentMethodEnum.paypal}`
    );
  }

  console.log("PayPal payment successful:", captureData);
  // handlePayment("paypal");
};
