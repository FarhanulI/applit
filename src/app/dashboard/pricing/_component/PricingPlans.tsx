"use client";

// components/pricing/PricingPlans.tsx
import { IoCheckmarkSharp } from "react-icons/io5";
import PricingCard from "./PricingCard";
import { BiCheck, BiShield } from "react-icons/bi";
import { CiStar } from "react-icons/ci";
import { GoZap } from "react-icons/go";
import { FaRegClock } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { heroBannerFeatures, pricingPlans } from "@/config/stripe-config";
import CvUploadFile from "./cvUploadFile";
import { TiTickOutline } from "react-icons/ti";
import PageTitle from "@/ui/text/pageTitle";

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
    <div className=" px-4 relative">
      <PageTitle
        title="Simple, Transparent Pricing"
        subtitle="Choose the perfect plan for your job search journey in Germany. Start with free job search and upgrade anytime."
      />
      <div className=" mt-8">
        {/* Professional CV Correction Banner */}
        <div className="bg-white rounded-2xl p-8 mb-12 border shadow-md border-blue-active text-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/30 rounded-full"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-lg md:text-3xl font-bold">
                Professional CV Correction
              </h1>
            </div>

            <div className="mb-6">
              <span className="text-2xl md:text-5xl font-bold">€29.99</span>
              <span className="md:text-lg text-sm ml-2 opacity-90">
                one-time payment
              </span>
            </div>

            <p className="md:text-lg text-sm mb-8 max-w-2xl mx-auto opacity-95">
              Get your CV professionally corrected to German standards. Pay
              once, use forever with unlimited updates and revisions.
            </p>

            <CvUploadFile plan={pricingPlans[0]} />

            <div className="flex items-center flex-wrap justify-center gap-8 mt-12 mb-6">
              {heroBannerFeatures.map((feature, index) => {
                const IconComponent = iconMap[feature.icon];
                // Add safety check for undefined icons
                if (!IconComponent) {
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 text-base text-[#525454] `}
                    >
                      <BiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />

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
          </div>
        </div>

        {/* Pricing Cards - Commented out */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pricingPlans.slice(1).map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
