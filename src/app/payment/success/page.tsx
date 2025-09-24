/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { HiCheckBadge } from "react-icons/hi2";
import { PiUploadSimpleBold } from "react-icons/pi";
import { BsRocketTakeoff, BsPersonVcard } from "react-icons/bs";
import { handleCheckSessionFile } from "@/hooks/auth/utils";
import { PlansNameEnum } from "@/enums";
import {
  handleCVCorrectionPlan,
  handlePaytAsGoPlan,
  handleStandardPlan,
  handleUnlimitedPlan,
} from "@/lib/file/apis";
import { useAuthContext } from "@/contexts/auth";
import { getPaymentDetails } from "./utils";

// Separate the component that uses useSearchParams
function SuccessPageContent() {
  const { user, setUser } = useAuthContext();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const planId = searchParams.get("planId");
  const subscriptionID = searchParams.get("subscriptionID");
  const paymentMethod = searchParams.get("paymentMethod");

  const [loading, setLoading] = useState(true);

  const handlePlanExecution = async () => {
    if (!planId || !user?.uid) return;

    const planHandlers = {
      [PlansNameEnum.cv_correction]: () =>
        handleCVCorrectionPlan(user.uid, setUser, planId),

      [PlansNameEnum.payAsYouGo]: () =>
        handlePaytAsGoPlan(
          user,
          setUser,
          planId,
          subscriptionID,
          paymentMethod
        ),

      [PlansNameEnum.standard]: () =>
        handleStandardPlan(
          user,
          setUser,
          planId,
          subscriptionID,
          paymentMethod
        ),

      [PlansNameEnum.unlimited]: () =>
        handleUnlimitedPlan(
          user,
          setUser,
          planId,
          subscriptionID,
          sessionId,
          paymentMethod
        ),
    };

    // @ts-ignore
    const handler = planHandlers[planId];
    if (handler) {
      const res = await handler();

      if (!!res) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handlePlanExecution();
  }, [planId, user, sessionId, subscriptionID]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-16">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-3xl p-8 md:p-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 text-green-600 p-4 rounded-full shadow-inner">
            <HiCheckBadge className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Payment Confirmed!
        </h1>

        <p className="text-gray-600 mb-6 text-lg">
          Your <strong>{planId || "CV Correction"}</strong> plan is now active.
          We&lsquo;re excited to help you land your next job!
        </p>

        {/* What's Next Section */}
        <div className="text-left bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8 space-y-5">
          <div className="flex items-start gap-3">
            <PiUploadSimpleBold className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Upload Your CV</p>
              <p className="text-sm text-gray-600">
                Head to your dashboard and upload your CV for correction.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BsRocketTakeoff className="text-orange-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Track Progress</p>
              <p className="text-sm text-gray-600">
                Stay updated on your correction status in real-time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BsPersonVcard className="text-purple-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Download Once Ready</p>
              <p className="text-sm text-gray-600">
                Get your professionally revised CV delivered straight to your
                dashboard and email.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
          >
            Go to Dashboard
          </a>
          <Link
            href="/pricing"
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition"
          >
            Explore More Plans
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-sm text-gray-500">
          Need help? Email us at{" "}
          <a
            href="mailto:support@cvservice.com"
            className="text-blue-600 hover:underline"
          >
            support@cvservice.com
          </a>
        </div>
      </div>
    </section>
  );
}

// Main component that wraps the content in Suspense
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
