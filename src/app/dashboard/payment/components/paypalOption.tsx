/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/contexts/auth";
import { PricingPlan } from "@/types/types";
import SpinLoader from "@/ui/loaders/spinLoader";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import React, { FC, useEffect, useRef } from "react";

interface ICardOptions {
  setSelectedMethod: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMethod: string | null;
  paypalButtonRef: React.RefObject<HTMLDivElement>;
  setIsSDKLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isSDKLoaded: boolean;
  amount: number;
  onSuccess: () => void;
  plan?: PricingPlan;
}

const PaypalOption: FC<ICardOptions> = ({
  setSelectedMethod,
  selectedMethod,
  paypalButtonRef,
  setIsSDKLoaded,
  isSDKLoaded,
  amount,
  onSuccess,
  plan,
}) => {
  const sdkScriptRef = useRef<HTMLScriptElement | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const removeExistingPayPalScript = () => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src^="https://www.paypal.com/sdk/js"]'
      );
      if (existing) {
        existing.remove();
      }

      if (paypalButtonRef.current) {
        paypalButtonRef.current.innerHTML = "";
      }

      if (window.paypal) {
        // optional: delete cached reference
        delete window.paypal;
      }

      setIsSDKLoaded(false);
    };
    removeExistingPayPalScript();

    const loadPayPalSDK = async () => {
      removeExistingPayPalScript();

      try {
        // const res = await fetch("/api/paypal/client-token");
        // const { clientToken } = await res.json();

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
        }&currency=EUR&components=buttons&disable-funding=card,credit&enable-funding=paypal${
          process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID
            ? `&merchant-id=${process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID}`
            : ""
        }`;
        // script.setAttribute("data-client-token", clientToken);
        script.async = true;

        script.onload = () => {
          setIsSDKLoaded(true);
          if (typeof window.paypal?.Buttons === "function") {
            renderPayPalButton();
          } else {
            console.error("PayPal Buttons component not available");
          }
        };

        script.onerror = () => {
          console.error("Failed to load PayPal SDK");
        };

        sdkScriptRef.current = script;
        document.head.appendChild(script);
      } catch (error) {
        console.error("Failed to fetch client token:", error);
      }
    };

    const renderPayPalButton = () => {
      if (
        !window.paypal ||
        typeof window.paypal.Buttons !== "function" ||
        !paypalButtonRef.current
      )
        return;

      paypalButtonRef.current.innerHTML = ""; // Clear old buttons

      window.paypal
        ?.Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            layout: "vertical",
            height: 45,
          },
          ...(plan?.id === "unlimited"
            ? {
                // Subscription flow
                createSubscription: (data: any, actions: any) => {
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
                },
                onApprove: (data: any, actions: any) => {
                  console.log("Subscription approved:", data);
                  onSuccess();
                },
              }
            : {
                // One-time payment flow
                createOrder: (data: any, actions: any) => {
                  return actions.order.create({
                    payer: {
                      email_address: user?.email,
                    },
                    purchase_units: [
                      {
                        amount: {
                          value: amount,
                          currency_code: "EUR",
                        },
                        description: plan!.description,
                      },
                    ],
                  });
                },
                onApprove: (data: any, actions: any) => {
                  return actions.order.capture().then((details: any) => {
                    console.log("Card Payment approved:", details);
                    onSuccess();
                  });
                },
              }),
          onError: (err: any) => {
            console.error("PayPal Button Error:", err);
          },
        })
        .render(paypalButtonRef.current);
    };

    if (selectedMethod === "paypal") {
      loadPayPalSDK();
    }

    return () => {
      removeExistingPayPalScript();
    };
  }, [selectedMethod]);

  return (
    <div
      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
        selectedMethod === "paypal"
          ? "border-blue-500 bg-blue-50/50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div
        onClick={() => setSelectedMethod("paypal")}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                selectedMethod === "paypal" ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal Icon"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                width={48}
                height={48}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                PayPal
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Fast and secure checkout
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
            {selectedMethod === "paypal" && (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            )}
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-8 sm:h-10 object-contain"
              width={80}
              height={40}
            />
          </div>
        </div>
      </div>

      {selectedMethod === "paypal" && !isSDKLoaded && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <SpinLoader />
        </div>
      )}

      {selectedMethod === "paypal" && (
        <div className="mt-4 sm:mt-6">
          <div ref={paypalButtonRef} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default PaypalOption;
