/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useAuthContext } from "@/contexts/auth";
import { getStripe } from "@/lib/stripe/stripe";
import { CheckoutRequest, PricingPlan } from "@/types/types";
import React, { useState } from "react";

interface ICvUploadFile {
  plan: PricingPlan;
}

const CvUploadFile = ({ plan }: ICvUploadFile) => {
  // @ts-ignore
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Create checkout session
      const checkoutData: CheckoutRequest = {
        planId: plan.id,
        successUrl: `${window.location.origin}/payment/success?plan=${plan.id}`,
        cancelUrl: `${window.location.origin}/payment/cancel?plan=${plan.id}`,
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
    <div className="relative">
      <input
        type="file"
        id="cv-upload"
        accept=".pdf,.doc,.docx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(e) => {
          console.log({ files: e.target.files });
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
              const base64 = event.target?.result;

              // Save base64 string in sessionStorage
              sessionStorage.setItem("cvFileBase64", base64 as string);
              sessionStorage.setItem("cvFileName", file.name);

              console.log("File saved to sessionStorage");
              handleCheckout();
            };

            reader.readAsDataURL(file); // Converts file to base64 string
          }
        }}
      />
      <label
        htmlFor="cv-upload"
        className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300 
        shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {loading ? "Uploading..." : "Get Your CV Corrected Now"}
      </label>
    </div>
  );
};

export default CvUploadFile;
