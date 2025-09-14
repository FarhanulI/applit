/* eslint-disable @typescript-eslint/no-explicit-any */
// ✅ app/api/cancel-subscription/route.ts

import { stripe } from "@/lib/stripe/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Missing subscriptionId" },
        { status: 400 }
      );
    }

    const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

    return NextResponse.json(
      {
        success: true,
        subscription: deletedSubscription,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
