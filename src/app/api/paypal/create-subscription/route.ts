/* eslint-disable @typescript-eslint/no-explicit-any */
import { pricingPlans } from "@/config/stripe-config";
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"; // Use `https://api-m.paypal.com` in production

/**
 * Get PayPal OAuth access token
 */
async function getAccessToken() {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("🔒 PayPal token error:", data);
    throw new Error(
      data.error_description || "Failed to get PayPal access token"
    );
  }

  return data.access_token;
}

/**
 * Handle POST /api/paypal/create-subscription
 */
export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: plan?.id,
        custom_id: userId ?? undefined, // Optional: your internal user ID
        application_context: {
          brand_name: plan?.name,
          locale: "en-US",
          user_action: "SUBSCRIBE_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: `${window.location.origin}/payment/success?planId=${plan.id}`,
          cancel_url: `${window.location.origin}/payment/cancel?planId=${plan.id}`,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ PayPal subscription error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create subscription" },
        { status: 500 }
      );
    }

    const approvalUrl = data.links?.find(
      (link: any) => link.rel === "approve"
    )?.href;

    return NextResponse.json({
      subscriptionId: data.id,
      approvalUrl,
    });
  } catch (error: any) {
    console.error("⚠️ Error in create-subscription:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
