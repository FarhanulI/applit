/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"; // Use `https://api-m.paypal.com` in production
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY!;

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

function buildInvoiceBodyFromCapture(capture: any) {
  const purchaseUnit = capture.purchase_units?.[0];
  const capturePayment = purchaseUnit?.payments?.captures?.[0];
  const payer = capture.payer;

  return {
    detail: {
      invoice_number: `INV-${capture.id}`, // unique reference
      reference: purchaseUnit?.reference_id || "default",
      invoice_date: new Date().toISOString().split("T")[0], // today’s date
      currency_code: capturePayment?.amount?.currency_code || "USD",
      note: "Thank you for your business!",
      term: "No refunds after 30 days.",
    },
    invoicer: {
      name: {
        given_name: "Your Business",
        surname: "Name",
      },
      email_address: "merchant@example.com", // replace with your merchant PayPal email
      address: {
        address_line_1: "Business Address Line",
        admin_area_2: "City",
        admin_area_1: "State",
        postal_code: "12345",
        country_code: "US",
      },
    },
    primary_recipients: [
      {
        billing_info: {
          name: {
            given_name: payer?.name?.given_name,
            surname: payer?.name?.surname,
          },
          email_address: payer?.email_address,
          address: payer?.address,
        },
        shipping_info: purchaseUnit?.shipping,
      },
    ],
    items: [
      {
        name: purchaseUnit?.description || "Purchase",
        quantity: "1",
        unit_amount: {
          currency_code: capturePayment?.amount?.currency_code,
          value: capturePayment?.amount?.value,
        },
      },
    ],
  };
}

// Utility to format PayPal transaction into simplified object
export async function POST(req: NextRequest) {
  try {
    const capture = await req.json(); // your PayPal capture response

    const body = buildInvoiceBodyFromCapture(capture);
    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api-m.sandbox.paypal.com/v2/invoicing/invoices",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body), // pass the invoice payload from client
      }
    );

    const data = await res.json();

    console.log({ data });

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("PayPal Invoice Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create invoice" },
      { status: 500 }
    );
  }
}
