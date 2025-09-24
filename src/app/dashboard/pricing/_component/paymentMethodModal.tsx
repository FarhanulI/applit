/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { X } from "lucide-react";
import { PricingPlan } from "@/types/types";
import { PayPalButtons } from "@paypal/react-paypal-js";
import StripeCheckoutButton from "./stripebutton";
import PayPalProvider from "@/app/providers/paypal-provider";
import {
  createPaypalOrder,
  createPaypalSubscription,
  onApprovePaypal,
} from "../apis";
import { useAuthContext } from "@/contexts/auth";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  handleStripeCheckout: () => void;
  setisOpenPaymentModal: Dispatch<SetStateAction<boolean>>;
}

type PaymentMethod = "stripe" | "paypal" | null;

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
  handleStripeCheckout,
  setisOpenPaymentModal,
}: PaymentModalProps) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

  if (!isOpen) return null;

  return (
    <div className={`fixed text-black inset-0 bg-black/40 backdrop-blur z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-semibold text-lg">{plan.name}</h3>
          <p className="text-3xl font-bold text-blue-600">{plan.price}</p>
          <ul className="mt-3 space-y-1">
            {plan.features.slice(0, 3).map((feature, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-center"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Method Selection */}
        {!selectedMethod && (
          <div className="p-6">
            <h4 className="font-semibold mb-4">Choose Payment Method</h4>
            <div className="space-y-3">
              <StripeCheckoutButton
                price={plan.priceAmount / 100}
                onClick={() => {
                  handleStripeCheckout();
                }}
              />

              {/* <button
                onClick={async () => {
                  const payload = {
                    name: plan.name,
                    description: plan.description,
                    price: plan.priceAmount / 100,
                  };
                  const response = await fetch("/api/paypal/create-plan", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  console.log({ response });
                }}
              >
                aaaaaa
              </button> */}

              <div className="border rounded-md p-2">
                {plan.type === "one-time" && (
                  <PayPalProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                      currency: "EUR",
                      intent: "capture",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) =>
                        createPaypalOrder(data, actions, plan, user)
                      }
                      onApprove={(data, actions) =>
                        onApprovePaypal(
                          // @ts-ignore
                          data,
                          plan,
                          router,
                          setisOpenPaymentModal
                        )
                      }
                      onError={(err) => {
                        console.error("PayPal error:", err);
                      }}
                    />
                  </PayPalProvider>
                )}
                {plan.type === "subscription" && (
                  <PayPalProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                      currency: "EUR",
                      intent: "subscription",
                      vault: true,
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createSubscription={(data, actions) =>
                        createPaypalSubscription(data, actions, plan, user!)
                      }
                      onApprove={(data, actions) =>
                        onApprovePaypal(
                          // @ts-ignore
                          data,
                          plan,
                          router,
                          setisOpenPaymentModal
                        )
                      }
                      onError={(err) => {
                        console.error("PayPal error:", err);
                      }}
                    />
                  </PayPalProvider>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fallback Payment Info (optional) */}
        {selectedMethod && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-blue-600 hover:text-blue-700 text-sm mr-3"
              >
                ← Back to payment methods
              </button>
              <span className="text-sm text-gray-500">
                Paying with{" "}
                {selectedMethod === "stripe" ? "Credit Card" : "PayPal"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
