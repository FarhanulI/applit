// app/providers/paypal-provider.tsx
"use client";

import { PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "EUR",
  intent: "capture",
};

export default function PayPalProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options: ReactPayPalScriptOptions
}) {
  return (
    <PayPalScriptProvider options={options}>{children}</PayPalScriptProvider>
  );
}
