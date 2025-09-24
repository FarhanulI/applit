import { pricingPlans } from "@/config/stripe-config";
import { UserStatsType } from "@/lib/file/types";
import { stripe } from "@/lib/stripe/stripe";

export const getPaymentDetails = async (
  sessionId: string | null | undefined,
  planId?: string
) => {
  if (!sessionId) return null;
  let customers: Awaited<ReturnType<typeof stripe.customers.list>> | null =
    null;
  let invoices: Awaited<ReturnType<typeof stripe.invoices.list>> | null = null;

  try {
    // Step 1: Get the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log({ session });

    if (session && session.customer_email) {
      customers = await stripe.customers.list({
        email: session.customer_email,
        limit: 1,
      });
    }
    console.log({ customers });

    if (customers) {
      invoices = await stripe.invoices.list({
        customer: customers?.data?.[0]?.id,
        limit: 10,
      });

      const invoiceItem = await stripe.invoiceItems.create({
        customer: customers?.data?.[0]?.id,
        pricing: {
          price: pricingPlans.find((item) => item.id === planId)?.stripePriceId, // or pass amount & currency
        },
      });

      console.log({ invoiceItem });
    }

    let cardDescription = null;

    // Step 2: Retrieve the payment intent
    if (session.payment_intent && typeof session.payment_intent === "string") {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      // Step 3: Retrieve the payment method
      if (
        paymentIntent.payment_method &&
        typeof paymentIntent.payment_method === "string"
      ) {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method
        );

        if (paymentMethod.card) {
          cardDescription = {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
            description: `${paymentMethod.card.brand.toUpperCase()} •••• ${
              paymentMethod.card.last4
            }`,
            cardholderName: paymentMethod.billing_details?.name || null,
          };
        }
      }
    }

    return {
      sessionId,
      paymentStatus: session.payment_status,
      cardDescription,
      metadata: session.metadata,
    };
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return null;
  }
};

export const getPaypalInvoice = async (user: UserStatsType) => {
  if (!user) return [];
  const res = await fetch("/api/paypal/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      startDate: "2025-01-01T00:00:00-0700",
      endDate: "2025-12-30T23:59:59-0700",
    }),
  });

  const data = await res.json();
  console.log(data.invoices);
};
