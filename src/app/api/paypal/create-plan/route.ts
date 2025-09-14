/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/paypal/create-plan/route.ts
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"; // Change to live URL for production

// 🔐 Step 1: Get Access Token
async function getAccessToken() {
  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to get token:", data);
    throw new Error(data.error_description || "Failed to get PayPal token");
  }

  return data.access_token;
}

// 🚀 POST handler to create Product + Plan
export async function POST(req: NextRequest) {
  try {
    const { name, description, price, currency = "EUR", interval = "MONTH" } = await req.json();

    if (!name || !description || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    // Step 2: Create Product
    const productRes = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        type: "SERVICE",
        category: "SOFTWARE",
      }),
    });

    const productData = await productRes.json();
    if (!productRes.ok) {
      console.error("Failed to create product:", productData);
      throw new Error(productData.message || "Product creation failed");
    }

    const productId = productData.id;

    console.log({productId});
    
    // Step 3: Create Billing Plan
    const planRes = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        name: `${name} Plan`,
        description: `Subscription plan for ${name}`,
        billing_cycles: [
          {
            frequency: {
              interval_unit: interval, // MONTH, YEAR, etc.
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 1, // 0 = infinite
            pricing_scheme: {
              fixed_price: {
                value: price,
                currency_code: currency,
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      }),
    });

    const planData = await planRes.json();

    if (!planRes.ok) {
      console.error("Failed to create plan:", planData);
      throw new Error(planData.message || "Billing plan creation failed");
    }

    return NextResponse.json({
      message: "Product & Plan created successfully",
      plan_id: planData.id,
      product_id: productId,
    });
  } catch (error: any) {
    console.error("PayPal Create Plan Error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
