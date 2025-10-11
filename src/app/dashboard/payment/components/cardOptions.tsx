/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/contexts/auth";
import { PricingPlan } from "@/types/types";
import SpinLoader from "@/ui/loaders/spinLoader";
import { CheckCircle2, CreditCard } from "lucide-react";
import Image from "next/image";
import React, { FC, useEffect, useRef } from "react";

interface ICardOptions {
  setSelectedMethod: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMethod: string | null;
  setIsSDKLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isSDKLoaded: boolean; // Added to props
  paypalButtonRef: React.RefObject<HTMLDivElement>;
  clientId?: string;
  merchantId?: string;
  amount: number;
  onSuccess: () => void;
  plan?: PricingPlan;
}

const CardOptions: FC<ICardOptions> = ({
  setSelectedMethod,
  selectedMethod,
  setIsSDKLoaded,
  isSDKLoaded,
  paypalButtonRef,
  clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  merchantId = process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID,
  amount,
  onSuccess,
  plan,
}) => {
  const sdkScriptRef = useRef<HTMLScriptElement | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const removeExistingPayPalScript = () => {
      // Remove existing PayPal SDK script tag
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src^="https://www.paypal.com/sdk/js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Clear PayPal button container
      if (paypalButtonRef.current) {
        paypalButtonRef.current.innerHTML = "";
      }

      // Clean global paypal object (optional but recommended)
      if ((window as any).paypal) {
        try {
          delete (window as any).paypal;
        } catch {
          (window as any).paypal = undefined;
        }
      }

      setIsSDKLoaded(false);
      sdkScriptRef.current = null;
    };

    const renderPayPalCardButton = () => {
      if (
        !(window as any).paypal ||
        typeof (window as any).paypal.Buttons !== "function" ||
        !paypalButtonRef.current
      ) {
        console.warn("PayPal Buttons not available yet");
        return;
      }

      paypalButtonRef.current.innerHTML = ""; // clear previous render

      (window as any).paypal
        .Buttons({
          fundingSource: (window as any).paypal.FUNDING.CARD,
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
            console.error("PayPal Card Button Error:", err);
          },
        })
        .render(paypalButtonRef.current);
    };

    const loadPayPalSDK = async () => {
      removeExistingPayPalScript();

      try {
        // const res = await fetch("/api/paypal/client-token");
        // const { clientToken } = await res.json();

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&components=buttons&enable-funding=card${
          merchantId ? `&merchant-id=${merchantId}` : ""
        }`;
        // script.setAttribute("data-client-token", clientToken);
        script.async = true;

        script.onload = () => {
          setIsSDKLoaded(true);
          renderPayPalCardButton();
        };

        script.onerror = () => {
          console.error("Failed to load PayPal SDK");
          setIsSDKLoaded(false);
        };

        sdkScriptRef.current = script;
        document.head.appendChild(script);
      } catch (error) {
        console.error("Failed to fetch client token:", error);
        setIsSDKLoaded(false);
      }
    };

    if (selectedMethod === "card") {
      loadPayPalSDK();
    } else {
      removeExistingPayPalScript();
    }

    return () => {
      removeExistingPayPalScript();
    };
  }, [selectedMethod, clientId, merchantId, paypalButtonRef, setIsSDKLoaded]);

  // Simple spinner component (can style as you like)

  return (
    <div
      onClick={() => setSelectedMethod("card")}
      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        selectedMethod === "card"
          ? "border-blue-500 bg-blue-50/50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
              selectedMethod === "card" ? "bg-blue-500" : "bg-gray-100"
            }`}
          >
            <CreditCard
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                selectedMethod === "card" ? "text-white" : "text-gray-600"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Credit or Debit Card
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Visa, Mastercard, Amex accepted
            </p>
          </div>
        </div>
        {selectedMethod === "card" && (
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-5 sm:h-6 object-contain"
            width={40}
            height={24}
          />
        </div>
        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-5 sm:h-6 object-contain"
            width={40}
            height={24}
          />
        </div>
        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
            alt="American Express"
            className="h-4 sm:h-5 object-contain"
            width={40}
            height={24}
          />
        </div>
      </div>

      {selectedMethod === "card" && !isSDKLoaded && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <SpinLoader />
        </div>
      )}

      {selectedMethod === "card" && (
        <div className="mt-4 sm:mt-6">
          <div ref={paypalButtonRef} />
        </div>
      )}
    </div>
  );
};

export default CardOptions;
