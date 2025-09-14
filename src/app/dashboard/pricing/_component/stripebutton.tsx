import React, { FC, useState } from "react";
import { CreditCard, Lock } from "lucide-react";

type StripeCheckoutButtonProps = {
  isLoading?: boolean;
  onClick: () => void;
  price: number;
};

const StripeCheckoutButton: FC<StripeCheckoutButtonProps> = ({
  isLoading,
  onClick,
  price
}) => {
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <button
          onClick={onClick}
          disabled={isLoading}
          className={` cursor-pointer
            relative w-full py-4 px-6 rounded-lg font-semibold text-white text-lg
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700
            transform transition-all duration-200 ease-out
            hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25
            active:scale-[0.98]
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            focus:outline-none focus:ring-4 focus:ring-indigo-500/25
            overflow-hidden group
          `}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="relative flex items-center justify-center">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-3" />
                Pay {price} with Stripe
              </>
            )}
          </div>
        </button>

        {/* Security indicator */}
        <div className="flex items-center justify-center mt-3 text-gray-500 text-sm">
          <Lock className="w-4 h-4 mr-1" />
          Secured by Stripe
        </div>
      </div>
    </div>
  );
};

export default StripeCheckoutButton;
