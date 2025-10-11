"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { MoveRight } from "lucide-react";

interface PaymentOptionProps {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badges?: React.ReactNode;
  continueText?: string;
  onContinue?: () => void;
  brandLogo?: React.ReactNode;
}

export default function PaymentOption({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  badges,
  continueText,
  onContinue,
  brandLogo,
}: PaymentOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50/50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
              selected ? "bg-blue-500" : "bg-gray-100"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {selected && (
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          )}
          {brandLogo}
        </div>
      </div>

      {badges && <div className="flex gap-2 flex-wrap">{badges}</div>}

      {selected && continueText && (
        <div className="mt-4 sm:mt-6">
          <button
            onClick={onContinue}
            className="w-full md:w-[260px] mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold py-3 px-4 rounded-xl text-sm sm:text-base hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 justify-center"
          >
            {continueText} <MoveRight />
          </button>
        </div>
      )}
    </div>
  );
}
