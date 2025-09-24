import { pricingPlans } from "@/config/stripe-config";
import { useAuthContext } from "@/contexts/auth";
import React from "react";
import { TiTickOutline } from "react-icons/ti";

const CurrentBenefits = () => {
  const {user} = useAuthContext()
  return (
    <div className="lg:col-span-2 col-span-3 px-8 py-5 bg-white rounded-xl shadow-md gap-3">
      <div className="border-b border-[#D9D9D9] ">
        <p className="text-black text-lg font-semibold py-2">
          Current Plans Benefit
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[#27292A] mt-4">
        {user?.currentPlan?.features?.map((item, index) => (
          <div className="flex items-center gap-2" key={index}>
            <TiTickOutline size="25px" color="#27292A" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentBenefits;
