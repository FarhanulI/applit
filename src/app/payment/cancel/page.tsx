// app/cancel/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BiXCircle } from "react-icons/bi";
import { RiMvAiLine } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";
import { Suspense } from "react";

const CancelContent = () => {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiXCircle className="w-12 h-12 text-red-500" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            No worries! Your payment was cancelled and no charges were made to
            your account.
          </p>

          {/* Reassurance */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Still interested?
            </h2>

            <p className="text-gray-600 mb-4">
              Our {planId || "CV correction service"} is still available. You
              can try again anytime, and our team is here to help if you have
              any questions.
            </p>

            <div className="flex items-start gap-3 text-left">
              <RiMvAiLine className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Need assistance?</p>
                <p className="text-sm text-gray-600">
                  Contact our team at support@cvservice.com for help with your
                  purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <BsArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Support */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions about our plans? We&#39;re here to help!{" "}
              <a
                href="mailto:support@cvservice.com"
                className="text-blue-600 hover:underline"
              >
                Get in touch
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
