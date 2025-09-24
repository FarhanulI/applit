// components/pricing/PricingCard.tsx
"use client";

import { PricingPlan } from "@/types/types";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { GiCrowNest } from "react-icons/gi";
import CheckoutButton from "./CheckoutButton";

interface PricingCardProps {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg relative transition-all duration-300 flex flex-col justify-between">
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute right-0 top-[0] overflow-hidden z-1">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-tr-xl rounded-bl-xl text-sm font-semibold shadow-lg flex items-center gap-2">
            <GiCrowNest className="w-4 h-4" />
            MOST POPULAR
          </div>
        </div>
      )}

      <div
        className={` ${
          plan.popular ? "mt-4" : ""
        }  border-b border-border-main pb-4`}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      <div className="mb-8">
        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
        <span className="text-gray-600 ml-1">{plan.period}</span>
        <p className={`text-sm mt-2 ${plan.subtitleStyle || "text-gray-500"}`}>
          {plan.subtitle}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <BiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <CheckoutButton
        planId={plan.id}
        buttonText={plan.buttonText}
        buttonStyle={plan.buttonStyle}
        plan={plan}
      />
    </div>
  );
}
