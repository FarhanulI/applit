/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthContext } from "@/contexts/auth";
import { PricingPlan } from "@/types/types";
import SpinLoader from "@/ui/loaders/spinLoader";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface GooglePayButtonProps {
  amount?: string;
  currency?: string;
  clientId?: string;
  merchantId?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: any) => void;
  environment?: "TEST" | "PRODUCTION";
  setSelectedMethod: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMethod: string | null;
  plan: PricingPlan;
}

declare global {
  interface Window {
    paypal?: any;
    google?: any;
  }
}

export default function GooglePayButton({
  amount = "100",
  currency = "EUR",
  clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  merchantId = process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID,
  onSuccess,
  onError,
  environment = "TEST",
  setSelectedMethod,
  selectedMethod,
  plan,
}: GooglePayButtonProps) {
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paymentsClientRef = useRef<any>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const loadPayPalSDK = async (): Promise<any> => {
      if (window.paypal) return window.paypal;

      try {
        // const res = await fetch("/api/paypal/client-token");
        // const { clientToken } = await res.json();

        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=googlepay${
            merchantId ? `&merchant-id=${merchantId}` : ""
          }`;
          // script.setAttribute("data-client-token", clientToken);
          script.async = true;

          script.onload = () => {
            if (window.paypal) {
              resolve(window.paypal);
            } else {
              reject(new Error("PayPal SDK failed to load"));
            }
          };

          script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
          document.head.appendChild(script);
        });
      } catch (error) {
        throw new Error("Failed to fetch client token");
      }
    };

    const loadGooglePaySDK = async (): Promise<any> => {
      if (window.google?.payments?.api) return window.google;

      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://pay.google.com/gp/p/js/pay.js";
        script.async = true;
        script.onload = () => {
          if (window.google?.payments?.api) {
            resolve(window.google);
          } else {
            reject(new Error("Google Pay SDK failed to load"));
          }
        };
        script.onerror = () =>
          reject(new Error("Failed to load Google Pay SDK"));
        document.head.appendChild(script);
      });
    };

    const initializeGooglePay = async () => {
      try {
        setIsLoading(true);

        // ✅ Load SDKs in parallel
        await Promise.all([loadPayPalSDK(), loadGooglePaySDK()]);

        const paymentsClient = getGooglePaymentsClient();
        paymentsClientRef.current = paymentsClient;

        // ✅ Fetch PayPal's Google Pay config
        const googlePayConfig = await window.paypal.Googlepay().config();
        console.log("✅ Google Pay Config:", googlePayConfig);

        // ✅ Check if Google Pay is ready
        const isReadyToPayRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
        };

        const isReadyResponse = await paymentsClient.isReadyToPay(
          isReadyToPayRequest
        );

        if (isReadyResponse.result) {
          setIsGooglePayReady(true);
          addGooglePayButton(paymentsClient);
        } else {
          console.warn("❌ Not eligible for Google Pay:", isReadyResponse);
          setIsGooglePayReady(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error initializing Google Pay:", error);
        setIsLoading(false);

        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedMethod == "google") {
      initializeGooglePay();
    }
  }, [clientId, currency, merchantId, onError, selectedMethod]);

  const getGooglePaymentsClient = () => {
    return new window.google.payments.api.PaymentsClient({
      environment: environment,
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized,
      },
    });
  };

  const addGooglePayButton = (paymentsClient: any) => {
    const button = paymentsClient.createButton({
      onClick: onGooglePaymentButtonClicked,
      buttonType: "pay",
      buttonColor: "default",
      buttonRadius: 4,
      width: "25rem",
    });

    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = "";
      buttonContainerRef.current.appendChild(button);
    }
  };

  const getGooglePaymentDataRequest = async () => {
    const googlePayConfig = await window?.paypal?.Googlepay().config();

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
      transactionInfo: {
        currencyCode: currency,
        totalPriceStatus: "FINAL",
        totalPrice: amount,
      },
      merchantInfo: googlePayConfig.merchantInfo,
      callbackIntents: ["PAYMENT_AUTHORIZATION"],
    };

    // Uncomment for Japan integrations only
    // paymentDataRequest.allowedPaymentMethods[0].parameters.allowedAuthMethods = ['PAN_ONLY'];

    return paymentDataRequest;
  };

  const onGooglePaymentButtonClicked = async () => {
    try {
      const paymentDataRequest = await getGooglePaymentDataRequest();
      const paymentsClient = paymentsClientRef.current;
      await paymentsClient.loadPaymentData(paymentDataRequest);
    } catch (error) {
      console.error("Payment cancelled or error:", error);
      onError?.(error);
    }
  };

  const onPaymentAuthorized = async (paymentData: any) => {
    return new Promise(async (resolve) => {
      try {
        // Create subscription
        if (plan?.type === "subscription") {
          try {
            const createSubscriptionResponse = await fetch(
              "/api/paypal/create-subscription",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan, userId: user?.uid }),
              }
            );

            if (!createSubscriptionResponse.ok) {
              const errorData = await createSubscriptionResponse.json();
              throw new Error(
                errorData.error || "Failed to create subscription"
              );
            }

            const { approvalUrl } = await createSubscriptionResponse.json();

            if (approvalUrl) {
              setIsLoading(true);
              window.location.href = approvalUrl;
            } else {
              throw new Error("No approval URL received from PayPal");
            }
          } catch (error) {
            console.error("Subscription creation error:", error);
            onError?.(error);
            resolve({
              transactionState: "ERROR",
              error: {
                intent: "PAYMENT_AUTHORIZATION",
                message: error || "Subscription initiation failed",
              },
            });
          }
          return; // Make sure you don't proceed to the order logic
        }
        // Create order on server
        const createOrderResponse = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: currency,
          }),
        });

        if (!createOrderResponse.ok) {
          throw new Error("Failed to create order");
        }

        const { id: orderId } = await createOrderResponse.json();

        // Confirm order with PayPal
        const confirmOrderResponse = await window.paypal
          .Googlepay()
          .confirmOrder({
            orderId: orderId,
            paymentMethodData: paymentData.paymentMethodData,
          });

        // Capture payment
        if (
          confirmOrderResponse.status === "APPROVED" ||
          confirmOrderResponse.status === "PAYER_ACTION_REQUIRED"
        ) {
          const captureResponse = await fetch(`/api/paypal/capture-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: orderId }),
          });

          if (!captureResponse.ok) {
            throw new Error("Failed to capture payment");
          }

          const captureData = await captureResponse.json();

          if (captureData.status === "COMPLETED") {
            onSuccess?.(orderId);
            resolve({ transactionState: "SUCCESS" });
          } else {
            throw new Error("Payment capture failed");
          }
        } else {
          throw new Error("Order confirmation failed");
        }
      } catch (error: any) {
        console.error("Payment processing error:", error);
        onError?.(error);
        resolve({
          transactionState: "ERROR",
          error: {
            intent: "PAYMENT_AUTHORIZATION",
            message: error.message || "TRANSACTION FAILED",
          },
        });
      }
    });
  };

  return (
    <div
      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
        selectedMethod === "google"
          ? "border-blue-500 bg-blue-50/50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div
        onClick={() => setSelectedMethod("google")}
        className={"cursor-pointer"}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                selectedMethod === "google" ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  fill="#FFC107"
                />
                <path
                  d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  fill="#FF3D00"
                />
                <path
                  d="M24 44c5.166 0 9.857-1.975 13.383-5.189l-6.184-5.237C29.69 35.477 26.994 36.5 24 36.5c-5.2 0-9.616-3.33-11.269-7.957l-6.574 5.065C10.388 39.671 16.66 44 24 44z"
                  fill="#4CAF50"
                />
                <path
                  d="M43.611 20.083H42V20H24v8h11.303c-0.792 2.236-2.242 4.151-4.124 5.574l.003-.002 6.184 5.237C39.123 35.943 44 30.714 44 24c0-1.341-.138-2.65-.389-3.917z"
                  fill="#1976D2"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Google Pay
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Quick checkout with Google
              </p>
              {/* <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                {isGooglePayAvailable
                  ? "Pay with your Google account"
                  : "Not available on this device"}
              </p> */}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
            {selectedMethod === "google" && (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            )}
            <Image
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Google Pay"
              className="h-8 sm:h-10 object-contain"
              width={80}
              height={40}
            />
            <span className="text-gray-700 font-medium text-base sm:text-lg">
              Pay
            </span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 sm:mt-6 flex justify-center">
          <SpinLoader />
        </div>
      )}

      {selectedMethod === "google" && (
        <div className="mt-4 sm:mt-6 mx-auto">
          <div
            ref={buttonContainerRef}
            className="w-full flex justify-center cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
