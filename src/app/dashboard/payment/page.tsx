/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useMemo, FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CreditCard,
  Shield,
  CheckCircle2,
  Lock,
  MoveRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentMethodEnum, SuccessQueryEnum } from "@/enums";
import { pricingPlans } from "@/config/stripe-config";
import CardOptions from "./components/cardOptions";
import PaypalOption from "./components/paypalOption";
import GooglePayButton from "./components/googlePayButton";
import SecurityNotice from "./components/securityNotice";

// PayPal SDK types
declare global {
  interface Window {
    paypal?: any;
    google?: any;
    ApplePaySession?: any;
  }
}

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const googlePayButtonRef = useRef<HTMLDivElement>(null);
  const applePayButtonRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const plan = useMemo(
    () => pricingPlans.find((item) => item.id === planId),
    [planId]
  );

  const amount = useMemo(() => {
    const amt = pricingPlans.find((item) => item.id === planId)?.priceAmount;
    if (amt) {
      return amt / 100;
    }

    return 0;
  }, [planId]);

  // Initialize Apple Pay
  useEffect(() => {
    if (
      !isSDKLoaded ||
      selectedMethod !== "apple" ||
      !applePayButtonRef.current ||
      !isApplePayAvailable
    )
      return;

    if (applePayButtonRef.current.innerHTML) return;

    const initApplePay = () => {
      const button = document.createElement("apple-pay-button");
      button.setAttribute("buttonstyle", "black");
      button.setAttribute("type", "buy");
      button.setAttribute("locale", "en");

      button.addEventListener("click", async () => {
        try {
          const applepay = window.paypal.Applepay();
          const config = await applepay.config();

          const paymentRequest = {
            countryCode: config.countryCode,
            merchantCapabilities: config.merchantCapabilities,
            supportedNetworks: config.supportedNetworks,
            currencyCode: "EUR",
            total: {
              label: "Payment",
              amount: amount,
              type: "final",
            },
          };

          const session = new window.ApplePaySession(4, paymentRequest);

          session.onvalidatemerchant = async (event: any) => {
            try {
              const merchantSession = await applepay.validateMerchant({
                validationUrl: event.validationURL,
              });
              session.completeMerchantValidation(merchantSession);
            } catch (error) {
              console.error("Merchant validation failed:", error);
              session.abort();
            }
          };

          session.onpaymentauthorized = async (event: any) => {
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  amount: amount,
                  EUR: "EUR",
                }),
              });

              const { id: orderId } = await response.json();

              const confirmResponse = await applepay.confirmOrder({
                orderId: orderId,
                token: event.payment.token,
                billingContact: event.payment.billingContact,
              });

              if (
                confirmResponse.status === "APPROVED" ||
                confirmResponse.status === "PAYER_ACTION_REQUIRED"
              ) {
                const captureResponse = await fetch(
                  `/api/orders/${orderId}/capture`,
                  { method: "POST" }
                );

                const captureData = await captureResponse.json();

                if (captureData.status === "COMPLETED") {
                  session.completePayment(
                    window.ApplePaySession.STATUS_SUCCESS
                  );
                  setShowSuccess(true);
                } else {
                  throw new Error("Payment capture failed");
                }
              } else {
                throw new Error("Payment confirmation failed");
              }
            } catch (error) {
              console.error("Apple Pay payment error:", error);
              session.completePayment(window.ApplePaySession.STATUS_FAILURE);
            }
          };

          session.oncancel = () => {
            console.log("Apple Pay cancelled");
          };

          session.begin();
        } catch (error) {
          console.error("Apple Pay initialization error:", error);
        }
      });

      applePayButtonRef.current!.innerHTML = "";
      applePayButtonRef.current?.appendChild(button);
    };

    initApplePay();
  }, [isSDKLoaded, selectedMethod, isApplePayAvailable, amount]);

  const handleSuccessPayment = () => {
    router.push(
      `/payment/success?planId=${plan?.id}&${SuccessQueryEnum.paymentMethod}=${PaymentMethodEnum.paypal}`
    );
  };

  return (
    <div className="mx-auto flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-[40rem]">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Secure Payment
              </h1>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 sm:px-4 py-2 rounded-full w-fit">
                <Shield className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-semibold">
                  SSL Secured
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Choose your preferred payment method
            </p>
          </div>

          {/* Payment Options */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
            {/* Credit/Debit Card */}
            <CardOptions
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              // @ts-ignore
              paypalButtonRef={paypalButtonRef}
              setIsSDKLoaded={setIsSDKLoaded}
              isSDKLoaded={isSDKLoaded}
              amount={amount}
              onSuccess={handleSuccessPayment}
            />

            {/* PayPal */}
            <PaypalOption
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              // @ts-ignore
              paypalButtonRef={paypalButtonRef}
              setIsSDKLoaded={setIsSDKLoaded}
              isSDKLoaded={isSDKLoaded}
              amount={amount}
              onSuccess={handleSuccessPayment}
              plan={plan}
            />

            {/* Apple Pay */}
            <div
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                selectedMethod === "apple"
                  ? "border-blue-500 bg-blue-50/50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              } ${!isApplePayAvailable ? "opacity-50" : ""}`}
            >
              <div
                onClick={() =>
                  isApplePayAvailable && setSelectedMethod("apple")
                }
                className={isApplePayAvailable ? "cursor-pointer" : ""}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                        selectedMethod === "apple"
                          ? "bg-blue-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-gray-900"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Apple Pay
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                        {isApplePayAvailable
                          ? "Pay with Apple devices"
                          : "Not available on this device"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                    {selectedMethod === "apple" && (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    )}
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                      alt="Apple Pay"
                      className="h-8 sm:h-10 object-contain"
                      width={80}
                      height={40}
                    />
                  </div>
                </div>
              </div>

              {selectedMethod === "apple" && isApplePayAvailable && (
                <div className="mt-4 sm:mt-6">
                  <div ref={applePayButtonRef} className="w-full" />
                </div>
              )}
            </div>

            {/* Google Pay */}
            <GooglePayButton
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              amount={String(amount)}
              onSuccess={handleSuccessPayment}
              plan={plan!}
            />
          </div>

          {/* Footer or Security Note */}
          <SecurityNotice />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
