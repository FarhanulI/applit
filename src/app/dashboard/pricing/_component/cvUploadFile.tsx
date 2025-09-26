/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useAuthContext } from "@/contexts/auth";
import { getStripe } from "@/lib/stripe/stripe";
import { CheckoutRequest, PricingPlan } from "@/types/types";
import React, { useState } from "react";
import PaymentModal from "./paymentMethodModal";

interface ICvUploadFile {
  plan: PricingPlan;
}

const CvUploadFile = ({ plan }: ICvUploadFile) => {
  // @ts-ignore
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [isOpenPaymentModal, setisOpenPaymentModal] = useState<boolean>(false);

  const handleCheckout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Create checkout session
      const checkoutData: CheckoutRequest = {
        planId: plan.id,
        user: user,
      };

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const { sessionId, url, error } = await response.json();

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Something went wrong. Please try again.");
        return;
      }

      sessionStorage.setItem("checkoutSessionId", sessionId);
      sessionStorage.setItem("currentPlan", JSON.stringify(plan)!);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js to redirect
        const stripe = await getStripe();
        const { error: stripeError } = await stripe!.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          console.error("Stripe redirect error:", stripeError);
          alert("Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <input
        type="file"
        id="cv-upload"
        accept=".pdf,.doc,.docx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(e) => {
          const file = e.target.files?.[0];
          console.log({ file });

          if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
              const base64 = event.target?.result;

              // Save base64 string in sessionStorage
              sessionStorage.setItem("cvFileBase64", base64 as string);
              sessionStorage.setItem("cvFileName", file.name);

              console.log("File saved to sessionStorage");
              setisOpenPaymentModal(true);
            };

            reader.readAsDataURL(file); // Converts file to base64 string
          }
        }}
      />
      <label
        htmlFor="cv-upload"
        className="
           w-full text-center
          bg-gradient-to-r from-blue-500 to-purple-600 
          text-white 
          hover:from-blue-600 hover:to-purple-700 
          shadow-lg hover:shadow-xl 
          px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 lg:px-10 lg:py-5
          rounded-md 
          font-semibold
          text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          cursor-pointer
          leading-tight
          min-h-[48px] sm:min-h-[52px] md:min-h-[56px] lg:min-h-[60px]
          flex items-center justify-center
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        "
        style={{
          opacity: loading ? 0.7 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <span className="break-words hyphens-auto">
          {loading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Uploading...
            </>
          ) : (
            "Get Your CV Corrected Now"
          )}
        </span>
      </label>

      <PaymentModal
        isOpen={isOpenPaymentModal}
        onClose={() => {
          sessionStorage.removeItem("cvFileBase64");
          sessionStorage.removeItem("cvFileName");
          setisOpenPaymentModal(false);
        }}
        plan={plan!}
        handleStripeCheckout={handleCheckout}
        setisOpenPaymentModal={setisOpenPaymentModal}
      />
    </div>
  );
};

export default CvUploadFile;
