'use client'

// components/pricing/PricingPlans.tsx
import { IoCheckmarkSharp } from "react-icons/io5";
import PricingCard from "./PricingCard";
import { BiShield } from "react-icons/bi";
import { CiStar } from "react-icons/ci";
import { GoZap } from "react-icons/go";
import { FaRegClock } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import {
  heroBannerFeatures,
  pricingPlans,
  trustIndicators,
} from "@/config/stripe-config";
import CheckoutButton from "./CheckoutButton";
import CvUploadFile from "./cvUploadFile";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/auth";

// Type for icon components
type IconComponent = React.ComponentType<{ className?: string }>;

const iconMap: Record<string, IconComponent> = {
  IoCheckmarkSharp,
  CiStar,
  GoZap,
  BiShield,
  FaRegClock,
  TbUsers,
};

const PricingPlans = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Professional CV Correction Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 mb-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/30 rounded-full"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <IoCheckmarkSharp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Professional CV Correction
              </h1>
            </div>

            <div className="mb-6">
              <span className="text-4xl md:text-5xl font-bold">€29.99</span>
              <span className="text-lg ml-2 opacity-90">one-time payment</span>
            </div>

            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
              Get your CV professionally corrected to German standards. Pay
              once, use forever with unlimited updates and revisions.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {heroBannerFeatures.map((feature, index) => {
                const IconComponent = iconMap[feature.icon];
                // Add safety check for undefined icons
                if (!IconComponent) {
                  console.warn(`Icon "${feature.icon}" not found in iconMap`);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-4 h-4 bg-emerald-200 rounded-sm" />
                      <span>{feature.text}</span>
                    </div>
                  );
                }

                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <IconComponent className="w-4 h-4 text-emerald-200" />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <CvUploadFile plan={pricingPlans[0]} />

            {/* <CheckoutButton
              planId={pricingPlans[0].id}
              buttonText={pricingPlans[0].buttonText}
              buttonStyle={pricingPlans[0].buttonStyle}
              plan={pricingPlans[0]}
            /> */}
          </div>
        </div>

        {/* Pricing Cards - Commented out */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.slice(1).map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Trust Indicators - Commented out */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = iconMap[indicator.icon];
              if (!IconComponent) {
                return null;
              }
              return (
                <div key={index} className="flex flex-col items-center">
                  <IconComponent className="w-8 h-8 text-emerald-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {indicator.value}
                  </div>
                  <div className="text-gray-600">{indicator.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
