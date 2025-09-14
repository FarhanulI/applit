/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/cancel-subscription.ts (or .js)
import { stripe } from "@/lib/stripe/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, res: NextApiResponse) {
  const { subscriptionId } = await request.json();

  console.log({ subscriptionId });
  try {
    const deletedSubscription = await stripe.subscriptions.cancel(
      subscriptionId
    );

    return NextResponse.json(
      { success: true, subscription: deletedSubscription },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: error },
      { status: 400 }
    );
  }
}
